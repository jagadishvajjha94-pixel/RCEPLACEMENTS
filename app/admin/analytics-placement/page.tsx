"use client"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { Download, Calendar, TrendingUp, Users, Award, Building, Filter } from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import { PlacementAnalyticsService, ConsolidatedSheetService } from "@/lib/placement-service"
import { AdminSidebar } from "@/components/admin-sidebar"

const COLORS = ["#FF8C42", "#2E86AB", "#A23B72", "#F18F01", "#6A4C93"]

export default function AnalyticsPlacementPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ id: string; role: string } | null>(null)
  const [stats, setStats] = useState<ReturnType<typeof PlacementAnalyticsService.getStats> | null>(null)
  const [trendData, setTrendData] = useState<Array<{ month: string; placements: number; internships: number }>>([])
  const [offerStatement, setOfferStatement] = useState<ReturnType<typeof PlacementAnalyticsService.getOfferStatement> | null>(null)
  const [selectedYear, setSelectedYear] = useState("2024-25")
  const [selectedBranch, setSelectedBranch] = useState<string>("all")

  // Consolidated sheet filters
  const [sheetFilters, setSheetFilters] = useState({
    academicYear: "2024-25",
    branch: "",
    minCGPA: 0,
    type: "all" as "placement" | "internship" | "hackathon" | "pending" | "all",
  })

  const loadAnalytics = useCallback(() => {
    const filters = selectedBranch !== "all" ? { branch: selectedBranch } : undefined
    const analyticsStats = PlacementAnalyticsService.getStats(filters)
    const trend = PlacementAnalyticsService.getPlacementTrend(selectedYear)
    const offers = PlacementAnalyticsService.getOfferStatement()

    setStats(analyticsStats)
    setTrendData(trend)
    setOfferStatement(offers)
  }, [selectedBranch, selectedYear])

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login")
      return
    }
    setUser(currentUser)
    loadAnalytics()
  }, [navigate, loadAnalytics])

  const handleDownloadConsolidatedSheet = () => {
    const sheet = ConsolidatedSheetService.generate(sheetFilters)
    ConsolidatedSheetService.downloadExcel(sheet)
  }

  if (!user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-72 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          <div className="p-4 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                  Placement Analytics
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive analytics, reports, and consolidated sheets
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="px-4 py-2 rounded-lg border bg-background"
                >
                  <option value="all">All Branches</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="EEE">EEE</option>
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 rounded-lg border bg-background"
                >
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                  <option value="2022-23">2022-23</option>
                </select>
              </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[
                {
                  label: "Total Students",
                  value: stats.totalStudents,
                  icon: Users,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  label: "Placed",
                  value: stats.placedStudents,
                  icon: Award,
                  color: "from-green-500 to-emerald-500",
                },
                {
                  label: "Internships",
                  value: stats.internshipStudents,
                  icon: Building,
                  color: "from-orange-500 to-red-500",
                },
                {
                  label: "Placement Rate",
                  value: `${stats.placementRate}%`,
                  icon: TrendingUp,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  label: "Avg Package",
                  value: `${stats.averagePackage} LPA`,
                  icon: TrendingUp,
                  color: "from-indigo-500 to-blue-500",
                },
              ].map((metric, index) => {
                const Icon = metric.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass-lg p-4 hover:shadow-lg transition-all">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-10 flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="glass-lg mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="yearwise">Year-wise</TabsTrigger>
                <TabsTrigger value="branchwise">Branch-wise</TabsTrigger>
                <TabsTrigger value="drivewise">Drive-wise</TabsTrigger>
                <TabsTrigger value="offers">Offer Statement</TabsTrigger>
                <TabsTrigger value="consolidated">Consolidated Sheet</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Placement Trend */}
                  <Card className="glass-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Placement & Internship Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="currentColor" />
                        <YAxis stroke="currentColor" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0,0,0,0.8)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="placements" stroke="#2E86AB" strokeWidth={2} />
                        <Line type="monotone" dataKey="internships" stroke="#FF8C42" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Branch Distribution */}
                  <Card className="glass-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Branch-wise Placement Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.branchWiseStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.name}: ${entry.percentage || 0}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="placed"
                        >
                          {stats.branchWiseStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </TabsContent>

              {/* Year-wise Tab */}
              <TabsContent value="yearwise">
                <Card className="glass-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Year-wise Placement Statistics</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stats.yearWiseStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="currentColor" />
                      <YAxis stroke="currentColor" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="total" fill="#A23B72" name="Total Students" />
                      <Bar dataKey="placed" fill="#2E86AB" name="Placed" />
                      <Bar dataKey="internships" fill="#FF8C42" name="Internships" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="grid md:grid-cols-4 gap-4 mt-6">
                    {stats.yearWiseStats.map((yearData) => (
                      <Card key={yearData.year} className="p-4 bg-background/50">
                        <h4 className="font-semibold mb-3">{yearData.year} Year</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-semibold">{yearData.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Placed:</span>
                            <span className="font-semibold text-green-600">{yearData.placed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Internships:</span>
                            <span className="font-semibold text-orange-600">{yearData.internships}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rate:</span>
                            <span className="font-semibold">
                              {Math.round((yearData.placed / yearData.total) * 100)}%
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Branch-wise Tab */}
              <TabsContent value="branchwise">
                <Card className="glass-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Branch-wise Placement Percentage</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stats.branchWiseStats} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" stroke="currentColor" />
                      <YAxis dataKey="branch" type="category" stroke="currentColor" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="percentage" fill="#2E86AB" name="Placement %" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    {stats.branchWiseStats.map((branchData) => (
                      <Card key={branchData.branch} className="p-4 bg-background/50">
                        <h4 className="font-semibold mb-3">{branchData.branch}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Students:</span>
                            <span className="font-semibold">{branchData.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Placed:</span>
                            <span className="font-semibold text-green-600">{branchData.placed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Percentage:</span>
                            <span className="font-semibold text-accent">{branchData.percentage}%</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Drive-wise Tab */}
              <TabsContent value="drivewise">
                <Card className="glass-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Drive-wise Placement Data</h3>
                  <div className="space-y-3">
                    {stats.driveWiseStats.map((drive, index) => (
                      <Card key={index} className="p-4 bg-background/50">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{drive.driveName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {drive.totalApplicants} applicants • {drive.placed} placed
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-accent">
                              {drive.totalApplicants > 0
                                ? Math.round((drive.placed / drive.totalApplicants) * 100)
                                : 0}
                              %
                            </p>
                            <p className="text-xs text-muted-foreground">Success Rate</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Offer Statement Tab */}
              <TabsContent value="offers">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="glass-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Offer Statement Overview</h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Single Offer</p>
                        <p className="text-4xl font-bold text-green-600">{offerStatement?.singleOffer || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Multiple Offers</p>
                        <p className="text-4xl font-bold text-purple-600">{offerStatement?.multipleOffers || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Total Placed</p>
                        <p className="text-4xl font-bold text-accent">
                          {(offerStatement?.singleOffer || 0) + (offerStatement?.multipleOffers || 0)}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="glass-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Branch-wise Offer Breakdown</h3>
                    <div className="space-y-3">
                      {offerStatement?.branchWise.map((branch) => (
                        <Card key={branch.branch} className="p-4 bg-background/50">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">{branch.branch}</h4>
                            <span className="text-sm font-semibold">
                              {branch.single + branch.multiple} total
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Single Offer</p>
                              <p className="text-xl font-bold text-green-600">{branch.single}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Multiple Offers</p>
                              <p className="text-xl font-bold text-purple-600">{branch.multiple}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Consolidated Sheet Tab */}
              <TabsContent value="consolidated">
                <Card className="glass-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Generate Consolidated Sheet</h3>
                  <p className="text-muted-foreground mb-6">
                    Generate and download comprehensive placement/internship sheets with custom filters
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Academic Year</label>
                      <select
                        value={sheetFilters.academicYear}
                        onChange={(e) => setSheetFilters({ ...sheetFilters, academicYear: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border bg-background"
                      >
                        <option value="2024-25">2024-25</option>
                        <option value="2023-24">2023-24</option>
                        <option value="2022-23">2022-23</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block">Branch</label>
                      <select
                        value={sheetFilters.branch}
                        onChange={(e) => setSheetFilters({ ...sheetFilters, branch: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border bg-background"
                      >
                        <option value="">All Branches</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="EEE">EEE</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block">Minimum CGPA</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={sheetFilters.minCGPA}
                        onChange={(e) =>
                          setSheetFilters({ ...sheetFilters, minCGPA: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="7.0"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block">Sheet Type</label>
                      <select
                        value={sheetFilters.type}
                        onChange={(e) => setSheetFilters({ ...sheetFilters, type: e.target.value as typeof sheetFilters.type })}
                        className="w-full px-3 py-2 rounded-lg border bg-background"
                      >
                        <option value="all">Complete Student List</option>
                        <option value="placement">Placement Sheet</option>
                        <option value="internship">Internship Sheet</option>
                        <option value="hackathon">Hackathon Sheet</option>
                        <option value="pending">Offer Pending Submission</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleDownloadConsolidatedSheet}
                    className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Download className="w-4 h-4" />
                    Download Consolidated Sheet (Excel)
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}