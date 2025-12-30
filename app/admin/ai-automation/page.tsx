"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  Bot,
  TrendingUp,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Activity,
  Award,
  Target,
  Zap,
  BarChart3,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AuthService } from "@/lib/auth-service"
import { AIAutomationService, type AutomationReport } from "@/lib/ai-automation-service"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import type { User as AuthUser } from "@/lib/auth-service"

const COLORS = ["#FF8C42", "#2E86AB", "#A23B72", "#F18F01", "#06A77D", "#8b5cf6", "#ef4444"]

export default function AIAutomationPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [latestReport, setLatestReport] = useState<AutomationReport | null>(null)
  const [allReports, setAllReports] = useState<AutomationReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<AutomationReport | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login")
      return
    }
    setUser(currentUser)
    initializeAllMockData()
    
    // Initialize AI automation service
    AIAutomationService.initialize()
    loadReports()
  }, [navigate])

  const loadReports = () => {
    setLoading(true)
    try {
      const reports = AIAutomationService.getAllReports()
      setAllReports(reports)
      setLatestReport(reports.length > 0 ? reports[0] : null)
    } catch (error) {
      console.error("Error loading reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      const report = AIAutomationService.generateDailyReport()
      setLatestReport(report)
      loadReports()
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Failed to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleViewReport = (report: AutomationReport) => {
    setSelectedReport(report)
    setShowReportModal(true)
  }

  const handleDownloadReport = (report: AutomationReport) => {
    const data = JSON.stringify(report, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ai-automation-report-${report.date}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    )
  }

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
                  <div className="flex items-center gap-3 mb-2">
                    <Bot className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                      AI Automation Dashboard
                    </h1>
                  </div>
                  <p className="text-gray-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    Automated daily updates, insights, and comprehensive reports
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={loadReports}
                    variant="outline"
                    className="gap-2 border-slate-700 text-gray-300 hover:bg-slate-800"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>
              </motion.div>

              {latestReport ? (
                <>
                  {/* Latest Report Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700/50 p-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">New Registrations</p>
                          <p className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                            {latestReport.summary.newRegistrations}
                          </p>
                        </div>
                        <Users className="w-10 h-10 text-cyan-400 opacity-70" />
                      </div>
                    </Card>

                    <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700/50 p-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Placements Today</p>
                          <p className="text-2xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
                            {latestReport.summary.placementsToday}
                          </p>
                        </div>
                        <Briefcase className="w-10 h-10 text-green-400 opacity-70" />
                      </div>
                    </Card>

                    <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700/50 p-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Active Drives</p>
                          <p className="text-2xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                            {latestReport.summary.activeDrives}
                          </p>
                        </div>
                        <Target className="w-10 h-10 text-purple-400 opacity-70" />
                      </div>
                    </Card>

                    <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700/50 p-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Completion Rate</p>
                          <p className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                            {latestReport.summary.completionRate.toFixed(1)}%
                          </p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-blue-400 opacity-70" />
                      </div>
                    </Card>
                  </div>

                  {/* Main Content Tabs */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
                      <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">Overview</TabsTrigger>
                      <TabsTrigger value="trends" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">Trends</TabsTrigger>
                      <TabsTrigger value="insights" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">AI Insights</TabsTrigger>
                      <TabsTrigger value="branches" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">Branches</TabsTrigger>
                      <TabsTrigger value="history" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">History</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6 mt-6">
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Daily Activities */}
                        <Card className="bg-slate-800/90 border-slate-700/50 p-6">
                          <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-2">
                            <Activity className="w-5 h-5 text-cyan-400" />
                            Daily Activities
                          </h3>
                          <div className="space-y-3">
                            {latestReport.dailyActivities.map((activity, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50"
                              >
                                <Clock className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-300">{activity.activity}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs border-slate-600 text-gray-400">
                                      {activity.category}
                                    </Badge>
                                    <Badge
                                      className={`text-xs ${
                                        activity.impact === "High"
                                          ? "bg-red-500/20 text-red-400"
                                          : "bg-yellow-500/20 text-yellow-400"
                                      }`}
                                    >
                                      {activity.impact} Impact
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>

                        {/* Alerts & Recommendations */}
                        <Card className="bg-slate-800/90 border-slate-700/50 p-6">
                          <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            Alerts & Recommendations
                          </h3>
                          <div className="space-y-4">
                            {/* Alerts */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">Alerts</h4>
                              <div className="space-y-2">
                                {latestReport.insights.alerts.map((alert, index) => (
                                  <div
                                    key={index}
                                    className={`p-3 rounded-lg border ${
                                      alert.severity === "high"
                                        ? "bg-red-500/10 border-red-500/30"
                                        : alert.severity === "medium"
                                        ? "bg-yellow-500/10 border-yellow-500/30"
                                        : "bg-blue-500/10 border-blue-500/30"
                                    }`}
                                  >
                                    <p className="text-sm font-medium text-white">{alert.type}</p>
                                    <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Recommendations */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">AI Recommendations</h4>
                              <div className="space-y-2">
                                {latestReport.insights.recommendations.map((rec, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-300">{rec}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* Trends Tab */}
                    <TabsContent value="trends" className="space-y-6 mt-6">
                      <div className="grid lg:grid-cols-2 gap-6">
                        <Card className="bg-slate-800/90 border-slate-700/50 p-6">
                          <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                            Registration Trend (7 Days)
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={latestReport.trends.registrationTrend}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                              <XAxis dataKey="date" stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <Tooltip
                                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff" }}
                              />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#06b6d4"
                                strokeWidth={2}
                                name="Registrations"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Card>

                        <Card className="bg-slate-800/90 border-slate-700/50 p-6">
                          <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                            Placement Trend (7 Days)
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={latestReport.trends.placementTrend}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                              <XAxis dataKey="date" stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <Tooltip
                                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff" }}
                              />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Placements"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Card>

                        <Card className="bg-slate-800/90 border-slate-700/50 p-6 lg:col-span-2">
                          <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                            Drive Activity (7 Days)
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={latestReport.trends.driveActivity}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                              <XAxis dataKey="date" stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <Tooltip
                                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff" }}
                              />
                              <Legend />
                              <Bar dataKey="active" fill="#8b5cf6" name="Active" />
                              <Bar dataKey="completed" fill="#10b981" name="Completed" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* AI Insights Tab */}
                    <TabsContent value="insights" className="space-y-6 mt-6">
                      <div className="grid lg:grid-cols-2 gap-6">
                        <Card className="bg-slate-800/90 border-slate-700/50 p-6">
                          <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-400" />
                            Top Performing Branches
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={latestReport.insights.topPerformingBranches}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                              <XAxis dataKey="branch" stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <Tooltip
                                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff" }}
                              />
                              <Legend />
                              <Bar dataKey="placementRate" fill="#06b6d4" name="Placement Rate %" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card>

                        <Card className="bg-slate-800/90 border-slate-700/50 p-6">
                          <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-400" />
                            Top Companies
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={latestReport.insights.topCompanies}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                              <XAxis dataKey="company" angle={-45} textAnchor="end" height={100} stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <Tooltip
                                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff" }}
                              />
                              <Legend />
                              <Bar dataKey="offers" fill="#10b981" name="Offers" />
                              <Bar dataKey="rate" fill="#8b5cf6" name="Success Rate %" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* Branches Tab */}
                    <TabsContent value="branches" className="space-y-6 mt-6">
                      <Card className="bg-slate-800/90 border-slate-700/50 p-6">
                        <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                          Branch-wise Statistics
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left p-3 text-gray-300">Branch</th>
                                <th className="text-right p-3 text-gray-300">Total Students</th>
                                <th className="text-right p-3 text-gray-300">Placed</th>
                                <th className="text-right p-3 text-gray-300">Pending</th>
                                <th className="text-right p-3 text-gray-300">Placement Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {latestReport.branchWiseStats.map((branch, index) => (
                                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                                  <td className="p-3 font-medium text-white">{branch.branch}</td>
                                  <td className="p-3 text-right text-gray-300">{branch.totalStudents}</td>
                                  <td className="p-3 text-right text-green-400 font-semibold">{branch.placed}</td>
                                  <td className="p-3 text-right text-yellow-400">{branch.pending}</td>
                                  <td className="p-3 text-right">
                                    <Badge
                                      className={
                                        branch.rate >= 70
                                          ? "bg-green-500/20 text-green-400"
                                          : branch.rate >= 50
                                          ? "bg-yellow-500/20 text-yellow-400"
                                          : "bg-red-500/20 text-red-400"
                                      }
                                    >
                                      {branch.rate.toFixed(1)}%
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6 mt-6">
                      <Card className="bg-slate-800/90 border-slate-700/50 p-6">
                        <h3 className="text-xl font-bold text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                          Report History
                        </h3>
                        <div className="space-y-3">
                          {allReports.map((report) => (
                            <div
                              key={report.id}
                              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:bg-slate-700 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-cyan-500/20 rounded-lg">
                                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                  <p className="font-semibold text-white">
                                    Report - {new Date(report.date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {report.summary.newRegistrations} registrations • {report.summary.placementsToday} placements • {report.summary.activeDrives} active drives
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleViewReport(report)}
                                  variant="outline"
                                  size="sm"
                                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                                >
                                  View Details
                                </Button>
                                <Button
                                  onClick={() => handleDownloadReport(report)}
                                  variant="outline"
                                  size="sm"
                                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <Card className="bg-slate-800/90 border-slate-700/50 p-12 text-center">
                  <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-2xl font-bold text-white mb-2">No Reports Available</h3>
                  <p className="text-gray-400 mb-6">Generate your first AI automation report to get started</p>
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="gap-2 bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Generate First Report
                      </>
                    )}
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Report Details Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
              Detailed Report - {selectedReport && new Date(selectedReport.date).toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
                <TabsTrigger value="summary" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">Summary</TabsTrigger>
                <TabsTrigger value="trends" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">Trends</TabsTrigger>
                <TabsTrigger value="insights" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">Insights</TabsTrigger>
                <TabsTrigger value="raw" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">Raw Data</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(selectedReport.summary).map(([key, value]: [string, any]) => (
                    <Card key={key} className="p-4 bg-slate-800 border-slate-700">
                      <p className="text-sm text-gray-400 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </p>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4 mt-4">
                <div className="grid lg:grid-cols-2 gap-4">
                  <Card className="p-4 bg-slate-800 border-slate-700">
                    <h4 className="font-semibold mb-4 text-white">Registration Trend</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={selectedReport.trends.registrationTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff" }} />
                        <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-4 bg-slate-800 border-slate-700">
                    <h4 className="font-semibold mb-4 text-white">Placement Trend</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={selectedReport.trends.placementTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff" }} />
                        <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4 mt-4">
                <div className="grid lg:grid-cols-2 gap-4">
                  <Card className="p-4 bg-slate-800 border-slate-700">
                    <h4 className="font-semibold mb-4 text-white">Top Branches</h4>
                    <div className="space-y-2">
                      {selectedReport.insights.topPerformingBranches.map((branch, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                          <span className="text-white">{branch.branch}</span>
                          <Badge className="bg-cyan-500/20 text-cyan-400">{branch.placementRate.toFixed(1)}%</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4 bg-slate-800 border-slate-700">
                    <h4 className="font-semibold mb-4 text-white">Top Companies</h4>
                    <div className="space-y-2">
                      {selectedReport.insights.topCompanies.map((company, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                          <span className="text-white">{company.company}</span>
                          <Badge className="bg-green-500/20 text-green-400">{company.offers} offers</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="raw" className="space-y-4 mt-4">
                <Card className="p-4 bg-slate-800 border-slate-700">
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(selectedReport, null, 2)}
                  </pre>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

