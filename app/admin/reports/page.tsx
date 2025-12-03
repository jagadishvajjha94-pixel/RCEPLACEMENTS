"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
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
import {
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  Download,
  Maximize2,
  Filter,
  X,
  Clock,
  BarChart3,
} from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import { PlacementAnalyticsService, PlacementDriveService, RegistrationService } from "@/lib/placement-service"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import type { User as AuthUser } from "@/lib/auth-service"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<"report" | "insights">("insights")
  
  // Filter states
  const [reportType, setReportType] = useState("campus-placement-summary")
  const [passOutYear, setPassOutYear] = useState("2025")
  const [campus, setCampus] = useState("all")
  const [department, setDepartment] = useState("all")
  const [degree, setDegree] = useState("all")
  
  // Stats
  const [stats, setStats] = useState({
    totalCampuses: 0,
    totalStudents: 0,
    totalPlacementEligible: 0,
    totalPlacedStudents: 0,
    placementRate: 0,
  })
  
  // Chart data
  const [placementRateByCampus, setPlacementRateByCampus] = useState<any[]>([])
  const [departmentDistribution, setDepartmentDistribution] = useState<any[]>([])
  const [salaryData, setSalaryData] = useState<any[]>([])
  const [salaryView, setSalaryView] = useState<"salary" | "stipend">("salary")
  const [expandedChart, setExpandedChart] = useState<string | null>(null)

  const loadReportData = useCallback(() => {
    setLoading(true)
    try {
      // Get all data
      let drives = PlacementDriveService.getAll() || []
      let registrations = RegistrationService.getAll() || []
      
      // Apply filters
      if (campus !== "all") {
        // Filter drives by campus (using companyName as proxy for now)
        drives = drives.filter(d => d.companyName.toLowerCase().includes(campus.toLowerCase()))
        const driveIds = new Set(drives.map(d => d.id))
        registrations = registrations.filter(r => driveIds.has(r.driveId))
      }
      
      if (department !== "all") {
        registrations = registrations.filter(r => r.branch === department)
      }
      
      // Note: degree filter would need to be added to registration data structure
      // For now, we'll skip it or apply it if the data structure supports it
      
      // Calculate stats based on filtered data
      const placedStudents = registrations.filter(r => r.hasOffer).length
      const totalStudents = 4000 // Mock total
      const eligibleStudents = registrations.length
      const campuses = drives.length > 0 ? new Set(drives.map(d => d.companyName)).size : 0
      const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0

      setStats({
        totalCampuses: campuses,
        totalStudents,
        totalPlacementEligible: eligibleStudents,
        totalPlacedStudents: placedStudents,
        placementRate: parseFloat(placementRate.toFixed(2)),
      })

      // Generate chart data - use deterministic values based on drive data
      const campusData = drives.length > 0 
        ? drives.slice(0, 5).map((drive, index) => {
            // Use hash of drive ID for deterministic "random" values
            const hash = drive.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
            const rate = 70 + (hash % 30)
            const students = 20 + (hash % 50)
            return {
              name: drive.companyName,
              rate,
              students,
            }
          })
        : []
      setPlacementRateByCampus(campusData)

      // Generate department distribution from filtered registrations
      const deptCounts = registrations.reduce((acc, reg) => {
        const dept = reg.branch || "Unknown"
        if (!acc[dept]) {
          acc[dept] = { placed: 0, total: 0 }
        }
        acc[dept].total++
        if (reg.hasOffer) {
          acc[dept].placed++
        }
        return acc
      }, {} as Record<string, { placed: number; total: number }>)
      
      const deptData = Object.entries(deptCounts).map(([name, data]) => ({
        name,
        value: data.placed,
        total: data.total,
      }))
      
      // If no data, use default mock data
      if (deptData.length === 0) {
        setDepartmentDistribution([
          { name: "CSE", value: 1150, total: 1200 },
          { name: "ECE", value: 730, total: 800 },
          { name: "Mech", value: 520, total: 600 },
          { name: "Civil", value: 320, total: 400 },
          { name: "EEE", value: 280, total: 350 },
        ])
      } else {
        setDepartmentDistribution(deptData)
      }

      const salaryChartData = [
        { name: "CSE", salary: 85, stipend: 45 },
        { name: "ECE", salary: 78, stipend: 40 },
        { name: "Mech", salary: 65, stipend: 35 },
        { name: "Civil", salary: 55, stipend: 30 },
        { name: "EEE", salary: 70, stipend: 38 },
      ]
      setSalaryData(salaryChartData)
    } catch (error) {
      console.error("Error loading report data:", error)
    } finally {
      setLoading(false)
    }
  }, [campus, department, degree])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return
    
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
      return
    }
    setUser(currentUser)
    initializeAllMockData()
    loadReportData()
  }, [router, loadReportData, mounted])

  // Remove auto-reload on filter change - only reload when Apply Filter is clicked
  // useEffect(() => {
  //   if (user) {
  //     loadReportData()
  //   }
  // }, [reportType, passOutYear, campus, department, degree, user, loadReportData])

  const handleClearFilters = () => {
    setReportType("campus-placement-summary")
    setPassOutYear("2025")
    setCampus("all")
    setDepartment("all")
    setDegree("all")
  }

  const handleApplyFilters = () => {
    loadReportData()
  }

  const handleDownloadReport = (type: string) => {
    const reportData = {
      type,
      filters: { reportType, passOutYear, campus, department, degree },
      stats,
      generatedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `report_${type}_${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExpandChart = (chartType: string) => {
    setExpandedChart(chartType)
  }

  const handleCloseExpandedChart = () => {
    setExpandedChart(null)
  }

  if (!mounted || !user) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col ml-72">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto pt-16">
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          </main>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Comprehensive placement and campus analytics</p>
        </div>
            </motion.div>

            {/* Filter Section */}
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-700">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-2 border-gray-200 shadow-xl z-[100] opacity-100">
                <SelectItem value="campus-placement-summary">Campus Placement Summary</SelectItem>
                <SelectItem value="department-wise">Department Wise</SelectItem>
                <SelectItem value="year-wise">Year Wise</SelectItem>
                <SelectItem value="company-wise">Company Wise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-700">Pass Out Year</label>
            <Select value={passOutYear} onValueChange={setPassOutYear}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-2 border-gray-200 shadow-xl z-[100] opacity-100">
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-700">Campus</label>
            <Select value={campus} onValueChange={setCampus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-2 border-gray-200 shadow-xl z-[100] opacity-100">
                <SelectItem value="all">All Campuses</SelectItem>
                <SelectItem value="main">Main Campus</SelectItem>
                <SelectItem value="branch1">Branch Campus 1</SelectItem>
                <SelectItem value="branch2">Branch Campus 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-700">Department</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-2 border-gray-200 shadow-xl z-[100] opacity-100">
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="Mech">Mechanical</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
                <SelectItem value="EEE">EEE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-700">Degree</label>
            <Select value={degree} onValueChange={setDegree}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-2 border-gray-200 shadow-xl z-[100] opacity-100">
                <SelectItem value="all">All Degrees</SelectItem>
                <SelectItem value="B.Tech">B.Tech</SelectItem>
                <SelectItem value="M.Tech">M.Tech</SelectItem>
                <SelectItem value="MBA">MBA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Apply Filter
            </Button>
          </div>
        </div>
        
        {/* Refresh Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Report section will be refreshed every 24 hours on 04:00 AM IST</span>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("report")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "report"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Report
            </button>
            <button
              onClick={() => setViewMode("insights")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "insights"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Insights
            </button>
          </div>
        </div>
            </motion.div>

            {/* Key Metrics Cards - Only show in Insights mode */}
            {viewMode === "insights" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="cursor-pointer"
        >
          <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCampuses}</h3>
            <p className="text-sm font-medium text-gray-600">Total Campuses</p>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="cursor-pointer"
        >
          <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalStudents.toLocaleString()}</h3>
            <p className="text-sm font-medium text-gray-600">Total Students in Platform</p>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="cursor-pointer"
        >
          <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalPlacementEligible.toLocaleString()}</h3>
            <p className="text-sm font-medium text-gray-600">Total Placement Eligible</p>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="cursor-pointer"
        >
          <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalPlacedStudents.toLocaleString()}</h3>
            <p className="text-sm font-medium text-gray-600">Total Placed Students</p>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="cursor-pointer"
        >
          <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.placementRate}%</h3>
            <p className="text-sm font-medium text-gray-600">Placement Rate</p>
          </Card>
        </motion.div>
      </div>
      )}

            {/* Charts Section - Show based on view mode */}
            {viewMode === "insights" ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement Rate by Campus */}
        <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Placement Rate by Campus</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExpandChart("placement-rate")}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadReport("placement-rate-by-campus")}
                className="h-8 w-8 p-0"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {placementRateByCampus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={placementRateByCampus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="rate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No Data Available
            </div>
          )}
        </Card>

        {/* Department Wise Distribution */}
        <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Overall Department wise Distribution</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExpandChart("department-distribution")}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadReport("department-distribution")}
                className="h-8 w-8 p-0"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {departmentDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No Data Available
            </div>
          )}
                </Card>
                </div>

                {/* Overall Campus Salary/Stipend Chart */}
                <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-gray-900">Overall Campus Statistics</h3>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSalaryView("salary")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  salaryView === "salary"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Salary
              </button>
              <button
                onClick={() => setSalaryView("stipend")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  salaryView === "stipend"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Stipend
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExpandChart("campus-statistics")}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadReport("campus-statistics")}
              className="h-8 w-8 p-0"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {salaryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey={salaryView === "salary" ? "salary" : "stipend"}
                fill={salaryView === "salary" ? "#10b981" : "#f59e0b"}
                radius={[8, 8, 0, 0]}
                name={salaryView === "salary" ? "Salary (LPA)" : "Stipend (K)"}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No Data Available
          </div>
        )}
      </Card>
        </>
      ) : (
        <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-12 text-center shadow-xl">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Report View</h3>
          <p className="text-gray-600 mb-4">Detailed reports will be displayed here based on selected filters.</p>
          <Button
            onClick={() => handleDownloadReport("full-report")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Full Report
                </Button>
              </Card>
            )}

            {/* Expanded Chart Modal */}
            <AnimatePresence>
        {expandedChart && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={handleCloseExpandedChart}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-6xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {expandedChart === "placement-rate" && "Placement Rate by Campus"}
                {expandedChart === "department-distribution" && "Overall Department wise Distribution"}
                {expandedChart === "campus-statistics" && "Overall Campus Statistics"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseExpandedChart}
                className="h-8 w-8 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="h-[600px]">
              {expandedChart === "placement-rate" && placementRateByCampus.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={placementRateByCampus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="rate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {expandedChart === "department-distribution" && departmentDistribution.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {expandedChart === "campus-statistics" && salaryData.length > 0 && (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setSalaryView("salary")}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          salaryView === "salary"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Salary
                      </button>
                      <button
                        onClick={() => setSalaryView("stipend")}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          salaryView === "stipend"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Stipend
                      </button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey={salaryView === "salary" ? "salary" : "stipend"}
                        fill={salaryView === "salary" ? "#10b981" : "#f59e0b"}
                        radius={[8, 8, 0, 0]}
                        name={salaryView === "salary" ? "Salary (LPA)" : "Stipend (K)"}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

