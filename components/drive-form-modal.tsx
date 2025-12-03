"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { 
  Building2, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Users, 
  GraduationCap, 
  FileText, 
  Link as LinkIcon,
  CheckCircle2,
  X,
  Save,
  Loader2
} from "lucide-react"
import type { PlacementDrive } from "@/lib/placement-service"

const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE", "AIDS", "AI/ML", "Cybersecurity", "IoT", "ServiceNow"]
const years = ["1st", "2nd", "3rd", "4th"]
const workModes = ["On-site", "Remote", "Hybrid"]
const experienceLevels = ["Fresher", "0-1 years", "1-2 years", "2-3 years", "3+ years"]

interface DriveFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  editingDrive?: PlacementDrive | null
  loading?: boolean
}

export function DriveFormModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editingDrive,
  loading = false 
}: DriveFormModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    jobDescription: "",
    package: "",
    packageCurrency: "INR",
    minPackage: "",
    maxPackage: "",
    deadline: "",
    seriesNumber: "",
    status: "active" as "active" | "closed" | "upcoming",
    type: "placement" as "placement" | "internship",
    location: "",
    workMode: "",
    experienceRequired: "",
    numberOfOpenings: "",
    eligibilityCriteria: {
      minCGPA: "",
      branches: [] as string[],
      years: [] as string[],
      specificStudents: [] as string[],
    },
    registrationLink: "",
    companyInfoLink: "",
    jdFileUrl: "",
    additionalInfo: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    profileSubmissionDeadline: "",
    requiredDocuments: [] as string[],
    skillsRequired: "",
    benefits: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingDrive) {
      setFormData({
        companyName: editingDrive.companyName || "",
        position: editingDrive.position || "",
        jobDescription: editingDrive.jobDescription || "",
        package: editingDrive.package || "",
        packageCurrency: "INR",
        minPackage: "",
        maxPackage: "",
        deadline: editingDrive.deadline || "",
        seriesNumber: editingDrive.seriesNumber || "",
        status: editingDrive.status || "active",
        type: editingDrive.type || "placement",
        location: "",
        workMode: "",
        experienceRequired: "",
        numberOfOpenings: "",
        eligibilityCriteria: {
          minCGPA: editingDrive.eligibilityCriteria.minCGPA?.toString() || "",
          branches: editingDrive.eligibilityCriteria.branches || [],
          years: editingDrive.eligibilityCriteria.years || [],
          specificStudents: editingDrive.eligibilityCriteria.specificStudents || [],
        },
        registrationLink: editingDrive.registrationLink || "",
        companyInfoLink: editingDrive.companyInfoLink || "",
        jdFileUrl: editingDrive.jdFileUrl || "",
        additionalInfo: "",
        contactPerson: "",
        contactEmail: "",
        contactPhone: "",
        profileSubmissionDeadline: "",
        requiredDocuments: [],
        skillsRequired: "",
        benefits: "",
      })
    } else {
      resetForm()
    }
  }, [editingDrive, open])

  const resetForm = () => {
    setFormData({
      companyName: "",
      position: "",
      jobDescription: "",
      package: "",
      packageCurrency: "INR",
      minPackage: "",
      maxPackage: "",
      deadline: "",
      seriesNumber: "",
      status: "active",
      type: "placement",
      location: "",
      workMode: "",
      experienceRequired: "",
      numberOfOpenings: "",
      eligibilityCriteria: {
        minCGPA: "",
        branches: [],
        years: [],
        specificStudents: [],
      },
      registrationLink: "",
      companyInfoLink: "",
      jdFileUrl: "",
      additionalInfo: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      profileSubmissionDeadline: "",
      requiredDocuments: [],
      skillsRequired: "",
      benefits: "",
    })
    setErrors({})
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
    if (!formData.position.trim()) newErrors.position = "Position is required"
    if (!formData.jobDescription.trim()) newErrors.jobDescription = "Job description is required"
    if (!formData.package.trim() && (!formData.minPackage.trim() || !formData.maxPackage.trim())) {
      newErrors.package = "Package or salary range is required"
    }
    if (!formData.deadline) newErrors.deadline = "Deadline is required"
    if (!formData.seriesNumber.trim()) newErrors.seriesNumber = "Series number is required"
    if (!formData.registrationLink.trim()) newErrors.registrationLink = "Registration link is required"
    if (!formData.companyInfoLink.trim()) newErrors.companyInfoLink = "Company info link is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    const driveData = {
      companyName: formData.companyName,
      jobDescription: formData.jobDescription,
      package: formData.package || `${formData.minPackage}-${formData.maxPackage} ${formData.packageCurrency}`,
      eligibilityCriteria: {
        minCGPA: formData.eligibilityCriteria.minCGPA ? parseFloat(formData.eligibilityCriteria.minCGPA) : undefined,
        branches: formData.eligibilityCriteria.branches.length > 0 ? formData.eligibilityCriteria.branches : undefined,
        years: formData.eligibilityCriteria.years.length > 0 ? formData.eligibilityCriteria.years : undefined,
        specificStudents: formData.eligibilityCriteria.specificStudents.length > 0 ? formData.eligibilityCriteria.specificStudents : undefined,
      },
      position: formData.position,
      registrationLink: formData.registrationLink,
      companyInfoLink: formData.companyInfoLink,
      seriesNumber: formData.seriesNumber,
      status: formData.status,
      deadline: formData.deadline,
      type: formData.type,
      jdFileUrl: formData.jdFileUrl || undefined,
      location: formData.location || undefined,
      workMode: formData.workMode || undefined,
      experienceRequired: formData.experienceRequired || undefined,
      numberOfOpenings: formData.numberOfOpenings || undefined,
      additionalInfo: formData.additionalInfo || undefined,
      contactPerson: formData.contactPerson || undefined,
      contactEmail: formData.contactEmail || undefined,
      contactPhone: formData.contactPhone || undefined,
      profileSubmissionDeadline: formData.profileSubmissionDeadline || undefined,
      skillsRequired: formData.skillsRequired || undefined,
      benefits: formData.benefits || undefined,
    }

    try {
      await onSubmit(driveData)
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleBranch = (branch: string) => {
    setFormData(prev => ({
      ...prev,
      eligibilityCriteria: {
        ...prev.eligibilityCriteria,
        branches: prev.eligibilityCriteria.branches.includes(branch)
          ? prev.eligibilityCriteria.branches.filter(b => b !== branch)
          : [...prev.eligibilityCriteria.branches, branch],
      },
    }))
  }

  const toggleYear = (year: string) => {
    setFormData(prev => ({
      ...prev,
      eligibilityCriteria: {
        ...prev.eligibilityCriteria,
        years: prev.eligibilityCriteria.years.includes(year)
          ? prev.eligibilityCriteria.years.filter(y => y !== year)
          : [...prev.eligibilityCriteria.years, year],
      },
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl z-50 relative">
        <DialogHeader className="px-6 pt-6 pb-4 border-b-2 border-white/20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <DialogTitle className="text-3xl font-bold flex items-center gap-3 drop-shadow-lg">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Briefcase className="w-7 h-7" />
              </motion.div>
              {editingDrive ? "Edit Drive Details" : "Create New Placement Drive"}
            </DialogTitle>
            <p className="text-sm text-white/90 mt-2 font-medium">
              {editingDrive 
                ? "Update the drive information and profile submission details" 
                : "Fill in all details to submit candidate profiles to the company"}
            </p>
          </motion.div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="p-6">
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-200/50 dark:border-blue-700/50 rounded-xl p-1 shadow-lg">
                <TabsTrigger 
                  value="company" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold"
                >
                  <Building2 className="w-4 h-4" />
                  Company
                </TabsTrigger>
                <TabsTrigger 
                  value="job" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold"
                >
                  <Briefcase className="w-4 h-4" />
                  Job Details
                </TabsTrigger>
                <TabsTrigger 
                  value="eligibility" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold"
                >
                  <GraduationCap className="w-4 h-4" />
                  Eligibility
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold"
                >
                  <Users className="w-4 h-4" />
                  Profile Submission
                </TabsTrigger>
                <TabsTrigger 
                  value="additional" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold"
                >
                  <FileText className="w-4 h-4" />
                  Additional
                </TabsTrigger>
              </TabsList>

              {/* Company Information Tab */}
              <TabsContent value="company" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 border-2 border-blue-200/60 dark:border-blue-700/60 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-blue-700 dark:text-blue-400">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                        <Building2 className="w-5 h-5" />
                      </div>
                      Company Information
                    </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Company Name <span className="text-red-500 font-bold">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g., Google, Microsoft, Amazon"
                        className={`h-11 border-2 ${errors.companyName ? "border-red-500 focus:border-red-600" : "border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"} focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-all`}
                      />
                      {errors.companyName && (
                        <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                          <X className="w-3 h-3" /> {errors.companyName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyInfoLink" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <LinkIcon className="w-4 h-4 text-blue-600" />
                        Company Info Link <span className="text-red-500 font-bold">*</span>
                      </Label>
                      <Input
                        id="companyInfoLink"
                        type="url"
                        value={formData.companyInfoLink}
                        onChange={(e) => setFormData({ ...formData, companyInfoLink: e.target.value })}
                        placeholder="https://company.com/about"
                        className={`h-11 border-2 ${errors.companyInfoLink ? "border-red-500 focus:border-red-600" : "border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"} focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-all`}
                      />
                      {errors.companyInfoLink && (
                        <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                          <X className="w-3 h-3" /> {errors.companyInfoLink}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Contact Person Name</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        placeholder="HR Manager Name"
                        className="h-11 border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="hr@company.com"
                        className="h-11 border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="h-11 border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>
                  </div>
                </Card>
                </motion.div>
              </TabsContent>

              {/* Job Details Tab */}
              <TabsContent value="job" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 border-2 border-purple-200/60 dark:border-purple-700/60 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-purple-700 dark:text-purple-400">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      Job Details
                    </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Position/Role <span className="text-red-500 font-bold">*</span>
                      </Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="e.g., Software Engineer, Data Analyst"
                        className={`h-11 border-2 ${errors.position ? "border-red-500 focus:border-red-600" : "border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"} focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-all`}
                      />
                      {errors.position && (
                        <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                          <X className="w-3 h-3" /> {errors.position}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Drive Type <span className="text-red-500 font-bold">*</span></Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => setFormData({ ...formData, type: v as any })}
                      >
                        <SelectTrigger className="h-11 border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
                          <SelectItem value="placement">Placement (Full-time)</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="jobDescription" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <FileText className="w-4 h-4 text-purple-600" />
                      Job Description <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Textarea
                      id="jobDescription"
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                      rows={6}
                      placeholder="Detailed job description, responsibilities, and requirements..."
                      className={`border-2 ${errors.jobDescription ? "border-red-500 focus:border-red-600" : "border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"} focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-all resize-none`}
                    />
                    {errors.jobDescription && (
                      <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                        <X className="w-3 h-3" /> {errors.jobDescription}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        Job Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Bangalore, Remote"
                        className="h-11 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workMode" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Work Mode</Label>
                      <Select
                        value={formData.workMode}
                        onValueChange={(v) => setFormData({ ...formData, workMode: v })}
                      >
                        <SelectTrigger className="h-11 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium">
                          <SelectValue placeholder="Select work mode" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
                          {workModes.map((mode) => (
                            <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfOpenings" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Number of Openings</Label>
                      <Input
                        id="numberOfOpenings"
                        type="number"
                        value={formData.numberOfOpenings}
                        onChange={(e) => setFormData({ ...formData, numberOfOpenings: e.target.value })}
                        placeholder="e.g., 10"
                        min="1"
                        className="h-11 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="experienceRequired" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Experience Required</Label>
                      <Select
                        value={formData.experienceRequired}
                        onValueChange={(v) => setFormData({ ...formData, experienceRequired: v })}
                      >
                        <SelectTrigger className="h-11 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skillsRequired" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Key Skills Required</Label>
                      <Input
                        id="skillsRequired"
                        value={formData.skillsRequired}
                        onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
                        placeholder="e.g., React, Node.js, Python, AWS"
                        className="h-11 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Label htmlFor="package" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      Package/CTC <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <div className="grid md:grid-cols-4 gap-2">
                      <Input
                        id="package"
                        value={formData.package}
                        onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                        placeholder="e.g., 45-60 LPA"
                        className={`h-11 border-2 ${errors.package ? "border-red-500 focus:border-red-600" : "border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"} focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-all`}
                      />
                      <div className="text-center py-2 text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center">OR</div>
                      <Input
                        placeholder="Min (LPA)"
                        type="number"
                        value={formData.minPackage}
                        onChange={(e) => setFormData({ ...formData, minPackage: e.target.value })}
                        className="h-11 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                      />
                      <Input
                        placeholder="Max (LPA)"
                        type="number"
                        value={formData.maxPackage}
                        onChange={(e) => setFormData({ ...formData, maxPackage: e.target.value })}
                        className="h-11 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>
                    {errors.package && (
                      <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                        <X className="w-3 h-3" /> {errors.package}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 space-y-2">
                    <Label htmlFor="benefits" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Benefits & Perks</Label>
                    <Textarea
                      id="benefits"
                      value={formData.benefits}
                      onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                      rows={3}
                      placeholder="Health insurance, stock options, flexible hours, etc."
                      className="border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-all resize-none"
                    />
                  </div>
                </Card>
                </motion.div>
              </TabsContent>

              {/* Eligibility Tab */}
              <TabsContent value="eligibility" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 border-2 border-green-200/60 dark:border-green-700/60 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-green-700 dark:text-green-400">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      Eligibility Criteria
                    </h3>

                  <div className="space-y-2 mb-6">
                    <Label htmlFor="minCGPA" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Minimum CGPA</Label>
                    <Input
                      id="minCGPA"
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
                            minCGPA: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., 7.0"
                      className="h-11 border-2 border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                    />
                  </div>

                  <div className="space-y-2 mb-6">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Eligible Branches</Label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-3 p-4 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                      {branches.map((branch) => (
                        <motion.div 
                          key={branch} 
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Checkbox
                            id={`branch-${branch}`}
                            checked={formData.eligibilityCriteria.branches.includes(branch)}
                            onCheckedChange={() => toggleBranch(branch)}
                            className="border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                          <Label htmlFor={`branch-${branch}`} className="text-sm cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                            {branch}
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Eligible Years</Label>
                    <div className="grid grid-cols-4 gap-3 mt-3 p-4 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                      {years.map((year) => (
                        <motion.div 
                          key={year} 
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Checkbox
                            id={`year-${year}`}
                            checked={formData.eligibilityCriteria.years.includes(year)}
                            onCheckedChange={() => toggleYear(year)}
                            className="border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                          <Label htmlFor={`year-${year}`} className="text-sm cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                            {year}
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specificStudents" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Specific Students (Comma-separated Roll Numbers)</Label>
                    <Input
                      id="specificStudents"
                      value={formData.eligibilityCriteria.specificStudents.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          eligibilityCriteria: {
                            ...formData.eligibilityCriteria,
                            specificStudents: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s.length > 0),
                          },
                        })
                      }
                      placeholder="e.g., 2021CSE001, 2021CSE002"
                      className="h-11 border-2 border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                    />
                  </div>
                </Card>
                </motion.div>
              </TabsContent>

              {/* Profile Submission Tab */}
              <TabsContent value="profile" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 border-2 border-orange-200/60 dark:border-orange-700/60 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-orange-700 dark:text-orange-400">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                        <Users className="w-5 h-5" />
                      </div>
                      Profile Submission Details
                    </h3>

                  <div className="space-y-2 mb-6">
                    <Label htmlFor="registrationLink" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <LinkIcon className="w-4 h-4 text-orange-600" />
                      Registration/Application Link <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      id="registrationLink"
                      type="url"
                      value={formData.registrationLink}
                      onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                      placeholder="https://company.com/careers/apply or Google Form link"
                      className={`h-11 border-2 ${errors.registrationLink ? "border-red-500 focus:border-red-600" : "border-orange-300 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400"} focus:ring-2 focus:ring-orange-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-all`}
                    />
                    {errors.registrationLink && (
                      <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                        <X className="w-3 h-3" /> {errors.registrationLink}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      External Google Form or Internal Application Form URL
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        Application Deadline <span className="text-red-500 font-bold">*</span>
                      </Label>
                      <Input
                        id="deadline"
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className={`h-11 border-2 ${errors.deadline ? "border-red-500 focus:border-red-600" : "border-orange-300 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400"} focus:ring-2 focus:ring-orange-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-all`}
                      />
                      {errors.deadline && (
                        <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                          <X className="w-3 h-3" /> {errors.deadline}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profileSubmissionDeadline" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        Profile Submission Deadline
                      </Label>
                      <Input
                        id="profileSubmissionDeadline"
                        type="datetime-local"
                        value={formData.profileSubmissionDeadline}
                        onChange={(e) => setFormData({ ...formData, profileSubmissionDeadline: e.target.value })}
                        placeholder="Deadline for submitting candidate profiles"
                        className="h-11 border-2 border-orange-200 dark:border-orange-800 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        When should profiles be submitted to the company?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="jdFileUrl" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Description File URL (Optional)</Label>
                    <Input
                      id="jdFileUrl"
                      type="url"
                      value={formData.jdFileUrl}
                      onChange={(e) => setFormData({ ...formData, jdFileUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/..."
                      className="h-11 border-2 border-orange-200 dark:border-orange-800 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                    />
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="seriesNumber" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <FileText className="w-4 h-4 text-orange-600" />
                      Series Number/Tracking ID <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      id="seriesNumber"
                      value={formData.seriesNumber}
                      onChange={(e) => setFormData({ ...formData, seriesNumber: e.target.value })}
                      placeholder="e.g., DRV-2024-001"
                      className={`h-11 border-2 ${errors.seriesNumber ? "border-red-500 focus:border-red-600" : "border-orange-300 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400"} focus:ring-2 focus:ring-orange-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-all`}
                    />
                    {errors.seriesNumber && (
                      <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                        <X className="w-3 h-3" /> {errors.seriesNumber}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Unique identifier for tracking this drive
                    </p>
                  </div>
                </Card>
                </motion.div>
              </TabsContent>

              {/* Additional Information Tab */}
              <TabsContent value="additional" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 border-2 border-pink-200/60 dark:border-pink-700/60 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-pink-700 dark:text-pink-400">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      Additional Information
                    </h3>

                  <div className="space-y-2 mb-6">
                    <Label htmlFor="status" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Drive Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                    >
                      <SelectTrigger className="h-11 border-2 border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Additional Notes/Information</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      rows={6}
                      placeholder="Any additional information, special instructions, or notes about this drive..."
                      className="border-2 border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-all resize-none"
                    />
                  </div>
                </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 px-6 py-4 flex justify-end gap-3 shadow-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              disabled={isSubmitting || loading}
              className="h-11 px-6 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 font-semibold transition-all"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {editingDrive ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {editingDrive ? "Update Drive" : "Create Drive"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

