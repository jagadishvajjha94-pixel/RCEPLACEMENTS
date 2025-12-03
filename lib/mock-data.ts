// Comprehensive mock data for RCE Career Hub

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  rollNumber: string
  cgpa: number
  branch: string
  section: string
  year: string
  semester: number
  rank: number
  techStack: string[]
  resumeUrl?: string
  appliedDrives: string[]
  selectedDrives: string[]
  status: "active" | "placed" | "inactive"
  semesterMarks: {
    semester: number
    marks: number
    grade: string
  }[]
}

export interface PlacementDrive {
  id: string
  company: string
  role: string
  package: string
  location: string
  mode: "Online" | "Offline" | "Hybrid"
  minCgpa: number
  eligibleBranches: string[]
  deadline: string
  description: string
  requirements: string[]
  applicants: number
  selected: number
  status: "active" | "closed" | "upcoming"
  applyLink: string
}

export interface Training {
  id: string
  title: string
  topic: string
  language: string
  date: string
  time: string
  location: string
  branch: string
  section: string
  year: string
  syllabusCovered: string[]
  instructor: string
  status: "ongoing" | "completed" | "upcoming"
}

export interface Assignment {
  id: string
  title: string
  subject: string
  description: string
  dueDate: string
  totalMarks: number
  uploadedBy: string
  branch: string
  section: string
  year: string
  attachmentUrl?: string
}

export interface Feedback {
  id: string
  studentId: string
  category: "training" | "workshop" | "placement" | "campus" | "other"
  subject: string
  content: string
  rating: number
  timestamp: string
  status: "pending" | "reviewed" | "resolved"
}

// Mock Students Data (sample of 50, representing 4000+)
export const mockStudents: Student[] = Array.from({ length: 50 }, (_, i) => ({
  id: `STU${String(i + 1).padStart(4, "0")}`,
  name: `Student ${i + 1}`,
  email: `student${i + 1}@rce.edu.in`,
  phone: `+91 ${9000000000 + i}`,
  rollNumber: `2021CSE${String(i + 1).padStart(3, "0")}`,
  cgpa: Number((7.0 + Math.random() * 2.5).toFixed(2)),
  branch: ["CSE", "ECE", "MECH", "CIVIL", "EEE"][i % 5],
  section: ["A", "B", "C"][i % 3],
  year: ["1st", "2nd", "3rd", "4th"][i % 4],
  semester: (i % 8) + 1,
  rank: i + 1,
  techStack: [
    ["React", "Node.js", "MongoDB"],
    ["Python", "Django", "PostgreSQL"],
    ["Java", "Spring Boot", "MySQL"],
    ["Angular", "Express", "Firebase"],
    ["Vue.js", "FastAPI", "Redis"],
  ][i % 5],
  appliedDrives: [`DRV00${(i % 5) + 1}`, `DRV00${((i + 1) % 5) + 1}`],
  selectedDrives: i % 10 === 0 ? [`DRV00${(i % 5) + 1}`] : [],
  status: i % 10 === 0 ? "placed" : "active",
  semesterMarks: Array.from({ length: (i % 8) + 1 }, (_, sem) => ({
    semester: sem + 1,
    marks: Math.floor(70 + Math.random() * 25),
    grade: ["A+", "A", "B+", "B"][Math.floor(Math.random() * 4)],
  })),
}))

// Mock Placement Drives
export const mockDrives: PlacementDrive[] = [
  {
    id: "DRV001",
    company: "Google",
    role: "Software Engineer",
    package: "45-60 LPA",
    location: "Bangalore",
    mode: "Online",
    minCgpa: 7.5,
    eligibleBranches: ["CSE", "ECE", "EEE"],
    deadline: "2025-01-15",
    description: "Join Google as a Software Engineer and work on cutting-edge technologies.",
    requirements: ["Strong DSA skills", "System Design knowledge", "3+ projects"],
    applicants: 342,
    selected: 18,
    status: "active",
    applyLink: "https://careers.google.com/jobs/results/",
  },
  {
    id: "DRV002",
    company: "Microsoft",
    role: "Data Scientist",
    package: "38-52 LPA",
    location: "Hyderabad",
    mode: "Offline",
    minCgpa: 7.0,
    eligibleBranches: ["CSE", "ECE"],
    deadline: "2025-01-20",
    description: "Work on AI/ML projects at Microsoft Azure.",
    requirements: ["Python", "Machine Learning", "Statistics"],
    applicants: 289,
    selected: 12,
    status: "active",
    applyLink: "https://careers.microsoft.com/professionals/us/en/search-results",
  },
  {
    id: "DRV003",
    company: "Amazon",
    role: "Backend Developer",
    package: "42-55 LPA",
    location: "Bangalore",
    mode: "Online",
    minCgpa: 7.2,
    eligibleBranches: ["CSE", "ECE", "EEE"],
    deadline: "2025-01-25",
    description: "Build scalable backend systems for AWS services.",
    requirements: ["Java/Python", "Microservices", "AWS knowledge"],
    applicants: 421,
    selected: 25,
    status: "active",
    applyLink: "https://www.amazon.jobs/en/search",
  },
  {
    id: "DRV004",
    company: "Flipkart",
    role: "Full Stack Developer",
    package: "28-35 LPA",
    location: "Bangalore",
    mode: "Hybrid",
    minCgpa: 6.8,
    eligibleBranches: ["CSE", "ECE"],
    deadline: "2025-02-01",
    description: "Develop e-commerce solutions at Flipkart.",
    requirements: ["React", "Node.js", "MongoDB"],
    applicants: 567,
    selected: 32,
    status: "active",
    applyLink: "https://www.flipkartcareers.com/#!/",
  },
  {
    id: "DRV005",
    company: "TCS",
    role: "Software Engineer",
    package: "18-22 LPA",
    location: "Multiple",
    mode: "Online",
    minCgpa: 6.5,
    eligibleBranches: ["CSE", "ECE", "MECH", "CIVIL", "EEE"],
    deadline: "2025-02-10",
    description: "Join TCS Digital for innovative projects.",
    requirements: ["Any programming language", "Problem solving"],
    applicants: 892,
    selected: 156,
    status: "active",
    applyLink: "https://www.tcs.com/careers",
  },
]

// Mock Trainings
export const mockTrainings: Training[] = [
  {
    id: "TRN001",
    title: "Full Stack Development",
    topic: "React & Node.js Fundamentals",
    language: "JavaScript",
    date: "2025-01-10",
    time: "10:00 AM - 12:00 PM",
    location: "Lab 1, A Building",
    branch: "CSE",
    section: "A",
    year: "3rd",
    syllabusCovered: ["React Hooks", "Express.js", "REST APIs"],
    instructor: "Dr. Sharma",
    status: "ongoing",
  },
  {
    id: "TRN002",
    title: "Machine Learning Workshop",
    topic: "Introduction to Neural Networks",
    language: "Python",
    date: "2025-01-12",
    time: "2:00 PM - 4:00 PM",
    location: "Lab 2, B Building",
    branch: "CSE",
    section: "B",
    year: "4th",
    syllabusCovered: ["TensorFlow", "Keras", "CNN"],
    instructor: "Prof. Kumar",
    status: "upcoming",
  },
  {
    id: "TRN003",
    title: "Data Structures & Algorithms",
    topic: "Advanced Graph Algorithms",
    language: "C++",
    date: "2025-01-08",
    time: "11:00 AM - 1:00 PM",
    location: "Lab 3, A Building",
    branch: "CSE",
    section: "A",
    year: "2nd",
    syllabusCovered: ["Dijkstra", "Floyd-Warshall", "MST"],
    instructor: "Dr. Patel",
    status: "completed",
  },
]

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: "ASG001",
    title: "Web Development Project",
    subject: "Full Stack Development",
    description: "Build a complete CRUD application using MERN stack",
    dueDate: "2025-01-20",
    totalMarks: 100,
    uploadedBy: "Dr. Sharma",
    branch: "CSE",
    section: "A",
    year: "3rd",
    attachmentUrl: "/assignments/asg001.pdf",
  },
  {
    id: "ASG002",
    title: "ML Model Implementation",
    subject: "Machine Learning",
    description: "Implement a classification model on the Iris dataset",
    dueDate: "2025-01-25",
    totalMarks: 100,
    uploadedBy: "Prof. Kumar",
    branch: "CSE",
    section: "B",
    year: "4th",
    attachmentUrl: "/assignments/asg002.pdf",
  },
  {
    id: "ASG003",
    title: "Algorithm Analysis",
    subject: "Data Structures",
    description: "Analyze time complexity of sorting algorithms",
    dueDate: "2025-01-18",
    totalMarks: 50,
    uploadedBy: "Dr. Patel",
    branch: "CSE",
    section: "A",
    year: "2nd",
  },
]

// Mock Feedback
export const mockFeedback: Feedback[] = [
  {
    id: "FDB001",
    studentId: "STU0001",
    category: "training",
    subject: "Full Stack Training Feedback",
    content: "The training was very informative and well-structured.",
    rating: 5,
    timestamp: "2025-01-05T10:30:00Z",
    status: "reviewed",
  },
  {
    id: "FDB002",
    studentId: "STU0002",
    category: "campus",
    subject: "Campus Facilities",
    content: "Need better WiFi connectivity in hostels.",
    rating: 3,
    timestamp: "2025-01-06T14:20:00Z",
    status: "pending",
  },
]

// Helper functions
export function getStudentById(id: string): Student | undefined {
  return mockStudents.find((s) => s.id === id)
}

export function getDriveById(id: string): PlacementDrive | undefined {
  return mockDrives.find((d) => d.id === id)
}

export function getStudentsByBranch(branch: string): Student[] {
  return mockStudents.filter((s) => s.branch === branch)
}

export function getActiveDrives(): PlacementDrive[] {
  return mockDrives.filter((d) => d.status === "active")
}

export function getStudentStats(studentId: string) {
  const student = getStudentById(studentId)
  if (!student) return null

  return {
    appliedDrives: student.appliedDrives.length,
    selectedDrives: student.selectedDrives.length,
    cgpa: student.cgpa,
    rank: student.rank,
  }
}

export function getAdminStats() {
  return {
    totalStudents: mockStudents.length * 80, // Simulating 4000+ students
    activeCompanies: mockDrives.length * 30,
    applicationsThisMonth: mockStudents.length * 50,
    placementRate: 92,
  }
}