
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Upload,
  Download,
  Search,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle,
  Users,
  FileSpreadsheet,
  Clock,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function TrainingAssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025-26")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)

  const handleUpload = (itemName: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.xlsx,.xls,.doc,.docx'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        setUploadingFile(itemName)
        // Simulate upload
        setTimeout(() => {
          alert(`${itemName} uploaded successfully!`)
          setUploadingFile(null)
        }, 1000)
      }
    }
    input.click()
  }

  const handleDownload = (itemName: string) => {
    // Create a mock file download
    const blob = new Blob([`Sample ${itemName} data`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${itemName.replace(/\s+/g, '_')}_${selectedYear}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleView = (itemName: string, branchOrYear?: string) => {
    alert(`Viewing ${itemName}${branchOrYear ? ` for ${branchOrYear}` : ''}`)
  }

  const branches = ["CSE", "ECE", "MECH", "CIVIL", "EEE", "AI&ML", "CS", "IOT", "AI&DS", "MBA"]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="p-8 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Training, Assessments & Assignments</h1>
                <p className="text-gray-600">Manage training programs, assessments, and assignments</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>
            </motion.div>

            {/* Filters */}
            <Card className="p-4 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Academic Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                </select>
                <label className="text-sm font-semibold text-gray-700">Branch:</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="all">All Branches</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="training" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="training">Training</TabsTrigger>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
              </TabsList>

              {/* Training Tab */}
              <TabsContent value="training" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {["Training Profiles", "Training Circulars", "Consolidated Sheets", "Photos", "Reports", "Syllabi"].map((item, idx) => (
                    <Card key={idx} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">{item}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleUpload(item)}
                          disabled={uploadingFile === item}
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingFile === item ? "Uploading..." : "Upload"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleDownload(item)}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Assessments Tab */}
              <TabsContent value="assessments" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Assessments</h3>
                    <Button className="gap-2" onClick={() => handleUpload("Assessment")}>
                      <Upload className="w-4 h-4" />
                      Upload Assessment
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {["Roll No List", "Syllabus", "Timetable", "Topic Covered", "Assessment Status"].map((item, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{item}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleView(item)}>View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Branch-wise Assessment Sheets</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {branches.map((branch) => (
                      <div key={branch} className="p-4 border border-gray-200 rounded-lg">
                        <span className="font-medium">{branch}</span>
                        <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => handleView("Assessment Sheet", branch)}>View</Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Assignments Tab */}
              <TabsContent value="assignments" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Assignments</h3>
                    <Button className="gap-2" onClick={() => handleUpload("Assignment")}>
                      <Upload className="w-4 h-4" />
                      Upload Assignment
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Branch-wise Assignments</h4>
                      <div className="space-y-2">
                        {branches.slice(0, 5).map((branch) => (
                          <div key={branch} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{branch}</span>
                            <Button variant="outline" size="sm" onClick={() => handleView("Assignment", branch)}>View</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Year-wise Assignments</h4>
                      <div className="space-y-2">
                        {["2025-26", "2024-25", "2023-24"].map((year) => (
                          <div key={year} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{year}</span>
                            <Button variant="outline" size="sm" onClick={() => handleView("Assignment", selectedBranch)}>View</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Attendance Sheets</h3>
                    <Button className="gap-2" onClick={() => handleUpload("Attendance")}>
                      <Upload className="w-4 h-4" />
                      Upload Attendance
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Branch-wise Attendance</h4>
                      <div className="space-y-2">
                        {branches.slice(0, 5).map((branch) => (
                          <div key={branch} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{branch}</span>
                            <Button variant="outline" size="sm" onClick={() => handleView("Assignment", selectedBranch)}>View</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Year-wise Attendance</h4>
                      <div className="space-y-2">
                        {["2025-26", "2024-25", "2023-24"].map((year) => (
                          <div key={year} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{year}</span>
                            <Button variant="outline" size="sm" onClick={() => handleView("Assignment", selectedBranch)}>View</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

