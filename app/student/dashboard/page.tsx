
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Trophy,
  Briefcase as BriefcaseIcon,
  GraduationCap as GraduationCapIcon,
  X,
} from "lucide-react"
import { Link } from "react-router-dom"
import { AuthService } from "@/lib/auth-service"
import { PlacementDriveService, RegistrationService, type PlacementDrive, type StudentRegistration } from "@/lib/placement-service"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import { mockToppers, type Topper, type FacultyFeedback } from "@/lib/mock-data"
import { FacultyFeedbackService } from "@/lib/db-service"
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
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [drives, setDrives] = useState<PlacementDrive[]>([])
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([])
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [showOfferUpload, setShowOfferUpload] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<StudentRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTopper, setSelectedTopper] = useState<Topper | null>(null)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [facultyFeedback, setFacultyFeedback] = useState<FacultyFeedback[]>([])
  const [studentStats, setStudentStats] = useState({
    appliedDrives: 0,
    selectedDrives: 0,
    cgpa: 0,
    rank: 0,
  })
  
  // Get toppers by category
  const trainingToppers = mockToppers.filter(t => t.category === "training")
  const academicToppers = mockToppers.filter(t => t.category === "academic")
  const placedStudents = mockToppers.filter(t => t.category === "placed")
  
  // Get user's branch
  const userBranch = user?.profile?.branch || "CSE"
  
  // Get branch-wise toppers
  const getBranchToppers = (branch: string, category: "training" | "academic" | "placed") => {
    return mockToppers.filter(t => t.branch === branch && t.category === category).slice(0, 3)
  }
  
  // Get college-wide toppers (top 3 across all branches)
  const collegeTrainingToppers = trainingToppers.slice(0, 3)
  const collegeAcademicToppers = academicToppers.slice(0, 3)
  const collegePlacedStudents = placedStudents.slice(0, 3)
  
  // Get branch-wise toppers for user's branch
  const branchTrainingToppers = getBranchToppers(userBranch, "training")
  const branchAcademicToppers = getBranchToppers(userBranch, "academic")
  const branchPlacedStudents = getBranchToppers(userBranch, "placed")

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
      navigate("/login")
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
  }, [navigate])

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

      // Load faculty feedback
      const feedback = await FacultyFeedbackService.getByStudent(currentUser.id)
      setFacultyFeedback(feedback)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    AuthService.logout()
    navigate("/login")
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-full p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
            <p className="text-sm text-gray-600">Track your placement journey and manage applications</p>
          </div>
          <div className="flex gap-3">
            <Link to="/student/profile">
              <Button variant="outline" className="gap-2">
                <User className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white overflow-hidden relative">
              <div className="p-2 relative z-10">
                <div className="flex items-start justify-between mb-1">
                  <div className="p-1.5 bg-white/20 rounded-md backdrop-blur-sm">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{studentStats.appliedDrives}</h3>
                <p className="text-white/90 text-xs font-medium">Applications</p>
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-6 -mb-6"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white overflow-hidden relative">
              <div className="p-2 relative z-10">
                <div className="flex items-start justify-between mb-1">
                  <div className="p-1.5 bg-white/20 rounded-md backdrop-blur-sm">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{studentStats.selectedDrives}</h3>
                <p className="text-white/90 text-xs font-medium">Offers Received</p>
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-6 -mb-6"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white overflow-hidden relative">
              <div className="p-2 relative z-10">
                <div className="flex items-start justify-between mb-1">
                  <div className="p-1.5 bg-white/20 rounded-md backdrop-blur-sm">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{studentStats.cgpa}</h3>
                <p className="text-white/90 text-xs font-medium">CGPA</p>
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-6 -mb-6"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 text-white overflow-hidden relative">
              <div className="p-2 relative z-10">
                <div className="flex items-start justify-between mb-1">
                  <div className="p-1.5 bg-white/20 rounded-md backdrop-blur-sm">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">#{studentStats.rank}</h3>
                <p className="text-white/90 text-xs font-medium">Class Rank</p>
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-6 -mb-6"></div>
            </Card>
          </motion.div>
        </div>

        {/* Toppers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Top Performers</h2>
          </div>
          
          {/* College-wide Toppers */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">College-wide Top Performers</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {/* Training Toppers */}
              <Card className="bg-white p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-sm font-bold">Training Toppers</h3>
                </div>
                <div className="space-y-2">
                  {collegeTrainingToppers.map((topper, index) => (
                    <motion.div
                      key={topper.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedTopper(topper)
                        setShowResumeModal(true)
                      }}
                    >
                      <img
                        src={topper.picture}
                        alt={topper.name}
                        className="w-8 h-8 rounded-full border-2 border-primary object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-xs">{topper.name}</p>
                        <p className="text-[10px] text-muted-foreground">{topper.branch} • Rank #{topper.rank}</p>
                      </div>
                      <Badge className="bg-yellow-500 text-[10px] px-1.5 py-0">{topper.score}%</Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Academic Toppers */}
              <Card className="bg-white p-3">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCapIcon className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-bold">Academic Toppers</h3>
                </div>
                <div className="space-y-2">
                  {collegeAcademicToppers.map((topper, index) => (
                    <motion.div
                      key={topper.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedTopper(topper)
                        setShowResumeModal(true)
                      }}
                    >
                      <img
                        src={topper.picture}
                        alt={topper.name}
                        className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-xs">{topper.name}</p>
                        <p className="text-[10px] text-muted-foreground">{topper.branch} • Rank #{topper.rank}</p>
                      </div>
                      <Badge className="bg-blue-500 text-[10px] px-1.5 py-0">CGPA {topper.cgpa}</Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Placed Students */}
              <Card className="bg-white p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BriefcaseIcon className="w-4 h-4 text-green-500" />
                  <h3 className="text-sm font-bold">Placed Students</h3>
                </div>
                <div className="space-y-2">
                  {collegePlacedStudents.map((topper, index) => (
                    <motion.div
                      key={topper.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedTopper(topper)
                        setShowResumeModal(true)
                      }}
                    >
                      <img
                        src={topper.picture}
                        alt={topper.name}
                        className="w-8 h-8 rounded-full border-2 border-green-500 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-xs">{topper.name}</p>
                        <p className="text-[10px] text-muted-foreground">{topper.company} • {topper.package}</p>
                      </div>
                      <Badge className="bg-green-500 text-[10px] px-1.5 py-0">Placed</Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Branch-wise Toppers */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              {userBranch} Branch Top Performers
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              {/* Branch Training Toppers */}
              <Card className="bg-white p-3 border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-sm font-bold">Training Toppers</h3>
                  <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">{userBranch}</Badge>
                </div>
                <div className="space-y-2">
                  {branchTrainingToppers.length > 0 ? (
                    branchTrainingToppers.map((topper, index) => (
                      <motion.div
                        key={topper.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedTopper(topper)
                          setShowResumeModal(true)
                        }}
                      >
                        <img
                          src={topper.picture}
                          alt={topper.name}
                          className="w-8 h-8 rounded-full border-2 border-primary object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-xs">{topper.name}</p>
                          <p className="text-[10px] text-muted-foreground">Rank #{topper.rank}</p>
                        </div>
                        <Badge className="bg-yellow-500 text-[10px] px-1.5 py-0">{topper.score}%</Badge>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">No toppers available</p>
                  )}
                </div>
              </Card>

              {/* Branch Academic Toppers */}
              <Card className="bg-white p-3 border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCapIcon className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-bold">Academic Toppers</h3>
                  <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">{userBranch}</Badge>
                </div>
                <div className="space-y-2">
                  {branchAcademicToppers.length > 0 ? (
                    branchAcademicToppers.map((topper, index) => (
                      <motion.div
                        key={topper.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedTopper(topper)
                          setShowResumeModal(true)
                        }}
                      >
                        <img
                          src={topper.picture}
                          alt={topper.name}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-xs">{topper.name}</p>
                          <p className="text-[10px] text-muted-foreground">Rank #{topper.rank}</p>
                        </div>
                        <Badge className="bg-blue-500 text-[10px] px-1.5 py-0">CGPA {topper.cgpa}</Badge>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">No toppers available</p>
                  )}
                </div>
              </Card>

              {/* Branch Placed Students */}
              <Card className="bg-white p-3 border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <BriefcaseIcon className="w-4 h-4 text-green-500" />
                  <h3 className="text-sm font-bold">Placed Students</h3>
                  <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">{userBranch}</Badge>
                </div>
                <div className="space-y-2">
                  {branchPlacedStudents.length > 0 ? (
                    branchPlacedStudents.map((topper, index) => (
                      <motion.div
                        key={topper.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedTopper(topper)
                          setShowResumeModal(true)
                        }}
                      >
                        <img
                          src={topper.picture}
                          alt={topper.name}
                          className="w-8 h-8 rounded-full border-2 border-green-500 object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-xs">{topper.name}</p>
                          <p className="text-[10px] text-muted-foreground">{topper.company} • {topper.package}</p>
                        </div>
                        <Badge className="bg-green-500 text-[10px] px-1.5 py-0">Placed</Badge>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">No placements yet</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </motion.div>


        {/* Faculty Feedback Section */}
        {facultyFeedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Faculty Feedback</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              {facultyFeedback.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                          {feedback.facultyName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{feedback.facultyName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(feedback.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        feedback.category === "academics" ? "bg-blue-500 text-[10px] px-1.5 py-0" : "bg-green-500 text-[10px] px-1.5 py-0"
                      }>
                        {feedback.category === "academics" ? "Academics" : "Training"}
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-sm mb-1">{feedback.subject}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{feedback.content}</p>
                    
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Award
                          key={star}
                          className={`w-3 h-3 ${
                            star <= feedback.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {feedback.rating} / 5
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

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
          <DialogContent className="max-w-2xl bg-white">
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

        {/* Resume Modal */}
        <Dialog open={showResumeModal} onOpenChange={setShowResumeModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedTopper && (
                  <>
                    <img
                      src={selectedTopper.picture}
                      alt={selectedTopper.name}
                      className="w-12 h-12 rounded-full border-2 border-primary"
                    />
                    <div>
                      <p className="text-xl">{selectedTopper.name}</p>
                      <p className="text-sm text-muted-foreground font-normal">
                        {selectedTopper.rollNumber} • {selectedTopper.branch}
                      </p>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {selectedTopper && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold mb-1">Category</p>
                    <Badge className={
                      selectedTopper.category === "training" ? "bg-yellow-500" :
                      selectedTopper.category === "academic" ? "bg-blue-500" :
                      "bg-green-500"
                    }>
                      {selectedTopper.category === "training" ? "Training Topper" :
                       selectedTopper.category === "academic" ? "Academic Topper" :
                       "Placed Student"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Rank</p>
                    <p className="text-lg font-bold">#{selectedTopper.rank}</p>
                  </div>
                  {selectedTopper.score && (
                    <div>
                      <p className="text-sm font-semibold mb-1">Training Score</p>
                      <p className="text-lg font-bold">{selectedTopper.score}%</p>
                    </div>
                  )}
                  {selectedTopper.cgpa && (
                    <div>
                      <p className="text-sm font-semibold mb-1">CGPA</p>
                      <p className="text-lg font-bold">{selectedTopper.cgpa}</p>
                    </div>
                  )}
                  {selectedTopper.company && (
                    <>
                      <div>
                        <p className="text-sm font-semibold mb-1">Company</p>
                        <p className="text-lg font-bold">{selectedTopper.company}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Package</p>
                        <p className="text-lg font-bold">{selectedTopper.package}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Position</p>
                        <p className="text-lg font-bold">{selectedTopper.position}</p>
                      </div>
                    </>
                  )}
                </div>
                
                {selectedTopper.achievement && (
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <p className="text-sm font-semibold mb-1">Achievement</p>
                    <p className="text-sm">{selectedTopper.achievement}</p>
                  </div>
                )}
                
                {selectedTopper.resumeUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-semibold mb-2">Resume Used for Interview</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is the resume that helped {selectedTopper.name} crack the interview at {selectedTopper.company}
                    </p>
                    <Button
                      onClick={() => window.open(selectedTopper.resumeUrl, "_blank")}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      View Resume
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Resume not available</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
    </div>
  )
}