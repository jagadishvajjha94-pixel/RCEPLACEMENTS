
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
  MessageSquare,
  UserCheck,
  GraduationCap,
  Calendar,
  FileSpreadsheet,
  BarChart3,
  Award,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function CareerConnectPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("2023-27")

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Connect & Mock Interviews</h1>
                <p className="text-gray-600">Manage career connect enrollment and mock interview evaluations</p>
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
                  <option value="2023-27">2023-27</option>
                  <option value="2024-28">2024-28</option>
                  <option value="2025-29">2025-29</option>
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
            <Tabs defaultValue="phase1" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="phase1">Phase 1: Enrollment</TabsTrigger>
                <TabsTrigger value="phase2">Phase 2: Communication</TabsTrigger>
                <TabsTrigger value="phase3">Phase 3: Counselling</TabsTrigger>
                <TabsTrigger value="phase4">Phase 4: Mock Interviews</TabsTrigger>
              </TabsList>

              {/* Phase 1: Enrollment Tab */}
              <TabsContent value="phase1" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Career Connect Enrollment</h3>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Import Enrollment Data
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Roll No</th>
                          <th className="text-left p-3 font-semibold">Name</th>
                          <th className="text-left p-3 font-semibold">Branch</th>
                          <th className="text-left p-3 font-semibold">Enrollment Date</th>
                          <th className="text-left p-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3">RCE2023001</td>
                          <td className="p-3">Sample Student</td>
                          <td className="p-3">CSE</td>
                          <td className="p-3">2023-09-01</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">Enrolled</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Phase 2 & 3: Communication & Counselling Tab */}
              <TabsContent value="phase2" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Phase 2 & 3: Communication Check & Career Counselling</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Evaluations with X, XII, B.Tech, backlogs, contact details
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Roll No</th>
                          <th className="text-left p-3 font-semibold">Name</th>
                          <th className="text-left p-3 font-semibold">X %</th>
                          <th className="text-left p-3 font-semibold">XII %</th>
                          <th className="text-left p-3 font-semibold">B.Tech %</th>
                          <th className="text-left p-3 font-semibold">Backlogs</th>
                          <th className="text-left p-3 font-semibold">Communication Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3">RCE2023001</td>
                          <td className="p-3">Sample Student</td>
                          <td className="p-3">85</td>
                          <td className="p-3">88</td>
                          <td className="p-3">82</td>
                          <td className="p-3">0</td>
                          <td className="p-3">4.2/5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Phase 3: Counselling Tab */}
              <TabsContent value="phase3" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Career Counselling Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Daily Counselling List</h4>
                      <p className="text-sm text-gray-600 mb-2">Tasks and follow-up dates</p>
                      <Button variant="outline" size="sm">View List</Button>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Counselling Reports</h4>
                      <p className="text-sm text-gray-600 mb-2">Progress tracking and outcomes</p>
                      <Button variant="outline" size="sm">View Reports</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Phase 4: Mock Interviews Tab */}
              <TabsContent value="phase4" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Phase 4: Multiple Mock Interviews</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["Mock Interview I", "Mock Interview II", "Mock Interview III"].map((interview, idx) => (
                        <Card key={idx} className="p-4 border border-gray-200">
                          <h4 className="font-semibold mb-2">{interview}</h4>
                          <p className="text-sm text-gray-600 mb-2">Branch-wise evaluation</p>
                          <Button variant="outline" size="sm" className="w-full">View Evaluations</Button>
                        </Card>
                      ))}
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Branch-wise Consolidated Sheets</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {["CSE", "ECE", "MECH", "CIVIL", "EEE", "AI&ML", "CS", "MBA"].map((branch) => (
                          <Button key={branch} variant="outline" size="sm">{branch}</Button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Branch-wise Percentage and Ranking</h4>
                      <p className="text-sm text-gray-600 mb-2">2023-27 batch rankings</p>
                      <Button variant="outline" size="sm">View Rankings</Button>
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

