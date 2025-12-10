
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
  Clock,
  FileSpreadsheet,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function MidMarksSyllabusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025-26")

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mid Marks & Training Syllabus</h1>
                <p className="text-gray-600">Manage mid-term marks and training syllabi</p>
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
            <Tabs defaultValue="mid-marks" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="mid-marks">Mid Marks</TabsTrigger>
                <TabsTrigger value="syllabus">Training Syllabus</TabsTrigger>
              </TabsList>

              {/* Mid Marks Tab */}
              <TabsContent value="mid-marks" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Mid 1 Marks</h3>
                    </div>
                    <Button className="w-full gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Mid 1 Marks
                    </Button>
                  </Card>

                  <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <FileSpreadsheet className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">Mid 2 Marks</h3>
                    </div>
                    <Button className="w-full gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Mid 2 Marks
                    </Button>
                  </Card>
                </div>

                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pending Hours</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Roll No</th>
                          <th className="text-left p-3 font-semibold">Name</th>
                          <th className="text-left p-3 font-semibold">Branch</th>
                          <th className="text-left p-3 font-semibold">Pending Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3">RCE2025001</td>
                          <td className="p-3">Sample Student</td>
                          <td className="p-3">CSE</td>
                          <td className="p-3">5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Training Syllabus Tab */}
              <TabsContent value="syllabus" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Training Syllabus</h3>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Syllabus
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {["Syllabus 25-26", "Training 3 Years", "Training 24-25 Syllabus"].map((item, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">{item}</span>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
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

