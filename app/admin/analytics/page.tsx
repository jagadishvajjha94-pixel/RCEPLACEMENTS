"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "recharts"
import { TrendingUp, Users, Briefcase, Award, Download, Filter, Calendar } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AuthService } from "@/lib/auth-service"
import { PlacementAnalyticsService, RegistrationService, PlacementDriveService } from "@/lib/placement-service"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import type { User as AuthUser } from "@/lib/auth-service"

const COLORS = ["#FF8C42", "#2E86AB", "#A23B72", "#F18F01", "#06A77D"]

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState("2024-25")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
      return
    }
    setUser(currentUser)
    // Initialize mock data if needed
    initializeAllMockData()
    loadAnalytics()
  }, [router, academicYear, selectedBranch])

  const loadAnalytics = () => {
    setLoading(true)
    const filters: any = { academicYear }
    if (selectedBranch !== "all") {
      filters.branch = selectedBranch
    }
    const analytics = PlacementAnalyticsService.getStats(filters)
    setStats(analytics)
    setLoading(false)
  }

  const handleDownloadReport = () => {
    // Generate and download analytics report
    const reportData = {
      academicYear,
      branch: selectedBranch,
      stats,
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

  if (!user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto pt-16">
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/10 dark:to-accent/5">
          <div className="p-4 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">Comprehensive placement and internship statistics</p>
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
              className="glass-lg rounded-lg p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Label>Academic Year</Label>
                  <Select value={academicYear} onValueChange={setAcademicYear}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2025-26">2025-26</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Label>Branch</Label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                    <p className="text-3xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                  </div>
                  <Users className="w-12 h-12 text-primary opacity-50" />
                </div>
              </Card>

              <Card className="glass-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Placed Students</p>
                    <p className="text-3xl font-bold text-green-600">{stats.placedStudents}</p>
                  </div>
                  <Briefcase className="w-12 h-12 text-green-600 opacity-50" />
                </div>
              </Card>

              <Card className="glass-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Placement Rate</p>
                    <p className="text-3xl font-bold text-accent">{stats.placementRate}%</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-accent opacity-50" />
                </div>
              </Card>

              <Card className="glass-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg. Package</p>
                    <p className="text-3xl font-bold text-primary">{stats.averagePackage} LPA</p>
                  </div>
                  <Award className="w-12 h-12 text-primary opacity-50" />
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Year-wise Stats */}
              <Card className="glass-lg p-6">
                <h3 className="text-xl font-bold mb-4">Year-wise Placement Statistics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.yearWiseStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="placed" fill="#FF8C42" name="Placed" />
                    <Bar dataKey="internships" fill="#2E86AB" name="Internships" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Branch-wise Stats */}
              <Card className="glass-lg p-6">
                <h3 className="text-xl font-bold mb-4">Branch-wise Placement Percentage</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.branchWiseStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ branch, percentage }) => `${branch}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="placed"
                    >
                      {stats.branchWiseStats.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Drive-wise Stats */}
            <Card className="glass-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Drive-wise Placement Statistics</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Company</th>
                      <th className="text-right p-3">Total Applicants</th>
                      <th className="text-right p-3">Placed</th>
                      <th className="text-right p-3">Placement Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.driveWiseStats.map((drive: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{drive.driveName}</td>
                        <td className="p-3 text-right">{drive.totalApplicants}</td>
                        <td className="p-3 text-right text-green-600 font-semibold">{drive.placed}</td>
                        <td className="p-3 text-right">
                          {drive.totalApplicants > 0
                            ? Math.round((drive.placed / drive.totalApplicants) * 100)
                            : 0}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Placement Trend */}
            <Card className="glass-lg p-6">
              <h3 className="text-xl font-bold mb-4">Placement Trend (Last 7 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={PlacementAnalyticsService.getPlacementTrend(academicYear)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="placements" stroke="#FF8C42" name="Placements" />
                  <Line type="monotone" dataKey="internships" stroke="#2E86AB" name="Internships" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function Label({ children, ...props }: any) {
  return <label className="text-sm font-medium" {...props}>{children}</label>
}
