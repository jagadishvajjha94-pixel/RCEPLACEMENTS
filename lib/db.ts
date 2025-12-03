// Database configuration and utilities
// Mock database layer - can be replaced with real database

interface Student {
  id: string
  name: string
  email: string
  phone: string
  roll: string
  cgpa: number
  branch: string
  section: string
  year: string
  status: string
  appliedDrives: string[]
  selectedDrives: string[]
}

interface PlacementDrive {
  id: string
  company: string
  role: string
  package: number
  location: string
  mode: string
  minCgpa: number
  deadline: string
  applicants: number
  selected: number
  status: string
}

interface Application {
  id: string
  studentId: string
  driveId: string
  appliedAt: string
  status: string
  score?: number
}

// Mock data store
export const mockStudents: Record<string, Student> = {
  "student-001": {
    id: "student-001",
    name: "Arjun Singh",
    email: "arjun@example.com",
    phone: "+91 9876543210",
    roll: "CSE001",
    cgpa: 8.7,
    branch: "CSE",
    section: "A",
    year: "3rd",
    status: "Active",
    appliedDrives: ["drive-001", "drive-002"],
    selectedDrives: ["drive-002"],
  },
}

export const mockDrives: Record<string, PlacementDrive> = {
  "drive-001": {
    id: "drive-001",
    company: "Google",
    role: "Software Engineer",
    package: 60,
    location: "Bangalore",
    mode: "Online",
    minCgpa: 7.5,
    deadline: "2025-01-15",
    applicants: 342,
    selected: 18,
    status: "active",
  },
}

export const mockApplications: Record<string, Application> = {}

// Database helper functions
export async function getStudent(id: string): Promise<Student | null> {
  return mockStudents[id] || null
}

export async function getPlacementDrive(id: string): Promise<PlacementDrive | null> {
  return mockDrives[id] || null
}

export async function getAllStudents(): Promise<Student[]> {
  return Object.values(mockStudents)
}

export async function getAllDrives(): Promise<PlacementDrive[]> {
  return Object.values(mockDrives)
}

export async function createApplication(studentId: string, driveId: string): Promise<Application> {
  const id = `app-${Date.now()}`
  const application: Application = {
    id,
    studentId,
    driveId,
    appliedAt: new Date().toISOString(),
    status: "applied",
  }
  mockApplications[id] = application
  return application
}
