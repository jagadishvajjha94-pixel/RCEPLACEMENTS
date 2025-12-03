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
  Database,
  Mail,
  GraduationCap,
  Award,
  FileSpreadsheet,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function AICTERiseUpPage() {
  const [searchQuery, setSearchQuery] = useState("")

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AICTE / RiseUp Data</h1>
                <p className="text-gray-600">Complete data and master datasets</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>
            </motion.div>

            {/* Search */}
            <Card className="p-4 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
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
            <Tabs defaultValue="aicte" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="aicte">AICTE Data</TabsTrigger>
                <TabsTrigger value="riseup">RiseUp Data</TabsTrigger>
                <TabsTrigger value="codex">ServiceNow Codex & Rootx</TabsTrigger>
              </TabsList>

              {/* AICTE Data Tab */}
              <TabsContent value="aicte" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">AICTE Data</h3>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Import Data
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Includes: Domain mail IDs, ServiceNow mail IDs, 10th, Inter, B.Tech%, backlogs
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {["Domain Mail IDs", "ServiceNow Mail IDs", "10th Marks", "Inter Marks", "B.Tech %", "Backlogs"].map((item, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-gray-600" />
                          <span className="font-medium">{item}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">View Data</Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* RiseUp Data Tab */}
              <TabsContent value="riseup" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">RiseUp Data & Master Sheet</h3>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Import Data
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Track: Interview status, course status, CSA/CAD cert numbers, etc.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Interview Status</h4>
                      <Button variant="outline" size="sm" className="w-full">View</Button>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Course Status</h4>
                      <Button variant="outline" size="sm" className="w-full">View</Button>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">CSA Certificate Numbers</h4>
                      <Button variant="outline" size="sm" className="w-full">View</Button>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">CAD Certificate Numbers</h4>
                      <Button variant="outline" size="sm" className="w-full">View</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* ServiceNow Codex & Rootx Tab */}
              <TabsContent value="codex" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">AICTE ServiceNow Codex & Rootx</h3>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Import Data
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Specific program-based certification tracking
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Codex Program</h4>
                      <p className="text-sm text-gray-600 mb-2">Certification tracking for Codex program</p>
                      <Button variant="outline" size="sm" className="w-full">View Data</Button>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Rootx Program</h4>
                      <p className="text-sm text-gray-600 mb-2">Certification tracking for Rootx program</p>
                      <Button variant="outline" size="sm" className="w-full">View Data</Button>
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

