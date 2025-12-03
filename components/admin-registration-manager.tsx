"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  FileSpreadsheet,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  ExternalLink
} from "lucide-react"
import { PlacementDriveService, RegistrationService, type PlacementDrive, type StudentRegistration } from "@/lib/placement-service"

interface RegistrationManagerProps {
  driveId?: string
}

const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE", "AIDS", "AI/ML", "Cybersecurity", "IoT", "ServiceNow"]
const years = ["1st", "2nd", "3rd", "4th"]
const statuses = ["submitted", "pending", "expired"]

// Excel column options
const availableColumns = [
  { id: "studentName", label: "Name", default: true },
  { id: "rollNumber", label: "Roll Number", default: true },
  { id: "branch", label: "Branch", default: true },
  { id: "year", label: "Year", default: true },
  { id: "cgpa", label: "CGPA", default: true },
  { id: "email", label: "Email", default: true },
  { id: "phone", label: "Phone", default: true },
  { id: "linkedin", label: "LinkedIn", default: false },
  { id: "github", label: "GitHub", default: false },
  { id: "status", label: "Status", default: true },
  { id: "submittedAt", label: "Submitted At", default: true },
  { id: "hasOffer", label: "Has Offer", default: true },
  { id: "companyName", label: "Company", default: false },
  { id: "position", label: "Position", default: false },
  { id: "package", label: "Package", default: false },
]

export function AdminRegistrationManager({ driveId }: RegistrationManagerProps) {
  const [drives, setDrives] = useState<PlacementDrive[]>([])
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<StudentRegistration[]>([])
  const [selectedDrive, setSelectedDrive] = useState<string>(driveId || "all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBranch, setFilterBranch] = useState("all")
  const [filterYear, setFilterYear] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    availableColumns.filter(col => col.default).map(col => col.id)
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [registrations, selectedDrive, searchTerm, filterBranch, filterYear, filterStatus])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load drives
      const allDrives = PlacementDriveService.getAll()
      setDrives(allDrives)

      // Load registrations
      let allRegistrations: StudentRegistration[] = []
      try {
        allRegistrations = await RegistrationService.getAllRemote()
      } catch (error) {
        allRegistrations = RegistrationService.getAll()
      }
      
      setRegistrations(allRegistrations)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...registrations]

    // Filter by drive
    if (selectedDrive !== "all") {
      filtered = filtered.filter(reg => reg.driveId === selectedDrive)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reg => 
        reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by branch
    if (filterBranch !== "all") {
      filtered = filtered.filter(reg => reg.branch === filterBranch)
    }

    // Filter by year
    if (filterYear !== "all") {
      filtered = filtered.filter(reg => reg.year === filterYear)
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(reg => reg.status === filterStatus)
    }

    setFilteredRegistrations(filtered)
  }

  const getDeadlineStatus = (driveId: string) => {
    const drive = drives.find(d => d.id === driveId)
    if (!drive) return { status: "unknown", timeRemaining: 0 }

    const deadline = new Date(drive.deadline)
    const now = new Date()
    const timeRemaining = deadline.getTime() - now.getTime()

    if (timeRemaining < 0) {
      return { status: "expired", timeRemaining: 0 }
    } else if (timeRemaining < 24 * 60 * 60 * 1000) {
      return { status: "urgent", timeRemaining }
    } else {
      return { status: "active", timeRemaining }
    }
  }

  const formatTimeRemaining = (timeMs: number) => {
    const days = Math.floor(timeMs / (24 * 60 * 60 * 1000))
    const hours = Math.floor((timeMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  const toggleColumn = (columnId: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    )
  }

  const downloadExcel = () => {
    if (filteredRegistrations.length === 0) {
      alert("No registrations to download")
      return
    }

    // Build headers based on selected columns
    const headers = availableColumns
      .filter(col => selectedColumns.includes(col.id))
      .map(col => col.label)

    // Build rows
    const rows = filteredRegistrations.map(reg => {
      const drive = drives.find(d => d.id === reg.driveId)
      const rowData: any = {
        studentName: reg.studentName,
        rollNumber: reg.rollNumber,
        branch: reg.branch,
        year: reg.year,
        cgpa: reg.cgpa,
        email: reg.email,
        phone: reg.phone,
        linkedin: reg.linkedin || "",
        github: reg.github || "",
        status: reg.status,
        submittedAt: new Date(reg.submittedAt).toLocaleString(),
        hasOffer: reg.hasOffer ? "Yes" : "No",
        companyName: drive?.companyName || "",
        position: drive?.position || "",
        package: drive?.package || "",
      }

      return availableColumns
        .filter(col => selectedColumns.includes(col.id))
        .map(col => rowData[col.id] || "")
    })

    // Create CSV content
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `registrations_${selectedDrive}_${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
    
    setShowExportModal(false)
  }

  const getRegistrationStats = () => {
    const total = filteredRegistrations.length
    const withOffers = filteredRegistrations.filter(r => r.hasOffer).length
    const pending = filteredRegistrations.filter(r => r.status === "pending").length
    const expired = filteredRegistrations.filter(r => r.status === "expired").length

    return { total, withOffers, pending, expired }
  }

  const stats = getRegistrationStats()

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Registrations</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.withOffers}</p>
              <p className="text-sm text-muted-foreground">With Offers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{stats.expired}</p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, roll number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label>Drive</Label>
            <Select value={selectedDrive} onValueChange={setSelectedDrive}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drives</SelectItem>
                {drives.map(drive => (
                  <SelectItem key={drive.id} value={drive.id}>
                    {drive.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Branch</Label>
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Year</Label>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={() => setShowExportModal(true)} className="gap-2">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={loadData} className="gap-2">
            <Filter className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Registrations List */}
      {loading ? (
        <Card className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading registrations...</p>
        </Card>
      ) : filteredRegistrations.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">No Registrations Found</h3>
          <p className="text-muted-foreground">No registrations match your current filters</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map((registration) => {
            const drive = drives.find(d => d.id === registration.driveId)
            const deadlineStatus = getDeadlineStatus(registration.driveId)
            
            return (
              <motion.div
                key={registration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{registration.studentName}</h3>
                          <p className="text-muted-foreground">
                            {registration.rollNumber} • {registration.branch} • {registration.year} Year
                          </p>
                          <p className="text-sm text-muted-foreground">
                            CGPA: {registration.cgpa} • {registration.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              registration.status === "submitted" ? "default" :
                              registration.status === "pending" ? "secondary" : "destructive"
                            }
                          >
                            {registration.status}
                          </Badge>
                          {registration.hasOffer && (
                            <Badge variant="default" className="bg-green-500">
                              Has Offer
                            </Badge>
                          )}
                        </div>
                      </div>

                      {drive && (
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Company</p>
                            <p className="text-sm text-muted-foreground">{drive.companyName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Position</p>
                            <p className="text-sm text-muted-foreground">{drive.position}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Package</p>
                            <p className="text-sm text-muted-foreground">{drive.package}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Deadline Status</p>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  deadlineStatus.status === "expired" ? "destructive" :
                                  deadlineStatus.status === "urgent" ? "secondary" : "default"
                                }
                              >
                                {deadlineStatus.status === "expired" ? "Expired" :
                                 deadlineStatus.status === "urgent" ? "Urgent" : "Active"}
                              </Badge>
                              {deadlineStatus.timeRemaining > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  {formatTimeRemaining(deadlineStatus.timeRemaining)} left
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {new Date(registration.submittedAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {registration.linkedin && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(registration.linkedin, "_blank")}
                          className="gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          LinkedIn
                        </Button>
                      )}
                      {registration.github && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(registration.github, "_blank")}
                          className="gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          GitHub
                        </Button>
                      )}
                      {drive?.registrationLink && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(drive.registrationLink, "_blank")}
                          className="gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Form Link
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Export Registrations to Excel
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Select Columns to Export</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Choose which columns to include in your Excel export
              </p>
              
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {availableColumns.map(column => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.id}
                      checked={selectedColumns.includes(column.id)}
                      onCheckedChange={() => toggleColumn(column.id)}
                    />
                    <Label htmlFor={column.id} className="text-sm cursor-pointer">
                      {column.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm">
                <strong>Export Summary:</strong> {filteredRegistrations.length} registrations 
                with {selectedColumns.length} columns selected
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={downloadExcel} 
              disabled={selectedColumns.length === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download Excel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
