import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
} from "recharts"
import {
  TrendingUp,
  Users,
  Award,
  BookOpen,
  FileText,
  Filter,
  Download,
  GraduationCap,
} from "lucide-react"
import { StudentService, TrainingService, AssignmentService } from "@/lib/db-service"
import { mockStudentPerformance } from "@/lib/mock-data"
import type { Student } from "@/lib/mock-data"

const filterOptions = {
  branches: ["CSE", "ECE", "MECH", "CIVIL", "EEE", "AI_ML", "CS", "IOT", "AI_DS", "MBA"],
  sections: ["A", "B", "C", "D"],
  years: ["1st", "2nd", "3rd", "4th"],
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"]

export default function ReportsPage() {
  const [selectedBranch, setSelectedBranch] = useState("CSE")
  const [selectedSection, setSelectedSection] = useState("A")
  const [selectedYear, setSelectedYear] = useState("3rd")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [viewType, setViewType] = useState<"branch" | "section" | "student">("branch")

  useEffect(() => {
    loadData()
  }, [selectedBranch, selectedSection, selectedYear])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await StudentService.getAll({
        branch: selectedBranch,
        section: selectedSection,
        year: selectedYear,
      })
      setStudents(data)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Branch-wise analytics
  const branchWiseData = filterOptions.branches.map((branch) => {
    const branchStudents = students.filter((s) => s.branch === branch)
    const performances = branchStudents
      .map((s) => mockStudentPerformance.find((p) => p.studentId === s.id))
      .filter(Boolean)
    const avgCgpa = performances.length > 0
      ? performances.reduce((sum, p) => sum + (p?.cgpa || 0), 0) / performances.length
      : 0
    const avgTraining = performances.length > 0
      ? performances.reduce((sum, p) => sum + (p?.trainingPerformance.averageScore || 0), 0) / performances.length
      : 0
    const avgAssignment = performances.length > 0
      ? performances.reduce((sum, p) => sum + (p?.assignmentPerformance.averageScore || 0), 0) / performances.length
      : 0

    return {
      branch,
      students: branchStudents.length,
      avgCgpa: Number(avgCgpa.toFixed(2)),
      avgTraining: Number(avgTraining.toFixed(2)),
      avgAssignment: Number(avgAssignment.toFixed(2)),
    }
  })

  // Section-wise analytics
  const sectionWiseData = filterOptions.sections.map((section) => {
    const sectionStudents = students.filter((s) => s.section === section && s.branch === selectedBranch)
    const performances = sectionStudents
      .map((s) => mockStudentPerformance.find((p) => p.studentId === s.id))
      .filter(Boolean)
    const avgCgpa = performances.length > 0
      ? performances.reduce((sum, p) => sum + (p?.cgpa || 0), 0) / performances.length
      : 0
    const avgTraining = performances.length > 0
      ? performances.reduce((sum, p) => sum + (p?.trainingPerformance.averageScore || 0), 0) / performances.length
      : 0
    const avgAssignment = performances.length > 0
      ? performances.reduce((sum, p) => sum + (p?.assignmentPerformance.averageScore || 0), 0) / performances.length
      : 0

    return {
      section,
      students: sectionStudents.length,
      avgCgpa: Number(avgCgpa.toFixed(2)),
      avgTraining: Number(avgTraining.toFixed(2)),
      avgAssignment: Number(avgAssignment.toFixed(2)),
    }
  })

  // Student-wise data
  const studentWiseData = students
    .map((student) => {
      const performance = mockStudentPerformance.find((p) => p.studentId === student.id)
      return {
        ...student,
        performance,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`,
      }
    })
    .filter((s) => s.performance)

  // Pie chart data for branch distribution
  const branchDistribution = branchWiseData.map((b) => ({
    name: b.branch,
    value: b.students,
  }))

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">Comprehensive performance analytics for academics, training, and assignments</p>
        </div>
        <Button className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </motion.div>

      {/* Filters */}
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {filterOptions.branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {filterOptions.sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {filterOptions.years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button className="w-full gap-2 bg-blue-500 hover:bg-blue-600 text-white">
              <Filter className="w-4 h-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* View Type Tabs */}
      <Tabs value={viewType} onValueChange={(v) => setViewType(v as any)}>
        <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg mb-6">
          <TabsTrigger value="branch">Branch-wise</TabsTrigger>
          <TabsTrigger value="section">Section-wise</TabsTrigger>
          <TabsTrigger value="student">Student-wise</TabsTrigger>
        </TabsList>

        {/* Branch-wise Analytics */}
        <TabsContent value="branch" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Branch-wise Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branch" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgCgpa" fill="#3b82f6" name="Avg CGPA" />
                  <Bar dataKey="avgTraining" fill="#8b5cf6" name="Avg Training Score" />
                  <Bar dataKey="avgAssignment" fill="#10b981" name="Avg Assignment Score" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Student Distribution by Branch
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={branchDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {branchDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Branch-wise Performance Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Branch</th>
                    <th className="text-left p-2">Students</th>
                    <th className="text-left p-2">Avg CGPA</th>
                    <th className="text-left p-2">Avg Training Score</th>
                    <th className="text-left p-2">Avg Assignment Score</th>
                  </tr>
                </thead>
                <tbody>
                  {branchWiseData.map((data) => (
                    <tr key={data.branch} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="p-2 font-semibold">{data.branch}</td>
                      <td className="p-2">{data.students}</td>
                      <td className="p-2">
                        <Badge className="bg-blue-500/20 text-blue-700">{data.avgCgpa}</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-purple-500/20 text-purple-700">{data.avgTraining}%</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-green-500/20 text-green-700">{data.avgAssignment}%</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Section-wise Analytics */}
        <TabsContent value="section" className="space-y-6">
          <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Section-wise Performance Comparison ({selectedBranch})
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sectionWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="section" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgCgpa" fill="#3b82f6" name="Avg CGPA" />
                <Bar dataKey="avgTraining" fill="#8b5cf6" name="Avg Training Score" />
                <Bar dataKey="avgAssignment" fill="#10b981" name="Avg Assignment Score" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Section-wise Performance Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Section</th>
                    <th className="text-left p-2">Students</th>
                    <th className="text-left p-2">Avg CGPA</th>
                    <th className="text-left p-2">Avg Training Score</th>
                    <th className="text-left p-2">Avg Assignment Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionWiseData.map((data) => (
                    <tr key={data.section} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="p-2 font-semibold">Section {data.section}</td>
                      <td className="p-2">{data.students}</td>
                      <td className="p-2">
                        <Badge className="bg-blue-500/20 text-blue-700">{data.avgCgpa}</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-purple-500/20 text-purple-700">{data.avgTraining}%</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-green-500/20 text-green-700">{data.avgAssignment}%</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Student-wise Analytics */}
        <TabsContent value="student" className="space-y-6">
          <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Student-wise Performance ({selectedBranch} - Section {selectedSection})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentWiseData.map((student) => (
                <Card
                  key={student.id}
                  className="bg-slate-50 dark:bg-slate-800/50 p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={student.picture}
                      alt={student.name}
                      className="w-16 h-16 rounded-full border-2 border-blue-500"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold">{student.name}</h4>
                      <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                      {student.performance && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">CGPA:</span>
                            <Badge className="bg-blue-500/20 text-blue-700">
                              {student.performance.cgpa}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Training:</span>
                            <Badge className="bg-purple-500/20 text-purple-700">
                              {student.performance.trainingPerformance.averageScore}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Assignment:</span>
                            <Badge className="bg-green-500/20 text-green-700">
                              {student.performance.assignmentPerformance.averageScore}%
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

