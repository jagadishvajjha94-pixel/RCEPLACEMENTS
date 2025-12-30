
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
  Calendar,
  Users,
  FileSpreadsheet,
  Award,
  BookOpen,
  BarChart3,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function BootcampInfosysPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025-26")

  const bootcampSyllabi = [
    "Java", "Python", "Azure", "Gen AI", "Specific Aptitude", "Specific Communication", 
    "Specific JavaScript", "ServiceNow", "Infosys-only girls"
  ]

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Boot Camps & Infosys-Specific Track</h1>
                <p className="text-gray-600">Manage boot camps and Infosys-specific training programs</p>
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
            <Tabs defaultValue="bootcamp" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="bootcamp">Boot Camp</TabsTrigger>
                <TabsTrigger value="infosys">Infosys-Specific</TabsTrigger>
              </TabsList>

              {/* Boot Camp Tab */}
              <TabsContent value="bootcamp" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {["Boot Camp Reports", "56 Schedule Sheets", "Assessment Report", "BC Attendance", "BC Assessment", "BC Topic Covered"].map((item, idx) => (
                    <Card key={idx} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-blue-600" />
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Mock Rank Sheets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {["Mock Rank 1-100", "Mock Rank 101-200", "Mock Rank 201-324"].map((rank, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{rank}</span>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Syllabus Boot Camp</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bootcampSyllabi.map((syllabus, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">{syllabus}</span>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Infosys-Specific Tab */}
              <TabsContent value="infosys" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {["Infosys Photos", "Old Papers", "Batch-wise Data (22-26)", "Assessment", "Attendance", "Syllabus"].map((item, idx) => (
                    <Card key={idx} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-orange-600" />
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Infosys Batch Data</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {["22", "23", "24", "25", "26"].map((batch) => (
                      <div key={batch} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Batch {batch}</span>
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

