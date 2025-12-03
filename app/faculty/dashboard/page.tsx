"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import { StudentService, TrainingService, AssignmentService, FacultyStatsService } from "@/lib/db-service"
import { AuthService } from "@/lib/auth-service"
import type { Student, Training, Assignment } from "@/lib/mock-data"
import type { User as AuthUser } from "@/lib/auth-service"

const filterOptions = {
  branch: ["CSE", "ECE", "Mechanical", "Civil", "EEE"],
  section: ["A", "B", "C"],
  year: ["1st", "2nd", "3rd", "4th"],
}

export default function FacultyDashboard() {
  const router = useRouter()
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

  // Modal states
  const [showNewTraining, setShowNewTraining] = useState(false)
  const [showNewAssignment, setShowNewAssignment] = useState(false)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "faculty") {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadData()
  }, [router])

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
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    AuthService.logout()
    router.push("/login")
  }

  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement training creation
    setShowNewTraining(false)
    loadData()
  }

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement assignment creation
    setShowNewAssignment(false)
    loadData()
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
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{facultyStats.totalStudents}</h3>
                <p className="text-white/90 text-sm font-medium">Total Students</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{facultyStats.ongoingTrainings}</h3>
                <p className="text-white/90 text-sm font-medium">Active Trainings</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{facultyStats.assignmentsPending}</h3>
                <p className="text-white/90 text-sm font-medium">Assignments</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 text-white overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{facultyStats.avgAttendance}%</h3>
                <p className="text-white/90 text-sm font-medium">Avg Attendance</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Filters */}
        <motion.div
          className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
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
                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all"
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
                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all"
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
                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                {filterOptions.year.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              📊 Showing: {selectedBranch} - Section {selectedSection} - {selectedYear} Year ({students.length} students)
            </p>
          </div>
        </motion.div>

        {/* Enhanced Tabs - Resources tab removed */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
            <TabsTrigger value="students">Student List</TabsTrigger>
            <TabsTrigger value="trainings">Trainings</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4 mt-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search students by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border shadow-sm"
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
                <p className="mt-4 text-muted-foreground">Loading students...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    whileHover={{ x: 4 }}
                  >
                    <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-6 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{student.name}</h3>
                          <Badge
                            className={
                              student.status === "placed"
                                ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                : "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                            }
                          >
                            {student.status === "placed" ? "✓ Placed" : "Active"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Roll Number</p>
                            <p className="font-semibold">{student.rollNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">CGPA</p>
                            <p className="font-semibold">{student.cgpa}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-semibold text-xs">{student.email}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Applications</p>
                            <p className="font-semibold">{student.appliedDrives.length}</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
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
                    className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6"
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
                        <p className="text-muted-foreground mb-3">{training.topic}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Date & Time</p>
                            <p className="font-semibold">{new Date(training.date).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">{training.time}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-semibold">{training.location}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Instructor</p>
                            <p className="font-semibold">{training.instructor}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-12 text-center shadow-xl">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No trainings scheduled. Create one to get started!</p>
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
                    className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{assignment.title}</h3>
                        <p className="text-muted-foreground mb-3">{assignment.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Subject</p>
                            <p className="font-semibold">{assignment.subject}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Due Date</p>
                            <p className="font-semibold">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Marks</p>
                            <p className="font-semibold">{assignment.totalMarks}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-gray-100 bg-white/80 backdrop-blur-sm p-12 text-center shadow-xl">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assignments created. Add one to get started!</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

      {/* New Training Modal */}
      <AnimatePresence>
        {showNewTraining && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewTraining(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6">Create New Training</h2>
              <form onSubmit={handleCreateTraining} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Training Title</label>
                  <Input placeholder="e.g., Full Stack Development Workshop" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Topic</label>
                  <Input placeholder="e.g., React & Node.js Fundamentals" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Date</label>
                    <Input type="date" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Time</label>
                    <Input type="time" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Location</label>
                  <Input placeholder="e.g., Lab 1, A Building" required />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewTraining(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    Create Training
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewAssignment(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6">Create New Assignment</h2>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Assignment Title</label>
                  <Input placeholder="e.g., Web Development Project" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Subject</label>
                  <Input placeholder="e.g., Full Stack Development" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Description</label>
                  <Textarea placeholder="Describe the assignment requirements..." className="h-32" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Due Date</label>
                    <Input type="date" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Total Marks</label>
                    <Input type="number" placeholder="100" required />
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
                    Create Assignment
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}