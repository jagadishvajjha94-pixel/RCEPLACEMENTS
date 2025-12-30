
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
    "career-guidance": {
      title: "Career Guidance",
      icon: GraduationCap,
      data: [
        { name: "Sessions", value: 28 },
        { name: "Students Attended", value: 1250 },
        { name: "Upcoming", value: 5 },
      ],
      chartData: [
        { topic: "Resume Writing", attendance: 320 },
        { topic: "Interview Prep", attendance: 280 },
        { topic: "Soft Skills", attendance: 250 },
        { topic: "Career Planning", attendance: 200 },
        { topic: "Industry Trends", attendance: 200 },
      ],
      summary: {
        sessions: 28,
        studentsAttended: 1250,
        upcoming: 5,
      }
    },
    "consultant-hr": {
      title: "Consultant & HR Data",
      icon: Phone,
      data: [
        { name: "Total Contacts", value: 156 },
        { name: "Active", value: 98 },
        { name: "Companies", value: 87 },
      ],
      chartData: [
        { category: "HR Managers", count: 45 },
        { category: "Recruiters", count: 32 },
        { category: "Consultants", count: 28 },
        { category: "Talent Acquisition", count: 51 },
      ],
      summary: {
        totalContacts: 156,
        active: 98,
        companies: 87,
      }
    },
    "servicenow-modules": {
      title: "ServiceNow Modules",
      icon: BookOpen,
      data: [
        { name: "Total Modules", value: 12 },
        { name: "Completed", value: 8 },
        { name: "In Progress", value: 4 },
      ],
      chartData: [
        { module: "Module 1", progress: 100 },
        { module: "Module 2", progress: 100 },
        { module: "Module 3", progress: 85 },
        { module: "Module 4", progress: 60 },
        { module: "Module 5", progress: 45 },
      ],
      summary: {
        totalModules: 12,
        completed: 8,
        inProgress: 4,
      }
    },
    "help-desk": {
      title: "T&P Help Desk",
      icon: HelpCircle,
      data: [
        { name: "Total Tickets", value: 234 },
        { name: "Resolved", value: 198 },
        { name: "Pending", value: 36 },
      ],
      chartData: [
        { category: "Technical", count: 85 },
        { category: "Registration", count: 62 },
        { category: "General", count: 54 },
        { category: "Documentation", count: 33 },
      ],
      summary: {
        totalTickets: 234,
        resolved: 198,
        pending: 36,
        resolutionRate: 84.6,
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
    "linkedin-softskills": {
      title: "LinkedIn & Soft Skills",
      icon: Link2,
      data: [
        { name: "LinkedIn Profiles", value: 3420 },
        { name: "Soft Skills Sessions", value: 45 },
        { name: "Certifications", value: 892 },
      ],
      chartData: [
        { skill: "Communication", students: 1250 },
        { skill: "Leadership", students: 980 },
        { skill: "Teamwork", students: 1150 },
        { skill: "Problem Solving", students: 1080 },
        { skill: "Time Management", students: 920 },
      ],
      summary: {
        linkedInProfiles: 3420,
        sessions: 45,
        certifications: 892,
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
    "career-guidance",
    "consultant-hr",
    "servicenow-modules",
    "help-desk",
    "career-connect",
    "linkedin-softskills",
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <div className="p-4 md:p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
              >
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                    Comprehensive Analytics Dashboard
                  </h1>
                  <p className="text-gray-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">All admin sections in one unified view</p>
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
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 mb-6 shadow-xl"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <Label className="text-gray-300">Academic Year</Label>
                    <Select value={academicYear} onValueChange={setAcademicYear}>
                      <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="2023-24" className="text-white">2023-24</SelectItem>
                        <SelectItem value="2024-25" className="text-white">2024-25</SelectItem>
                        <SelectItem value="2025-26" className="text-white">2025-26</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-cyan-400" />
                    <Label className="text-gray-300">Branch</Label>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all" className="text-white">All Branches</SelectItem>
                        <SelectItem value="CSE" className="text-white">CSE</SelectItem>
                        <SelectItem value="ECE" className="text-white">ECE</SelectItem>
                        <SelectItem value="Mechanical" className="text-white">Mechanical</SelectItem>
                        <SelectItem value="Civil" className="text-white">Civil</SelectItem>
                        <SelectItem value="EEE" className="text-white">EEE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 p-4 shadow-xl hover:shadow-2xl hover:border-cyan-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Students</p>
                      <p className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">{stats.totalStudents.toLocaleString()}</p>
                    </div>
                    <Users className="w-10 h-10 text-cyan-400 opacity-70 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                  </div>
                </Card>
                <Card className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 p-4 shadow-xl hover:shadow-2xl hover:border-green-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Placed Students</p>
                      <p className="text-2xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">{stats.placedStudents}</p>
                    </div>
                    <Briefcase className="w-10 h-10 text-green-400 opacity-70 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  </div>
                </Card>
                <Card className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 p-4 shadow-xl hover:shadow-2xl hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Placement Rate</p>
                      <p className="text-2xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">{stats.placementRate}%</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-purple-400 opacity-70 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                  </div>
                </Card>
                <Card className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 p-4 shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Avg. Package</p>
                      <p className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">{stats.averagePackage} LPA</p>
                    </div>
                    <Award className="w-10 h-10 text-blue-400 opacity-70 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
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
                      className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 p-4 cursor-pointer hover:shadow-2xl hover:border-cyan-500/50 transition-all hover:scale-[1.02] shadow-xl"
                      onClick={() => handleChartClick(sectionKey)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                          <Icon className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                        </div>
                        <h3 className="text-sm font-bold text-white line-clamp-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{section.title}</h3>
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">{chartDetails?.title}</DialogTitle>
          </DialogHeader>
          
          {chartDetails && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
                <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700 data-[state=active]:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Overview</TabsTrigger>
                <TabsTrigger value="data" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700 data-[state=active]:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Data Breakdown</TabsTrigger>
                <TabsTrigger value="chart" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700 data-[state=active]:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Detailed Chart</TabsTrigger>
                <TabsTrigger value="export" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700 data-[state=active]:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Export</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(chartDetails.summary || {}).map(([key, value]: [string, any]) => (
                    <Card key={key} className="p-4 bg-slate-800/90 border-slate-700/50">
                      <p className="text-sm text-gray-400 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                    </Card>
                  ))}
                </div>
                <Card className="p-4 bg-slate-800/90 border-slate-700/50">
                  <h4 className="font-semibold mb-2 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Description</h4>
                  <p className="text-sm text-gray-300">
                    Comprehensive analytics and insights for {chartDetails.title.toLowerCase()}. 
                    View detailed breakdowns, trends, and export data for further analysis.
                  </p>
                </Card>
              </TabsContent>
              
              <TabsContent value="data" className="space-y-4">
                <Card className="p-4 bg-slate-800/90 border-slate-700/50">
                  <h4 className="font-semibold mb-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Complete Data Table</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          {chartDetails.chartData && chartDetails.chartData.length > 0 && 
                            Object.keys(chartDetails.chartData[0]).map((key) => (
                              <th key={key} className="text-left p-2 capitalize text-gray-300">{key}</th>
                            ))
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {chartDetails.chartData?.map((item: any, index: number) => (
                          <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                            {Object.values(item).map((val: any, i: number) => (
                              <td key={i} className="p-2 text-gray-200">{val}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="chart" className="space-y-4">
                <Card className="p-4 bg-slate-800/90 border-slate-700/50">
                  <h4 className="font-semibold mb-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Interactive Chart</h4>
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
                <Card className="p-4 bg-slate-800/90 border-slate-700/50">
                  <h4 className="font-semibold mb-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Export Options</h4>
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
