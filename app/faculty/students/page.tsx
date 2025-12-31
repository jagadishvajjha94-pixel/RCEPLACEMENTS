
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Filter, Mail, Phone, Eye, Edit2, Trash2, Upload, Download, User, Award, Briefcase, GraduationCap } from "lucide-react"
import { StudentService } from "@/lib/db-service"
import type { Student } from "@/lib/mock-data"
import { mockStudentPerformance } from "@/lib/mock-data"

const filterOptions = {
  branches: ["CSE", "ECE", "MECH", "CIVIL", "EEE", "AI_ML", "CS", "IOT", "AI_DS", "MBA"],
  sections: ["A", "B", "C", "D"],
  years: ["1st", "2nd", "3rd", "4th"],
}

const allStudents = [
  {
    id: 1,
    name: "Arjun Singh",
    roll: "CSE001",
    cgpa: 8.7,
    email: "arjun@example.com",
    phone: "+91 9876543210",
    branch: "CSE",
    section: "A",
    year: "3rd",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Sharma",
    roll: "CSE002",
    cgpa: 8.9,
    email: "priya@example.com",
    phone: "+91 9876543211",
    branch: "CSE",
    section: "A",
    year: "3rd",
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul Verma",
    roll: "CSE003",
    cgpa: 7.6,
    email: "rahul@example.com",
    phone: "+91 9876543212",
    branch: "CSE",
    section: "A",
    year: "3rd",
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Kumar",
    roll: "CSE004",
    cgpa: 8.2,
    email: "sneha@example.com",
    phone: "+91 9876543213",
    branch: "CSE",
    section: "B",
    year: "3rd",
    status: "Active",
  },
  {
    id: 5,
    name: "Vikram Patel",
    roll: "CSE005",
    cgpa: 7.9,
    email: "vikram@example.com",
    phone: "+91 9876543214",
    branch: "CSE",
    section: "B",
    year: "3rd",
    status: "Inactive",
  },
]


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function ManageStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("CSE")
  const [selectedSection, setSelectedSection] = useState("A")
  const [selectedYear, setSelectedYear] = useState("3rd")
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudents()
  }, [selectedBranch, selectedSection, selectedYear])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const data = await StudentService.getAll({
        branch: selectedBranch,
        section: selectedSection,
        year: selectedYear,
      })
      setStudents(data)
    } catch (error) {
      console.error("Failed to load students:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
    setShowDetailsModal(true)
  }

  const studentPerformance = selectedStudent ? mockStudentPerformance.find(p => p.studentId === selectedStudent.id) : null

  return (
    <div className="p-8 space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">
                Manage Students
              </h1>
              <p className="text-muted-foreground">View and manage student records by branch, section, and year</p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-lg rounded-lg p-6 mb-8"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by name or roll..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Branch</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border"
                  >
                    {filterOptions.branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border"
                  >
                    {filterOptions.sections.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border"
                  >
                    {filterOptions.years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full gap-2 bg-secondary text-secondary-foreground">
                    <Filter className="w-4 h-4" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Students List */}
            <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
              {loading ? (
                <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 text-center">
                  <p>Loading students...</p>
                </Card>
              ) : filteredStudents.length === 0 ? (
                <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 text-center">
                  <p className="text-muted-foreground">No students found</p>
                </Card>
              ) : (
                filteredStudents.map((student) => (
                  <motion.div key={student.id} variants={itemVariants}>
                    <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 hover:shadow-lg transition-all duration-300 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-bold">{student.name}</h3>
                            <Badge
                              className={
                                student.status === "active"
                                  ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                  : student.status === "placed"
                                  ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                  : "bg-red-500/20 text-red-700 dark:text-red-300"
                              }
                            >
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Roll: {student.rollNumber} | CGPA: {student.cgpa} | Branch: {student.branch} | Year: {student.year}
                          </p>
                          <div className="grid md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-secondary" />
                              <span>{student.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-secondary" />
                              <span>{student.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-2 bg-slate-50 dark:bg-slate-800/50"
                            onClick={() => handleViewDetails(student)}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2 bg-slate-50 dark:bg-slate-800/50">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Student Details Modal */}
            <AnimatePresence>
              {showDetailsModal && selectedStudent && (
                <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                  <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6" />
                        {selectedStudent.name} - Student Details
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      {/* Basic Info */}
                      <Card className="bg-slate-50 dark:bg-slate-800/50 p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Basic Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Roll Number:</span>
                            <p className="font-medium">{selectedStudent.rollNumber}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Email:</span>
                            <p className="font-medium">{selectedStudent.email}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Phone:</span>
                            <p className="font-medium">{selectedStudent.phone}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Branch:</span>
                            <p className="font-medium">{selectedStudent.branch}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Section:</span>
                            <p className="font-medium">{selectedStudent.section}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Year:</span>
                            <p className="font-medium">{selectedStudent.year}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CGPA:</span>
                            <p className="font-medium">{selectedStudent.cgpa}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className={selectedStudent.status === "active" ? "bg-green-500/20 text-green-700" : "bg-blue-500/20 text-blue-700"}>
                              {selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </Card>

                      {/* Placement Offers */}
                      {selectedStudent.selectedDrives.length > 0 && (
                        <Card className="bg-slate-50 dark:bg-slate-800/50 p-4">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            Placement Offers ({selectedStudent.selectedDrives.length})
                          </h3>
                          <div className="space-y-2">
                            {selectedStudent.selectedDrives.map((driveId, idx) => (
                              <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-lg border">
                                <p className="font-medium">Offer #{idx + 1}</p>
                                <p className="text-sm text-muted-foreground">Drive ID: {driveId}</p>
                              </div>
                            ))}
                          </div>
                        </Card>
                      )}

                      {/* Academic Performance */}
                      {studentPerformance && (
                        <Card className="bg-slate-50 dark:bg-slate-800/50 p-4">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            Academic Performance
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <span className="text-muted-foreground text-sm">CGPA:</span>
                              <p className="font-bold text-lg">{studentPerformance.cgpa}</p>
                            </div>
                            {studentPerformance.semesterMarks && studentPerformance.semesterMarks.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold mb-2">Semester Marks:</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {studentPerformance.semesterMarks.map((sem, idx) => (
                                    <div key={idx} className="p-2 bg-white dark:bg-slate-900 rounded border">
                                      <p className="text-xs text-muted-foreground">Semester {sem.semester}</p>
                                      <p className="font-medium">{sem.marks}% ({sem.grade})</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      )}

                      {/* Training Performance */}
                      {studentPerformance && studentPerformance.trainingPerformance && (
                        <Card className="bg-slate-50 dark:bg-slate-800/50 p-4">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Training Performance
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <span className="text-muted-foreground text-sm">Average Score:</span>
                              <p className="font-medium">{studentPerformance.trainingPerformance.averageScore}%</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-sm">Completed Trainings:</span>
                              <p className="font-medium">{studentPerformance.trainingPerformance.completedTrainings}</p>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* Assignment Performance */}
                      {studentPerformance && studentPerformance.assignmentPerformance && (
                        <Card className="bg-slate-50 dark:bg-slate-800/50 p-4">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Assignment Performance
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <span className="text-muted-foreground text-sm">Average Score:</span>
                              <p className="font-medium">{studentPerformance.assignmentPerformance.averageScore}%</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-sm">Submitted Assignments:</span>
                              <p className="font-medium">{studentPerformance.assignmentPerformance.submittedAssignments}</p>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </AnimatePresence>
    </div>
  )
}
