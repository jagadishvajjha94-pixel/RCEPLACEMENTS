"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  Calendar,
  Briefcase,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Clock,
  CheckCircle,
  Eye,
  Download,
  Plus,
  Upload,
  Search,
  TrendingUp,
  Award,
  Target,
  User,
  Mail,
  Phone,
  Linkedin,
  Github,
  ExternalLink,
  FileText,
  AlertCircle,
  XCircle,
  Building,
  Package,
} from "lucide-react"
import Link from "next/link"
import { AuthService } from "@/lib/auth-service"
import { PlacementDriveService, RegistrationService, type PlacementDrive, type StudentRegistration } from "@/lib/placement-service"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import type { User as AuthUser } from "@/lib/auth-service"

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [drives, setDrives] = useState<PlacementDrive[]>([])
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([])
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [showOfferUpload, setShowOfferUpload] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<StudentRegistration | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [studentStats, setStudentStats] = useState({
    appliedDrives: 0,
    selectedDrives: 0,
    cgpa: 0,
    rank: 0,
  })

  // Enhanced application form state
  const [applicationData, setApplicationData] = useState({
    name: "",
    rollNumber: "",
    branch: "",
    year: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  })

  // Offer document upload state
  const [offerDocuments, setOfferDocuments] = useState({
    offerLetter: null as File | null,
    emailConfirmation: null as File | null,
    loi: null as File | null,
    internshipOffer: null as File | null,
  })

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "student") {
      router.push("/login")
      return
    }

    setUser(currentUser)
    
    // Initialize mock data if needed
    initializeAllMockData()
    
    // Pre-fill application form with user data
    setApplicationData({
      name: currentUser.name,
      rollNumber: currentUser.profile?.rollNumber || "",
      branch: currentUser.profile?.branch || "",
      year: currentUser.profile?.year || "",
      email: currentUser.email,
      phone: currentUser.profile?.phone || "",
      linkedin: currentUser.profile?.linkedin || "",
      github: currentUser.profile?.github || "",
    })

    loadData(currentUser)
  }, [router])

  const loadData = async (currentUser: AuthUser) => {
    setLoading(true)
    try {
      // Update registration statuses based on deadlines
      RegistrationService.updateRegistrationStatuses()

      // Get eligible drives for the student
      const eligibleDrives = PlacementDriveService.getEligibleDrives(currentUser.id)
      setDrives(eligibleDrives)

      // Get student's registrations
      const studentRegs = RegistrationService.getByStudent(currentUser.id)
      setRegistrations(studentRegs)

      // Calculate stats
      const appliedDrives = studentRegs.length
      const selectedDrives = studentRegs.filter(reg => reg.hasOffer).length
      const cgpa = currentUser.profile?.cgpa || 0
      const rank = Math.floor(Math.random() * 100) + 1 // Mock rank

      setStudentStats({
        appliedDrives,
        selectedDrives,
        cgpa,
        rank,
      })
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    AuthService.logout()
    router.push("/login")
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDrive || !user) return

    // Validate required fields
    if (!applicationData.name || !applicationData.rollNumber || !applicationData.branch || 
        !applicationData.year || !applicationData.email || !applicationData.phone) {
      alert("Please fill in all required fields")
      return
    }

    try {
      // Auto-collect student data and merge with form data
      const autoCollectedData = RegistrationService.autoCollectStudentData(user.id)
      const registrationPayload = {
        driveId: selectedDrive.id,
        studentId: user.id,
        ...autoCollectedData,
        // Override with form data
        studentName: applicationData.name,
        rollNumber: applicationData.rollNumber,
        branch: applicationData.branch,
        year: applicationData.year,
        email: applicationData.email,
        phone: applicationData.phone,
        linkedin: applicationData.linkedin,
        github: applicationData.github,
        hasOffer: false,
      }

      const remote = await RegistrationService.submitRemote(registrationPayload)
      let saved: any
      if (remote) {
        saved = remote
      } else {
        // Fallback to local storage
        saved = RegistrationService.submit(registrationPayload as any)
      }

      // Update UI
      setShowApplicationForm(false)
      setSelectedDrive(null)

      alert(`✓ Registration submitted successfully!\n\nYou will now be redirected to ${selectedDrive.companyName}'s career portal to complete your application.`)

      // Redirect to company portal
      if (selectedDrive.registrationLink) {
        window.open(selectedDrive.registrationLink, "_blank")
      }

      // Refresh data
      loadData(user)
    } catch (error: any) {
      alert(error.message || "Failed to submit application. Please try again.")
    }
  }

  const handleOfferUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRegistration) return

    try {
      // In a real app, you would upload files to a storage service
      // For now, we'll simulate the upload and store file names
      const documentUrls: any = {}
      
      if (offerDocuments.offerLetter) {
        documentUrls.offerLetter = `uploads/${selectedRegistration.id}/offer_letter.pdf`
      }
      if (offerDocuments.emailConfirmation) {
        documentUrls.emailConfirmation = `uploads/${selectedRegistration.id}/email_confirmation.pdf`
      }
      if (offerDocuments.loi) {
        documentUrls.loi = `uploads/${selectedRegistration.id}/loi.pdf`
      }
      if (offerDocuments.internshipOffer) {
        documentUrls.internshipOffer = `uploads/${selectedRegistration.id}/internship_offer.pdf`
      }

      // Update registration with offer documents
      RegistrationService.uploadOfferDocuments(selectedRegistration.id, documentUrls)

      alert("✓ Offer documents uploaded successfully!")
      
      setShowOfferUpload(false)
      setSelectedRegistration(null)
      setOfferDocuments({
        offerLetter: null,
        emailConfirmation: null,
        loi: null,
        internshipOffer: null,
      })

      // Refresh data
      if (user) loadData(user)
    } catch (error: any) {
      alert(error.message || "Failed to upload documents. Please try again.")
    }
  }

  const getRegistrationStatus = (driveId: string): StudentRegistration | null => {
    return registrations.find((r) => r.driveId === driveId) || null
  }

  const getStatusBadge = (registration: StudentRegistration | null, drive: PlacementDrive) => {
    if (!registration) {
      const deadline = new Date(drive.deadline)
      const now = new Date()
      if (deadline < now) {
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Expired/Missed</Badge>
      }
      return null
    }

    switch (registration.status) {
      case "submitted":
        return <Badge variant="default" className="gap-1"><CheckCircle className="w-3 h-3" />Submitted</Badge>
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Pending</Badge>
      case "expired":
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Expired/Missed</Badge>
      default:
        return null
    }
  }

  const isExpired = (deadline: string): boolean => {
    return new Date(deadline) < new Date()
  }

  const getTimeRemaining = (deadline: string): string => {
    const timeMs = new Date(deadline).getTime() - new Date().getTime()
    if (timeMs < 0) return "Expired"
    
    const days = Math.floor(timeMs / (24 * 60 * 60 * 1000))
    const hours = Math.floor((timeMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  const filteredDrives = drives.filter((drive) =>
    drive.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drive.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
            <p className="text-gray-600">Track your placement journey and manage applications</p>
          </div>
          <div className="flex gap-3">
            <Link href="/student/profile">
              <Button variant="outline" className="gap-2">
                <User className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Briefcase className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{studentStats.appliedDrives}</h3>
                <p className="text-white/90 text-sm font-medium">Applications</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{studentStats.selectedDrives}</h3>
                <p className="text-white/90 text-sm font-medium">Offers Received</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{studentStats.cgpa}</h3>
                <p className="text-white/90 text-sm font-medium">CGPA</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 text-white overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">#{studentStats.rank}</h3>
                <p className="text-white/90 text-sm font-medium">Class Rank</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="drives" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="drives">Active Drives</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>

          {/* Active Drives Tab */}
          <TabsContent value="drives" className="space-y-6">
            {/* Search */}
            <Card className="p-4 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search drives by company or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            {/* Drives List */}
            {filteredDrives.length === 0 ? (
              <Card className="p-12 text-center border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Active Drives</h3>
                <p className="text-muted-foreground">Check back later for new placement opportunities</p>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredDrives.map((drive) => {
                  const registration = getRegistrationStatus(drive.id)
                  const expired = isExpired(drive.deadline)
                  
                  return (
                    <motion.div
                      key={drive.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-bold">{drive.companyName}</h3>
                                  {getStatusBadge(registration, drive)}
                                </div>
                                <p className="text-lg text-muted-foreground mb-2">{drive.position}</p>
                                <div className="flex gap-2 flex-wrap">
                                  <Badge variant="outline" className="gap-1">
                                    <Package className="w-3 h-3" />
                                    {drive.package}
                                  </Badge>
                                  <Badge variant="outline" className="gap-1">
                                    <Building className="w-3 h-3" />
                                    {drive.type}
                                  </Badge>
                                  <Badge 
                                    variant={expired ? "destructive" : "default"}
                                    className="gap-1"
                                  >
                                    <Clock className="w-3 h-3" />
                                    {getTimeRemaining(drive.deadline)}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Eligibility</p>
                                <p className="text-sm text-muted-foreground">
                                  {drive.eligibilityCriteria.minCGPA && `Min CGPA: ${drive.eligibilityCriteria.minCGPA}`}
                                  {drive.eligibilityCriteria.branches && ` • Branches: ${drive.eligibilityCriteria.branches.join(", ")}`}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Deadline</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(drive.deadline).toLocaleDateString()} at {new Date(drive.deadline).toLocaleTimeString()}
                                </p>
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
                                  container.className = "bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-border"
                                  
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
                                onClick={() => window.open(drive.companyInfoLink, "_blank")}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Company Info
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {registration ? (
                              <div className="space-y-2">
                                <div className="text-center">
                                  <p className="text-sm font-medium">Registration Status</p>
                                  <p className="text-xs text-muted-foreground">
                                    Submitted: {new Date(registration.submittedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                
                                {!registration.hasOffer && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRegistration(registration)
                                      setShowOfferUpload(true)
                                    }}
                                    className="gap-2"
                                  >
                                    <Upload className="w-4 h-4" />
                                    Upload Offer
                                  </Button>
                                )}
                                
                                {registration.hasOffer && (
                                  <Badge variant="default" className="w-full justify-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Offer Uploaded
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <Button
                                onClick={() => {
                                  setSelectedDrive(drive)
                                  setShowApplicationForm(true)
                                }}
                                disabled={expired}
                                className="gap-2"
                              >
                                {expired ? (
                                  <>
                                    <XCircle className="w-4 h-4" />
                                    Expired
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4" />
                                    Apply Now
                                  </>
                                )}
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
          </TabsContent>

          {/* My Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {registrations.length === 0 ? (
              <Card className="p-12 text-center border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground">Start applying to placement drives to see them here</p>
              </Card>
            ) : (
              <div className="grid gap-6">
                {registrations.map((registration) => {
                  const drive = drives.find(d => d.id === registration.driveId)
                  if (!drive) return null
                  
                  return (
                    <motion.div
                      key={registration.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">{drive.companyName}</h3>
                              {getStatusBadge(registration, drive)}
                              {registration.hasOffer && (
                                <Badge variant="default" className="bg-green-500 gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Offer Received
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-2">{drive.position}</p>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p><strong>Package:</strong> {drive.package}</p>
                                <p><strong>Type:</strong> {drive.type}</p>
                              </div>
                              <div>
                                <p><strong>Applied:</strong> {new Date(registration.submittedAt).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> {registration.status}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {!registration.hasOffer && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRegistration(registration)
                                  setShowOfferUpload(true)
                                }}
                                className="gap-2"
                              >
                                <Upload className="w-4 h-4" />
                                Upload Offer
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(drive.registrationLink, "_blank")}
                              className="gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Career Portal
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Application Form Modal */}
        <AnimatePresence>
          {showApplicationForm && selectedDrive && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplicationForm(false)}
            >
              <motion.div
                className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-border"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h2 className="text-3xl font-bold mb-2">Apply to {selectedDrive.companyName}</h2>
                <p className="text-muted-foreground mb-6">{selectedDrive.position}</p>

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
                        placeholder="John Doe"
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
                        placeholder="21CSE001"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Branch <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={applicationData.branch}
                        onChange={(e) => setApplicationData({ ...applicationData, branch: e.target.value })}
                        placeholder="CSE"
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
                        placeholder="3rd"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Gmail <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                      placeholder="your.email@gmail.com"
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
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowApplicationForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Submit Application
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Offer Upload Modal */}
        <Dialog open={showOfferUpload} onOpenChange={setShowOfferUpload}>
          <DialogContent className="max-w-2xl bg-white dark:bg-slate-900">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Offer Documents
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleOfferUpload} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="offerLetter">Offer Letter (PDF)</Label>
                  <Input
                    id="offerLetter"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setOfferDocuments({
                      ...offerDocuments,
                      offerLetter: e.target.files?.[0] || null
                    })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="emailConfirmation">Email Confirmation (PDF)</Label>
                  <Input
                    id="emailConfirmation"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setOfferDocuments({
                      ...offerDocuments,
                      emailConfirmation: e.target.files?.[0] || null
                    })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="loi">Letter of Intent (LOI) (PDF)</Label>
                  <Input
                    id="loi"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setOfferDocuments({
                      ...offerDocuments,
                      loi: e.target.files?.[0] || null
                    })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="internshipOffer">Internship Offer (PDF)</Label>
                  <Input
                    id="internshipOffer"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setOfferDocuments({
                      ...offerDocuments,
                      internshipOffer: e.target.files?.[0] || null
                    })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Upload at least one document to confirm your offer. 
                  All documents should be in PDF format.
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowOfferUpload(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={!offerDocuments.offerLetter && !offerDocuments.emailConfirmation && 
                           !offerDocuments.loi && !offerDocuments.internshipOffer}
                >
                  Upload Documents
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  )
}