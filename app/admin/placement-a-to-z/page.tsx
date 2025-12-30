
import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Upload,
  Download,
  Folder,
  Building2,
  Briefcase,
  GraduationCap,
  Users,
  Calendar,
  FileSpreadsheet,
  Award,
  BarChart3,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function PlacementAToZPage() {
  const [selectedYear, setSelectedYear] = useState("2025-26")
  const [selectedBranch, setSelectedBranch] = useState("all")

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Placement – A to Z</h1>
                <p className="text-gray-600">Comprehensive placement management system</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>
            </motion.div>

            {/* Year Selection */}
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
              </div>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="offers" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="offers">Offers</TabsTrigger>
                <TabsTrigger value="consolidated">Consolidated</TabsTrigger>
                <TabsTrigger value="statements">Statements</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="internship">Internship</TabsTrigger>
                <TabsTrigger value="student-data">Student Data</TabsTrigger>
              </TabsList>

              {/* Offers Tab */}
              <TabsContent value="offers" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {branches.map((branch) => (
                    <Card key={branch} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Folder className="w-8 h-8 text-blue-600" />
                          <h3 className="text-lg font-bold text-gray-900">{branch}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Placement Offer Letters</p>
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

              {/* Consolidated Tab */}
              <TabsContent value="consolidated" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">Placement Consolidated Sheet</h3>
                    </div>
                    <Button className="gap-2">
                      <Download className="w-4 h-4" />
                      Download Template
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Columns: S.no, Roll no, Name, Branch, Gender, Mobile Number, Mail ID
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Consolidated Sheet
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <FileText className="w-4 h-4" />
                      View Current Data
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Statements Tab */}
              <TabsContent value="statements" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">Placement Statement</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Company-wise placement statements with branch-wise counts
                    </p>
                    <Button className="w-full gap-2">
                      <FileText className="w-4 h-4" />
                      Generate Statement
                    </Button>
                  </Card>

                  <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Briefcase className="w-6 h-6 text-orange-600" />
                      <h3 className="text-xl font-bold text-gray-900">Internship Statement</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Company-wise internship statements with branch-wise counts
                    </p>
                    <Button className="w-full gap-2">
                      <FileText className="w-4 h-4" />
                      Generate Statement
                    </Button>
                  </Card>
                </div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Placement Reports</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Consolidated Sheets
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Word Documents
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Sign Sheets
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Photos/Posters
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Internship Tab */}
              <TabsContent value="internship" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {branches.map((branch) => (
                    <Card key={branch} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Folder className="w-8 h-8 text-green-600" />
                          <h3 className="text-lg font-bold text-gray-900">{branch}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Internship Offer Letters</p>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Internship Selected Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Student details + Company Name, Stipend, Internship Title, On/Off Campus, Duration, HR Contact Details
                  </p>
                  <Button className="gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    View/Edit Data
                  </Button>
                </Card>
              </TabsContent>

              {/* Student Data Tab */}
              <TabsContent value="student-data" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Student Selected Data</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Company name, Website, Interview Date, Date info received, LOI/Offer Received, Joining Date
                    </p>
                    <Button className="w-full gap-2">
                      <FileText className="w-4 h-4" />
                      View Data
                    </Button>
                  </Card>

                  <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Specific vs Regular</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Track specific batch placements vs regular placements
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 gap-2">
                        <FileText className="w-4 h-4" />
                        Specific
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2">
                        <FileText className="w-4 h-4" />
                        Regular
                      </Button>
                    </div>
                  </Card>
                </div>

                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Multiple Offer Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Track students with multiple offers: Company1, Company2, Company3, Company4, Company5
                  </p>
                  <Button className="gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    View Data
                  </Button>
                </Card>

                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">PAN Card Details</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Track PAN status for Specific, Regular & ServiceNow batches
                  </p>
                  <Button className="gap-2">
                    <FileText className="w-4 h-4" />
                    View/Edit Data
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

