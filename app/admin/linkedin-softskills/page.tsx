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
  Users,
  Search,
  Linkedin,
  MessageSquare,
  FileSpreadsheet,
  Presentation,
  CheckCircle,
  XCircle,
  Mail,
  ExternalLink,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function LinkedInSoftSkillsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("23-27")

  const [linkedinData, setLinkedinData] = useState([
    {
      rollNo: "RCE2023001",
      name: "Sample Student",
      branch: "CSE",
      linkedinUrl: "https://linkedin.com/in/sample",
      mailSent: true,
      comment: "Profile updated",
      dealBy: "Coordinator 1",
    },
  ])

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn Profiles & Soft Skills</h1>
                <p className="text-gray-600">Manage LinkedIn profiles and soft skills training</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>
            </motion.div>

            {/* Year Selection & Search */}
            <Card className="p-4 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Year Range:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="23-27">23-27</option>
                  <option value="24-28">24-28</option>
                  <option value="25-29">25-29</option>
                </select>
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="linkedin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="linkedin">LinkedIn Profiles</TabsTrigger>
                <TabsTrigger value="softskills">Soft Skills & Communication</TabsTrigger>
              </TabsList>

              {/* LinkedIn Profiles Tab */}
              <TabsContent value="linkedin" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Linkedin className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Form Responses</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Name, Roll no, Branch, Gender, Mobile, Mail, LinkedIn URL
                    </p>
                    <Button className="w-full gap-2">
                      <Upload className="w-4 h-4" />
                      Import Form Data
                    </Button>
                  </Card>

                  <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <FileSpreadsheet className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">Main Data</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Name, Roll no, Branch, LinkedIn ID
                    </p>
                    <Button className="w-full gap-2">
                      <FileText className="w-4 h-4" />
                      View Data
                    </Button>
                  </Card>
                </div>

                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Student Data</h3>
                    <Button className="gap-2">
                      <Download className="w-4 h-4" />
                      Export Data
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Roll No</th>
                          <th className="text-left p-3 font-semibold">Name</th>
                          <th className="text-left p-3 font-semibold">Branch</th>
                          <th className="text-left p-3 font-semibold">LinkedIn URL</th>
                          <th className="text-left p-3 font-semibold">Mail Sent</th>
                          <th className="text-left p-3 font-semibold">Comment</th>
                          <th className="text-left p-3 font-semibold">Deal By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {linkedinData.map((student, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="p-3">{student.rollNo}</td>
                            <td className="p-3">{student.name}</td>
                            <td className="p-3">{student.branch}</td>
                            <td className="p-3">
                              <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                View Profile
                              </a>
                            </td>
                            <td className="p-3">
                              {student.mailSent ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-gray-400" />
                              )}
                            </td>
                            <td className="p-3 text-sm text-gray-600">{student.comment}</td>
                            <td className="p-3 text-sm">{student.dealBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pivot Tables</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Branch</h4>
                      <p className="text-2xl font-bold text-blue-600">8</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Count</h4>
                      <p className="text-2xl font-bold text-green-600">150</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Deal By</h4>
                      <p className="text-2xl font-bold text-purple-600">5</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Coordinators</h4>
                      <p className="text-2xl font-bold text-orange-600">3</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Soft Skills Tab */}
              <TabsContent value="softskills" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {["PPT on Benefits of LinkedIn", "Mock Preparation", "1-1 Interaction", "Accenture Interview", "Aptitude", "Communication Skills"].map((item, idx) => (
                    <Card key={idx} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <Presentation className="w-6 h-6 text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-900">{item}</h3>
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

                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Soft Skills Review & Feedback</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Text Feedback</h4>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Presentation Check</h4>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Student Presentations</h4>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Effective Students</h4>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Observations</h4>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Formats & Proposals</h4>
                        <Button variant="outline" size="sm">View</Button>
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

