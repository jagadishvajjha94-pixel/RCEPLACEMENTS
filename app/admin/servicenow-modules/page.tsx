
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
  BookOpen,
  CheckCircle,
  Search,
  Award,
  Users,
  FileSpreadsheet,
  GraduationCap,
  Clock,
  BarChart3,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import AICTERiseUpContent from "@/components/aicte-riseup-content"

export default function ServiceNowModulesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025-26")

  return (
    <div className="flex h-screen bg-gray-50">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ServiceNow Modules & Question Banks</h1>
                <p className="text-gray-600">Manage ServiceNow certifications, modules, and question banks</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>
            </motion.div>

            {/* Search & Year Selection */}
            <Card className="p-4 border border-gray-200 bg-white">
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search modules or questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </select>
              </div>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="certifications" className="w-full">
              <TabsList className="grid w-full grid-cols-7 bg-gray-100 border border-gray-200">
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="question-banks">Question Banks</TabsTrigger>
                <TabsTrigger value="test-scores">Test Scores</TabsTrigger>
                <TabsTrigger value="mock-interviews">Mock Interviews</TabsTrigger>
                <TabsTrigger value="database">ServiceNow DB</TabsTrigger>
                <TabsTrigger value="aicte-riseup">AICTE / RiseUp</TabsTrigger>
              </TabsList>

              {/* Certifications Tab */}
              <TabsContent value="certifications" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border border-gray-200 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Certification Links/Domains</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Upload certification documents and domain information</p>
                    <Button className="w-full gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Documents
                    </Button>
                  </Card>

                  <Card className="p-6 border border-gray-200 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">CSA & CAD Certified</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">View and manage certified students with certification numbers</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">CSA Certified</span>
                        <Button variant="outline" size="sm">View (45)</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">CAD Certified</span>
                        <Button variant="outline" size="sm">View (38)</Button>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-6 border border-gray-200 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">CSA & CAD Exam Date Sheet</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Student Name</th>
                          <th className="text-left p-3 font-semibold">Roll No</th>
                          <th className="text-left p-3 font-semibold">CSA Exam Date</th>
                          <th className="text-left p-3 font-semibold">CSA Certificate No</th>
                          <th className="text-left p-3 font-semibold">CAD Exam Date</th>
                          <th className="text-left p-3 font-semibold">CAD Certificate No</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3">Sample Student</td>
                          <td className="p-3">RCE2025001</td>
                          <td className="p-3">2025-01-15</td>
                          <td className="p-3">CSA-2025-001</td>
                          <td className="p-3">2025-02-20</td>
                          <td className="p-3">CAD-2025-001</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Modules Tab */}
              <TabsContent value="modules" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {["Module 1: Fundamentals", "Module 2: Advanced", "Module 3: Specialization", "CAD Uploaded Modules", "Recap Session Questions"].map((module, idx) => (
                    <Card key={idx} className="p-6 border border-gray-200 bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-900">{module}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Upload className="w-4 h-4" />
                          Upload
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Question Banks Tab */}
              <TabsContent value="question-banks" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border border-gray-200 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">MCQ's</h3>
                    <div className="space-y-3">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Module Wise MCQs</span>
                          <Button variant="outline" size="sm">Upload</Button>
                        </div>
                        <p className="text-sm text-gray-600">Upload module-wise multiple choice questions</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Previous MCQs</span>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                        <p className="text-sm text-gray-600">Access previous year question banks</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border border-gray-200 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Question Sets</h3>
                    <div className="space-y-3">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">ServiceNow 60 Questions</span>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                        <p className="text-sm text-gray-600">Question bank with metadata (Subject, Topic, Difficulty)</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">ServiceNow 120 Questions</span>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                        <p className="text-sm text-gray-600">Extended question bank with full metadata</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Recap Session Questions</span>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                        <p className="text-sm text-gray-600">Questions with text, options, correct answer, time, explanation</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Test Scores Tab */}
              <TabsContent value="test-scores" className="space-y-6 mt-6">
                <Card className="p-6 border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">ServiceNow Test Scores</h3>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Import Scores
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Roll No</th>
                          <th className="text-left p-3 font-semibold">Name</th>
                          <th className="text-left p-3 font-semibold">Branch</th>
                          <th className="text-center p-3 font-semibold">X1/60</th>
                          <th className="text-center p-3 font-semibold">X2/120</th>
                          <th className="text-center p-3 font-semibold">X3/25</th>
                          <th className="text-center p-3 font-semibold">X4/25</th>
                          <th className="text-center p-3 font-semibold">X5/50</th>
                          <th className="text-center p-3 font-semibold">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3">RCE2025001</td>
                          <td className="p-3">Sample Student</td>
                          <td className="p-3">CSE</td>
                          <td className="p-3 text-center">45</td>
                          <td className="p-3 text-center">95</td>
                          <td className="p-3 text-center">20</td>
                          <td className="p-3 text-center">22</td>
                          <td className="p-3 text-center">42</td>
                          <td className="p-3 text-center font-semibold">85%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border border-gray-200 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Training Timetable</h3>
                    <Button variant="outline" className="w-full gap-2">
                      <FileText className="w-4 h-4" />
                      View Timetable
                    </Button>
                  </Card>

                  <Card className="p-6 border border-gray-200 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Test Result Sheets</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Test 1 Results</span>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Test 2 Results</span>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Mock Interviews Tab */}
              <TabsContent value="mock-interviews" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {["Mock Interviews", "PPTs", "DSA", "JavaScript", "ServiceNow Modules", "Quiz Questions"].map((item, idx) => (
                    <Card key={idx} className="p-6 border border-gray-200 bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-orange-600" />
                        <h3 className="text-lg font-bold text-gray-900">{item}</h3>
                      </div>
                      <Button variant="outline" className="w-full gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Documents
                      </Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* ServiceNow Database Tab */}
              <TabsContent value="database" className="space-y-6 mt-6">
                <Card className="p-6 border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Main File – ServiceNow Batch DB</h3>
                    <Button className="gap-2">
                      <Download className="w-4 h-4" />
                      Export Database
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Master database containing: Student personal info, academic details, ServiceNow mails, PAN, percentages, backlogs, quiz scores (X1-X19), CSA/CAD/Overall percentages
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Student Information</h4>
                      <p className="text-sm text-gray-600">Personal, academic, and contact details</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Quiz Scores</h4>
                      <p className="text-sm text-gray-600">Test indices X1 through X19</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Certification Data</h4>
                      <p className="text-sm text-gray-600">CSA/CAD certification numbers and dates</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Performance Metrics</h4>
                      <p className="text-sm text-gray-600">Overall percentages and rankings</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-gray-200 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Shortlisted Students</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Shortlisted 40 Students</span>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Shortlisted 20 Students</span>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* AICTE / RiseUp Content */}
              <TabsContent value="aicte-riseup" className="space-y-6 mt-6">
                <AICTERiseUpContent />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

