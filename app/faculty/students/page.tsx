"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Mail, Phone, Eye, Edit2, Trash2, Upload, Download } from "lucide-react"
import { useRef } from "react"

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

const branches = ["CSE", "ECE", "Mechanical", "Civil"]
const sections = ["A", "B", "C"]
const years = ["1st", "2nd", "3rd", "4th"]

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

  const filteredStudents = allStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilters =
      student.branch === selectedBranch && student.section === selectedSection && student.year === selectedYear
    return matchesSearch && matchesFilters
  })

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
                    {branches.map((b) => (
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
                    {sections.map((s) => (
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
                    {years.map((y) => (
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
              {filteredStudents.map((student) => (
                <motion.div key={student.id} variants={itemVariants}>
                  <Card className="glass-lg p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold">{student.name}</h3>
                          <Badge
                            className={
                              student.status === "Active"
                                ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                : "bg-red-500/20 text-red-700 dark:text-red-300"
                            }
                          >
                            {student.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Roll: {student.roll} | CGPA: {student.cgpa}
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
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 text-destructive hover:bg-destructive/10 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredStudents.length === 0 && (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-muted-foreground text-lg">No students found</p>
              </motion.div>
            )}
    </div>
  )
}
