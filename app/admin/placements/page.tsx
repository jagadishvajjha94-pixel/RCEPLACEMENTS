
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  Users,
  Calendar,
  Building,
  ExternalLink,
  X,
  CheckCircle,
  Clock,
} from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import {
  PlacementDriveService,
  RegistrationService,
  type PlacementDrive,
  type StudentRegistration,
} from "@/lib/placement-service"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminPlacementsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ id: string; role: string } | null>(null)
  const [drives, setDrives] = useState<PlacementDrive[]>([])
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "closed" | "upcoming">("all")
  const [filterType, setFilterType] = useState<"all" | "placement" | "internship">("all")
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([])

  // Form state
  const [formData, setFormData] = useState<{
    companyName: string
    jobDescription: string
    jdFileUrl: string
    package: string
    position: string
    registrationLink: string
    companyInfoLink: string
    seriesNumber: string
    status: "active" | "closed" | "upcoming"
    deadline: string
    type: "placement" | "internship"
    eligibilityCriteria: {
      minCGPA: number
      branches: string[]
      years: string[]
      specificStudents: string[]
    }
  }>({
    companyName: "",
    jobDescription: "",
    jdFileUrl: "",
    package: "",
    position: "",
    registrationLink: "",
    companyInfoLink: "",
    seriesNumber: "",
    status: "active",
    deadline: "",
    type: "placement",
    eligibilityCriteria: {
      minCGPA: 0,
      branches: [],
      years: [],
      specificStudents: [],
    },
  })

  const loadDrives = useCallback(() => {
    const allDrives = PlacementDriveService.getAll()
    setDrives(allDrives)
  }, [])

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login")
      return
    }
    setUser(currentUser)
    loadDrives()
  }, [navigate, loadDrives])

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    try {
      PlacementDriveService.create({
        ...formData,
        createdBy: user.id,
      })

      alert("✓ Drive created successfully!")
      setShowCreateForm(false)
      resetForm()
      loadDrives()
    } catch (error) {
      console.error("Error creating drive:", error)
      alert("Failed to create drive. Please try again.")
    }
  }

  const handleDeleteDrive = (id: string) => {
    if (confirm("Are you sure you want to delete this drive?")) {
      PlacementDriveService.delete(id)
      loadDrives()
      alert("✓ Drive deleted successfully!")
    }
  }

  const handleViewDrive = (drive: PlacementDrive) => {
    setSelectedDrive(drive)
    const driveRegistrations = RegistrationService.getByDrive(drive.id)
    setRegistrations(driveRegistrations)
    setShowViewModal(true)
  }

  const handleDownloadRegistrations = (driveId: string) => {
    RegistrationService.downloadCSV(driveId)
  }

  const handleUpdateStatus = (driveId: string, newStatus: "active" | "closed" | "upcoming") => {
    PlacementDriveService.update(driveId, { status: newStatus })
    loadDrives()
    alert(`✓ Drive status updated to ${newStatus}!`)
  }

  const resetForm = () => {
    setFormData({
      companyName: "",
      jobDescription: "",
      jdFileUrl: "",
      package: "",
      position: "",
      registrationLink: "",
      companyInfoLink: "",
      seriesNumber: "",
      status: "active",
      deadline: "",
      type: "placement",
      eligibilityCriteria: {
        minCGPA: 0,
        branches: [],
        years: [],
        specificStudents: [],
      },
    })
  }

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || drive.status === filterStatus
    const matchesType = filterType === "all" || drive.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-700 dark:text-green-300"
      case "closed":
        return "bg-red-500/20 text-red-700 dark:text-red-300"
      case "upcoming":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300"
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "placement"
      ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
      : "bg-orange-500/20 text-orange-700 dark:text-orange-300"
  }

  const getDaysLeft = (deadline: string) => {
    return Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-72 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/10 dark:to-accent/5">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                  Placement & Internship Drives
                </h1>
                <p className="text-muted-foreground">
                  Manage placement drives, track registrations, and monitor student placements
                </p>
              </div>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="gap-2 bg-gradient-to-r from-accent to-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Create New Drive
              </Button>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-lg rounded-lg p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by company or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="px-4 py-2 rounded-lg border bg-background"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                    className="w-full px-3 py-2 rounded-lg border bg-background"
                  >
                    <option value="all">All Types</option>
                    <option value="placement">Placement</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Drives List */}
            <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {filteredDrives.length === 0 ? (
                <Card className="glass-lg p-12 text-center">
                  <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No drives found</p>
                  <Button onClick={() => setShowCreateForm(true)} className="mt-4 gap-2">
                    <Plus className="w-4 h-4" />
                    Create First Drive
                  </Button>
                </Card>
              ) : (
                filteredDrives.map((drive, index) => {
                  const driveRegistrations = RegistrationService.getByDrive(drive.id)
                  const placedCount = driveRegistrations.filter((r) => r.hasOffer).length
                  const daysLeft = getDaysLeft(drive.deadline)

                  return (
                    <motion.div
                      key={drive.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-lg p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <h3 className="text-xl font-bold">{drive.companyName}</h3>
                              <Badge className={getStatusColor(drive.status)}>{drive.status}</Badge>
                              <Badge className={getTypeColor(drive.type)}>{drive.type}</Badge>
                              <span className="text-xs bg-muted px-2 py-1 rounded">#{drive.seriesNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <p className="text-muted-foreground">{drive.position}</p>
                              {drive.jdFileUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  asChild
                                  className="text-xs"
                                >
                                  <a href={drive.jdFileUrl} target="_blank" rel="noopener noreferrer" className="gap-1">
                                    <ExternalLink className="w-3 h-3" />
                                    View JD
                                  </a>
                                </Button>
                              )}
                            </div>
                            <div className="grid md:grid-cols-5 gap-4 text-sm mb-4">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-accent" />
                                <span>
                                  {driveRegistrations.length} registered
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>{placedCount} placed</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-accent" />
                                <span className="font-semibold text-accent">{drive.package}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-accent" />
                                <span>{new Date(drive.deadline).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-accent" />
                                <span>{daysLeft}d left</span>
                              </div>
                            </div>
                            {drive.eligibilityCriteria.branches && drive.eligibilityCriteria.branches.length > 0 && (
                              <div className="flex gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground">Eligible:</span>
                                {drive.eligibilityCriteria.branches.map((branch) => (
                                  <span key={branch} className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                    {branch}
                                  </span>
                                ))}
                                {drive.eligibilityCriteria.minCGPA && drive.eligibilityCriteria.minCGPA > 0 && (
                                  <span className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                                    CGPA ≥ {drive.eligibilityCriteria.minCGPA}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Button size="sm" variant="outline" onClick={() => handleViewDrive(drive)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadRegistrations(drive.id)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <div className="relative group">
                              <Button size="sm" variant="outline">
                                <Filter className="w-4 h-4" />
                              </Button>
                              <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg p-2 hidden group-hover:block z-10">
                                <button
                                  onClick={() => handleUpdateStatus(drive.id, "active")}
                                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                                >
                                  Mark Active
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(drive.id, "closed")}
                                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                                >
                                  Mark Closed
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(drive.id, "upcoming")}
                                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                                >
                                  Mark Upcoming
                                </button>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:bg-destructive/10 bg-transparent"
                              onClick={() => handleDeleteDrive(drive.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Create Drive Modal - Keeping original implementation */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              className="bg-background rounded-2xl max-w-4xl w-full p-8 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Create New Drive</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleCreateDrive} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Google"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Position/Role <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Software Engineer"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    placeholder="Detailed job description..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Job Description File URL (Optional)
                  </label>
                  <Input
                    type="url"
                    value={formData.jdFileUrl}
                    onChange={(e) => setFormData({ ...formData, jdFileUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload JD file to Google Drive/Dropbox and paste the shareable link here
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Package/CTC <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.package}
                      onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                      placeholder="45-60 LPA"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Series Number / Tracking ID <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.seriesNumber}
                      onChange={(e) => setFormData({ ...formData, seriesNumber: e.target.value })}
                      placeholder="DRV2025001"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Registration Link <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="url"
                      value={formData.registrationLink}
                      onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                      placeholder="https://forms.google.com/..."
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Company Information Link</label>
                    <Input
                      type="url"
                      value={formData.companyInfoLink}
                      onChange={(e) => setFormData({ ...formData, companyInfoLink: e.target.value })}
                      placeholder="https://company.com/careers"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as "placement" | "internship" })}
                      className="w-full px-3 py-2 rounded-lg border bg-background"
                      required
                    >
                      <option value="placement">Placement</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "closed" | "upcoming" })}
                      className="w-full px-3 py-2 rounded-lg border bg-background"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Eligibility Criteria</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Minimum CGPA</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={formData.eligibilityCriteria.minCGPA}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eligibilityCriteria: {
                              ...formData.eligibilityCriteria,
                              minCGPA: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        placeholder="7.5"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Eligible Branches</label>
                      <div className="flex flex-wrap gap-2">
                        {["CSE", "ECE", "Mechanical", "Civil", "EEE"].map((branch) => (
                          <label key={branch} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.eligibilityCriteria.branches.includes(branch)}
                              onChange={(e) => {
                                const branches = e.target.checked
                                  ? [...formData.eligibilityCriteria.branches, branch]
                                  : formData.eligibilityCriteria.branches.filter((b) => b !== branch)
                                setFormData({
                                  ...formData,
                                  eligibilityCriteria: { ...formData.eligibilityCriteria, branches },
                                })
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{branch}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-semibold mb-2 block">Eligible Years</label>
                    <div className="flex gap-4">
                      {["1st", "2nd", "3rd", "4th"].map((year) => (
                        <label key={year} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.eligibilityCriteria.years.includes(year)}
                            onChange={(e) => {
                              const years = e.target.checked
                                ? [...formData.eligibilityCriteria.years, year]
                                : formData.eligibilityCriteria.years.filter((y) => y !== year)
                              setFormData({
                                ...formData,
                                eligibilityCriteria: { ...formData.eligibilityCriteria, years },
                              })
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{year} Year</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="text-sm font-semibold mb-2 block">Specific Students (Optional)</label>
                    <Textarea
                      value={formData.eligibilityCriteria.specificStudents.join(', ')}
                      onChange={(e) => {
                        const students = e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        setFormData({
                          ...formData,
                          eligibilityCriteria: { ...formData.eligibilityCriteria, specificStudents: students },
                        })
                      }}
                      placeholder="Enter student IDs separated by commas (e.g., 21BCE001, 21BCE002)"
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to allow all eligible students. Enter specific student IDs to restrict access.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-accent to-primary hover:opacity-90">
                    Create Drive
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Drive Modal - Keeping original implementation with registrations display */}
      <AnimatePresence>
        {showViewModal && selectedDrive && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              className="bg-background rounded-2xl max-w-5xl w-full p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedDrive.companyName}</h2>
                  <p className="text-muted-foreground">{selectedDrive.position}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowViewModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Drive Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package:</span>
                      <span className="font-semibold">{selectedDrive.package}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge className={getTypeColor(selectedDrive.type)}>{selectedDrive.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedDrive.status)}>{selectedDrive.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span>{new Date(selectedDrive.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Series Number:</span>
                      <span>#{selectedDrive.seriesNumber}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Registration Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Registrations:</span>
                      <span className="font-semibold">{registrations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Placed:</span>
                      <span className="font-semibold text-green-600">
                        {registrations.filter((r) => r.hasOffer).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-semibold text-orange-600">
                        {registrations.filter((r) => !r.hasOffer).length}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownloadRegistrations(selectedDrive.id)}
                    className="w-full mt-4 gap-2"
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </Button>
                </Card>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Job Description</h3>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedDrive.jobDescription}</p>
                </Card>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Links</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedDrive.jdFileUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedDrive.jdFileUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View JD
                      </a>
                    </Button>
                  )}
                  {selectedDrive.registrationLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedDrive.registrationLink} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Registration Form
                      </a>
                    </Button>
                  )}
                  {selectedDrive.companyInfoLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedDrive.companyInfoLink} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Company Info
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Registered Students ({registrations.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {registrations.length === 0 ? (
                    <Card className="p-8 text-center">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No registrations yet</p>
                    </Card>
                  ) : (
                    registrations.map((reg) => (
                      <Card key={reg.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{reg.studentName}</p>
                            <p className="text-sm text-muted-foreground">
                              {reg.rollNumber} • {reg.branch} • {reg.year} Year • CGPA: {reg.cgpa}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {reg.email} • {reg.phone}
                            </p>
                          </div>
                          <Badge className={reg.hasOffer ? "bg-green-500/20 text-green-700" : "bg-orange-500/20 text-orange-700"}>
                            {reg.hasOffer ? "Placed" : "Pending"}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}