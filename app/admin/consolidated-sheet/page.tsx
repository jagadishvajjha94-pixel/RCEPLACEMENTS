import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileSpreadsheet, Filter, Search } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AuthService } from "@/lib/auth-service"
import { ConsolidatedSheetService, PlacementDriveService, RegistrationService, type ConsolidatedSheet } from "@/lib/placement-service"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import type { User as AuthUser } from "@/lib/auth-service"

const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE", "AIDS", "AI/ML", "Cybersecurity", "IoT", "ServiceNow"]
const academicYears = ["2023-24", "2024-25", "2025-26"]

export default function ConsolidatedSheetPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sheet, setSheet] = useState<ConsolidatedSheet | null>(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    academicYear: "2024-25",
    branch: "",
    minCGPA: "",
    type: "all" as "placement" | "internship" | "hackathon" | "pending" | "all",
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login")
      return
    }
    setUser(currentUser)
    // Initialize mock data if needed
    try {
      initializeAllMockData()
      // Verify data was initialized
      const drives = PlacementDriveService.getAll()
      const registrations = RegistrationService.getAll()
      if (drives.length === 0 || registrations.length === 0) {
        console.warn("Mock data initialization may have failed. Drives:", drives.length, "Registrations:", registrations.length)
      }
    } catch (error) {
      console.error("Error initializing mock data:", error)
    }
  }, [navigate])

  const generateSheet = () => {
    try {
      setLoading(true)
      
      // Ensure mock data is initialized
      const drives = PlacementDriveService.getAll()
      const registrations = RegistrationService.getAll()
      
      if (drives.length === 0 || registrations.length === 0) {
        console.log("Initializing mock data...")
        initializeAllMockData(true) // Force re-initialization
      }
      
      const generatedSheet = ConsolidatedSheetService.generate({
        academicYear: filters.academicYear,
        branch: filters.branch || undefined,
        minCGPA: filters.minCGPA ? parseFloat(filters.minCGPA) : undefined,
        type: filters.type,
      })
      
      setSheet(generatedSheet)
      
      if (generatedSheet.students.length === 0) {
        alert("No students found matching the selected filters. Try adjusting your filters or ensure mock data is initialized.")
      } else {
        console.log(`Generated sheet with ${generatedSheet.students.length} students`)
      }
    } catch (error) {
      console.error("Error generating sheet:", error)
      alert("Failed to generate sheet. Please try again. Error: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!sheet) {
      alert("Please generate a sheet first")
      return
    }
    try {
      if (sheet.students.length === 0) {
        alert("No data to download. Please generate a sheet with data first.")
        return
      }
      ConsolidatedSheetService.downloadExcel(sheet)
      alert("Sheet downloaded successfully!")
    } catch (error) {
      console.error("Error downloading sheet:", error)
      alert("Failed to download sheet. Please try again.")
    }
  }

  const filteredStudents = sheet?.students.filter((student) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.rollNumber.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.companyName?.toLowerCase().includes(searchLower)
    )
  }) || []

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
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
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                  Consolidated Sheet Generator
                </h1>
                <p className="text-muted-foreground">Generate and export placement/internship data with filters</p>
              </div>
            </motion.div>

            {/* Filters */}
            <Card className="glass-lg p-6 mb-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Select
                    value={filters.academicYear}
                    onValueChange={(v) => setFilters({ ...filters, academicYear: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Select
                    value={filters.branch || "all"}
                    onValueChange={(v) => setFilters({ ...filters, branch: v === "all" ? "" : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="minCGPA">Min CGPA</Label>
                  <Input
                    id="minCGPA"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={filters.minCGPA}
                    onChange={(e) => setFilters({ ...filters, minCGPA: e.target.value })}
                    placeholder="e.g., 7.0"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Sheet Type *</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(v) => setFilters({ ...filters, type: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="placement">Placement Sheet</SelectItem>
                      <SelectItem value="internship">Internship Sheet</SelectItem>
                      <SelectItem value="hackathon">Hackathon Sheet</SelectItem>
                      <SelectItem value="pending">Offer Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateSheet} className="gap-2 bg-accent text-accent-foreground">
                  <Filter className="w-4 h-4" />
                  Generate Sheet
                </Button>
                {sheet && (
                  <Button onClick={handleDownload} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Excel
                  </Button>
                )}
              </div>
            </Card>

            {/* Results */}
            {loading ? (
              <Card className="glass-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
                <p className="mt-4 text-muted-foreground">Generating consolidated sheet...</p>
              </Card>
            ) : sheet ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {sheet.type.charAt(0).toUpperCase() + sheet.type.slice(1)} Sheet - {sheet.academicYear}
                    </h2>
                    <p className="text-muted-foreground">
                      {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>

                <Card className="glass-lg p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Roll Number</th>
                          <th className="text-left p-3">Branch</th>
                          <th className="text-left p-3">Year</th>
                          <th className="text-right p-3">CGPA</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Phone</th>
                          <th className="text-left p-3">Company</th>
                          <th className="text-left p-3">Package</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-right p-3">Multiple Offers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-3 font-medium">{student.name}</td>
                            <td className="p-3">{student.rollNumber}</td>
                            <td className="p-3">{student.branch}</td>
                            <td className="p-3">{student.year}</td>
                            <td className="p-3 text-right">{student.cgpa}</td>
                            <td className="p-3 text-sm">{student.email}</td>
                            <td className="p-3">{student.phone}</td>
                            <td className="p-3">{student.companyName || "N/A"}</td>
                            <td className="p-3">{student.package || "N/A"}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  student.offerStatus === "Placed"
                                    ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                    : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                                }`}
                              >
                                {student.offerStatus || "Pending"}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {student.multipleOffers && student.multipleOffers > 1 ? (
                                <span className="font-semibold text-accent">{student.multipleOffers}</span>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="glass-lg p-12 text-center">
                <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Sheet Generated</h3>
                <p className="text-muted-foreground mb-4">
                  Configure filters and click "Generate Sheet" to create a consolidated report
                </p>
              </Card>
            )}
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}

