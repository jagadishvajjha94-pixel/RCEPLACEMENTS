
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar, Users, MapPin, IndianRupee, Search, Filter, CheckCircle, Clock, ExternalLink, FileText, AlertCircle } from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import { PlacementDriveService, RegistrationService, type PlacementDrive, type StudentRegistration } from "@/lib/placement-service"
import { CountdownTimer } from "@/components/countdown-timer"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import type { User as AuthUser } from "@/lib/auth-service"

export default function StudentDrivesPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [drives, setDrives] = useState<PlacementDrive[]>([])
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "applied" | "expired">("all")
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "student") {
      navigate("/login")
      return
    }
    setUser(currentUser)
    // Initialize mock data if needed
    initializeAllMockData()
    loadData()
  }, [navigate])

  const loadData = () => {
    setLoading(true)
    const allDrives = PlacementDriveService.getAll({ status: "active" })
    const eligibleDrives = PlacementDriveService.getEligibleDrives(user?.id || "")
    setDrives(eligibleDrives.length > 0 ? eligibleDrives : allDrives)
    
    if (user) {
      const studentRegs = RegistrationService.getByStudent(user.id)
      setRegistrations(studentRegs)
    }
    setLoading(false)
  }

  const handleApply = (drive: PlacementDrive) => {
    setSelectedDrive(drive)
    setShowApplicationModal(true)
  }

  const handleSubmitApplication = async () => {
    if (!user || !selectedDrive) return

    try {
      const registrationData = {
        driveId: selectedDrive.id,
        studentId: user.id,
        studentName: user.name,
        rollNumber: user.profile?.rollNumber || "",
        branch: user.profile?.branch || "",
        year: user.profile?.year || "",
        cgpa: user.profile?.cgpa || 0,
        email: user.email,
        phone: user.profile?.phone || "",
        linkedin: user.profile?.linkedin,
        github: user.profile?.github,
        hasOffer: false,
      }

      // Submit to server
      await RegistrationService.submitRemote(registrationData)
      // Also save locally
      RegistrationService.submit(registrationData)

      // Redirect to registration link
      window.open(selectedDrive.registrationLink, "_blank")
      
      setShowApplicationModal(false)
      setSelectedDrive(null)
      loadData()
    } catch (error: any) {
      alert(error.message || "Failed to submit application. Please try again.")
    }
}

  const getRegistrationStatus = (driveId: string): StudentRegistration | null => {
    return registrations.find((r) => r.driveId === driveId) || null
  }

  const isExpired = (deadline: string): boolean => {
    return new Date(deadline) < new Date()
  }

  const getTimeRemaining = (deadline: string): number => {
    return new Date(deadline).getTime() - new Date().getTime()
  }

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const registration = getRegistrationStatus(drive.id)
    const expired = isExpired(drive.deadline)
    
    let matchesFilter = true
    if (filterStatus === "applied") {
      matchesFilter = registration !== null
    } else if (filterStatus === "expired") {
      matchesFilter = expired
    } else if (filterStatus === "active") {
      matchesFilter = !expired && registration === null
    }

    return matchesSearch && matchesFilter
  })

  if (!user) {
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
            Placement & Internship Drives
          </h1>
          <p className="text-gray-600">Browse and apply to active drives from top companies</p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-xl"
      >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search companies or roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All" },
                    { value: "active", label: "Active" },
                    { value: "applied", label: "Applied" },
                    { value: "expired", label: "Expired" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterStatus(filter.value as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filterStatus === filter.value
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <Filter className="inline w-4 h-4 mr-2" />
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Drives Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
              </div>
            ) : filteredDrives.length === 0 ? (
              <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-12 text-center shadow-xl">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Drives Found</h3>
                <p className="text-muted-foreground">No drives match your search criteria</p>
              </Card>
            ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
            >
                {filteredDrives.map((drive) => {
                  const registration = getRegistrationStatus(drive.id)
                  const expired = isExpired(drive.deadline)
                  const timeRemaining = getTimeRemaining(drive.deadline)

                  return (
                    <motion.div
                      key={drive.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                  <motion.div
                    whileHover={{ x: 4 }}
                  >
                    <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-6 hover:shadow-xl transition-all h-full flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold">{drive.companyName}</h3>
                              <p className="text-sm text-muted-foreground">{drive.position}</p>
                        </div>
                            <div className="flex flex-col gap-1">
                              <Badge
                                variant={registration ? "default" : expired ? "destructive" : "secondary"}
                              >
                                {registration ? "Applied" : expired ? "Expired" : "Open"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {drive.type}
                        </Badge>
                            </div>
                      </div>
                    </div>

                    {/* Drive Details */}
                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="w-4 h-4 text-accent" />
                        <span className="font-semibold">{drive.package}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-accent" />
                            <div className="flex-1">
                              <div className="font-medium">Deadline</div>
                              {!expired && timeRemaining > 0 ? (
                                <CountdownTimer deadline={drive.deadline} compact />
                              ) : (
                                <span className="text-destructive">Expired</span>
                              )}
                            </div>
                          </div>

                          {drive.eligibilityCriteria.minCGPA && (
                            <div className="text-xs text-muted-foreground">
                              Min CGPA: {drive.eligibilityCriteria.minCGPA}
                            </div>
                          )}

                          {drive.eligibilityCriteria.branches && drive.eligibilityCriteria.branches.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Branches: {drive.eligibilityCriteria.branches.join(", ")}
                            </div>
                          )}

                          <div className="pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-left justify-start"
                              onClick={() => {
                                setSelectedDrive(drive)
                                setShowApplicationModal(true)
                              }}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Job Description
                            </Button>
                      </div>
                    </div>

                    {/* Action Button */}
                        {registration ? (
                          <div className="space-y-2">
                    <Button
                              className="w-full gap-2 bg-green-500/20 text-green-700 dark:text-green-300 hover:bg-green-500/30"
                              disabled
                            >
                          <CheckCircle className="w-4 h-4" />
                              Application Submitted
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full gap-2"
                              onClick={() => window.open(drive.registrationLink, "_blank")}
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Registration
                            </Button>
                          </div>
                        ) : expired ? (
                          <Button className="w-full gap-2" variant="destructive" disabled>
                            <AlertCircle className="w-4 h-4" />
                            Deadline Passed
                          </Button>
                        ) : (
                          <Button
                            className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={() => handleApply(drive)}
                          >
                          <Clock className="w-4 h-4" />
                          Apply Now
                            {timeRemaining > 0 && (
                              <span className="text-xs ml-2">
                                ({Math.floor(timeRemaining / (1000 * 60 * 60))}h left)
                              </span>
                      )}
                    </Button>
                        )}
                  </Card>
                  </motion.div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

      {/* Application Confirmation Modal */}
      <AnimatePresence>
        {showApplicationModal && selectedDrive && (
          <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Confirm Application</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedDrive.companyName}</h3>
                  <p className="text-muted-foreground">{selectedDrive.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Job Description:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedDrive.jobDescription}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Package:</strong> {selectedDrive.package}
                  </div>
                  <div>
                    <strong>Deadline:</strong> {new Date(selectedDrive.deadline).toLocaleString()}
                  </div>
                </div>
                {selectedDrive.eligibilityCriteria.minCGPA && (
                  <div className="text-sm">
                    <strong>Min CGPA Required:</strong> {selectedDrive.eligibilityCriteria.minCGPA}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowApplicationModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitApplication} className="bg-accent text-accent-foreground">
                  Confirm & Apply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
