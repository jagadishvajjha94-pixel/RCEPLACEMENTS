"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  FileText,
  Mail,
  FileCheck,
  ExternalLink,
  Search,
  Filter,
  Download,
} from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import { RegistrationService, PlacementDriveService, type StudentRegistration } from "@/lib/placement-service"
import { uploadAPI } from "@/lib/api-client"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import type { User as AuthUser } from "@/lib/auth-service"

export default function StudentApplicationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([])
  const [drives, setDrives] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "submitted" | "pending" | "expired">("all")
  const [selectedRegistration, setSelectedRegistration] = useState<StudentRegistration | null>(null)
  const [showOfferUpload, setShowOfferUpload] = useState(false)
  const [uploading, setUploading] = useState(false)

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
    loadData()
  }, [router])

  const loadData = async () => {
    setLoading(true)
    try {
      const studentRegs = await RegistrationService.getByStudentRemote(user?.id || "")
      if (studentRegs.length === 0) {
        const localRegs = RegistrationService.getByStudent(user?.id || "")
        setRegistrations(localRegs)
      } else {
        setRegistrations(studentRegs)
      }

      // Load drive details for each registration
      const driveIds = registrations.map((r) => r.driveId)
      const driveDetails = driveIds.map((id) => PlacementDriveService.getById(id)).filter(Boolean)
      setDrives(driveDetails)
    } catch (error) {
      console.error("Error loading data:", error)
      const localRegs = RegistrationService.getByStudent(user?.id || "")
      setRegistrations(localRegs)
    } finally {
      setLoading(false)
    }
  }

  const getDriveDetails = (driveId: string) => {
    return drives.find((d) => d.id === driveId) || PlacementDriveService.getById(driveId)
  }

  const handleFileSelect = (type: keyof typeof offerDocuments, file: File | null) => {
    setOfferDocuments((prev) => ({ ...prev, [type]: file }))
  }

  const handleUploadOfferDocuments = async () => {
    if (!selectedRegistration) return

    setUploading(true)
    try {
      const uploadedDocs: any = {}

      // Upload each document
      for (const [key, file] of Object.entries(offerDocuments)) {
        if (file) {
          try {
            const res = await uploadAPI.file(file)
            if (res?.success && res.data?.url) {
              uploadedDocs[key] = res.data.url
            }
          } catch (error) {
            console.error(`Error uploading ${key}:`, error)
          }
        }
      }

      // Update registration with uploaded documents
      const updated = await RegistrationService.uploadOfferDocumentsRemote(selectedRegistration.id, uploadedDocs)
      if (updated) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === selectedRegistration.id ? updated : r))
        )
        alert("Offer documents uploaded successfully!")
        setShowOfferUpload(false)
        setSelectedRegistration(null)
        setOfferDocuments({
          offerLetter: null,
          emailConfirmation: null,
          loi: null,
          internshipOffer: null,
        })
      } else {
        // Fallback to local
        RegistrationService.uploadOfferDocuments(selectedRegistration.id, uploadedDocs)
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === selectedRegistration.id
              ? { ...r, offerDocuments: uploadedDocs, hasOffer: true }
              : r
          )
        )
        alert("Offer documents uploaded (saved locally)")
        setShowOfferUpload(false)
      }
    } catch (error) {
      console.error("Error uploading documents:", error)
      alert("Failed to upload documents. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const getStatusBadge = (registration: StudentRegistration) => {
    if (registration.status === "expired") {
      return <Badge variant="destructive">Expired</Badge>
    }
    if (registration.status === "submitted") {
      return <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">Submitted</Badge>
    }
    return <Badge variant="secondary">Pending</Badge>
  }

  const filteredRegistrations = registrations.filter((reg) => {
    const drive = getDriveDetails(reg.driveId)
    const matchesSearch =
      reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFilter = true
    if (filterStatus === "submitted") {
      matchesFilter = reg.status === "submitted"
    } else if (filterStatus === "pending") {
      matchesFilter = reg.status === "pending"
    } else if (filterStatus === "expired") {
      matchesFilter = reg.status === "expired"
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
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                My Applications
              </h1>
              <p className="text-muted-foreground">
                Track your placement applications and upload offer documents
              </p>
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
                    placeholder="Search by company name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All" },
                    { value: "submitted", label: "Submitted" },
                    { value: "pending", label: "Pending" },
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

            {/* Applications List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <Card className="glass-lg p-12 text-center">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Applications Found</h3>
                <p className="text-muted-foreground mb-4">You haven't applied to any drives yet</p>
                <Button onClick={() => router.push("/student/drives")} className="gap-2 bg-accent text-accent-foreground">
                  Browse Drives
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRegistrations.map((registration) => {
                  const drive = getDriveDetails(registration.driveId)
                  return (
                    <motion.div
                      key={registration.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="glass-lg p-6 hover:shadow-xl transition-all">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-bold">{drive?.companyName || "Unknown Company"}</h3>
                                  {getStatusBadge(registration)}
                                  {registration.hasOffer && (
                                    <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Offer Received
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-lg text-muted-foreground">{drive?.position || "Position"}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Applied on {new Date(registration.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Registration Status</p>
                                <p className="font-semibold">
                                  {registration.status === "submitted" ? (
                                    <span className="text-green-600 flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4" />
                                      Registration Completed
                                    </span>
                                  ) : registration.status === "pending" ? (
                                    <span className="text-amber-600 flex items-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      Registration Inline
                                    </span>
                                  ) : (
                                    <span className="text-red-600 flex items-center gap-2">
                                      <XCircle className="w-4 h-4" />
                                      Expired/Missed
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Offer Status</p>
                                <p className="font-semibold">
                                  {registration.hasOffer ? (
                                    <span className="text-green-600">Offer Received</span>
                                  ) : (
                                    <span className="text-muted-foreground">No Offer Yet</span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {drive?.registrationLink && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 mb-4"
                                onClick={() => window.open(drive.registrationLink, "_blank")}
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Registration Link
                              </Button>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            {registration.hasOffer ? (
                              <>
                                <Button
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => {
                                    setSelectedRegistration(registration)
                                    setShowOfferUpload(true)
                                  }}
                                >
                                  <Upload className="w-4 h-4" />
                                  Update Documents
                                </Button>
                                {registration.offerDocuments && (
                                  <div className="space-y-1 text-xs text-muted-foreground">
                                    {registration.offerDocuments.offerLetter && (
                                      <div className="flex items-center gap-1">
                                        <FileCheck className="w-3 h-3" />
                                        Offer Letter
                                      </div>
                                    )}
                                    {registration.offerDocuments.emailConfirmation && (
                                      <div className="flex items-center gap-1">
                                        <FileCheck className="w-3 h-3" />
                                        Email Confirmation
                                      </div>
                                    )}
                                    {registration.offerDocuments.loi && (
                                      <div className="flex items-center gap-1">
                                        <FileCheck className="w-3 h-3" />
                                        LOI
                                      </div>
                                    )}
                                    {registration.offerDocuments.internshipOffer && (
                                      <div className="flex items-center gap-1">
                                        <FileCheck className="w-3 h-3" />
                                        Internship Offer
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Button
                                className="gap-2 bg-accent text-accent-foreground"
                                onClick={() => {
                                  setSelectedRegistration(registration)
                                  setShowOfferUpload(true)
                                }}
                              >
                                <Upload className="w-4 h-4" />
                                Upload Offer Documents
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
          </div>
        </div>
      </main>

      {/* Offer Upload Modal */}
      <AnimatePresence>
        {showOfferUpload && selectedRegistration && (
          <Dialog open={showOfferUpload} onOpenChange={setShowOfferUpload}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Upload Offer Documents</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your offer-related documents. All fields are optional, but uploading documents helps track
                    your placement status.
                  </p>
                </div>

                <Tabs defaultValue="offerLetter" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="offerLetter">Offer Letter</TabsTrigger>
                    <TabsTrigger value="emailConfirmation">Email Confirmation</TabsTrigger>
                    <TabsTrigger value="loi">LOI</TabsTrigger>
                    <TabsTrigger value="internshipOffer">Internship Offer</TabsTrigger>
                  </TabsList>

                  <TabsContent value="offerLetter" className="space-y-4">
                    <div>
                      <Label htmlFor="offerLetter">Offer Letter (PDF)</Label>
                      <Input
                        id="offerLetter"
                        type="file"
                        accept=".pdf,.png,.jpg"
                        onChange={(e) => handleFileSelect("offerLetter", e.target.files?.[0] || null)}
                      />
                      {offerDocuments.offerLetter && (
                        <p className="text-sm text-green-600 mt-2">
                          Selected: {offerDocuments.offerLetter.name}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="emailConfirmation" className="space-y-4">
                    <div>
                      <Label htmlFor="emailConfirmation">Email Confirmation PDF</Label>
                      <Input
                        id="emailConfirmation"
                        type="file"
                        accept=".pdf,.png,.jpg"
                        onChange={(e) => handleFileSelect("emailConfirmation", e.target.files?.[0] || null)}
                      />
                      {offerDocuments.emailConfirmation && (
                        <p className="text-sm text-green-600 mt-2">
                          Selected: {offerDocuments.emailConfirmation.name}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="loi" className="space-y-4">
                    <div>
                      <Label htmlFor="loi">Letter of Intent (LOI)</Label>
                      <Input
                        id="loi"
                        type="file"
                        accept=".pdf,.png,.jpg"
                        onChange={(e) => handleFileSelect("loi", e.target.files?.[0] || null)}
                      />
                      {offerDocuments.loi && (
                        <p className="text-sm text-green-600 mt-2">Selected: {offerDocuments.loi.name}</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="internshipOffer" className="space-y-4">
                    <div>
                      <Label htmlFor="internshipOffer">Internship Offer</Label>
                      <Input
                        id="internshipOffer"
                        type="file"
                        accept=".pdf,.png,.jpg"
                        onChange={(e) => handleFileSelect("internshipOffer", e.target.files?.[0] || null)}
                      />
                      {offerDocuments.internshipOffer && (
                        <p className="text-sm text-green-600 mt-2">
                          Selected: {offerDocuments.internshipOffer.name}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowOfferUpload(false)} disabled={uploading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUploadOfferDocuments}
                  className="bg-accent text-accent-foreground"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documents
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}

