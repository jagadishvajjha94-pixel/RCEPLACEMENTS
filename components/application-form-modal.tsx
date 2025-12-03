"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Upload, CheckCircle } from "lucide-react"
import type { PlacementDrive } from "@/lib/mock-data"

interface ApplicationFormModalProps {
  drive: PlacementDrive | null
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: ApplicationFormData) => void
}

export interface ApplicationFormData {
  driveId: string
  phone: string
  techStack: string
  resume?: File
  coverLetter: string
}

export function ApplicationFormModal({ drive, isOpen, onClose, onSubmit }: ApplicationFormModalProps) {
  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({
    phone: "",
    techStack: "",
    coverLetter: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!drive) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const applicationData: ApplicationFormData = {
      driveId: drive.id,
      phone: formData.phone || "",
      techStack: formData.techStack || "",
      resume: resumeFile || undefined,
      coverLetter: formData.coverLetter || "",
    }

    onSubmit?.(applicationData)
    setIsSuccess(true)

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(false)
      setFormData({ phone: "", techStack: "", coverLetter: "" })
      setResumeFile(null)
      onClose()
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setResumeFile(file)
    }
  }

  if (!drive) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-border p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">Apply for {drive.company}</h2>
                <p className="text-muted-foreground">{drive.role}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">{drive.package}</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{drive.location}</span>
                  <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">{drive.mode}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Success State */}
            {isSuccess && (
              <motion.div
                className="p-8 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                <p className="text-muted-foreground">
                  Your application has been sent to {drive.company} and synced with the admin dashboard.
                </p>
              </motion.div>
            )}

            {/* Form */}
            {!isSuccess && (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="bg-background/50"
                  />
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <Label htmlFor="techStack">Technical Skills *</Label>
                  <Textarea
                    id="techStack"
                    placeholder="e.g., React, Node.js, MongoDB, Python, AWS..."
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    required
                    className="bg-background/50 min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    List your technical skills relevant to this role
                  </p>
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume (PDF) *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent transition-colors">
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      {resumeFile ? (
                        <p className="text-sm font-medium text-accent">{resumeFile.name}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Click to upload your resume</p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Why are you interested in this role?"
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="bg-background/50 min-h-[120px]"
                  />
                </div>

                {/* Requirements Checklist */}
                <div className="bg-accent/10 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-sm mb-2">Requirements:</p>
                  {drive.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Your application will be instantly synced with {drive.company}'s career portal and the admin
                  dashboard
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}