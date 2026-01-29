
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  FileText,
  Filter,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Award,
  Briefcase,
  X,
} from "lucide-react"
import { StudentService, TrainingService, AssignmentService, FacultyStatsService } from "@/lib/db-service"
import { AuthService } from "@/lib/auth-service"
import type { Student, Training, Assignment } from "@/lib/mock-data"
import type { User as AuthUser } from "@/lib/auth-service"

const filterOptions = {
  branch: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "AIDS", "AI/ML", "Cybersecurity", "IoT", "ServiceNow"],
  section: ["A", "B", "C"],
  year: ["1st", "2nd", "3rd", "4th"],
}

export default function FacultyDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [selectedBranch, setSelectedBranch] = useState("CSE")
  const [selectedSection, setSelectedSection] = useState("A")
  const [selectedYear, setSelectedYear] = useState("3rd")
  const [students, setStudents] = useState<Student[]>([])
  const [trainings, setTrainings] = useState<Training[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [facultyStats, setFacultyStats] = useState({
    totalStudents: 0,
    ongoingTrainings: 0,
    assignmentsPending: 0,
    avgAttendance: 89,
  })
  const [branchStats, setBranchStats] = useState<{ branch: string; count: number }[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showStudentModal, setShowStudentModal] = useState(false)

  // Modal states
  const [showNewTraining, setShowNewTraining] = useState(false)
  const [showNewAssignment, setShowNewAssignment] = useState(false)
  const [editingTraining, setEditingTraining] = useState<Training | null>(null)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  
  // Form states
  const [trainingForm, setTrainingForm] = useState({
    title: "",
    topic: "",
    date: "",
    time: "",
    location: "",
    instructor: user?.name || "",
  })
  
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subject: "",
    description: "",
    dueDate: "",
    totalMarks: 100,
  })

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "faculty") {
      navigate("/login")
      return
    }

    setUser(currentUser)
    loadData()
  }, [navigate])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [selectedBranch, selectedSection, selectedYear])

  const loadData = async () => {
    setLoading(true)
    try {
      const [studentsData, trainingsData, assignmentsData, stats] = await Promise.all([
        StudentService.getAll({ branch: selectedBranch, section: selectedSection, year: selectedYear }),
        TrainingService.getAll({ branch: selectedBranch, section: selectedSection, year: selectedYear }),
        AssignmentService.getAll({ branch: selectedBranch, section: selectedSection, year: selectedYear }),
        FacultyStatsService.getOverview(selectedBranch, selectedSection, selectedYear),
      ])

      setStudents(studentsData)
      setTrainings(trainingsData)
      setAssignments(assignmentsData)
      setFacultyStats(stats)
      
      // Calculate branch-wise statistics for graphs
      const branchCounts: { [key: string]: number } = {}
      studentsData.forEach(student => {
        branchCounts[student.branch] = (branchCounts[student.branch] || 0) + 1
      })
      setBranchStats(Object.entries(branchCounts).map(([branch, count]) => ({ branch, count })))
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    AuthService.logout()
    navigate("/login")
  }

  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTraining) {
        await TrainingService.update(editingTraining.id, {
          title: trainingForm.title,
          topic: trainingForm.topic,
          date: trainingForm.date,
          time: trainingForm.time,
          location: trainingForm.location,
          instructor: trainingForm.instructor,
          status: new Date(trainingForm.date) > new Date() ? "upcoming" : "ongoing",
        })
        setEditingTraining(null)
      } else {
        await TrainingService.create({
          title: trainingForm.title,
          topic: trainingForm.topic,
          language: "English",
          date: trainingForm.date,
          time: trainingForm.time,
          location: trainingForm.location,
          branch: selectedBranch,
          section: selectedSection,
          year: selectedYear,
          syllabusCovered: [],
          instructor: trainingForm.instructor,
          status: new Date(trainingForm.date) > new Date() ? "upcoming" : "ongoing",
        })
      }
      setTrainingForm({ title: "", topic: "", date: "", time: "", location: "", instructor: user?.name || "" })
      setShowNewTraining(false)
      loadData()
    } catch (error) {
      console.error("Error saving training:", error)
      alert("Failed to save training. Please try again.")
    }
  }

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingAssignment) {
        // Update assignment (if update method exists)
        await AssignmentService.create({
          title: assignmentForm.title,
          subject: assignmentForm.subject,
          description: assignmentForm.description,
          dueDate: assignmentForm.dueDate,
          totalMarks: assignmentForm.totalMarks,
          uploadedBy: user?.id || "",
          branch: selectedBranch,
          section: selectedSection,
          year: selectedYear,
        })
        setEditingAssignment(null)
      } else {
        await AssignmentService.create({
          title: assignmentForm.title,
          subject: assignmentForm.subject,
          description: assignmentForm.description,
          dueDate: assignmentForm.dueDate,
          totalMarks: assignmentForm.totalMarks,
          uploadedBy: user?.id || "",
          branch: selectedBranch,
          section: selectedSection,
          year: selectedYear,
        })
      }
      setAssignmentForm({ title: "", subject: "", description: "", dueDate: "", totalMarks: 100 })
      setShowNewAssignment(false)
      loadData()
    } catch (error) {
      console.error("Error saving assignment:", error)
      alert("Failed to save assignment. Please try again.")
    }
  }

  const handleEditTraining = (training: Training) => {
    setTrainingForm({
      title: training.title,
      topic: training.topic,
      date: training.date,
      time: training.time,
      location: training.location,
      instructor: training.instructor,
    })
    setEditingTraining(training)
    setShowNewTraining(true)
  }

  const handleDeleteTraining = async (id: string) => {
    if (confirm("Are you sure you want to delete this training?")) {
      try {
        await TrainingService.update(id, { status: "completed" as any })
        loadData()
      } catch (error) {
        console.error("Error deleting training:", error)
        alert("Failed to delete training.")
      }
    }
  }

  const handleEditAssignment = (assignment: Assignment) => {
    setAssignmentForm({
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description,
      dueDate: assignment.dueDate,
      totalMarks: assignment.totalMarks,
    })
    setEditingAssignment(assignment)
    setShowNewAssignment(true)
  }

  const handleDeleteAssignment = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await AssignmentService.delete(id)
        loadData()
      } catch (error) {
        console.error("Error deleting assignment:", error)
        alert("Failed to delete assignment.")
      }
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || "Faculty"}! 👋
            </h1>
            <p className="text-gray-600">Manage students, track progress, and empower learning</p>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-gray-900 overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl ">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{facultyStats.totalStudents}</h3>
                <p className="text-gray-900 text-sm font-medium">Total Students</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-gray-900 overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl ">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{facultyStats.ongoingTrainings}</h3>
                <p className="text-gray-900 text-sm font-medium">Active Trainings</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-gray-900 overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl ">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{facultyStats.assignmentsPending}</h3>
                <p className="text-gray-900 text-sm font-medium">Assignments</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 text-gray-900 overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl ">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{facultyStats.avgAttendance}%</h3>
                <p className="text-gray-900 text-sm font-medium">Avg Attendance</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Filters */}
        <motion.div
          className="border border-gray-200 bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-600" />
            Filter Students
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                {filterOptions.branch.map((b) => (
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
                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                {filterOptions.section.map((s) => (
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
                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                {filterOptions.year.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
            <p className="text-sm font-medium text-emerald-700">
              📊 Showing: {selectedBranch} - Section {selectedSection} - {selectedYear} Year ({students.length} students)
            </p>
          </div>
        </motion.div>

        {/* Graphical Visualizations */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Branch Distribution Chart */}
          <Card className="bg-white border border-slate-200/70 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Branch Distribution
              </h3>
            </div>
            <div className="space-y-3">
              {branchStats.map((stat, index) => {
                const maxCount = Math.max(...branchStats.map(s => s.count), 1)
                const percentage = (stat.count / maxCount) * 100
                return (
                  <div key={stat.branch} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{stat.branch}</span>
                      <span className="text-gray-600">{stat.count} students</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Performance Overview */}
          <Card className="bg-white border border-slate-200/70 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Performance Overview
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Total Students</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{facultyStats.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Active Trainings</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{facultyStats.ongoingTrainings}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Assignments</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">{facultyStats.assignmentsPending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Avg Attendance</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">{facultyStats.avgAttendance}%</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Tabs - Resources tab removed */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 border border-gray-200">
            <TabsTrigger value="students">Student List</TabsTrigger>
            <TabsTrigger value="trainings">Trainings</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4 mt-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
              <Input
                placeholder="Search students by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border shadow-sm"
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
                <p className="mt-4 text-gray-600">Loading students...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    whileHover={{ x: 4 }}
                  >
                    <Card className="border border-gray-200 bg-white p-6 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{student.name}</h3>
                          <Badge
                            className={
                              student.status === "placed"
                                ? "bg-green-500/20 text-green-700"
                                : "bg-blue-500/20 text-blue-700"
                            }
                          >
                            {student.status === "placed" ? "✓ Placed" : "Active"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Roll Number</p>
                            <p className="font-semibold">{student.rollNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">CGPA</p>
                            <p className="font-semibold">{student.cgpa}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-semibold text-xs">{student.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Applications</p>
                            <p className="font-semibold">{student.appliedDrives.length}</p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => {
                          setSelectedStudent(student)
                          setShowStudentModal(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trainings" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Active Trainings</h3>
              <Button
                onClick={() => setShowNewTraining(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                New Training
              </Button>
            </div>

            {trainings.length > 0 ? (
              <div className="space-y-3">
                {trainings.map((training) => (
                  <Card
                    key={training.id}
                    className="border-0 shadow-sm bg-white p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{training.title}</h3>
                          <Badge
                            className={
                              training.status === "ongoing"
                                ? "bg-green-500/20 text-green-700"
                                : training.status === "upcoming"
                                  ? "bg-blue-500/20 text-blue-700"
                                  : "bg-gray-500/20 text-gray-700"
                            }
                          >
                            {training.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{training.topic}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Date & Time</p>
                            <p className="font-semibold">{new Date(training.date).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-600">{training.time}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Location</p>
                            <p className="font-semibold">{training.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Instructor</p>
                            <p className="font-semibold">{training.instructor}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditTraining(training)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteTraining(training.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-gray-200 bg-white p-12 text-center shadow-sm">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600">No trainings scheduled. Create one to get started!</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Assignments</h3>
              <Button
                onClick={() => setShowNewAssignment(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                New Assignment
              </Button>
            </div>

            {assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    className="border-0 shadow-sm bg-white p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{assignment.title}</h3>
                        <p className="text-gray-600 mb-3">{assignment.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Subject</p>
                            <p className="font-semibold">{assignment.subject}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Due Date</p>
                            <p className="font-semibold">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Marks</p>
                            <p className="font-semibold">{assignment.totalMarks}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditAssignment(assignment)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteAssignment(assignment.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-gray-200 bg-white p-12 text-center shadow-sm">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600">No assignments created. Add one to get started!</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

      {/* New Training Modal */}
      <AnimatePresence>
        {showNewTraining && (
          <motion.div
            className="fixed inset-0 bg-black/60  flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewTraining(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-sm max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6">{editingTraining ? "Edit Training" : "Create New Training"}</h2>
              <form onSubmit={handleCreateTraining} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Training Title</label>
                  <Input 
                    placeholder="e.g., Full Stack Development Workshop" 
                    value={trainingForm.title}
                    onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Topic</label>
                  <Input 
                    placeholder="e.g., React & Node.js Fundamentals" 
                    value={trainingForm.topic}
                    onChange={(e) => setTrainingForm({ ...trainingForm, topic: e.target.value })}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Date</label>
                    <Input 
                      type="date" 
                      value={trainingForm.date}
                      onChange={(e) => setTrainingForm({ ...trainingForm, date: e.target.value })}
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Time</label>
                    <Input 
                      type="time" 
                      value={trainingForm.time}
                      onChange={(e) => setTrainingForm({ ...trainingForm, time: e.target.value })}
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Location</label>
                  <Input 
                    placeholder="e.g., Lab 1, A Building" 
                    value={trainingForm.location}
                    onChange={(e) => setTrainingForm({ ...trainingForm, location: e.target.value })}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Instructor</label>
                  <Input 
                    placeholder="Instructor name" 
                    value={trainingForm.instructor}
                    onChange={(e) => setTrainingForm({ ...trainingForm, instructor: e.target.value })}
                    required 
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewTraining(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {editingTraining ? "Update Training" : "Create Training"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Assignment Modal */}
      <AnimatePresence>
        {showNewAssignment && (
          <motion.div
            className="fixed inset-0 bg-black/60  flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewAssignment(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-sm max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6">{editingAssignment ? "Edit Assignment" : "Create New Assignment"}</h2>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Assignment Title</label>
                  <Input 
                    placeholder="e.g., Web Development Project" 
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Subject</label>
                  <Input 
                    placeholder="e.g., Full Stack Development" 
                    value={assignmentForm.subject}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Description</label>
                  <Textarea 
                    placeholder="Describe the assignment requirements..." 
                    className="h-32" 
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Due Date</label>
                    <Input 
                      type="date" 
                      value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Total Marks</label>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      value={assignmentForm.totalMarks}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, totalMarks: parseInt(e.target.value) || 100 })}
                      required 
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowNewAssignment(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {editingAssignment ? "Update Assignment" : "Create Assignment"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Performance Modal */}
      <AnimatePresence>
        {showStudentModal && selectedStudent && (
          <motion.div
            className="fixed inset-0 bg-black/60  flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStudentModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-sm max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Student Performance Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowStudentModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Student Basic Info */}
                <Card className="p-6 bg-slate-50">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Student Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Roll Number</p>
                      <p className="font-semibold">{selectedStudent.rollNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{selectedStudent.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CGPA</p>
                      <p className="font-semibold">{selectedStudent.cgpa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Branch</p>
                      <p className="font-semibold">{selectedStudent.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Section</p>
                      <p className="font-semibold">{selectedStudent.section}</p>
                    </div>
                  </div>
                </Card>

                {/* Offers Received */}
                <Card className="p-6 bg-green-50">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Job Offers
                  </h3>
                  {selectedStudent.selectedDrives.length > 0 ? (
                    <div className="space-y-3">
                      {selectedStudent.selectedDrives.map((driveId, index) => {
                        // In real app, fetch drive details
                        return (
                          <div key={index} className="p-4 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">Offer #{index + 1}</p>
                                <p className="text-sm text-gray-600">Drive ID: {driveId}</p>
                              </div>
                              <Badge className="bg-green-500/20 text-green-700">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Selected
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-600">No offers received yet.</p>
                  )}
                </Card>

                {/* Performance Metrics */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Metrics
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Applications</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedStudent.appliedDrives.length}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Offers</p>
                      <p className="text-2xl font-bold text-green-600">{selectedStudent.selectedDrives.length}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">CGPA</p>
                      <p className="text-2xl font-bold text-purple-600">{selectedStudent.cgpa}</p>
                    </div>
                  </div>
                </Card>

                {/* Semester Performance */}
                {selectedStudent.semesterMarks && selectedStudent.semesterMarks.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Semester Performance</h3>
                    <div className="space-y-2">
                      {selectedStudent.semesterMarks.map((sem, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-semibold">Semester {sem.semester}</p>
                            <p className="text-sm text-gray-600">Grade: {sem.grade}</p>
                          </div>
                          <p className="text-lg font-bold">{sem.marks}%</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}