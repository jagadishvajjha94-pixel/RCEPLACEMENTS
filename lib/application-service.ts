// Service for managing student applications and CSV export
export interface ApplicationData {
  id: string
  studentId: string
  studentName: string
  rollNumber: string
  branch: string
  year: string
  email: string
  phone: string
  linkedin?: string
  github?: string
  driveId: string
  companyName: string
  companyRole: string
  companyPortalUrl?: string
  appliedAt: string
  status: "pending" | "submitted" | "redirected"
}

export class ApplicationService {
  private static APPLICATIONS_KEY = "rce_applications"

  static getAll(): ApplicationData[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.APPLICATIONS_KEY)
    return data ? JSON.parse(data) : []
  }

  static save(applications: ApplicationData[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.APPLICATIONS_KEY, JSON.stringify(applications))
  }

  static submitApplication(data: Omit<ApplicationData, "id" | "appliedAt" | "status">): ApplicationData {
    const applications = this.getAll()
    
    const newApplication: ApplicationData = {
      ...data,
      id: `APP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      appliedAt: new Date().toISOString(),
      status: "pending",
    }

    applications.push(newApplication)
    this.save(applications)
    return newApplication
  }

  static updateStatus(id: string, status: ApplicationData["status"]) {
    const applications = this.getAll()
    const index = applications.findIndex(app => app.id === id)
    
    if (index !== -1) {
      applications[index].status = status
      this.save(applications)
    }
  }

  static getByStudent(studentId: string): ApplicationData[] {
    return this.getAll().filter(app => app.studentId === studentId)
  }

  static exportToCSV(): string {
    const applications = this.getAll()
    
    if (applications.length === 0) {
      return "No applications to export"
    }

    // CSV headers
    const headers = [
      "Application ID",
      "Student Name",
      "Roll Number",
      "Branch",
      "Year",
      "Email",
      "Phone",
      "LinkedIn",
      "GitHub",
      "Company Name",
      "Role",
      "Applied At",
      "Status",
    ]

    // CSV rows
    const rows = applications.map(app => [
      app.id,
      app.studentName,
      app.rollNumber,
      app.branch,
      app.year,
      app.email,
      app.phone,
      app.linkedin || "N/A",
      app.github || "N/A",
      app.companyName,
      app.companyRole,
      new Date(app.appliedAt).toLocaleString(),
      app.status,
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n")

    return csvContent
  }

  static downloadCSV() {
    const csv = this.exportToCSV()
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `applications_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}