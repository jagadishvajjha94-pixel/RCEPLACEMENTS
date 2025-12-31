
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PlacementDriveService, type PlacementDrive } from "@/lib/placement-service"
import { AuthService } from "@/lib/auth-service"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit2, Search, FileText, Calendar, Building, Download } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import type { User as AuthUser } from "@/lib/auth-service"
import { DriveFormModal } from "@/components/drive-form-modal"

export default function AdminDrivesPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [drives, setDrives] = useState<PlacementDrive[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "closed" | "upcoming">("all")
  const [filterType, setFilterType] = useState<"all" | "placement" | "internship">("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null)
  const [loading, setLoading] = useState(true)

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login")
      return
    }
    setUser(currentUser)
    // Initialize mock data if needed
    initializeAllMockData()
    loadDrives()
  }, [navigate])

  const loadDrives = () => {
    setLoading(true)
    const allDrives = PlacementDriveService.getAll()
    setDrives(allDrives)
    setLoading(false)
  }

  const handleSubmit = async (driveData: any) => {
    setSubmitting(true)
    try {
      const finalData = {
        ...driveData,
      createdBy: user?.id || "admin",
    }

      if (editingDrive) {
        await PlacementDriveService.updateRemote(editingDrive.id, finalData)
        PlacementDriveService.update(editingDrive.id, finalData)
      } else {
        await PlacementDriveService.createRemote(finalData)
        PlacementDriveService.create(finalData)
      }
      
      loadDrives()
      setEditingDrive(null)
      setShowAddModal(false)
    } catch (error) {
      console.error("Error saving drive:", error)
      alert("Failed to save drive. Please try again.")
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (drive: PlacementDrive) => {
    setEditingDrive(drive)
    setShowAddModal(true)
  }

  const handleClose = () => {
    setShowAddModal(false)
    setEditingDrive(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this drive?")) return
    
    try {
      await PlacementDriveService.deleteRemote(id)
      PlacementDriveService.delete(id)
      loadDrives()
    } catch (error) {
      console.error("Error deleting drive:", error)
      alert("Failed to delete drive.")
    }
  }


  const filteredDrives = drives.filter((drive) => {
    const matchesSearch = drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || drive.status === filterStatus
    const matchesType = filterType === "all" || drive.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-72 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          <div className="p-4 md:p-8">
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
                <p className="text-muted-foreground">Create and manage company drives with eligibility criteria</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    initializeAllMockData(true)
                    setTimeout(() => {
                      loadDrives()
                      alert("Mock data loaded! 200 drives and 200 registrations added.")
                    }, 500)
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Load Data
              </Button>
                        <Button
                  onClick={() => {
                    setEditingDrive(null)
                    setShowAddModal(true)
                  }}
                  className="gap-2 bg-accent text-accent-foreground"
                >
                  <Plus className="w-4 h-4" />
                  Add New Drive
                        </Button>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-lg rounded-lg p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search by company name or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="placement">Placement</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Drives List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
              </div>
            ) : filteredDrives.length === 0 ? (
              <Card className="glass-lg p-12 text-center">
                <Building className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Drives Found</h3>
                <p className="text-muted-foreground mb-4">Get started by creating your first placement drive</p>
                <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-accent text-accent-foreground">
                  <Plus className="w-4 h-4" />
                  Add Drive
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredDrives.map((drive) => (
                <motion.div
                  key={drive.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="glass-lg p-6 hover:shadow-xl transition-all">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-bold">{drive.companyName}</h3>
                          <Badge
                                  variant={
                              drive.status === "active"
                                      ? "default"
                                      : drive.status === "closed"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {drive.status}
                          </Badge>
                                <Badge variant="outline">{drive.type}</Badge>
                              </div>
                              <p className="text-lg text-muted-foreground">{drive.position}</p>
                        </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-accent" />
                                <span><strong>Deadline:</strong> {new Date(drive.deadline).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                            <Building className="w-4 h-4 text-accent" />
                                <span><strong>Package:</strong> {drive.package}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4 text-accent" />
                                <span><strong>Series:</strong> {drive.seriesNumber}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {drive.eligibilityCriteria.minCGPA && (
                                <div className="text-sm">
                                  <strong>Min CGPA:</strong> {drive.eligibilityCriteria.minCGPA}
                                </div>
                              )}
                              {drive.eligibilityCriteria.branches && drive.eligibilityCriteria.branches.length > 0 && (
                                <div className="text-sm">
                                  <strong>Branches:</strong> {drive.eligibilityCriteria.branches.join(", ")}
                                </div>
                              )}
                              {drive.eligibilityCriteria.years && drive.eligibilityCriteria.years.length > 0 && (
                                <div className="text-sm">
                                  <strong>Years:</strong> {drive.eligibilityCriteria.years.join(", ")}
                                </div>
                              )}
                          </div>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const modal = document.createElement("div")
                                modal.className = "fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
                                
                                const container = document.createElement("div")
                                container.className = "bg-background rounded-2xl max-w-3xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                                
                                const header = document.createElement("div")
                                header.className = "flex justify-between items-center mb-4"
                                
                                const title = document.createElement("h2")
                                title.className = "text-2xl font-bold"
                                title.textContent = `Job Description - ${drive.companyName || ""}`
                                
                                const closeBtn = document.createElement("button")
                                closeBtn.className = "text-muted-foreground hover:text-foreground text-2xl leading-none"
                                closeBtn.textContent = "×"
                                closeBtn.onclick = () => modal.remove()
                                
                                header.appendChild(title)
                                header.appendChild(closeBtn)
                                
                                const content = document.createElement("div")
                                content.className = "prose max-w-none"
                                
                                const desc = document.createElement("p")
                                desc.className = "whitespace-pre-wrap text-sm leading-relaxed"
                                desc.textContent = drive.jobDescription || ""
                                
                                content.appendChild(desc)
                                
                                const footer = document.createElement("div")
                                footer.className = "mt-6 flex gap-2"
                                
                                const closeBtn2 = document.createElement("button")
                                closeBtn2.className = "px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
                                closeBtn2.textContent = "Close"
                                closeBtn2.onclick = () => modal.remove()
                                
                                footer.appendChild(closeBtn2)
                                
                                container.appendChild(header)
                                container.appendChild(content)
                                container.appendChild(footer)
                                modal.appendChild(container)
                                
                                document.body.appendChild(modal)
                                modal.addEventListener("click", (e) => {
                                  if (e.target === modal) modal.remove()
                                })
                              }}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View JD
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(drive.registrationLink, "_blank")}
                            >
                              View Registration Link
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(drive.companyInfoLink, "_blank")}
                            >
                              Company Info
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                          size="sm"
                            onClick={() => handleEdit(drive)}
                            className="gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                          size="sm"
                            onClick={() => handleDelete(drive.id)}
                            className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                ))}
              </div>
            )}

            {/* Add/Edit Drive Modal */}
            <DriveFormModal
              open={showAddModal}
              onOpenChange={handleClose}
              onSubmit={handleSubmit}
              editingDrive={editingDrive}
              loading={submitting}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
