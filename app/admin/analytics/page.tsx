
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "@/components/recharts-wrapper"
import {
  TrendingUp, Users, Briefcase, Award, Download, Filter, Calendar,
  FileSpreadsheet, FileText, Building2, GraduationCap, Phone, BookOpen,
  HelpCircle, MessageSquare, Link2, UserPlus, BarChart3
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AuthService } from "@/lib/auth-service"
import { PlacementAnalyticsService, RegistrationService, PlacementDriveService, ConsolidatedSheetService } from "@/lib/placement-service"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import type { User as AuthUser } from "@/lib/auth-service"

const COLORS = ["#FF8C42", "#2E86AB", "#A23B72", "#F18F01", "#06A77D", "#8b5cf6", "#ef4444", "#10b981"]

// Generate analytics data for all sections
const generateSectionAnalytics = (stats: any, registrations: any[], drives: any[]) => {
  const offerStatement = PlacementAnalyticsService.getOfferStatement()
  const consolidatedData = ConsolidatedSheetService.generate({ academicYear: "2024-25", type: "all" })

  return {
    "registration-management": {
      title: "Registration Management",
      icon: UserPlus,
      data: [
        { name: "Total", value: registrations.length },
        { name: "Submitted", value: registrations.filter(r => r.status === "submitted").length },
        { name: "Pending", value: registrations.filter(r => r.status === "pending").length },
        { name: "With Offers", value: registrations.filter(r => r.hasOffer).length },
      ],
      chartData: registrations.reduce((acc: any, reg: any) => {
        const month = new Date(reg.submittedAt).toLocaleDateString('en-US', { month: 'short' })
        const existing = acc.find((item: any) => item.month === month)
        if (existing) {
          existing.count++
        } else {
          acc.push({ month, count: 1 })
        }
        return acc
      }, []).slice(-6),
      summary: {
        totalRegistrations: registrations.length,
        submitted: registrations.filter(r => r.status === "submitted").length,
        pending: registrations.filter(r => r.status === "pending").length,
        withOffers: registrations.filter(r => r.hasOffer).length,
      }
    },
    "consolidated-sheet": {
      title: "Consolidated Sheet",
      icon: FileSpreadsheet,
      data: [
        { name: "Total Students", value: consolidatedData.students.length },
        { name: "Placed", value: consolidatedData.students.filter((s: any) => s.offerStatus === "placed").length },
        { name: "Internships", value: consolidatedData.students.filter((s: any) => s.offerType === "internship").length },
        { name: "Pending", value: consolidatedData.students.filter((s: any) => s.offerStatus === "pending").length },
      ],
      chartData: consolidatedData.students.reduce((acc: any, student: any) => {
        const branch = student.branch || "Unknown"
        const existing = acc.find((item: any) => item.branch === branch)
        if (existing) {
          existing.count++
        } else {
          acc.push({ branch, count: 1 })
        }
        return acc
      }, []),
      summary: {
        totalStudents: consolidatedData.students.length,
        placed: consolidatedData.students.filter((s: any) => s.offerStatus === "placed").length,
        internships: consolidatedData.students.filter((s: any) => s.offerType === "internship").length,
      }
    },
    "offer-statement": {
      title: "Offer Statement",
      icon: Award,
      data: [
        { name: "Single Offer", value: offerStatement.singleOffer },
        { name: "Multiple Offers", value: offerStatement.multipleOffers },
        { name: "Total Placed", value: offerStatement.singleOffer + offerStatement.multipleOffers },
      ],
      chartData: Object.entries(offerStatement.branchWise || {}).map(([branch, data]: [string, any]) => ({
        branch,
        single: data.singleOffer || 0,
        multiple: data.multipleOffers || 0,
      })),
      summary: {
        singleOffer: offerStatement.singleOffer,
        multipleOffers: offerStatement.multipleOffers,
        total: offerStatement.singleOffer + offerStatement.multipleOffers,
      }
    },
    "reports": {
      title: "Reports",
      icon: BarChart3,
      data: [
        { name: "Total Reports", value: 15 },
        { name: "Generated", value: 12 },
        { name: "Pending", value: 3 },
      ],
      chartData: [
        { month: "Aug", reports: 2 },
        { month: "Sep", reports: 3 },
        { month: "Oct", reports: 4 },
        { month: "Nov", reports: 3 },
        { month: "Dec", reports: 2 },
        { month: "Jan", reports: 1 },
      ],
      summary: {
        totalReports: 15,
        generated: 12,
        pending: 3,
      }
    },
    "placement-a-to-z": {
      title: "Placement A to Z",
      icon: Briefcase,
      data: [
        { name: "Total Drives", value: drives.length },
        { name: "Active", value: drives.filter(d => d.status === "active").length },
        { name: "Completed", value: drives.filter(d => d.status === "closed").length },
        { name: "Upcoming", value: drives.filter(d => d.status === "upcoming").length },
      ],
      chartData: drives.reduce((acc: any, drive: any) => {
        const company = drive.companyName
        const existing = acc.find((item: any) => item.company === company)
        if (existing) {
          existing.count++
        } else {
          acc.push({ company, count: 1 })
        }
        return acc
      }, []).slice(0, 10),
      summary: {
        totalDrives: drives.length,
        active: drives.filter(d => d.status === "active").length,
        completed: drives.filter(d => d.status === "closed").length,
        upcoming: drives.filter(d => d.status === "upcoming").length,
      }
    },
    "industry-institute": {
      title: "Industry Institute Interaction",
      icon: Building2,
      data: [
        { name: "Total Interactions", value: 45 },
        { name: "This Year", value: 32 },
        { name: "Scheduled", value: 8 },
      ],
      chartData: [
        { month: "Aug", interactions: 5 },
        { month: "Sep", interactions: 7 },
        { month: "Oct", interactions: 6 },
        { month: "Nov", interactions: 8 },
        { month: "Dec", interactions: 4 },
        { month: "Jan", interactions: 2 },
      ],
      summary: {
        total: 45,
        thisYear: 32,
        scheduled: 8,
      }
    },
    "career-connect": {
      title: "Career Connect",
      icon: MessageSquare,
      data: [
        { name: "Total Connections", value: 567 },
        { name: "Active", value: 423 },
        { name: "Messages", value: 1234 },
      ],
      chartData: [
        { month: "Aug", connections: 45 },
        { month: "Sep", connections: 67 },
        { month: "Oct", connections: 89 },
        { month: "Nov", connections: 102 },
        { month: "Dec", connections: 115 },
        { month: "Jan", connections: 149 },
      ],
      summary: {
        totalConnections: 567,
        active: 423,
        messages: 1234,
      }
    },
  }
}

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState("2024-25")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [loading, setLoading] = useState(true)
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [chartDetails, setChartDetails] = useState<any>(null)
  const [sectionAnalytics, setSectionAnalytics] = useState<any>({})

  useEffect(() => {
    if (typeof window === "undefined") return
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login")
      return
    }
    setUser(currentUser)
    initializeAllMockData()
    loadAnalytics()
  }, [navigate, academicYear, selectedBranch])

  const loadAnalytics = () => {
    setLoading(true)
    try {
      const filters: any = { academicYear }
      if (selectedBranch !== "all") {
        filters.branch = selectedBranch
      }
      const analytics = PlacementAnalyticsService.getStats(filters)
      const registrations = RegistrationService.getAll()
      const drives = PlacementDriveService.getAll()

      setStats(analytics)
      const sections = generateSectionAnalytics(analytics, registrations, drives)
      setSectionAnalytics(sections)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = () => {
    const reportData = {
      academicYear,
      branch: selectedBranch,
      stats,
      sections: sectionAnalytics,
      generatedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `analytics_report_${academicYear}_${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleChartClick = (sectionKey: string) => {
    setSelectedChart(sectionKey)
    const section = sectionAnalytics[sectionKey]
    if (section) {
      setChartDetails(section)
    }
  }

  if (!user || !stats || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    )
  }

  const sections = [
    "registration-management",
    "consolidated-sheet",
    "offer-statement",
    "reports",
    "placement-a-to-z",
    "industry-institute",
    "career-connect",
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="min-h-screen bg-gray-50">
            <div className="p-4 md:p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
              >
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Comprehensive Analytics Dashboard
                  </h1>
                  <p className="text-gray-600">All admin sections in one unified view</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleDownloadReport} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </div>
              </motion.div>

              {/* Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <Label className="text-gray-700">Academic Year</Label>
                    <Select value={academicYear} onValueChange={setAcademicYear}>
                      <SelectTrigger className="w-[140px] bg-white border-gray-300 text-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <Label className="text-gray-700">Branch</Label>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger className="w-[140px] bg-white border-gray-300 text-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="all">All Branches</SelectItem>
                        <SelectItem value="CSE">CSE</SelectItem>
                        <SelectItem value="ECE">ECE</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="EEE">EEE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
                    </div>
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                </Card>
                <Card className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Placed Students</p>
                      <p className="text-2xl font-bold text-green-600">{stats.placedStudents}</p>
                    </div>
                    <Briefcase className="w-10 h-10 text-green-600" />
                  </div>
                </Card>
                <Card className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Placement Rate</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.placementRate}%</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-purple-600" />
                  </div>
                </Card>
                <Card className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg. Package</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.averagePackage} LPA</p>
                    </div>
                    <Award className="w-10 h-10 text-blue-600" />
                  </div>
                </Card>
              </div>

              {/* All Sections Grid - Maximized */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {sections.map((sectionKey) => {
                  const section = sectionAnalytics[sectionKey]
                  if (!section) return null
                  const Icon = section.icon

                  return (
                    <Card
                      key={sectionKey}
                      className="bg-white border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all shadow-sm"
                      onClick={() => handleChartClick(sectionKey)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{section.title}</h3>
                      </div>
                      <ResponsiveContainer width="100%" height={180}>
                        {section.chartData && section.chartData.length > 0 ? (
                          section.chartData[0].month ? (
                            <LineChart data={section.chartData.slice(-6)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey={Object.keys(section.chartData[0]).find(k => k !== 'month') || 'count'} stroke={COLORS[0]} strokeWidth={2} />
                            </LineChart>
                          ) : section.chartData[0].branch || section.chartData[0].company ? (
                            <BarChart data={section.chartData.slice(0, 5)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey={section.chartData[0].branch ? 'branch' : 'company'} angle={-45} textAnchor="end" height={60} />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill={COLORS[1]} />
                            </BarChart>
                          ) : (
                            <PieChart>
                              <Pie
                                data={section.chartData.slice(0, 5)}
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                              >
                                {section.chartData.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          )
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            No data available
                          </div>
                        )}
                      </ResponsiveContainer>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Chart Details Modal */}
      <Dialog open={selectedChart !== null} onOpenChange={() => setSelectedChart(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">{chartDetails?.title}</DialogTitle>
          </DialogHeader>

          {chartDetails && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 border-gray-200">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="data">Data Breakdown</TabsTrigger>
                <TabsTrigger value="chart">Detailed Chart</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(chartDetails.summary || {}).map(([key, value]: [string, any]) => (
                    <Card key={key} className="p-4 bg-white border-gray-200">
                      <p className="text-sm text-gray-600 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-2xl font-bold text-gray-900">{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                    </Card>
                  ))}
                </div>
                <Card className="p-4 bg-white border-gray-200">
                  <h4 className="font-semibold mb-2 text-gray-900">Description</h4>
                  <p className="text-sm text-gray-600">
                    Comprehensive analytics and insights for {chartDetails.title.toLowerCase()}.
                    View detailed breakdowns, trends, and export data for further analysis.
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <Card className="p-4 bg-slate-800 border-slate-700/50">
                  <h4 className="font-semibold mb-4 text-gray-900 ">Complete Data Table</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          {chartDetails.chartData && chartDetails.chartData.length > 0 &&
                            Object.keys(chartDetails.chartData[0]).map((key) => (
                              <th key={key} className="text-left p-2 capitalize text-gray-700">{key}</th>
                            ))
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {chartDetails.chartData?.map((item: any, index: number) => (
                          <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                            {Object.values(item).map((val: any, i: number) => (
                              <td key={i} className="p-2 text-gray-600">{val}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="chart" className="space-y-4">
                <Card className="p-4 bg-slate-800 border-slate-700/50">
                  <h4 className="font-semibold mb-4 text-gray-900 ">Interactive Chart</h4>
                  <ResponsiveContainer width="100%" height={400}>
                    {chartDetails.chartData && chartDetails.chartData.length > 0 && (
                      chartDetails.chartData[0].month ? (
                        <LineChart data={chartDetails.chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey={Object.keys(chartDetails.chartData[0]).find(k => k !== 'month') || 'count'} stroke={COLORS[0]} strokeWidth={2} />
                        </LineChart>
                      ) : chartDetails.chartData[0].branch || chartDetails.chartData[0].company ? (
                        <BarChart data={chartDetails.chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey={chartDetails.chartData[0].branch ? 'branch' : 'company'} angle={-45} textAnchor="end" height={100} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill={COLORS[1]} />
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie
                            data={chartDetails.chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {chartDetails.chartData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      )
                    )}
                  </ResponsiveContainer>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <Card className="p-4 bg-white border-gray-200">
                  <h4 className="font-semibold mb-4 text-gray-900">Export Options</h4>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        if (!chartDetails.chartData || chartDetails.chartData.length === 0) return
                        const csv = [
                          Object.keys(chartDetails.chartData[0]).join(','),
                          ...chartDetails.chartData.map((item: any) => Object.values(item).join(','))
                        ].join('\n')
                        const blob = new Blob([csv], { type: 'text/csv' })
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `${selectedChart}_data_${Date.now()}.csv`
                        link.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="w-full gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export as CSV
                    </Button>
                    <Button
                      onClick={() => {
                        const json = JSON.stringify(chartDetails, null, 2)
                        const blob = new Blob([json], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `${selectedChart}_data_${Date.now()}.json`
                        link.click()
                        URL.revokeObjectURL(url)
                      }}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export as JSON
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
