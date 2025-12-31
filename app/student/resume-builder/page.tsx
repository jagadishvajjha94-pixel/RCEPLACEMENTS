"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  FileText,
  Download,
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Wand2,
  FileCheck,
  Layout,
  Save,
  Eye,
  EyeOff,
  X,
  Plus,
  Trash2,
  Edit2,
  SpellCheck,
  TrendingUp,
  Lightbulb,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
} from "lucide-react"
import { Link } from "react-router-dom"
import { AuthService } from "@/lib/auth-service"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    address: string
    linkedin: string
    github: string
    website: string
  }
  objective: string
  education: Array<{
    id: string
    degree: string
    institution: string
    year: string
    cgpa: string
    achievements: string
  }>
  experience: Array<{
    id: string
    title: string
    company: string
    duration: string
    description: string
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    tech: string
    link: string
  }>
  skills: string[]
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
  }>
}

interface AISuggestion {
  type: "grammar" | "spelling" | "alignment" | "ats" | "improvement"
  message: string
  severity: "error" | "warning" | "info"
  position?: { start: number; end: number }
}

interface ResumeTemplate {
  id: string
  name: string
  description: string
  preview: string
  category: "modern" | "classic" | "creative" | "professional"
}

const resumeTemplates: ResumeTemplate[] = [
  {
    id: "template-1",
    name: "Modern Professional",
    description: "Clean and modern design perfect for tech roles",
    preview: "Modern layout with clear sections",
    category: "modern"
  },
  {
    id: "template-2",
    name: "Classic Traditional",
    description: "Traditional format preferred by many recruiters",
    preview: "Classic two-column layout",
    category: "classic"
  },
  {
    id: "template-3",
    name: "Creative Portfolio",
    description: "Eye-catching design for creative roles",
    preview: "Colorful and creative layout",
    category: "creative"
  },
  {
    id: "template-4",
    name: "ATS Optimized",
    description: "Designed to pass ATS systems easily",
    preview: "Simple, ATS-friendly format",
    category: "professional"
  }
]

// Resume Preview Component
function ResumePreview({ data, templateId }: { data: ResumeData; templateId: string }) {
  const renderTemplate1 = () => (
    <div className="bg-white text-gray-900 p-8 space-y-6" style={{ fontFamily: 'Arial, sans-serif', minHeight: '400px' }}>
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">{data.personalInfo.name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {data.personalInfo.email ? <span>📧 {data.personalInfo.email}</span> : <span className="text-gray-400">📧 your.email@example.com</span>}
          {data.personalInfo.phone ? <span>📱 {data.personalInfo.phone}</span> : <span className="text-gray-400">📱 +91 9876543210</span>}
          {data.personalInfo.address && <span>📍 {data.personalInfo.address}</span>}
          {data.personalInfo.linkedin && <span>💼 {data.personalInfo.linkedin}</span>}
          {data.personalInfo.github && <span>💻 {data.personalInfo.github}</span>}
        </div>
      </div>

      {/* Objective */}
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-2 border-b border-gray-300 pb-1">Objective</h2>
        {data.objective ? (
          <p className="text-gray-700">{data.objective}</p>
        ) : (
          <p className="text-gray-400 italic">Add your career objective here...</p>
        )}
      </div>

      {/* Education */}
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-2 border-b border-gray-300 pb-1">Education</h2>
        {data.education.length > 0 ? (
          data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree || "Degree"}</h3>
                  <p className="text-gray-600">{edu.institution || "Institution"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{edu.year || "Year"}</p>
                  {edu.cgpa && <p className="text-sm text-gray-600">CGPA: {edu.cgpa}</p>}
                </div>
              </div>
              {edu.achievements && <p className="text-sm text-gray-600 mt-1">{edu.achievements}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-sm">Add your education details...</p>
        )}
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-2 border-b border-gray-300 pb-1">Experience</h2>
        {data.experience.length > 0 ? (
          data.experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{exp.title || "Job Title"}</h3>
                  <p className="text-gray-600">{exp.company || "Company"}</p>
                </div>
                <p className="text-sm text-gray-600">{exp.duration || "Duration"}</p>
              </div>
              {exp.description && <p className="text-gray-700 mt-1">{exp.description}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-sm">Add your work experience...</p>
        )}
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-2 border-b border-gray-300 pb-1">Projects</h2>
        {data.projects.length > 0 ? (
          data.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <h3 className="font-semibold">{proj.name || "Project Name"}</h3>
              {proj.description && <p className="text-gray-700">{proj.description}</p>}
              {proj.tech && <p className="text-sm text-gray-600 mt-1">Tech: {proj.tech}</p>}
              {proj.link && <p className="text-sm text-blue-600 mt-1">🔗 {proj.link}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-sm">Add your projects...</p>
        )}
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-2 border-b border-gray-300 pb-1">Skills</h2>
        {data.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">{skill}</span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic text-sm">Add your skills...</p>
        )}
      </div>

      {/* Certifications */}
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-2 border-b border-gray-300 pb-1">Certifications</h2>
        {data.certifications.length > 0 ? (
          data.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <h3 className="font-semibold">{cert.name || "Certification Name"}</h3>
              <p className="text-sm text-gray-600">{cert.issuer || "Issuer"} {cert.date && `• ${cert.date}`}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-sm">Add your certifications...</p>
        )}
      </div>
    </div>
  )

  const renderTemplate2 = () => (
    <div className="bg-white text-gray-900 p-8" style={{ fontFamily: 'Times New Roman, serif', minHeight: '400px' }}>
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-1 bg-gray-100 p-4">
          <h1 className="text-2xl font-bold mb-4">{data.personalInfo.name || "Your Name"}</h1>
          <div className="space-y-3 text-sm">
            {data.personalInfo.email ? <p>📧 {data.personalInfo.email}</p> : <p className="text-gray-400">📧 email@example.com</p>}
            {data.personalInfo.phone ? <p>📱 {data.personalInfo.phone}</p> : <p className="text-gray-400">📱 +91 9876543210</p>}
            {data.personalInfo.address && <p>📍 {data.personalInfo.address}</p>}
            {data.personalInfo.linkedin && <p>💼 {data.personalInfo.linkedin}</p>}
            {data.personalInfo.github && <p>💻 {data.personalInfo.github}</p>}
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-lg mb-2">Skills</h2>
            {data.skills.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-sm">
                {data.skills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic">Add skills...</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-4">
          <div>
            <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-2">Objective</h2>
            {data.objective ? (
              <p className="text-sm">{data.objective}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Add your career objective...</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-2">Education</h2>
            {data.education.length > 0 ? (
              data.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-semibold">{edu.degree || "Degree"}</h3>
                  <p className="text-sm">{edu.institution || "Institution"} • {edu.year || "Year"} {edu.cgpa && `• CGPA: ${edu.cgpa}`}</p>
                  {edu.achievements && <p className="text-xs text-gray-600 mt-1">{edu.achievements}</p>}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">Add education...</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-2">Experience</h2>
            {data.experience.length > 0 ? (
              data.experience.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <h3 className="font-semibold">{exp.title || "Job Title"}</h3>
                  <p className="text-sm">{exp.company || "Company"} • {exp.duration || "Duration"}</p>
                  {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">Add experience...</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-2">Projects</h2>
            {data.projects.length > 0 ? (
              data.projects.map((proj) => (
                <div key={proj.id} className="mb-3">
                  <h3 className="font-semibold">{proj.name || "Project Name"}</h3>
                  {proj.description && <p className="text-sm">{proj.description}</p>}
                  {proj.tech && <p className="text-xs text-gray-600 mt-1">Tech: {proj.tech}</p>}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">Add projects...</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-2">Certifications</h2>
            {data.certifications.length > 0 ? (
              data.certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <h3 className="font-semibold text-sm">{cert.name || "Certification"}</h3>
                  <p className="text-xs text-gray-600">{cert.issuer || "Issuer"} {cert.date && `• ${cert.date}`}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">Add certifications...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderTemplate3 = () => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 p-8 space-y-6" style={{ fontFamily: 'Georgia, serif', minHeight: '400px' }}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-bold text-purple-600 mb-3 text-center">{data.personalInfo.name || "Your Name"}</h1>
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-700 mb-4">
          {data.personalInfo.email ? <span>📧 {data.personalInfo.email}</span> : <span className="text-gray-400">📧 email@example.com</span>}
          {data.personalInfo.phone ? <span>📱 {data.personalInfo.phone}</span> : <span className="text-gray-400">📱 +91 9876543210</span>}
          {data.personalInfo.linkedin && <span>💼 {data.personalInfo.linkedin}</span>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-pink-600 mb-2">Career Objective</h2>
        {data.objective ? (
          <p className="text-gray-700">{data.objective}</p>
        ) : (
          <p className="text-gray-400 italic">Add your career objective...</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-purple-600 mb-3">Education</h2>
        {data.education.length > 0 ? (
          data.education.map((edu) => (
            <div key={edu.id} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
              <h3 className="font-semibold text-lg">{edu.degree || "Degree"}</h3>
              <p className="text-gray-600">{edu.institution || "Institution"} • {edu.year || "Year"}</p>
              {edu.cgpa && <p className="text-sm text-gray-500">CGPA: {edu.cgpa}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-sm">Add education...</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-pink-600 mb-3">Experience</h2>
        {data.experience.length > 0 ? (
          data.experience.map((exp) => (
            <div key={exp.id} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
              <h3 className="font-semibold">{exp.title || "Job Title"} at {exp.company || "Company"}</h3>
              <p className="text-sm text-gray-600">{exp.duration || "Duration"}</p>
              {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-sm">Add experience...</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-purple-600 mb-3">Projects</h2>
        {data.projects.length > 0 ? (
          data.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <h3 className="font-semibold">{proj.name || "Project Name"}</h3>
              {proj.description && <p className="text-gray-700">{proj.description}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-sm">Add projects...</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-pink-600 mb-2">Skills</h2>
        {data.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{skill}</span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic text-sm">Add skills...</p>
        )}
      </div>
    </div>
  )

  const renderTemplate4 = () => (
    <div className="bg-white text-gray-900 p-8 space-y-5" style={{ fontFamily: 'Calibri, sans-serif', fontSize: '11pt', minHeight: '400px' }}>
      <div className="text-center border-b-2 border-black pb-3">
        <h1 className="text-2xl font-bold uppercase mb-2">{data.personalInfo.name || "YOUR NAME"}</h1>
        <div className="text-sm space-x-3">
          {data.personalInfo.email ? <span>{data.personalInfo.email}</span> : <span className="text-gray-400">email@example.com</span>}
          {data.personalInfo.phone ? <span>| {data.personalInfo.phone}</span> : <span className="text-gray-400">| +91 9876543210</span>}
          {data.personalInfo.address && <span>| {data.personalInfo.address}</span>}
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold uppercase border-b border-gray-400 pb-1 mb-2">OBJECTIVE</h2>
        {data.objective ? (
          <p className="text-sm">{data.objective}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">Add your career objective...</p>
        )}
      </div>

      <div>
        <h2 className="text-base font-bold uppercase border-b border-gray-400 pb-1 mb-2">EDUCATION</h2>
        {data.education.length > 0 ? (
          data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{edu.degree || "Degree"}</span>
                <span className="text-sm">{edu.year || "Year"}</span>
              </div>
              <p className="text-sm">{edu.institution || "Institution"} {edu.cgpa && `• CGPA: ${edu.cgpa}`}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">Add education...</p>
        )}
      </div>

      <div>
        <h2 className="text-base font-bold uppercase border-b border-gray-400 pb-1 mb-2">EXPERIENCE</h2>
        {data.experience.length > 0 ? (
          data.experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{exp.title || "Job Title"}</span>
                <span className="text-sm">{exp.duration || "Duration"}</span>
              </div>
              <p className="text-sm italic">{exp.company || "Company"}</p>
              {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">Add experience...</p>
        )}
      </div>

      <div>
        <h2 className="text-base font-bold uppercase border-b border-gray-400 pb-1 mb-2">PROJECTS</h2>
        {data.projects.length > 0 ? (
          data.projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <p className="font-semibold">{proj.name || "Project Name"}</p>
              {proj.description && <p className="text-sm">{proj.description}</p>}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">Add projects...</p>
        )}
      </div>

      <div>
        <h2 className="text-base font-bold uppercase border-b border-gray-400 pb-1 mb-2">SKILLS</h2>
        {data.skills.length > 0 ? (
          <p className="text-sm">{data.skills.join(" • ")}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">Add skills...</p>
        )}
      </div>

      <div>
        <h2 className="text-base font-bold uppercase border-b border-gray-400 pb-1 mb-2">CERTIFICATIONS</h2>
        {data.certifications.length > 0 ? (
          data.certifications.map((cert) => (
            <p key={cert.id} className="text-sm">{cert.name || "Certification"} - {cert.issuer || "Issuer"} {cert.date && `(${cert.date})`}</p>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">Add certifications...</p>
        )}
      </div>
    </div>
  )

  switch (templateId) {
    case "template-1":
      return renderTemplate1()
    case "template-2":
      return renderTemplate2()
    case "template-3":
      return renderTemplate3()
    case "template-4":
      return renderTemplate4()
    default:
      return renderTemplate1()
  }
}

export default function ResumeBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("template-1")
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [atsScore, setAtsScore] = useState(0)
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      github: "",
      website: ""
    },
    objective: "",
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: []
  })
  const [currentSection, setCurrentSection] = useState<"personal" | "objective" | "education" | "experience" | "projects" | "skills" | "certifications">("personal")
  const [editingField, setEditingField] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (currentUser) {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.profile?.phone || "",
          address: "",
          linkedin: currentUser.profile?.linkedin || "",
          github: currentUser.profile?.github || "",
          website: ""
        }
      }))
    }
  }, [])

  // AI-powered ATS Score calculation and suggestions
  useEffect(() => {
    const calculateATSScore = () => {
      let score = 0
      const suggestions: AISuggestion[] = []

      // Check personal info completeness
      if (resumeData.personalInfo.name) score += 5
      else {
        suggestions.push({
          type: "ats",
          message: "Add your full name for better ATS recognition",
          severity: "error"
        })
      }
      if (resumeData.personalInfo.email) score += 5
      else {
        suggestions.push({
          type: "ats",
          message: "Email is required for ATS systems",
          severity: "error"
        })
      }
      if (resumeData.personalInfo.phone) score += 5
      if (resumeData.personalInfo.linkedin) score += 3
      if (resumeData.personalInfo.github) score += 2

      // Check objective
      if (resumeData.objective && resumeData.objective.length > 50) score += 10
      else if (resumeData.objective) {
        suggestions.push({
          type: "ats",
          message: "Objective should be at least 50 characters for better ATS parsing",
          severity: "warning"
        })
      } else {
        suggestions.push({
          type: "ats",
          message: "Add a career objective to improve ATS score",
          severity: "warning"
        })
      }

      // Check education
      if (resumeData.education.length > 0) score += 15
      else {
        suggestions.push({
          type: "ats",
          message: "Add at least one education entry",
          severity: "error"
        })
      }
      resumeData.education.forEach((edu, index) => {
        if (edu.degree && edu.institution && edu.year) score += 5
        else {
          suggestions.push({
            type: "alignment",
            message: `Education entry ${index + 1}: Complete degree, institution, and year fields`,
            severity: "warning"
          })
        }
      })

      // Check experience
      if (resumeData.experience.length > 0) score += 20
      resumeData.experience.forEach((exp, index) => {
        if (exp.title && exp.company && exp.description) score += 5
        else {
          suggestions.push({
            type: "alignment",
            message: `Experience entry ${index + 1}: Complete all fields for better impact`,
            severity: "warning"
          })
        }
        if (exp.description && exp.description.length < 20) {
          suggestions.push({
            type: "improvement",
            message: `Experience ${index + 1}: Add more details (at least 20 characters)`,
            severity: "warning"
          })
        }
      })

      // Check projects
      if (resumeData.projects.length > 0) score += 10
      resumeData.projects.forEach((proj, index) => {
        if (proj.name && proj.description) score += 3
        else {
          suggestions.push({
            type: "alignment",
            message: `Project ${index + 1}: Complete project name and description`,
            severity: "warning"
          })
        }
      })

      // Check skills
      if (resumeData.skills.length >= 5) score += 10
      else if (resumeData.skills.length > 0) {
        suggestions.push({
          type: "ats",
          message: `Add ${5 - resumeData.skills.length} more skills for better ATS matching`,
          severity: "info"
        })
      } else {
        suggestions.push({
          type: "ats",
          message: "Add at least 5 relevant skills",
          severity: "error"
        })
      }

      // Check certifications
      if (resumeData.certifications.length > 0) score += 5

      // Advanced Grammar and spelling checks (mock AI - can be replaced with real AI API)
      const allText = `${resumeData.objective} ${resumeData.experience.map(e => e.description).join(" ")} ${resumeData.projects.map(p => p.description).join(" ")}`.toLowerCase()

      // Common spelling mistakes
      const spellingMistakes: { [key: string]: string } = {
        "teh ": "the ",
        "recieve": "receive",
        "seperate": "separate",
        "occured": "occurred",
        "definately": "definitely",
        "acheive": "achieve",
        "sucess": "success",
        "experiance": "experience"
      }

      Object.entries(spellingMistakes).forEach(([mistake, correct]) => {
        if (allText.includes(mistake)) {
          suggestions.push({
            type: "spelling",
            message: `Spelling error: "${mistake.trim()}" should be "${correct.trim()}"`,
            severity: "error"
          })
        }
      })

      // Grammar checks
      if (allText.includes(" i ")) {
        suggestions.push({
          type: "grammar",
          message: "Use 'I' (capitalized) instead of 'i' when referring to yourself",
          severity: "error"
        })
      }

      // Check for action verbs (important for ATS)
      const actionVerbs = ["developed", "created", "implemented", "designed", "managed", "led", "improved", "optimized", "built", "achieved"]
      const hasActionVerbs = actionVerbs.some(verb => allText.includes(verb))
      if (resumeData.experience.length > 0 && !hasActionVerbs) {
        suggestions.push({
          type: "improvement",
          message: "Use action verbs (developed, created, implemented) in experience descriptions",
          severity: "info"
        })
      }

      // Check for keywords density
      if (resumeData.skills.length > 0 && resumeData.experience.length > 0) {
        const skillKeywords = resumeData.skills.join(" ").toLowerCase()
        const experienceText = resumeData.experience.map(e => e.description).join(" ").toLowerCase()
        const matchingSkills = resumeData.skills.filter(skill => experienceText.includes(skill.toLowerCase()))
        if (matchingSkills.length < resumeData.skills.length / 2) {
          suggestions.push({
            type: "ats",
            message: "Include your skills in experience descriptions for better keyword matching",
            severity: "info"
          })
        }
      }

      // Alignment checks
      if (resumeData.experience.length > 0 && resumeData.experience.some(e => !e.description || e.description.length < 20)) {
        suggestions.push({
          type: "alignment",
          message: "Experience descriptions should be detailed (at least 20 characters) with specific achievements",
          severity: "warning"
        })
      }

      // Check for consistent formatting
      if (resumeData.education.length > 1) {
        const years = resumeData.education.map(e => e.year).filter(y => y)
        const formats = years.map(y => y.includes("-") ? "range" : "single")
        if (new Set(formats).size > 1) {
          suggestions.push({
            type: "alignment",
            message: "Use consistent date format across all education entries (e.g., '2021-2025')",
            severity: "warning"
          })
        }
      }

      setAtsScore(Math.min(100, score))
      setAiSuggestions(suggestions)
    }

    // Debounce the calculation
    const timeoutId = setTimeout(calculateATSScore, 300)
    return () => clearTimeout(timeoutId)
  }, [resumeData])

  const handleAddEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now().toString(),
        degree: "",
        institution: "",
        year: "",
        cgpa: "",
        achievements: ""
      }]
    }))
  }

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now().toString(),
        title: "",
        company: "",
        duration: "",
        description: ""
      }]
    }))
  }

  const handleAddProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now().toString(),
        name: "",
        description: "",
        tech: "",
        link: ""
      }]
    }))
  }

  const handleAddCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        id: Date.now().toString(),
        name: "",
        issuer: "",
        date: ""
      }]
    }))
  }

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }))
    }
  }

  const handleRemoveItem = (section: string, id: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: (prev[section as keyof ResumeData] as any[]).filter((item: any) => item.id !== id)
    }))
  }

  const handleUpdateItem = (section: string, id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: (prev[section as keyof ResumeData] as any[]).map((item: any) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleSaveResume = async () => {
    try {
      await handleExportPDF()
    } catch (error) {
      console.error("Error saving resume:", error)
      alert("Failed to save resume. Please try again.")
    }
  }

  const handleExportPDF = async () => {
    try {
      // Find the preview element
      const previewElement = document.getElementById('resume-preview-content')
      if (!previewElement) {
        // If preview is not open, temporarily show it
        setShowPreview(true)
        // Wait for DOM to update
        await new Promise(resolve => setTimeout(resolve, 100))
        const element = document.getElementById('resume-preview-content')
        if (!element) {
          alert("Please wait for preview to load, then try again.")
          return
        }
      }

      const element = previewElement || document.getElementById('resume-preview-content')
      if (!element) {
        alert("Preview element not found. Please try again.")
        return
      }

      // Show loading message
      const loadingMsg = document.createElement('div')
      loadingMsg.textContent = 'Generating PDF...'
      loadingMsg.style.position = 'fixed'
      loadingMsg.style.top = '50%'
      loadingMsg.style.left = '50%'
      loadingMsg.style.transform = 'translate(-50%, -50%)'
      loadingMsg.style.background = 'white'
      loadingMsg.style.padding = '20px'
      loadingMsg.style.borderRadius = '8px'
      loadingMsg.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
      loadingMsg.style.zIndex = '10000'
      document.body.appendChild(loadingMsg)

      // Create canvas from the preview element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      })

      // Calculate dimensions
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const pdfWidth = 210 // A4 width in mm
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      let heightLeft = pdfHeight
      let position = 0

      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= 297 // A4 height in mm

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, pdfWidth, pdfHeight)
        heightLeft -= 297
      }

      // Remove loading message
      document.body.removeChild(loadingMsg)

      // Download PDF
      const fileName = `resume-${resumeData.personalInfo.name || "resume"}.pdf`
      pdf.save(fileName)
      alert("PDF downloaded successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("PDF generation failed: " + (error as Error).message)
    }
  }

  const handleUploadResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          setResumeData(data)
          alert("Resume uploaded successfully!")
        } catch (error) {
          alert("Invalid resume file format")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleAIGenerate = async () => {
    // Mock AI generation - in real app, this would call an AI API (OpenAI, Anthropic, etc.)
    const currentUser = AuthService.getCurrentUser()
    if (currentUser?.profile) {
      // Simulate AI processing
      alert("AI is generating your resume... Please wait.")

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      setResumeData(prev => ({
        ...prev,
        objective: `Motivated ${currentUser.profile?.branch || "Engineering"} student with strong problem-solving skills and passion for technology. Seeking opportunities to apply technical knowledge and contribute to innovative projects.`,
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "MongoDB", "Express.js"],
        education: [{
          id: "1",
          degree: `B.Tech in ${currentUser.profile?.branch || "CSE"}`,
          institution: "RCE College",
          year: "2021-2025",
          cgpa: currentUser.profile?.cgpa?.toString() || "8.5",
          achievements: "Dean's List, Academic Excellence Award"
        }],
        projects: [{
          id: "1",
          name: "E-Commerce Platform",
          description: "Developed a full-stack e-commerce application with user authentication, product management, and payment integration.",
          tech: "React, Node.js, MongoDB, Stripe",
          link: "https://github.com/username/ecommerce"
        }]
      }))
      alert("✓ AI has generated a basic resume structure based on your profile! Please review and customize the details.")
    } else {
      alert("Please complete your profile first to use AI generation.")
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/student/dashboard" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-1">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Resume Builder
              </h1>
              <p className="text-muted-foreground">Create, edit, and optimize your resume with AI assistance</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="gap-2 bg-slate-50 dark:bg-slate-800/50"
              >
                <Eye className="w-4 h-4" />
                Preview Resume
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById("resume-upload")?.click()}
                className="gap-2 bg-slate-50 dark:bg-slate-800/50"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
              <input
                id="resume-upload"
                type="file"
                accept=".json"
                onChange={handleUploadResume}
                className="hidden"
              />
              <Button
                onClick={handleSaveResume}
                className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Save className="w-4 h-4" />
                Save as PDF
              </Button>
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="gap-2 bg-slate-50 dark:bg-slate-800/50"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Sections */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-4 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Sections
              </h3>
              <div className="space-y-2">
                {[
                  { id: "personal", label: "Personal Info", icon: User },
                  { id: "objective", label: "Objective", icon: FileText },
                  { id: "education", label: "Education", icon: GraduationCap },
                  { id: "experience", label: "Experience", icon: Briefcase },
                  { id: "projects", label: "Projects", icon: Code },
                  { id: "skills", label: "Skills", icon: Award },
                  { id: "certifications", label: "Certifications", icon: FileCheck },
                ].map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id as any)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${currentSection === section.id
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                          : "bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Template Selection */}
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-4 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Templates
              </h3>
              <Button
                variant="outline"
                onClick={() => setShowTemplateModal(true)}
                className="w-full gap-2 bg-slate-50 dark:bg-slate-800/50"
              >
                <Eye className="w-4 h-4" />
                Select Template
              </Button>
              {selectedTemplate && (
                <p className="text-xs text-muted-foreground mt-2">
                  {resumeTemplates.find(t => t.id === selectedTemplate)?.name}
                </p>
              )}
            </Card>

            {/* AI Generate Button */}
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-4 shadow-sm">
              <Button
                onClick={handleAIGenerate}
                className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Sparkles className="w-4 h-4" />
                AI Generate Resume
              </Button>
            </Card>
          </div>

          {/* Main Content - Resume Editor */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm min-h-[600px]">
              {currentSection === "personal" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Full Name *</label>
                      <Input
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, name: e.target.value }
                        }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Email *</label>
                      <Input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        placeholder="john.doe@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Phone *</label>
                      <Input
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Address</label>
                      <Input
                        value={resumeData.personalInfo.address}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, address: e.target.value }
                        }))}
                        placeholder="City, State, Country"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">LinkedIn</label>
                      <Input
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                        }))}
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">GitHub</label>
                      <Input
                        value={resumeData.personalInfo.github}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, github: e.target.value }
                        }))}
                        placeholder="github.com/yourusername"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentSection === "objective" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Career Objective</h2>
                  <Textarea
                    ref={textareaRef}
                    value={resumeData.objective}
                    onChange={(e) => setResumeData(prev => ({ ...prev, objective: e.target.value }))}
                    placeholder="Write a compelling career objective (at least 50 characters for better ATS score)..."
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    {resumeData.objective.length} characters
                  </p>
                </div>
              )}

              {currentSection === "education" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Education</h2>
                    <Button onClick={handleAddEducation} size="sm" className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="w-4 h-4" />
                      Add Education
                    </Button>
                  </div>
                  {resumeData.education.map((edu) => (
                    <Card key={edu.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold">Education Entry</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem("education", edu.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Degree *</label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => handleUpdateItem("education", edu.id, "degree", e.target.value)}
                            placeholder="B.Tech in CSE"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Institution *</label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => handleUpdateItem("education", edu.id, "institution", e.target.value)}
                            placeholder="RCE College"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Year *</label>
                          <Input
                            value={edu.year}
                            onChange={(e) => handleUpdateItem("education", edu.id, "year", e.target.value)}
                            placeholder="2021-2025"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">CGPA</label>
                          <Input
                            value={edu.cgpa}
                            onChange={(e) => handleUpdateItem("education", edu.id, "cgpa", e.target.value)}
                            placeholder="8.5"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold mb-2 block">Achievements</label>
                          <Textarea
                            value={edu.achievements}
                            onChange={(e) => handleUpdateItem("education", edu.id, "achievements", e.target.value)}
                            placeholder="Dean's List, Academic Excellence Award..."
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  {resumeData.education.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No education entries yet. Click "Add Education" to get started.</p>
                    </div>
                  )}
                </div>
              )}

              {currentSection === "experience" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Work Experience</h2>
                    <Button onClick={handleAddExperience} size="sm" className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="w-4 h-4" />
                      Add Experience
                    </Button>
                  </div>
                  {resumeData.experience.map((exp) => (
                    <Card key={exp.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold">Experience Entry</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem("experience", exp.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Job Title *</label>
                          <Input
                            value={exp.title}
                            onChange={(e) => handleUpdateItem("experience", exp.id, "title", e.target.value)}
                            placeholder="Software Engineer Intern"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Company *</label>
                          <Input
                            value={exp.company}
                            onChange={(e) => handleUpdateItem("experience", exp.id, "company", e.target.value)}
                            placeholder="Tech Company Inc."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Duration *</label>
                          <Input
                            value={exp.duration}
                            onChange={(e) => handleUpdateItem("experience", exp.id, "duration", e.target.value)}
                            placeholder="Jun 2023 - Aug 2023"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold mb-2 block">Description *</label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => handleUpdateItem("experience", exp.id, "description", e.target.value)}
                            placeholder="Describe your responsibilities and achievements (at least 20 characters)..."
                            className="min-h-[100px]"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {exp.description.length} characters
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {resumeData.experience.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No work experience yet. Click "Add Experience" to get started.</p>
                    </div>
                  )}
                </div>
              )}

              {currentSection === "projects" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Projects</h2>
                    <Button onClick={handleAddProject} size="sm" className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="w-4 h-4" />
                      Add Project
                    </Button>
                  </div>
                  {resumeData.projects.map((proj) => (
                    <Card key={proj.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold">Project Entry</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem("projects", proj.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Project Name *</label>
                          <Input
                            value={proj.name}
                            onChange={(e) => handleUpdateItem("projects", proj.id, "name", e.target.value)}
                            placeholder="E-Commerce Website"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Description *</label>
                          <Textarea
                            value={proj.description}
                            onChange={(e) => handleUpdateItem("projects", proj.id, "description", e.target.value)}
                            placeholder="Describe your project..."
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold mb-2 block">Technologies</label>
                            <Input
                              value={proj.tech}
                              onChange={(e) => handleUpdateItem("projects", proj.id, "tech", e.target.value)}
                              placeholder="React, Node.js, MongoDB"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-2 block">Project Link</label>
                            <Input
                              value={proj.link}
                              onChange={(e) => handleUpdateItem("projects", proj.id, "link", e.target.value)}
                              placeholder="https://github.com/username/project"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {resumeData.projects.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No projects yet. Click "Add Project" to get started.</p>
                    </div>
                  )}
                </div>
              )}

              {currentSection === "skills" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Skills</h2>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Add a skill (e.g., JavaScript, Python)"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddSkill((e.target as HTMLInputElement).value)
                            ; (e.target as HTMLInputElement).value = ""
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                        if (input) {
                          handleAddSkill(input.value)
                          input.value = ""
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => setResumeData(prev => ({
                            ...prev,
                            skills: prev.skills.filter((_, i) => i !== index)
                          }))}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  {resumeData.skills.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No skills added yet. Add at least 5 skills for better ATS matching.</p>
                    </div>
                  )}
                </div>
              )}

              {currentSection === "certifications" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Certifications</h2>
                    <Button onClick={handleAddCertification} size="sm" className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="w-4 h-4" />
                      Add Certification
                    </Button>
                  </div>
                  {resumeData.certifications.map((cert) => (
                    <Card key={cert.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold">Certification Entry</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem("certifications", cert.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Certification Name *</label>
                          <Input
                            value={cert.name}
                            onChange={(e) => handleUpdateItem("certifications", cert.id, "name", e.target.value)}
                            placeholder="AWS Certified Solutions Architect"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Issuing Organization *</label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => handleUpdateItem("certifications", cert.id, "issuer", e.target.value)}
                            placeholder="Amazon Web Services"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Date</label>
                          <Input
                            value={cert.date}
                            onChange={(e) => handleUpdateItem("certifications", cert.id, "date", e.target.value)}
                            placeholder="Jan 2024"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  {resumeData.certifications.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No certifications yet. Click "Add Certification" to get started.</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar - AI Suggestions & ATS Score */}
          <div className="lg:col-span-1 space-y-4">
            {/* ATS Score Card */}
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  ATS Score
                </h3>
                <Badge className={`${getScoreBadgeColor(atsScore)} text-white`}>
                  {atsScore}/100
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${atsScore >= 80 ? "bg-green-500" :
                        atsScore >= 60 ? "bg-yellow-500" :
                          "bg-red-500"
                      }`}
                    style={{ width: `${atsScore}%` }}
                  />
                </div>
                <p className={`text-sm font-semibold ${getScoreColor(atsScore)}`}>
                  {atsScore >= 80 ? "Excellent" : atsScore >= 60 ? "Good" : "Needs Improvement"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Real-time ATS compatibility score
                </p>
              </div>
            </Card>

            {/* AI Suggestions */}
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Suggestions
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  {showSuggestions ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              {showSuggestions && (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {aiSuggestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No suggestions at the moment</p>
                      <p className="text-xs">Keep editing to get AI feedback</p>
                    </div>
                  ) : (
                    aiSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${suggestion.severity === "error"
                            ? "bg-red-50 dark:bg-red-900/20 border-red-500"
                            : suggestion.severity === "warning"
                              ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                              : "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                          }`}
                      >
                        <div className="flex items-start gap-2">
                          {suggestion.severity === "error" ? (
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          ) : suggestion.severity === "warning" ? (
                            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <Badge
                              variant="outline"
                              className={`text-xs mb-1 ${suggestion.severity === "error"
                                  ? "border-red-500 text-red-700 dark:text-red-300"
                                  : suggestion.severity === "warning"
                                    ? "border-yellow-500 text-yellow-700 dark:text-yellow-300"
                                    : "border-blue-500 text-blue-700 dark:text-blue-300"
                                }`}
                            >
                              {suggestion.type.toUpperCase()}
                            </Badge>
                            <p className="text-sm">{suggestion.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-4 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-slate-50 dark:bg-slate-800/50"
                  onClick={() => {
                    // Real-time spell check - already running, show results
                    const spellingErrors = aiSuggestions.filter(s => s.type === "spelling")
                    if (spellingErrors.length > 0) {
                      alert(`Found ${spellingErrors.length} spelling error(s). Check suggestions panel.`)
                    } else {
                      alert("✓ Spell check completed! No spelling errors found.")
                    }
                  }}
                >
                  <SpellCheck className="w-4 h-4" />
                  Check Spelling
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-slate-50 dark:bg-slate-800/50"
                  onClick={() => {
                    // Real-time grammar check - already running, show results
                    const grammarErrors = aiSuggestions.filter(s => s.type === "grammar")
                    if (grammarErrors.length > 0) {
                      alert(`Found ${grammarErrors.length} grammar issue(s). Check suggestions panel.`)
                    } else {
                      alert("✓ Grammar check completed! No grammar issues found.")
                    }
                  }}
                >
                  <FileCheck className="w-4 h-4" />
                  Check Grammar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-slate-50 dark:bg-slate-800/50"
                  onClick={() => {
                    // Real-time alignment check - already running, show results
                    const alignmentIssues = aiSuggestions.filter(s => s.type === "alignment")
                    if (alignmentIssues.length > 0) {
                      alert(`Found ${alignmentIssues.length} alignment issue(s). Check suggestions panel.`)
                    } else {
                      alert("✓ Alignment check completed! All sections are properly formatted.")
                    }
                  }}
                >
                  <Layout className="w-4 h-4" />
                  Check Alignment
                </Button>
              </div>
            </Card>
          </div>

        </div>

        {/* Template Selection Modal */}
        <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Select Resume Template</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {resumeTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer transition-all border-2 ${selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                    }`}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setShowTemplateModal(false)
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    {selectedTemplate === template.id && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Resume Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Resume Preview
                </DialogTitle>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm">
                    {resumeTemplates.find(t => t.id === selectedTemplate)?.name || "Template"}
                  </Badge>
                  <Button
                    onClick={handleExportPDF}
                    className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <div className="p-6 overflow-y-auto">
              <div
                id="resume-preview-content"
                className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white mx-auto"
                style={{ maxWidth: '210mm', minHeight: '297mm' }}
              >
                <ResumePreview data={resumeData} templateId={selectedTemplate} />
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Preview updates in real-time as you edit your resume. Click "Download PDF" to save your resume.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

