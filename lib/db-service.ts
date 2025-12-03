// Database Service Layer - Ready for Supabase Integration
// Currently uses mock data, will seamlessly switch to real DB when Supabase is enabled

import {
  mockStudents,
  mockDrives,
  mockTrainings,
  mockAssignments,
  mockFeedback,
  type Student,
  type PlacementDrive,
  type Training,
  type Assignment,
  type Feedback,
} from "./mock-data"

// Database configuration
const DB_CONFIG = {
  isSupabaseEnabled: false, // Will be set to true when Supabase is connected
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

// Student Service
export const StudentService = {
  // Get all students with optional filters
  async getAll(filters?: {
    branch?: string
    section?: string
    year?: string
    status?: string
  }): Promise<Student[]> {
    // TODO: Replace with Supabase query when enabled
    let students = [...mockStudents]

    if (filters?.branch) {
      students = students.filter((s) => s.branch === filters.branch)
    }
    if (filters?.section) {
      students = students.filter((s) => s.section === filters.section)
    }
    if (filters?.year) {
      students = students.filter((s) => s.year === filters.year)
    }
    if (filters?.status) {
      students = students.filter((s) => s.status === filters.status)
    }

    return students
  },

  // Get student by ID
  async getById(id: string): Promise<Student | null> {
    const student = mockStudents.find((s) => s.id === id)
    return student || null
  },

  // Get student statistics
  async getStats(studentId: string) {
    const student = await this.getById(studentId)
    if (!student) return null

    return {
      appliedDrives: student.appliedDrives.length,
      selectedDrives: student.selectedDrives.length,
      cgpa: student.cgpa,
      rank: student.rank,
    }
  },

  // Update student profile
  async update(id: string, data: Partial<Student>): Promise<Student | null> {
    // TODO: Implement Supabase update
    const index = mockStudents.findIndex((s) => s.id === id)
    if (index === -1) return null

    mockStudents[index] = { ...mockStudents[index], ...data }
    return mockStudents[index]
  },
}

// Drive Service
export const DriveService = {
  // Get all drives with filters
  async getAll(filters?: {
    status?: "active" | "closed" | "upcoming"
    branch?: string
    minCgpa?: number
  }): Promise<PlacementDrive[]> {
    let drives = [...mockDrives]

    if (filters?.status) {
      drives = drives.filter((d) => d.status === filters.status)
    }
    if (filters?.branch) {
      drives = drives.filter((d) => d.eligibleBranches.includes(filters.branch))
    }
    if (filters?.minCgpa !== undefined) {
      drives = drives.filter((d) => d.minCgpa <= filters.minCgpa)
    }

    return drives
  },

  // Get active drives
  async getActive(): Promise<PlacementDrive[]> {
    return mockDrives.filter((d) => d.status === "active")
  },

  // Get drive by ID
  async getById(id: string): Promise<PlacementDrive | null> {
    const drive = mockDrives.find((d) => d.id === id)
    return drive || null
  },

  // Apply to drive
  async apply(driveId: string, studentId: string, applicationData: any): Promise<boolean> {
    // TODO: Implement Supabase insert
    const student = await StudentService.getById(studentId)
    if (!student) return false

    if (!student.appliedDrives.includes(driveId)) {
      student.appliedDrives.push(driveId)
    }

    return true
  },

  // Create new drive (admin)
  async create(data: Omit<PlacementDrive, "id">): Promise<PlacementDrive> {
    // TODO: Implement Supabase insert
    const newDrive: PlacementDrive = {
      id: `DRV${String(mockDrives.length + 1).padStart(3, "0")}`,
      ...data,
    }
    mockDrives.push(newDrive)
    return newDrive
  },
}

// Training Service
export const TrainingService = {
  // Get all trainings with filters
  async getAll(filters?: {
    branch?: string
    section?: string
    year?: string
    status?: string
  }): Promise<Training[]> {
    let trainings = [...mockTrainings]

    if (filters?.branch) {
      trainings = trainings.filter((t) => t.branch === filters.branch)
    }
    if (filters?.section) {
      trainings = trainings.filter((t) => t.section === filters.section)
    }
    if (filters?.year) {
      trainings = trainings.filter((t) => t.year === filters.year)
    }
    if (filters?.status) {
      trainings = trainings.filter((t) => t.status === filters.status)
    }

    return trainings
  },

  // Get training by ID
  async getById(id: string): Promise<Training | null> {
    const training = mockTrainings.find((t) => t.id === id)
    return training || null
  },

  // Create new training
  async create(data: Omit<Training, "id">): Promise<Training> {
    const newTraining: Training = {
      id: `TRN${String(mockTrainings.length + 1).padStart(3, "0")}`,
      ...data,
    }
    mockTrainings.push(newTraining)
    return newTraining
  },

  // Update training
  async update(id: string, data: Partial<Training>): Promise<Training | null> {
    const index = mockTrainings.findIndex((t) => t.id === id)
    if (index === -1) return null

    mockTrainings[index] = { ...mockTrainings[index], ...data }
    return mockTrainings[index]
  },
}

// Assignment Service
export const AssignmentService = {
  // Get all assignments with filters
  async getAll(filters?: {
    branch?: string
    section?: string
    year?: string
  }): Promise<Assignment[]> {
    let assignments = [...mockAssignments]

    if (filters?.branch) {
      assignments = assignments.filter((a) => a.branch === filters.branch)
    }
    if (filters?.section) {
      assignments = assignments.filter((a) => a.section === filters.section)
    }
    if (filters?.year) {
      assignments = assignments.filter((a) => a.year === filters.year)
    }

    return assignments
  },

  // Get assignment by ID
  async getById(id: string): Promise<Assignment | null> {
    const assignment = mockAssignments.find((a) => a.id === id)
    return assignment || null
  },

  // Create new assignment
  async create(data: Omit<Assignment, "id">): Promise<Assignment> {
    const newAssignment: Assignment = {
      id: `ASG${String(mockAssignments.length + 1).padStart(3, "0")}`,
      ...data,
    }
    mockAssignments.push(newAssignment)
    return newAssignment
  },

  // Delete assignment
  async delete(id: string): Promise<boolean> {
    const index = mockAssignments.findIndex((a) => a.id === id)
    if (index === -1) return false

    mockAssignments.splice(index, 1)
    return true
  },
}

// Feedback Service
export const FeedbackService = {
  // Get all feedback
  async getAll(filters?: { studentId?: string; status?: string }): Promise<Feedback[]> {
    let feedback = [...mockFeedback]

    if (filters?.studentId) {
      feedback = feedback.filter((f) => f.studentId === filters.studentId)
    }
    if (filters?.status) {
      feedback = feedback.filter((f) => f.status === filters.status)
    }

    return feedback
  },

  // Submit feedback
  async create(data: Omit<Feedback, "id" | "timestamp">): Promise<Feedback> {
    const newFeedback: Feedback = {
      id: `FDB${String(mockFeedback.length + 1).padStart(3, "0")}`,
      timestamp: new Date().toISOString(),
      ...data,
    }
    mockFeedback.push(newFeedback)
    return newFeedback
  },
}

// Admin Statistics Service
export const AdminStatsService = {
  async getOverview() {
    const totalStudents = mockStudents.length * 80 // Simulating 4000+
    const placedStudents = mockStudents.filter((s) => s.status === "placed").length * 80
    const activeDrives = mockDrives.filter((d) => d.status === "active").length

    return {
      totalStudents,
      activeCompanies: mockDrives.length * 30,
      applicationsThisMonth: totalStudents * 0.625,
      placementRate: Math.round((placedStudents / totalStudents) * 100),
      placedStudents,
      activeDrives,
    }
  },

  async getPlacementTrend() {
    return [
      { month: "Jan", applications: 1200, placements: 450 },
      { month: "Feb", applications: 1900, placements: 620 },
      { month: "Mar", applications: 2200, placements: 750 },
      { month: "Apr", applications: 2800, placements: 920 },
      { month: "May", applications: 3200, placements: 1100 },
      { month: "Jun", applications: 3500, placements: 1250 },
    ]
  },

  async getBranchDistribution() {
    const branches = ["CSE", "ECE", "MECH", "CIVIL", "EEE"]
    return branches.map((branch) => ({
      name: branch,
      value: mockStudents.filter((s) => s.branch === branch).length * 80,
    }))
  },
}

// Faculty Statistics Service
export const FacultyStatsService = {
  async getOverview(branch: string, section: string, year: string) {
    const students = await StudentService.getAll({ branch, section, year })
    const trainings = await TrainingService.getAll({ branch, section, year })
    const assignments = await AssignmentService.getAll({ branch, section, year })

    return {
      totalStudents: students.length,
      ongoingTrainings: trainings.filter((t) => t.status === "ongoing").length,
      assignmentsPending: assignments.length,
      avgAttendance: 89, // Mock value
    }
  },
}

export { DB_CONFIG }