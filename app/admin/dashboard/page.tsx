
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthService } from "@/lib/auth-service"
import { PlacementDriveService, RegistrationService, PlacementAnalyticsService } from "@/lib/placement-service"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import {
  Users,
  CheckCircle2,
  Building2,
  Briefcase,  
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  Activity,
  Target,
  Award,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react"
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
import type { User as AuthUser } from "@/lib/auth-service"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    totalCompanies: 0,
    totalOffers: 0,
    pendingApplications: 0,
    activeDrives: 0,
    averageSalary: 0,
    highestSalary: 0,
    placementRate: 0,
    growthRate: 0,
  })

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login")
      return
    }
    setUser(currentUser)
    initializeAllMockData()
    loadDashboardData()
  }, [navigate])

  const loadDashboardData = () => {
    setLoading(true)
    try {
      const registrations = RegistrationService.getAll()
      const drives = PlacementDriveService.getAll()
      
      const totalStudents = 4000
      const placedStudents = registrations.filter((r) => r.hasOffer).length
      const totalCompanies = new Set(drives.map(d => d.companyName)).size
      const totalOffers = registrations.filter((r) => r.hasOffer).length
      const pendingApplications = registrations.filter((r) => !r.hasOffer).length
      const activeDrives = drives.filter((d) => d.status === "active").length
      const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0
      
      // Calculate salaries (mock for now)
      const averageSalary = 62.5
      const highestSalary = 125.0
      const growthRate = 12.5

      setStats({
        totalStudents,
        placedStudents,
        totalCompanies,
        totalOffers,
        pendingApplications,
        activeDrives,
        averageSalary,
        highestSalary,
        placementRate,
        growthRate,
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Get data for charts
  const upcomingDrives = PlacementDriveService.getAll()
    .filter((drive) => new Date(drive.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5)

  const monthlyData = [
    { month: "Jan", placements: 450, applications: 1200 },
    { month: "Feb", placements: 620, applications: 1900 },
    { month: "Mar", placements: 750, applications: 2200 },
    { month: "Apr", placements: 920, applications: 2800 },
    { month: "May", placements: 1100, applications: 3200 },
    { month: "Jun", placements: 1250, applications: 3500 },
  ]

  const branchData = [
    { name: "CSE", placed: 1150, total: 1200 },
    { name: "ECE", placed: 730, total: 800 },
    { name: "Mech", placed: 520, total: 600 },
    { name: "Civil", placed: 320, total: 400 },
  ]

  const placementStatusData = [
    { name: "Placed", value: stats.placedStudents, color: "#10b981" },
    { name: "Pending", value: stats.pendingApplications, color: "#f59e0b" },
    { name: "Not Applied", value: stats.totalStudents - stats.placedStudents - stats.pendingApplications, color: "#94a3b8" },
  ]

  const topCompanies = [
    { name: "Google", offers: 45, avgSalary: 85 },
    { name: "Microsoft", offers: 38, avgSalary: 78 },
    { name: "Amazon", offers: 42, avgSalary: 82 },
    { name: "Meta", offers: 35, avgSalary: 88 },
    { name: "Apple", offers: 28, avgSalary: 92 },
  ]

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    gradient, 
    trend,
    onClick 
  }: {
    title: string
    value: string | number
    subtitle?: string
    icon: any
    gradient: string
    trend?: { value: number; isPositive: boolean }
    onClick?: () => void
  }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className={`${gradient} border-0 text-white overflow-hidden relative`}>
        <div className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="w-6 h-6" />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium`}>
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          <p className="text-white/90 text-sm font-medium">{title}</p>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
      </Card>
    </motion.div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.name || "Admin"}! 👋
                </h1>
                <p className="text-gray-600">Here's what's happening with placements today.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/drives")}
                  className="gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Manage Drives
                </Button>
                <Button
                  onClick={() => navigate("/admin/analytics")}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Activity className="w-4 h-4" />
                  View Analytics
                </Button>
              </div>
            </motion.div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Students"
                value={stats.totalStudents.toLocaleString()}
                subtitle="Registered in system"
                icon={Users}
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                trend={{ value: stats.growthRate, isPositive: true }}
                onClick={() => navigate("/admin/students")}
              />
              <StatCard
                title="Placed Students"
                value={stats.placedStudents.toLocaleString()}
                subtitle={`${stats.placementRate.toFixed(1)}% placement rate`}
                icon={CheckCircle2}
                gradient="bg-gradient-to-br from-green-500 to-emerald-600"
                trend={{ value: 8.2, isPositive: true }}
                onClick={() => navigate("/admin/analytics")}
              />
              <StatCard
                title="Active Companies"
                value={stats.totalCompanies}
                subtitle={`${stats.activeDrives} active drives`}
                icon={Building2}
                gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                trend={{ value: 5.4, isPositive: true }}
                onClick={() => navigate("/admin/placements")}
              />
              <StatCard
                title="Total Offers"
                value={stats.totalOffers.toLocaleString()}
                subtitle="Job offers extended"
                icon={Briefcase}
                gradient="bg-gradient-to-br from-orange-500 to-red-500"
                trend={{ value: 12.3, isPositive: true }}
                onClick={() => navigate("/admin/offer-statement")}
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-2 border-blue-100 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    +{stats.growthRate}%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  ₹{stats.averageSalary} LPA
                </h3>
                <p className="text-sm text-gray-600">Average Salary</p>
              </Card>

              <Card className="p-6 border-2 border-purple-100 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    +15.2%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  ₹{stats.highestSalary} LPA
                </h3>
                <p className="text-sm text-gray-600">Highest Package</p>
              </Card>

              <Card className="p-6 border-2 border-orange-100 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {stats.pendingApplications}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.activeDrives}
                </h3>
                <p className="text-sm text-gray-600">Active Drives</p>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Placement Trends */}
              <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Placement Trends</h3>
                    <p className="text-sm text-gray-600">Monthly placement activity</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/admin/analytics")}>
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="placements"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      name="Placements"
                    />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      name="Applications"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Placement Status */}
              <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Placement Status</h3>
                    <p className="text-sm text-gray-600">Student distribution</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/admin/analytics")}>
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={placementStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {placementStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {placementStatusData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Branch Performance & Top Companies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Branch Performance */}
              <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Branch Performance</h3>
                    <p className="text-sm text-gray-600">Placement by branch</p>
                  </div>
                  <Target className="w-5 h-5 text-gray-400" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={branchData}>
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
                    <Bar dataKey="placed" fill="#3b82f6" name="Placed" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="total" fill="#cbd5e1" name="Total" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Top Companies */}
              <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Top Companies</h3>
                    <p className="text-sm text-gray-600">Highest offers & packages</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/admin/placements")}>
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {topCompanies.map((company, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer"
                      onClick={() => navigate("/admin/placements")}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{company.name}</h4>
                          <p className="text-sm text-gray-600">{company.offers} offers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{company.avgSalary} LPA</p>
                        <p className="text-xs text-gray-500">Avg Package</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
