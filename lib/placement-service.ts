// Comprehensive Placement & Internship Management Service
import { AuthService } from "./auth-service"

// ==================== INTERFACES ====================

export interface PlacementDrive {
  id: string
  companyName: string
  jobDescription: string
  jdFileUrl?: string
  package: string
  eligibilityCriteria: {
    minCGPA?: number
    branches?: string[]
    years?: string[]
    specificStudents?: string[]
  }
  position: string
  registrationLink: string
  companyInfoLink: string
  seriesNumber: string
  status: "active" | "closed" | "upcoming"
  deadline: string
  createdAt: string
  createdBy: string
  type: "placement" | "internship"
}

export interface StudentRegistration {
  id: string
  driveId: string
  studentId: string
  studentName: string
  rollNumber: string
  branch: string
  year: string
  cgpa: number
  email: string
  phone: string
  linkedin?: string
  github?: string
  status: "submitted" | "pending" | "expired"
  submittedAt: string
  offerDocuments?: {
    offerLetter?: string
    emailConfirmation?: string
    loi?: string
    internshipOffer?: string
  }
  hasOffer: boolean
}

export interface PlacementStats {
  totalStudents: number
  placedStudents: number
  internshipStudents: number
  placementRate: number
  internshipRate: number
  averagePackage: number
  highestPackage: number
  yearWiseStats: {
    year: string
    total: number
    placed: number
    internships: number
  }[]
  branchWiseStats: {
    branch: string
    total: number
    placed: number
    percentage: number
  }[]
  driveWiseStats: {
    driveName: string
    totalApplicants: number
    placed: number
  }[]
}

export interface ConsolidatedSheet {
  academicYear: string
  branch?: string
  minCGPA?: number
  type: "placement" | "internship" | "hackathon" | "pending" | "all"
  students: {
    id: string
    name: string
    rollNumber: string
    branch: string
    year: string
    cgpa: number
    email: string
    phone: string
    companyName?: string
    package?: string
    offerType?: string
    offerStatus?: string
    multipleOffers?: number
  }[]
}

// ==================== LOCAL STORAGE KEYS ====================

const STORAGE_KEYS = {
  DRIVES: "rce_placement_drives",
  REGISTRATIONS: "rce_student_registrations",
  STATS: "rce_placement_stats",
}

// ==================== PLACEMENT DRIVE SERVICE ====================

export class PlacementDriveService {
  // Get all drives
  static getAll(filters?: {
    status?: "active" | "closed" | "upcoming"
    type?: "placement" | "internship"
    branch?: string
    year?: string
  }): PlacementDrive[] {
    if (typeof window === "undefined") return []

    const data = localStorage.getItem(STORAGE_KEYS.DRIVES)
    let drives: PlacementDrive[] = data ? JSON.parse(data) : []

    if (filters?.status) {
      drives = drives.filter((d) => d.status === filters.status)
    }
    if (filters?.type) {
      drives = drives.filter((d) => d.type === filters.type)
    }
    if (filters?.branch) {
      drives = drives.filter((d) => 
        !d.eligibilityCriteria.branches || 
        d.eligibilityCriteria.branches.includes(filters.branch)
      )
    }
    if (filters?.year) {
      drives = drives.filter((d) => 
        !d.eligibilityCriteria.years || 
        d.eligibilityCriteria.years.includes(filters.year)
      )
    }

    return drives.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Async fetch from server API (Supabase) — use where appropriate in async flows
  static async fetchAll(filters?: {
    status?: "active" | "closed" | "upcoming"
    type?: "placement" | "internship"
    branch?: string
    year?: string
  }): Promise<PlacementDrive[]> {
    try {
      const res = await fetch('/api/drives')
      if (!res.ok) throw new Error('Drives API error')
      const json = await res.json()
      let drives: PlacementDrive[] = json?.data || []

      if (filters?.status) {
        drives = drives.filter((d) => d.status === filters.status)
      }
      if (filters?.type) {
        drives = drives.filter((d) => d.type === filters.type)
      }
      if (filters?.branch) {
        drives = drives.filter((d) => 
          !d.eligibilityCriteria.branches || 
          d.eligibilityCriteria.branches.includes(filters.branch)
        )
      }
      if (filters?.year) {
        drives = drives.filter((d) => 
          !d.eligibilityCriteria.years || 
          d.eligibilityCriteria.years.includes(filters.year)
        )
      }

      return drives.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (err) {
      console.warn('Failed to fetch drives from API', err)
      return this.getAll(filters)
    }
  }

  // Get drive by ID
  static getById(id: string): PlacementDrive | null {
    const drives = this.getAll()
    return drives.find((d) => d.id === id) || null
  }

  // Create new drive
  static create(data: Omit<PlacementDrive, "id" | "createdAt">): PlacementDrive {
    const drives = this.getAll()
    const newDrive: PlacementDrive = {
      id: `DRV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...data,
    }
    drives.push(newDrive)
    localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(drives))
    return newDrive
  }

  // Update drive
  static update(id: string, data: Partial<PlacementDrive>): PlacementDrive | null {
    const drives = this.getAll()
    const index = drives.findIndex((d) => d.id === id)
    if (index === -1) return null

    drives[index] = { ...drives[index], ...data }
    localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(drives))
    return drives[index]
  }

  // Delete drive
  static delete(id: string): boolean {
    const drives = this.getAll()
    const filtered = drives.filter((d) => d.id !== id)
    if (filtered.length === drives.length) return false

    localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(filtered))
    return true
  }

  // Remote operations (Supabase via app APIs)
  static async createRemote(data: Omit<PlacementDrive, "id" | "createdAt">): Promise<PlacementDrive | null> {
    try {
      const res = await fetch('/api/drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create drive')
      const json = await res.json()
      return json.data
    } catch (err) {
      console.warn('createRemote failed', err)
      return null
    }
  }

  static async updateRemote(id: string, data: Partial<PlacementDrive>): Promise<PlacementDrive | null> {
    try {
      const res = await fetch('/api/drives', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      })
      if (!res.ok) throw new Error('Failed to update drive')
      const json = await res.json()
      return json.data
    } catch (err) {
      console.warn('updateRemote failed', err)
      return null
    }
  }

  static async deleteRemote(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/drives?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      const json = await res.json()
      return json.success === true
    } catch (err) {
      console.warn('deleteRemote failed', err)
      return false
    }
  }

  // Get drives eligible for a student
  static getEligibleDrives(studentId: string): PlacementDrive[] {
    const user = AuthService.getCurrentUser()
    if (!user || !user.profile) return []

    const { branch, year, cgpa } = user.profile
    const allDrives = this.getAll({ status: "active" })

    return allDrives.filter((drive) => {
      const criteria = drive.eligibilityCriteria

      // Check CGPA
      if (criteria.minCGPA && cgpa < criteria.minCGPA) return false

      // Check branch
      if (criteria.branches && criteria.branches.length > 0 && !criteria.branches.includes(branch)) {
        return false
      }

      // Check year
      if (criteria.years && criteria.years.length > 0 && !criteria.years.includes(year)) {
        return false
      }

      // Check specific students
      if (criteria.specificStudents && criteria.specificStudents.length > 0) {
        return criteria.specificStudents.includes(studentId)
      }

      return true
    })
  }
}

// ==================== REGISTRATION SERVICE ====================

export class RegistrationService {
  // Get all registrations
  static getAll(filters?: {
    driveId?: string
    studentId?: string
    status?: string
    branch?: string
    year?: string
  }): StudentRegistration[] {
    if (typeof window === "undefined") return []
    
    const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)
    let registrations: StudentRegistration[] = data ? JSON.parse(data) : []

    if (filters?.driveId) {
      registrations = registrations.filter((r) => r.driveId === filters.driveId)
    }
    if (filters?.studentId) {
      registrations = registrations.filter((r) => r.studentId === filters.studentId)
    }
    if (filters?.status) {
      registrations = registrations.filter((r) => r.status === filters.status)
    }
    if (filters?.branch) {
      registrations = registrations.filter((r) => r.branch === filters.branch)
    }
    if (filters?.year) {
      registrations = registrations.filter((r) => r.year === filters.year)
    }

    return registrations.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }

  // Submit registration with deadline validation
  static submit(data: Omit<StudentRegistration, "id" | "submittedAt" | "status">): StudentRegistration {
    const registrations = this.getAll()
    
    // Check if already registered
    const existing = registrations.find(
      (r) => r.driveId === data.driveId && r.studentId === data.studentId
    )
    if (existing) {
      throw new Error("Already registered for this drive")
    }

    // Check deadline
    const drive = PlacementDriveService.getById(data.driveId)
    if (drive) {
      const deadline = new Date(drive.deadline)
      const now = new Date()
      if (deadline < now) {
        throw new Error("Registration deadline has passed")
      }
    }

    // Determine status based on deadline
    let status: "submitted" | "pending" | "expired" = "submitted"
    if (drive) {
      const deadline = new Date(drive.deadline)
      const now = new Date()
      const timeRemaining = deadline.getTime() - now.getTime()
      
      if (timeRemaining < 0) {
        status = "expired"
      } else if (timeRemaining < 24 * 60 * 60 * 1000) { // Less than 24 hours
        status = "pending"
      }
    }

    const newRegistration: StudentRegistration = {
      id: `REG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
      status,
      hasOffer: false,
      ...data,
    }

    registrations.push(newRegistration)
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations))
    return newRegistration
  }

  // Remote submit (Supabase via API)
  static async submitRemote(data: Omit<StudentRegistration, "id" | "submittedAt" | "status">): Promise<StudentRegistration | null> {
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to submit registration')
      const json = await res.json()
      return json.data
    } catch (err) {
      console.warn('submitRemote failed', err)
      return null
    }
  }

  // Update registration status
  static updateStatus(id: string, status: "submitted" | "pending" | "expired"): boolean {
    const registrations = this.getAll()
    const index = registrations.findIndex((r) => r.id === id)
    if (index === -1) return false

    registrations[index].status = status
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations))
    return true
  }

  // Upload offer documents
  static uploadOfferDocuments(
    registrationId: string,
    documents: {
      offerLetter?: string
      emailConfirmation?: string
      loi?: string
      internshipOffer?: string
    }
  ): boolean {
    const registrations = this.getAll()
    const index = registrations.findIndex((r) => r.id === registrationId)
    if (index === -1) return false

    registrations[index].offerDocuments = {
      ...registrations[index].offerDocuments,
      ...documents,
    }
    registrations[index].hasOffer = true

    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations))
    return true
  }

  // Get registrations by student
  static getByStudent(studentId: string): StudentRegistration[] {
    return this.getAll({ studentId })
  }

  // Remote get by student
  static async getByStudentRemote(studentId: string): Promise<StudentRegistration[]> {
    try {
      const res = await fetch(`/api/registrations?studentId=${encodeURIComponent(studentId)}`)
      if (!res.ok) throw new Error('Failed to fetch registrations')
      const json = await res.json()
      return json.data || []
    } catch (err) {
      console.warn('getByStudentRemote failed', err)
      return this.getByStudent(studentId)
    }
  }

  // Get all registrations from server
  static async getAllRemote(filters?: { driveId?: string; status?: string }): Promise<StudentRegistration[]> {
    try {
      const params = new URLSearchParams()
      if (filters?.driveId) params.set('driveId', filters.driveId)
      if (filters?.status) params.set('status', filters.status)

      const res = await fetch('/api/registrations' + (params.toString() ? `?${params.toString()}` : ''))
      if (!res.ok) throw new Error('Failed to fetch registrations')
      const json = await res.json()
      return json.data || []
    } catch (err) {
      console.warn('getAllRemote failed', err)
      return this.getAll()
    }
  }

  // Remote update for a registration (e.g., to save offer document URLs or change status)
  static async updateRemoteRegistration(id: string, data: Partial<StudentRegistration>): Promise<StudentRegistration | null> {
    try {
      const res = await fetch('/api/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      })
      if (!res.ok) throw new Error('Failed to update registration')
      const json = await res.json()
      return json.data
    } catch (err) {
      console.warn('updateRemoteRegistration failed', err)
      return null
    }
  }

  // Upload offer documents: client should upload files to storage (via /api/upload) then call this to persist links
  static async uploadOfferDocumentsRemote(
    registrationId: string,
    documents: {
      offerLetter?: string
      emailConfirmation?: string
      loi?: string
      internshipOffer?: string
    }
  ): Promise<StudentRegistration | null> {
    try {
      const updated = await this.updateRemoteRegistration(registrationId, { offerDocuments: documents, hasOffer: true })
      return updated
    } catch (err) {
      console.warn('uploadOfferDocumentsRemote failed', err)
      return null
    }
  }

  // Get registrations by drive
  static getByDrive(driveId: string): StudentRegistration[] {
    return this.getAll({ driveId })
  }

  // Check if student has registered for drive
  static hasRegistered(driveId: string, studentId: string): boolean {
    const registrations = this.getAll({ driveId, studentId })
    return registrations.length > 0
  }

  // Update registration statuses based on deadlines
  static updateRegistrationStatuses(): void {
    if (typeof window === "undefined") return

    const registrations = this.getAll()
    let updated = false

    registrations.forEach(registration => {
      const drive = PlacementDriveService.getById(registration.driveId)
      if (!drive) return

      const deadline = new Date(drive.deadline)
      const now = new Date()
      const timeRemaining = deadline.getTime() - now.getTime()

      let newStatus: "submitted" | "pending" | "expired" = registration.status

      if (timeRemaining < 0 && registration.status !== "expired") {
        newStatus = "expired"
        updated = true
      } else if (timeRemaining < 24 * 60 * 60 * 1000 && timeRemaining > 0 && registration.status === "submitted") {
        newStatus = "pending"
        updated = true
      }

      if (newStatus !== registration.status) {
        registration.status = newStatus
      }
    })

    if (updated) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations))
    }
  }

  // Auto-collect student data from user profile
  static autoCollectStudentData(userId: string): Partial<StudentRegistration> {
    const user = AuthService.getCurrentUser()
    if (!user || user.id !== userId) return {}

    return {
      studentName: user.name,
      rollNumber: user.profile?.rollNumber || "",
      branch: user.profile?.branch || "",
      year: user.profile?.year || "",
      cgpa: user.profile?.cgpa || 0,
      email: user.email,
      phone: user.profile?.phone || "",
      linkedin: user.profile?.linkedin,
      github: user.profile?.github,
    }
  }

  // Download registrations as CSV
  static downloadCSV(driveId?: string, filters?: any): void {
    const registrations = driveId ? this.getByDrive(driveId) : this.getAll(filters)
    
    if (registrations.length === 0) {
      alert("No registrations to download")
      return
    }

    const headers = [
      "Name",
      "Roll Number",
      "Branch",
      "Year",
      "CGPA",
      "Email",
      "Phone",
      "LinkedIn",
      "GitHub",
      "Status",
      "Submitted At",
      "Has Offer",
    ]

    const rows = registrations.map((reg) => [
      reg.studentName,
      reg.rollNumber,
      reg.branch,
      reg.year,
      reg.cgpa,
      reg.email,
      reg.phone,
      reg.linkedin || "",
      reg.github || "",
      reg.status,
      new Date(reg.submittedAt).toLocaleString(),
      reg.hasOffer ? "Yes" : "No",
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `registrations_${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
}

// ==================== ANALYTICS SERVICE ====================

export class PlacementAnalyticsService {
  // Get comprehensive statistics
  static getStats(filters?: {
    academicYear?: string
    branch?: string
    year?: string
  }): PlacementStats {
    const registrations = RegistrationService.getAll(filters)
    const drives = PlacementDriveService.getAll()

    // Calculate total students (mock data for now)
    const totalStudents = 4000
    const placedStudents = registrations.filter((r) => r.hasOffer).length
    const internshipStudents = registrations.filter((r) => {
      const drive = drives.find((d) => d.id === r.driveId)
      return drive?.type === "internship" && r.hasOffer
    }).length

    // Year-wise stats
    const yearWiseStats = ["1st", "2nd", "3rd", "4th"].map((year) => {
      const yearRegs = registrations.filter((r) => r.year === year)
      const yearPlaced = yearRegs.filter((r) => r.hasOffer).length
      const yearInternships = yearRegs.filter((r) => {
        const drive = drives.find((d) => d.id === r.driveId)
        return drive?.type === "internship" && r.hasOffer
      }).length

      return {
        year,
        total: totalStudents / 4,
        placed: yearPlaced,
        internships: yearInternships,
      }
    })

    // Branch-wise stats
    const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE"]
    const branchWiseStats = branches.map((branch) => {
      const branchRegs = registrations.filter((r) => r.branch === branch)
      const branchPlaced = branchRegs.filter((r) => r.hasOffer).length
      const branchTotal = totalStudents / branches.length

      return {
        branch,
        total: branchTotal,
        placed: branchPlaced,
        percentage: branchTotal > 0 ? Math.round((branchPlaced / branchTotal) * 100) : 0,
      }
    })

    // Drive-wise stats
    const driveWiseStats = drives.map((drive) => {
      const driveRegs = registrations.filter((r) => r.driveId === drive.id)
      const drivePlaced = driveRegs.filter((r) => r.hasOffer).length

      return {
        driveName: drive.companyName,
        totalApplicants: driveRegs.length,
        placed: drivePlaced,
      }
    })

    return {
      totalStudents,
      placedStudents,
      internshipStudents,
      placementRate: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0,
      internshipRate: totalStudents > 0 ? Math.round((internshipStudents / totalStudents) * 100) : 0,
      averagePackage: 62.3,
      highestPackage: 125,
      yearWiseStats,
      branchWiseStats,
      driveWiseStats,
    }
  }

  // Get placement trend data
  static getPlacementTrend(year: string = "2024-25"): any[] {
    return [
      { month: "Aug", placements: 120, internships: 80 },
      { month: "Sep", placements: 250, internships: 150 },
      { month: "Oct", placements: 380, internships: 220 },
      { month: "Nov", placements: 520, internships: 310 },
      { month: "Dec", placements: 680, internships: 420 },
      { month: "Jan", placements: 850, internships: 540 },
      { month: "Feb", placements: 1020, internships: 650 },
    ]
  }

  // Get offer statement
  static getOfferStatement(): {
    singleOffer: number
    multipleOffers: number
    branchWise: { branch: string; single: number; multiple: number }[]
  } {
    const registrations = RegistrationService.getAll()
    const studentsWithOffers = new Map<string, number>()

    registrations.forEach((reg) => {
      if (reg.hasOffer) {
        const count = studentsWithOffers.get(reg.studentId) || 0
        studentsWithOffers.set(reg.studentId, count + 1)
      }
    })

    let singleOffer = 0
    let multipleOffers = 0

    studentsWithOffers.forEach((count) => {
      if (count === 1) singleOffer++
      else if (count > 1) multipleOffers++
    })

    // Branch-wise breakdown
    const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE"]
    const branchWise = branches.map((branch) => {
      const branchRegs = registrations.filter((r) => r.branch === branch && r.hasOffer)
      const branchStudents = new Map<string, number>()

      branchRegs.forEach((reg) => {
        const count = branchStudents.get(reg.studentId) || 0
        branchStudents.set(reg.studentId, count + 1)
      })

      let branchSingle = 0
      let branchMultiple = 0

      branchStudents.forEach((count) => {
        if (count === 1) branchSingle++
        else if (count > 1) branchMultiple++
      })

      return {
        branch,
        single: branchSingle,
        multiple: branchMultiple,
      }
    })

    return {
      singleOffer,
      multipleOffers,
      branchWise,
    }
  }
}

// ==================== CONSOLIDATED SHEET SERVICE ====================

export class ConsolidatedSheetService {
  // Generate consolidated sheet
  static generate(filters: {
    academicYear: string
    branch?: string
    minCGPA?: number
    type: "placement" | "internship" | "hackathon" | "pending" | "all"
  }): ConsolidatedSheet {
    let registrations = RegistrationService.getAll()
    const drives = PlacementDriveService.getAll()

    // Apply filters
    if (filters.branch) {
      registrations = registrations.filter((r) => r.branch === filters.branch)
    }
    if (filters.minCGPA) {
      registrations = registrations.filter((r) => r.cgpa >= filters.minCGPA!)
    }

    // Filter by type
    if (filters.type !== "all") {
      if (filters.type === "pending") {
        registrations = registrations.filter((r) => !r.hasOffer)
      } else {
        registrations = registrations.filter((r) => {
          const drive = drives.find((d) => d.id === r.driveId)
          return drive?.type === filters.type && r.hasOffer
        })
      }
    }

    // Build student list
    const studentMap = new Map<string, any>()

    registrations.forEach((reg) => {
      if (!studentMap.has(reg.studentId)) {
        studentMap.set(reg.studentId, {
          id: reg.studentId,
          name: reg.studentName,
          rollNumber: reg.rollNumber,
          branch: reg.branch,
          year: reg.year,
          cgpa: reg.cgpa,
          email: reg.email,
          phone: reg.phone,
          offers: [],
        })
      }

      if (reg.hasOffer) {
        const drive = drives.find((d) => d.id === reg.driveId)
        if (drive) {
          studentMap.get(reg.studentId).offers.push({
            companyName: drive.companyName,
            package: drive.package,
            offerType: drive.type,
          })
        }
      }
    })

    const students = Array.from(studentMap.values()).map((student) => ({
      ...student,
      companyName: student.offers[0]?.companyName || "N/A",
      package: student.offers[0]?.package || "N/A",
      offerType: student.offers[0]?.offerType || "N/A",
      offerStatus: student.offers.length > 0 ? "Placed" : "Pending",
      multipleOffers: student.offers.length,
    }))

    return {
      ...filters,
      students,
    }
  }

  // Download consolidated sheet as Excel
  static downloadExcel(sheet: ConsolidatedSheet): void {
    if (sheet.students.length === 0) {
      alert("No data to download")
      return
    }

    const headers = [
      "Name",
      "Roll Number",
      "Branch",
      "Year",
      "CGPA",
      "Email",
      "Phone",
      "Company",
      "Package",
      "Offer Type",
      "Status",
      "Multiple Offers",
    ]

    const rows = sheet.students.map((student) => [
      student.name,
      student.rollNumber,
      student.branch,
      student.year,
      student.cgpa,
      student.email,
      student.phone,
      student.companyName || "N/A",
      student.package || "N/A",
      student.offerType || "N/A",
      student.offerStatus || "Pending",
      student.multipleOffers || 0,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `consolidated_${sheet.type}_${sheet.academicYear}_${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
}