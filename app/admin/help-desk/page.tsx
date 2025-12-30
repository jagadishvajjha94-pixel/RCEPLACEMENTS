
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
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  UserCheck,
  GraduationCap,
  BarChart3,
  Calendar,
  FileSpreadsheet,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function HelpDeskPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("22-26")
  const [selectedPhase, setSelectedPhase] = useState("general")

  const batches = ["22-26", "23-27", "24-28", "25-29", "26-30"]

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">T&P Help Desk</h1>
                <p className="text-gray-600">Comprehensive help desk management for student batches</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>
            </motion.div>

            {/* Batch Selection & Search */}
            <Card className="p-4 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Batch:</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  {batches.map(batch => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
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
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="phase1">Phase 1: Registration</TabsTrigger>
                <TabsTrigger value="phase2">Phase 2: Communication</TabsTrigger>
                <TabsTrigger value="phase3">Phase 3: Counselling</TabsTrigger>
                <TabsTrigger value="phase4">Phase 4: Mock Interviews</TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6 border-2 border-blue-200 bg-blue-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">HelpDesk Registration</h3>
                        <p className="text-3xl font-bold text-blue-600">150</p>
                      </div>
                      <UserCheck className="w-8 h-8 text-blue-600" />
                    </div>
                  </Card>
                  <Card className="p-6 border-2 border-green-200 bg-green-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Communication Check</h3>
                        <p className="text-3xl font-bold text-green-600">120</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-green-600" />
                    </div>
                  </Card>
                  <Card className="p-6 border-2 border-purple-200 bg-purple-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Counselling</h3>
                        <p className="text-3xl font-bold text-purple-600">95</p>
                      </div>
                      <GraduationCap className="w-8 h-8 text-purple-600" />
                    </div>
                  </Card>
                  <Card className="p-6 border-2 border-orange-200 bg-orange-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Mock Interviews</h3>
                        <p className="text-3xl font-bold text-orange-600">80</p>
                      </div>
                      <Users className="w-8 h-8 text-orange-600" />
                    </div>
                  </Card>
                </div>

                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Proposals & Reports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {["Registration Proposal", "Communication Check Report", "Counselling Report", "Mock Interview Campaign", "SDE Mock Interviews", "GD Mock Interviews", "JAM Mock Interviews", "PI Mock Interviews"].map((item, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{item}</span>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pending List</h3>
                  <p className="text-sm text-gray-600 mb-4">Students not attended with reasons and expected dates</p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Roll No</th>
                          <th className="text-left p-3 font-semibold">Name</th>
                          <th className="text-left p-3 font-semibold">Branch</th>
                          <th className="text-left p-3 font-semibold">Reason</th>
                          <th className="text-left p-3 font-semibold">Expected Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3">RCE2025001</td>
                          <td className="p-3">Sample Student</td>
                          <td className="p-3">CSE</td>
                          <td className="p-3">Personal reasons</td>
                          <td className="p-3">2025-02-15</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Phase 1: Registration Tab */}
              <TabsContent value="phase1" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Phase 1 – Help Desk Registration</h3>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Import Data
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Branch Wise Student Data with detailed fields: Personal, academic, workshops, hackathons, projects, internships, certifications, LinkedIn, etc.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {["Workshop/Seminar", "Projects", "Hackathons", "Internship", "Certification", "LinkedIn"].map((item, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item}</span>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Phase 2: Communication Check Tab */}
              <TabsContent value="phase2" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Phase 2 – Communication Check</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Branch wise consolidated data with verbal and non-verbal communication metrics (rated 1-5)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Verbal Communication</h4>
                      <div className="space-y-2">
                        {["Pronunciation", "Pace & Fluency", "Choice of Words", "Confidence"].map((metric) => (
                          <div key={metric} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{metric}</span>
                            <span className="text-xs text-gray-500">1-5 Scale</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Non-Verbal Communication</h4>
                      <div className="space-y-2">
                        {["Eye-contact", "Facial expressions", "Body language", "Gestures"].map((metric) => (
                          <div key={metric} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{metric}</span>
                            <span className="text-xs text-gray-500">1-5 Scale</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Super Batch", "ServiceNow Batch", "Specific Batch"].map((batch) => (
                      <div key={batch} className="p-4 border border-gray-200 rounded-lg">
                        <span className="font-medium">{batch}</span>
                        <Button variant="outline" size="sm" className="mt-2 w-full">View Data</Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Phase 3: Counselling Tab */}
              <TabsContent value="phase3" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Phase 3 – Counselling</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Daily Student List</h4>
                      <p className="text-sm text-gray-600 mb-2">Tasks and follow-up dates for each student</p>
                      <Button variant="outline" size="sm">View List</Button>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Mentor Sheets</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Umera Anjum", "Y. Divya"].map((mentor) => (
                          <Button key={mentor} variant="outline" size="sm">{mentor}</Button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Progress Sheets by Mentor</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Vandhana", "Divya", "Anjum", "Madhuri"].map((mentor) => (
                          <Button key={mentor} variant="outline" size="sm">{mentor}</Button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Final HELPDESK – Counselling Specific Batch</h4>
                      <p className="text-sm text-gray-600 mb-2">Before & After comparison: Communication, Certifications, Hackathons, Projects, Workshops/Seminars, Internships, Drive Status</p>
                      <Button variant="outline" size="sm">View Comparison</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Phase 4: Mock Interviews Tab */}
              <TabsContent value="phase4" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Phase 4 – Mock Interviews</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Evaluation Sheets</h4>
                        <div className="space-y-2">
                          {["C & R Batch", "ServiceNow"].map((batch) => (
                            <Button key={batch} variant="outline" size="sm" className="w-full">{batch} Evaluations</Button>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Interview Rounds</h4>
                        <div className="space-y-2">
                          {["1-1 Round", "TR (Technical Round)", "HR Round"].map((round) => (
                            <div key={round} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{round}</span>
                              <span className="text-xs text-gray-500">/25</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Student Roll List</h4>
                      <p className="text-sm text-gray-600 mb-2">Rank, grand-test, attendance, academic %, overall</p>
                      <Button variant="outline" size="sm">View List</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["First Round", "Second Round", "Final Round"].map((round) => (
                        <div key={round} className="p-4 border border-gray-200 rounded-lg">
                          <span className="font-medium">{round}</span>
                          <Button variant="outline" size="sm" className="mt-2 w-full">View Schedule</Button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">TR Sets & Keys</h4>
                        <div className="space-y-2">
                          {["C", "Java", "Python"].map((lang) => (
                            <Button key={lang} variant="outline" size="sm" className="w-full">{lang} Sets</Button>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Documents</h4>
                        <div className="space-y-2">
                          {["Timetables", "Signature Sheets", "Proposals", "Reports"].map((doc) => (
                            <Button key={doc} variant="outline" size="sm" className="w-full">{doc}</Button>
                          ))}
                        </div>
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

