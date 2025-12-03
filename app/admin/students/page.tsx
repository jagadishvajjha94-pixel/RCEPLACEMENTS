"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  Upload,
  Users,
  GraduationCap,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AuthService } from "@/lib/auth-service"

export default function StudentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  useEffect(() => {
    if (typeof window === "undefined") return
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
      return
    }
    setUser(currentUser)
    // Load students data
    loadStudents()
  }, [router, selectedBranch, selectedYear])

  const loadStudents = () => {
    // Mock student data
    const mockStudents = [
      {
        id: "1",
        rollNo: "RCE2025001",
        name: "John Doe",
        branch: "CSE",
        year: "2025",
        email: "john.doe@example.com",
        phone: "+91 9876543210",
        cgpa: 8.5,
      },
      {
        id: "2",
        rollNo: "RCE2025002",
        name: "Jane Smith",
        branch: "ECE",
        year: "2025",
        email: "jane.smith@example.com",
        phone: "+91 9876543211",
        cgpa: 8.8,
      },
    ]
    setStudents(mockStudents)
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBranch = selectedBranch === "all" || student.branch === selectedBranch
    const matchesYear = selectedYear === "all" || student.year === selectedYear
    return matchesSearch && matchesBranch && matchesYear
  })

  if (!user) {
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
                <p className="text-gray-600">Manage all student records and information</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import CSV
                </Button>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Student
                </Button>
              </div>
            </motion.div>

            {/* Filters */}
            <Card className="p-4 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-2 border-gray-200 shadow-xl z-[100] opacity-100">
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="MECH">MECH</SelectItem>
                    <SelectItem value="CIVIL">CIVIL</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-2 border-gray-200 shadow-xl z-[100] opacity-100">
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Students Table */}
            <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Roll No</th>
                      <th className="text-left p-3 font-semibold">Name</th>
                      <th className="text-left p-3 font-semibold">Branch</th>
                      <th className="text-left p-3 font-semibold">Year</th>
                      <th className="text-left p-3 font-semibold">Email</th>
                      <th className="text-left p-3 font-semibold">Phone</th>
                      <th className="text-left p-3 font-semibold">CGPA</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{student.rollNo}</td>
                        <td className="p-3">{student.name}</td>
                        <td className="p-3">{student.branch}</td>
                        <td className="p-3">{student.year}</td>
                        <td className="p-3">{student.email}</td>
                        <td className="p-3">{student.phone}</td>
                        <td className="p-3">{student.cgpa}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

