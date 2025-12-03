"use client"

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
  Mail,
  FileCheck,
  Search,
  GraduationCap,
  Users,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function CareerGuidancePage() {
  const [selectedYear, setSelectedYear] = useState("2025-26")
  const [searchQuery, setSearchQuery] = useState("")
  const [companies, setCompanies] = useState([
    { id: "1", name: "Career Guidance Session 1", year: "2025-26" },
    { id: "2", name: "Webinar: Resume Building", year: "2025-26" },
    { id: "3", name: "Interview Skills Workshop", year: "2025-26" },
  ])

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Guidance (CG)</h1>
                <p className="text-gray-600">Manage career guidance sessions, webinars, and talks</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button className="gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Add Session
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
                    <input
                      type="text"
                      placeholder="Search sessions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="sessions" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="sessions">Session Folders</TabsTrigger>
                <TabsTrigger value="moms">CG MOMs & Circulars</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              {/* Session Folders Tab */}
              <TabsContent value="sessions" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map((company) => (
                    <Card key={company.id} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Folder className="w-8 h-8 text-purple-600" />
                          <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Circulars</span>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Upload className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Mail Communication</span>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Upload className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Reports</span>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Upload className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Sign Sheets</span>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Upload className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* MOMs & Circulars Tab */}
              <TabsContent value="moms" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">CG Minutes of Meetings & Circulars</h3>
                    </div>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Document
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload and manage CG-related minutes of meetings and circulars
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">CG MOM Document {i}</span>
                          </div>
                          <Download className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Uploaded on {new Date().toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">CG Reports</h3>
                    </div>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Report
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Session Reports</h4>
                        <p className="text-sm text-gray-600">Upload individual session reports</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Monthly Summary</h4>
                        <p className="text-sm text-gray-600">Upload monthly CG activity summary</p>
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

