"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Users,
  MapPin,
  IndianRupee,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ExternalLink,
  Upload,
  FileText,
  X,
  Mail,
  Phone,
  Linkedin,
  Github,
  User,
  AlertCircle,
  Award,
} from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import {
  PlacementDriveService,
  RegistrationService,
  type PlacementDrive,
  type StudentRegistration,
} from "@/lib/placement-service"

export default function StudentPlacementsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [drives, setDrives] = useState<PlacementDrive[]>([])
  const [myRegistrations, setMyRegistrations] = useState<StudentRegistration[]>([])
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [showOfferUpload, setShowOfferUpload] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<StudentRegistration | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "placement" | "internship">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "applied" | "not-applied">("all")

  // Application form state
  const [applicationData, setApplicationData] = useState({
    name: "",
    rollNumber: "",
    branch: "",
    year: "",
    cgpa: 0,
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  })

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "student") {
      navigate("/login")
      return
    }
    setUser(currentUser)

    // Pre-fill application form
    setApplicationData({
      name: currentUser.name,
      rollNumber: currentUser.profile?.rollNumber || "",
      branch: currentUser.profile?.branch || "",
      year: currentUser.profile?.year || "",
      cgpa: currentUser.profile?.cgpa || 0,
      email: currentUser.email,
      phone: currentUser.profile?.phone || "",
      linkedin: currentUser.profile?.linkedin || "",
      github: currentUser.profile?.github || "",
    })

    loadData(currentUser)
  }, [navigate])

  const loadData = (currentUser: any) => {
    // Get eligible drives for the student
    const eligibleDrives = PlacementDriveService.getEligibleDrives(currentUser.id)
    setDrives(eligibleDrives)

    // Get student's registrations
    const registrations = RegistrationService.getByStudent(currentUser.id)
    setMyRegistrations(registrations)
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDrive || !user) return

    try {
      // Auto-collect student data and merge with form data
      const autoCollectedData = RegistrationService.autoCollectStudentData(user.id)
      const registration = RegistrationService.submit({
        driveId: selectedDrive.id,
        studentId: user.id,
        ...autoCollectedData,
        // Override with form data
        studentName: applicationData.name,
        rollNumber: applicationData.rollNumber,
        branch: applicationData.branch,
        year: applicationData.year,
        cgpa: applicationData.cgpa,
        email: applicationData.email,
        phone: applicationData.phone,
        linkedin: applicationData.linkedin,
        github: applicationData.github,
        hasOffer: false,
      })

      alert(`✓ Registration submitted successfully!\n\nYou will now be redirected to ${selectedDrive.companyName}'s registration portal.`)
      
      setShowApplicationForm(false)
      
      // Redirect to company portal
      if (selectedDrive.registrationLink) {
        window.open(selectedDrive.registrationLink, "_blank")
      }

      // Reload data
      loadData(user)
    } catch (error: any) {
      alert(error.message || "Failed to submit registration. Please try again.")
    }
  }

  const handleOfferUpload = (registrationId: string) => {
    const registration = myRegistrations.find((r) => r.id === registrationId)
    if (registration) {
      setSelectedRegistration(registration)
      setShowOfferUpload(true)
    }
  }

  const handleOfferDocumentSubmit = () => {
    if (!selectedRegistration) return

    // In a real app, this would upload files to a server
    // For now, we'll just mark as having an offer
    RegistrationService.uploadOfferDocuments(selectedRegistration.id, {
      offerLetter: "uploaded",
      emailConfirmation: "uploaded",
    })

    alert("✓ Offer documents uploaded successfully!")
    setShowOfferUpload(false)
    loadData(user)
  }

  const daysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const hasApplied = (driveId: string) => {
    return myRegistrations.some((r) => r.driveId === driveId)
  }

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.position.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || drive.type === filterType
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "applied" && hasApplied(drive.id)) ||
      (filterStatus === "not-applied" && !hasApplied(drive.id))
    return matchesSearch && matchesType && matchesStatus
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <main>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Placement & Internship Drives
              </h1>
              <p className="text-gray-600">
                Browse active drives, register for opportunities, and track your applications
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[
                { label: "Available Drives", value: drives.length, color: "from-blue-500 to-cyan-500" },
                { label: "Applied", value: myRegistrations.length, color: "from-green-500 to-emerald-500" },
                {
                  label: "Offers Received",
                  value: myRegistrations.filter((r) => r.hasOffer).length,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  label: "Pending",
                  value: myRegistrations.filter((r) => !r.hasOffer).length,
                  color: "from-orange-500 to-red-500",
                },
              ].map((stat, index) => (
                <Card key={index} className="bg-white border border-slate-200/70 p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </Card>
              ))}
            </motion.div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-slate-100 mb-6 shadow-sm border border-slate-200/60">
                <TabsTrigger value="active">Active Drives</TabsTrigger>
                <TabsTrigger value="applied">My Applications</TabsTrigger>
                <TabsTrigger value="offers">Offers Received</TabsTrigger>
              </TabsList>

              {/* Active Drives Tab */}
              <TabsContent value="active">
                {/* Search & Filters */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200/70 rounded-lg p-6 mb-8 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                      <Input
                        placeholder="Search companies or roles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="px-4 py-2 rounded-lg border bg-background"
                      >
                        <option value="all">All Types</option>
                        <option value="placement">Placement</option>
                        <option value="internship">Internship</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-4 py-2 rounded-lg border bg-background"
                      >
                        <option value="all">All Status</option>
                        <option value="applied">Applied</option>
                        <option value="not-applied">Not Applied</option>
                      </select>
                    </div>
                  </div>
                </motion.div>

                {/* Drives Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDrives.map((drive, index) => {
                    const applied = hasApplied(drive.id)
                    return (
                      <motion.div
                        key={drive.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="bg-white border border-slate-200/70 p-6 hover:shadow-sm transition-all duration-300 h-full flex flex-col shadow-sm">
                          <div className="mb-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold mb-1">{drive.companyName}</h3>
                                <p className="text-sm text-gray-600">{drive.position}</p>
                              </div>
                              <Badge
                                className={
                                  applied
                                    ? "bg-green-500/20 text-green-700"
                                    : "bg-blue-500/20 text-blue-700"
                                }
                              >
                                {applied ? "Applied" : "Open"}
                              </Badge>
                            </div>
                            <Badge
                              className={
                                drive.type === "placement"
                                  ? "bg-purple-500/20 text-purple-700"
                                  : "bg-orange-500/20 text-orange-700"
                              }
                            >
                              {drive.type}
                            </Badge>
                          </div>

                          <div className="space-y-3 mb-6 flex-1">
                            <div className="flex items-center gap-2 text-sm">
                              <IndianRupee className="w-4 h-4 text-accent" />
                              <span className="font-semibold">{drive.package}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-accent" />
                              <span>Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-accent" />
                              <span
                                className={
                                  daysUntilDeadline(drive.deadline) <= 3 ? "text-red-500 font-semibold" : ""
                                }
                              >
                                {daysUntilDeadline(drive.deadline)} days left
                              </span>
                            </div>
                            {drive.eligibilityCriteria.minCGPA && drive.eligibilityCriteria.minCGPA > 0 && (
                              <div className="text-xs text-gray-600">
                                Min CGPA: {drive.eligibilityCriteria.minCGPA}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            {!applied ? (
                              <Button
                                onClick={() => {
                                  setSelectedDrive(drive)
                                  setShowApplicationForm(true)
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Register Now
                              </Button>
                            ) : (
                              <Button variant="outline" className="w-full gap-2" disabled>
                                <CheckCircle className="w-4 h-4" />
                                Already Registered
                              </Button>
                            )}
                            {drive.companyInfoLink && (
                              <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                                <a href={drive.companyInfoLink} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                  Company Info
                                </a>
                              </Button>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>

                {filteredDrives.length === 0 && (
                  <Card className="glass-lg p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No drives found matching your filters</p>
                  </Card>
                )}
              </TabsContent>

              {/* My Applications Tab */}
              <TabsContent value="applied">
                <div className="space-y-4">
                  {myRegistrations.length === 0 ? (
                    <Card className="bg-white border border-slate-200/70 p-12 text-center shadow-sm">
                      <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">No applications yet</p>
                      <p className="text-sm text-gray-600 mt-2">Start applying to drives to see them here</p>
                    </Card>
                  ) : (
                    myRegistrations.map((registration) => {
                      const drive = drives.find((d) => d.id === registration.driveId)
                      if (!drive) return null

                      return (
                        <Card key={registration.id} className="bg-white border border-slate-200/70 p-6 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold">{drive.companyName}</h3>
                              <p className="text-gray-600">{drive.position}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                Applied on {new Date(registration.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              className={
                                registration.hasOffer
                                  ? "bg-green-500/20 text-green-700"
                                  : "bg-orange-500/20 text-orange-700"
                              }
                            >
                              {registration.hasOffer ? "Offer Received" : "Pending"}
                            </Badge>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            {drive.registrationLink && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={drive.registrationLink} target="_blank" rel="noopener noreferrer" className="gap-2">
                                  <ExternalLink className="w-4 h-4" />
                                  View Registration
                                </a>
                              </Button>
                            )}
                            {!registration.hasOffer && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOfferUpload(registration.id)}
                                className="gap-2"
                              >
                                <Upload className="w-4 h-4" />
                                Upload Offer Documents
                              </Button>
                            )}
                          </div>
                        </Card>
                      )
                    })
                  )}
                </div>
              </TabsContent>

              {/* Offers Tab */}
              <TabsContent value="offers">
                <div className="space-y-4">
                  {myRegistrations.filter((r) => r.hasOffer).length === 0 ? (
                    <Card className="bg-white border border-slate-200/70 p-12 text-center shadow-sm">
                      <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">No offers yet</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Keep applying and upload offer documents when you receive them
                      </p>
                    </Card>
                  ) : (
                    myRegistrations
                      .filter((r) => r.hasOffer)
                      .map((registration) => {
                        const drive = drives.find((d) => d.id === registration.driveId)
                        if (!drive) return null

                        return (
                          <Card key={registration.id} className="bg-white border border-slate-200/70 p-6 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold mb-1">{drive.companyName}</h3>
                                <p className="text-gray-600 mb-2">{drive.position}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="font-semibold text-green-600">{drive.package}</span>
                                  <span className="text-gray-600">
                                    Offer received on {new Date(registration.submittedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        )
                      })
                  )}
                </div>
              </TabsContent>
            </Tabs>
      </main>

      {/* Application Form Modal */}
      <AnimatePresence>
        {showApplicationForm && selectedDrive && (
          <motion.div
            className="fixed inset-0 bg-black/60  flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowApplicationForm(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-sm max-h-[90vh] overflow-y-auto border border-border"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold">Register for {selectedDrive?.companyName}</h2>
                  <p className="text-gray-600">{selectedDrive?.position}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowApplicationForm(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleApply} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={applicationData.name}
                      onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Roll Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={applicationData.rollNumber}
                      onChange={(e) => setApplicationData({ ...applicationData, rollNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={applicationData.branch}
                      onChange={(e) => setApplicationData({ ...applicationData, branch: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={applicationData.year}
                      onChange={(e) => setApplicationData({ ...applicationData, year: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      CGPA <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={applicationData.cgpa}
                      onChange={(e) => setApplicationData({ ...applicationData, cgpa: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={applicationData.email}
                    onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Profile (Optional)
                  </label>
                  <Input
                    type="url"
                    value={applicationData.linkedin}
                    onChange={(e) => setApplicationData({ ...applicationData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub Profile (Optional)
                  </label>
                  <Input
                    type="url"
                    value={applicationData.github}
                    onChange={(e) => setApplicationData({ ...applicationData, github: e.target.value })}
                    placeholder="https://github.com/yourusername"
                  />
                </div>


                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Submit & Continue to Portal
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offer Upload Modal */}
      <AnimatePresence>
        {showOfferUpload && selectedRegistration && (
          <motion.div
            className="fixed inset-0 bg-black/60  flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOfferUpload(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-sm"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upload Offer Documents</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowOfferUpload(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Offer Letter</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-600 mt-1">PDF, DOC, or image files</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Email Confirmation</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-600 mt-1">PDF or image files</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">LOI (Optional)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowOfferUpload(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleOfferDocumentSubmit}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Submit Documents
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}