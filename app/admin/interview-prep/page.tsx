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
  BookOpen,
  Code,
  Database,
  FileCode,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function InterviewPrepPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const prepCategories = {
    "Companies": ["Accenture", "Capgemini", "Cognizant", "DXC", "HCL", "Infosys", "TCS", "Wipro"],
    "Technical Skills": ["AutoCAD", "C", "C++", "Data Structures", "ECE", "EEE", "HTML", "Java", "Python", "Salesforce", "SQL"],
    "HR Skills": ["Aptitude", "Cognitive Ability", "Communication Ability", "Critical Thinking & Problem Solving"],
    "Other": ["MongoDB", "Group Discussion", "JAM"]
  }

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Material & Preparation</h1>
                <p className="text-gray-600">Interview preparation content and materials</p>
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
                      placeholder="Search interview materials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="companies" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="technical">Technical Skills</TabsTrigger>
                <TabsTrigger value="hr">HR Skills</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>

              {/* Companies Tab */}
              <TabsContent value="companies" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {prepCategories["Companies"].map((company, idx) => (
                    <Card key={idx} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">{company}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Upload className="w-4 h-4" />
                          Upload
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Download className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Technical Skills Tab */}
              <TabsContent value="technical" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {prepCategories["Technical Skills"].map((skill, idx) => (
                    <Card key={idx} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <Code className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">{skill}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Upload className="w-4 h-4" />
                          Upload
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Download className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* HR Skills Tab */}
              <TabsContent value="hr" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {prepCategories["HR Skills"].map((skill, idx) => (
                    <Card key={idx} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-900">{skill}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Upload className="w-4 h-4" />
                          Upload
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Download className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Other Tab */}
              <TabsContent value="other" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {prepCategories["Other"].map((item, idx) => (
                    <Card key={idx} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <Database className="w-6 h-6 text-orange-600" />
                        <h3 className="text-lg font-bold text-gray-900">{item}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Upload className="w-4 h-4" />
                          Upload
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Download className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

