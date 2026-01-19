"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, User, Mail, Phone, Linkedin, Github, Award, Upload, FileText, Image as ImageIcon, Code, X, Plus } from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import type { User as AuthUser } from "@/lib/auth-service"

export default function StudentProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [editing, setEditing] = useState(false)
  const [success, setSuccess] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    branch: "",
    section: "",
    year: "",
    cgpa: "",
    phone: "",
    linkedin: "",
    github: "",
    technologies: [] as string[],
  })
  const [newTechnology, setNewTechnology] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUrl, setResumeUrl] = useState<string>("")
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("")

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "student") {
      navigate("/login")
      return
    }

    setUser(currentUser)
    
    // Set profile data separately to avoid setState in effect warning
    const newProfileData = {
      name: currentUser.name,
      email: currentUser.email,
      rollNumber: currentUser.profile?.rollNumber || "",
      branch: currentUser.profile?.branch || "",
      section: currentUser.profile?.section || "",
      year: currentUser.profile?.year || "",
      cgpa: currentUser.profile?.cgpa?.toString() || "",
      phone: currentUser.profile?.phone || "",
      linkedin: currentUser.profile?.linkedin || "",
      github: currentUser.profile?.github || "",
      technologies: currentUser.profile?.technologies || [],
    }
    setProfileData(newProfileData)
    setResumeUrl(currentUser.profile?.resumeUrl || "")
    setProfilePictureUrl(currentUser.profile?.profilePictureUrl || "")
  }, [navigate])

  const handleSave = async () => {
    let resumeUrlToSave = resumeUrl
    let profilePictureUrlToSave = profilePictureUrl
    
    // If new resume file is uploaded, simulate upload
    if (resumeFile) {
      // In a real app, upload to storage service
      // For now, create a local URL
      const fileUrl = URL.createObjectURL(resumeFile)
      resumeUrlToSave = fileUrl
      setResumeUrl(fileUrl)
    }

    // If new profile picture file is uploaded, simulate upload
    if (profilePictureFile) {
      // In a real app, upload to storage service
      // For now, create a local URL
      const fileUrl = URL.createObjectURL(profilePictureFile)
      profilePictureUrlToSave = fileUrl
      setProfilePictureUrl(fileUrl)
    }

    AuthService.updateCurrentUser({
      name: profileData.name,
      profile: {
        rollNumber: profileData.rollNumber,
        branch: profileData.branch,
        section: profileData.section,
        year: profileData.year,
        cgpa: parseFloat(profileData.cgpa) || 0,
        phone: profileData.phone,
        linkedin: profileData.linkedin,
        github: profileData.github,
        resumeUrl: resumeUrlToSave,
        profilePictureUrl: profilePictureUrlToSave,
        technologies: profileData.technologies,
      },
    })

    setSuccess(true)
    setEditing(false)
    setResumeFile(null)
    setProfilePictureFile(null)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5 MB")
        return
      }
      if (!file.type.includes("pdf") && !file.type.includes("doc")) {
        alert("Please upload a PDF or DOC file")
        return
      }
      setResumeFile(file)
    }
  }

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5 MB")
        return
      }
      if (!file.type.includes("image")) {
        alert("Please upload an image file")
        return
      }
      setProfilePictureFile(file)
      // Preview the image
      const fileUrl = URL.createObjectURL(file)
      setProfilePictureUrl(fileUrl)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  My Profile
                </h1>
                <p className="text-muted-foreground">Manage your personal information</p>
              </div>
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            {success && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
                ✓ Profile updated successfully!
              </div>
            )}

            <div className="space-y-6">
              {/* Profile Picture Upload */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Profile Picture
                </h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-2 border-purple-200 bg-purple-50 flex items-center justify-center overflow-hidden">
                      {profilePictureUrl ? (
                        <img 
                          src={profilePictureUrl} 
                          alt={profileData.name || "Profile"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-purple-400" />
                      )}
                    </div>
                  </div>
                  {editing && (
                    <div className="flex-1">
                      <label className="text-sm font-semibold mb-2 block">Upload Profile Picture</label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-primary transition-colors">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">
                          {profilePictureFile ? profilePictureFile.name : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">PNG, JPG, or JPEG (Max 5MB)</p>
                        <Input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                          id="profile-picture-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('profile-picture-upload')?.click()}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {profilePictureFile ? "Change Picture" : "Choose Picture"}
                        </Button>
                        {profilePictureFile && (
                          <p className="text-xs text-green-600 mt-2">✓ {profilePictureFile.name} selected</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Full Name</label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!editing}
                      className={!editing ? "bg-slate-50 dark:bg-slate-800" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        value={profileData.email}
                        disabled
                        className="pl-10 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Academic Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Roll Number</label>
                    <Input
                      value={profileData.rollNumber}
                      onChange={(e) => setProfileData({ ...profileData, rollNumber: e.target.value })}
                      disabled={!editing}
                      className={!editing ? "bg-slate-50 dark:bg-slate-800" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">CGPA</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={profileData.cgpa}
                      onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                      disabled={!editing}
                      className={!editing ? "bg-slate-50 dark:bg-slate-800" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Branch</label>
                    <Input
                      value={profileData.branch}
                      disabled
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Section</label>
                    <Input
                      value={profileData.section}
                      disabled
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Year</label>
                    <Input
                      value={profileData.year}
                      disabled
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Social */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Contact & Social Links
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="tel"
                        placeholder="+91 XXXXXXXXXX"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!editing}
                        className={`pl-10 ${!editing ? "bg-slate-50 dark:bg-slate-800" : ""}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">LinkedIn Profile</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                        disabled={!editing}
                        className={`pl-10 ${!editing ? "bg-slate-50 dark:bg-slate-800" : ""}`}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold mb-2 block">GitHub Profile</label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="https://github.com/yourusername"
                        value={profileData.github}
                        onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                        disabled={!editing}
                        className={`pl-10 ${!editing ? "bg-slate-50 dark:bg-slate-800" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies Section */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  Technologies
                </h2>
                <div className="space-y-4">
                  {profileData.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profileData.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {tech}
                          {editing && (
                            <button
                              onClick={() => {
                                setProfileData({
                                  ...profileData,
                                  technologies: profileData.technologies.filter((_, i) => i !== index),
                                })
                              }}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {editing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add technology (e.g., React, Python, Java)"
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newTechnology.trim()) {
                            if (!profileData.technologies.includes(newTechnology.trim())) {
                              setProfileData({
                                ...profileData,
                                technologies: [...profileData.technologies, newTechnology.trim()],
                              })
                              setNewTechnology("")
                            }
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newTechnology.trim() && !profileData.technologies.includes(newTechnology.trim())) {
                            setProfileData({
                              ...profileData,
                              technologies: [...profileData.technologies, newTechnology.trim()],
                            })
                            setNewTechnology("")
                          }
                        }}
                        disabled={!newTechnology.trim() || profileData.technologies.includes(newTechnology.trim())}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  )}
                  {!editing && profileData.technologies.length === 0 && (
                    <p className="text-sm text-muted-foreground">No technologies added yet. Edit profile to add technologies.</p>
                  )}
                </div>
              </div>

              {/* Resume Upload Section */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Resume
                </h2>
                <div className="space-y-4">
                  {resumeUrl && !resumeFile && (
                    <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Current Resume</p>
                        <p className="text-xs text-muted-foreground">Resume uploaded successfully</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(resumeUrl, '_blank')}
                      >
                        View
                      </Button>
                    </div>
                  )}
                  {editing && (
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Upload Updated Resume</label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">
                          {resumeFile ? resumeFile.name : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">PDF or DOC (Max 5MB)</p>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="hidden"
                          id="resume-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('resume-upload')?.click()}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {resumeFile ? "Change File" : "Choose File"}
                        </Button>
                        {resumeFile && (
                          <p className="text-xs text-green-600 mt-2">✓ {resumeFile.name} selected</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}