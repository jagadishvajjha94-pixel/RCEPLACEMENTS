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

export interface Timetable {
  id: string
  semester: number
  academicYear: string
  branch: string
  section: string
  year: string
  uploadedBy: string
  uploadedAt: string
  schedule: {
    day: string
    time: string
    subject: string
    faculty: string
    room: string
    type: "Lecture" | "Lab" | "Tutorial" | "Training"
  }[]
  trainings: {
    title: string
    date: string
    time: string
    instructor: string
    location: string
    description: string
  }[]
}

export interface Topper {
  id: string
  studentId: string
  name: string
  rollNumber: string
  branch: string
  year: string
  picture: string
  category: "training" | "academic" | "placed"
  rank: number
  score?: number
  cgpa?: number
  company?: string
  package?: string
  position?: string
  resumeUrl?: string
  achievement?: string
}

export interface NewsFeed {
  id: string
  title: string
  description: string
  image?: string
  type: "activity" | "announcement" | "achievement" | "event"
  uploadedBy: string
  uploadedAt: string
  likes: number
  comments: number
  tags: string[]
}

export interface CompanySpecificPrep {
  id: string
  company: string
  topics: string[]
  uploadedBy: string
  uploadedAt: string
  fileUrl?: string
  description?: string
}

export interface FacultyFeedback {
  id: string
  studentId: string
  facultyId: string
  facultyName: string
  category: "academics" | "training"
  subject: string
  content: string
  rating: number
  timestamp: string
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

// Mock Timetables
export const mockTimetables: Timetable[] = [
  {
    id: "TT001",
    semester: 1,
    academicYear: "2024-2025",
    branch: "CSE",
    section: "A",
    year: "1st",
    uploadedBy: "Dr. Sharma",
    uploadedAt: "2025-01-01T10:00:00Z",
    schedule: [
      { day: "Monday", time: "9:00 AM - 10:00 AM", subject: "Mathematics", faculty: "Dr. Kumar", room: "A-101", type: "Lecture" },
      { day: "Monday", time: "10:00 AM - 11:00 AM", subject: "Programming Fundamentals", faculty: "Dr. Sharma", room: "Lab-1", type: "Lab" },
      { day: "Monday", time: "11:00 AM - 12:00 PM", subject: "English", faculty: "Prof. Singh", room: "A-102", type: "Lecture" },
      { day: "Tuesday", time: "9:00 AM - 10:00 AM", subject: "Physics", faculty: "Dr. Patel", room: "A-103", type: "Lecture" },
      { day: "Tuesday", time: "10:00 AM - 11:00 AM", subject: "Chemistry", faculty: "Dr. Verma", room: "A-104", type: "Lecture" },
      { day: "Wednesday", time: "9:00 AM - 11:00 AM", subject: "Programming Fundamentals", faculty: "Dr. Sharma", room: "Lab-1", type: "Lab" },
      { day: "Wednesday", time: "2:00 PM - 3:00 PM", subject: "Mathematics", faculty: "Dr. Kumar", room: "A-101", type: "Tutorial" },
      { day: "Thursday", time: "9:00 AM - 10:00 AM", subject: "English", faculty: "Prof. Singh", room: "A-102", type: "Lecture" },
      { day: "Thursday", time: "10:00 AM - 12:00 PM", subject: "Physics Lab", faculty: "Dr. Patel", room: "Lab-2", type: "Lab" },
      { day: "Friday", time: "9:00 AM - 10:00 AM", subject: "Chemistry", faculty: "Dr. Verma", room: "A-104", type: "Lecture" },
      { day: "Friday", time: "2:00 PM - 4:00 PM", subject: "Soft Skills Training", faculty: "Prof. Mehta", room: "A-105", type: "Training" },
    ],
    trainings: [
      {
        title: "Introduction to Programming",
        date: "2025-01-15",
        time: "2:00 PM - 4:00 PM",
        instructor: "Dr. Sharma",
        location: "Lab-1",
        description: "Basic programming concepts and hands-on practice"
      },
      {
        title: "Soft Skills Development",
        date: "2025-01-20",
        time: "10:00 AM - 12:00 PM",
        instructor: "Prof. Mehta",
        location: "A-105",
        description: "Communication and presentation skills"
      }
    ]
  },
  {
    id: "TT002",
    semester: 2,
    academicYear: "2024-2025",
    branch: "CSE",
    section: "A",
    year: "1st",
    uploadedBy: "Dr. Sharma",
    uploadedAt: "2025-01-05T10:00:00Z",
    schedule: [
      { day: "Monday", time: "9:00 AM - 10:00 AM", subject: "Data Structures", faculty: "Dr. Patel", room: "A-201", type: "Lecture" },
      { day: "Monday", time: "10:00 AM - 12:00 PM", subject: "Data Structures Lab", faculty: "Dr. Patel", room: "Lab-1", type: "Lab" },
      { day: "Tuesday", time: "9:00 AM - 10:00 AM", subject: "Discrete Mathematics", faculty: "Dr. Kumar", room: "A-202", type: "Lecture" },
      { day: "Tuesday", time: "2:00 PM - 3:00 PM", subject: "Digital Logic", faculty: "Dr. Verma", room: "A-203", type: "Lecture" },
      { day: "Wednesday", time: "9:00 AM - 11:00 AM", subject: "Digital Logic Lab", faculty: "Dr. Verma", room: "Lab-2", type: "Lab" },
      { day: "Thursday", time: "9:00 AM - 10:00 AM", subject: "Data Structures", faculty: "Dr. Patel", room: "A-201", type: "Tutorial" },
      { day: "Friday", time: "10:00 AM - 12:00 PM", subject: "Web Development Training", faculty: "Prof. Singh", room: "Lab-1", type: "Training" },
    ],
    trainings: [
      {
        title: "Web Development Basics",
        date: "2025-02-01",
        time: "10:00 AM - 12:00 PM",
        instructor: "Prof. Singh",
        location: "Lab-1",
        description: "HTML, CSS, and JavaScript fundamentals"
      }
    ]
  },
  {
    id: "TT003",
    semester: 3,
    academicYear: "2024-2025",
    branch: "CSE",
    section: "A",
    year: "2nd",
    uploadedBy: "Dr. Sharma",
    uploadedAt: "2025-01-10T10:00:00Z",
    schedule: [
      { day: "Monday", time: "9:00 AM - 10:00 AM", subject: "Database Management", faculty: "Dr. Kumar", room: "A-301", type: "Lecture" },
      { day: "Monday", time: "10:00 AM - 12:00 PM", subject: "DBMS Lab", faculty: "Dr. Kumar", room: "Lab-3", type: "Lab" },
      { day: "Tuesday", time: "9:00 AM - 10:00 AM", subject: "Operating Systems", faculty: "Dr. Patel", room: "A-302", type: "Lecture" },
      { day: "Wednesday", time: "9:00 AM - 11:00 AM", subject: "OS Lab", faculty: "Dr. Patel", room: "Lab-2", type: "Lab" },
      { day: "Thursday", time: "2:00 PM - 4:00 PM", subject: "Interview Preparation Training", faculty: "Prof. Mehta", room: "A-305", type: "Training" },
      { day: "Friday", time: "9:00 AM - 10:00 AM", subject: "Computer Networks", faculty: "Dr. Verma", room: "A-303", type: "Lecture" },
    ],
    trainings: [
      {
        title: "Interview Preparation Workshop",
        date: "2025-02-15",
        time: "2:00 PM - 4:00 PM",
        instructor: "Prof. Mehta",
        location: "A-305",
        description: "Technical interview skills and coding practice"
      }
    ]
  },
  {
    id: "TT004",
    semester: 4,
    academicYear: "2024-2025",
    branch: "CSE",
    section: "A",
    year: "2nd",
    uploadedBy: "Dr. Sharma",
    uploadedAt: "2025-01-15T10:00:00Z",
    schedule: [
      { day: "Monday", time: "9:00 AM - 10:00 AM", subject: "Algorithm Design", faculty: "Dr. Sharma", room: "A-401", type: "Lecture" },
      { day: "Monday", time: "10:00 AM - 12:00 PM", subject: "Algorithm Lab", faculty: "Dr. Sharma", room: "Lab-1", type: "Lab" },
      { day: "Tuesday", time: "9:00 AM - 10:00 AM", subject: "Software Engineering", faculty: "Dr. Kumar", room: "A-402", type: "Lecture" },
      { day: "Wednesday", time: "2:00 PM - 4:00 PM", subject: "Placement Training", faculty: "Prof. Mehta", room: "A-405", type: "Training" },
      { day: "Thursday", time: "9:00 AM - 11:00 AM", subject: "Machine Learning", faculty: "Dr. Patel", room: "A-403", type: "Lecture" },
      { day: "Friday", time: "10:00 AM - 12:00 PM", subject: "ML Lab", faculty: "Dr. Patel", room: "Lab-3", type: "Lab" },
    ],
    trainings: [
      {
        title: "Placement Preparation Program",
        date: "2025-03-01",
        time: "2:00 PM - 4:00 PM",
        instructor: "Prof. Mehta",
        location: "A-405",
        description: "Aptitude, reasoning, and technical skills for placements"
      }
    ]
  }
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

// Mock Toppers Data
export const mockToppers: Topper[] = [
  // Training Toppers
  { id: "TOP001", studentId: "STU0001", name: "Rajesh Kumar", rollNumber: "21CSE001", branch: "CSE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh", category: "training", rank: 1, score: 98, achievement: "Full Stack Development Training" },
  { id: "TOP002", studentId: "STU0002", name: "Priya Sharma", rollNumber: "21CSE002", branch: "CSE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", category: "training", rank: 2, score: 96, achievement: "Machine Learning Workshop" },
  { id: "TOP003", studentId: "STU0003", name: "Amit Singh", rollNumber: "21ECE001", branch: "ECE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit", category: "training", rank: 1, score: 97, achievement: "System Design Training" },
  { id: "TOP004", studentId: "STU0004", name: "Sneha Patel", rollNumber: "21ECE002", branch: "ECE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha", category: "training", rank: 2, score: 95, achievement: "Data Structures Mastery" },
  // Academic Toppers
  { id: "TOP005", studentId: "STU0005", name: "Vikram Reddy", rollNumber: "21CSE003", branch: "CSE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram", category: "academic", rank: 1, cgpa: 9.8, achievement: "College Topper" },
  { id: "TOP006", studentId: "STU0006", name: "Anjali Verma", rollNumber: "21CSE004", branch: "CSE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali", category: "academic", rank: 2, cgpa: 9.6, achievement: "Branch Topper" },
  { id: "TOP007", studentId: "STU0007", name: "Rohit Mehta", rollNumber: "21ECE003", branch: "ECE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit", category: "academic", rank: 1, cgpa: 9.7, achievement: "Branch Topper" },
  { id: "TOP008", studentId: "STU0008", name: "Kavya Nair", rollNumber: "21ECE004", branch: "ECE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya", category: "academic", rank: 2, cgpa: 9.5, achievement: "Academic Excellence" },
  // Placed Students
  { id: "TOP009", studentId: "STU0009", name: "Arjun Desai", rollNumber: "21CSE005", branch: "CSE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", category: "placed", rank: 1, company: "Google", package: "55 LPA", position: "Software Engineer", resumeUrl: "/resumes/arjun_resume.pdf", achievement: "Placed at Google" },
  { id: "TOP010", studentId: "STU0010", name: "Meera Joshi", rollNumber: "21CSE006", branch: "CSE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera", category: "placed", rank: 2, company: "Microsoft", package: "48 LPA", position: "Data Scientist", resumeUrl: "/resumes/meera_resume.pdf", achievement: "Placed at Microsoft" },
  { id: "TOP011", studentId: "STU0011", name: "Karan Malhotra", rollNumber: "21ECE005", branch: "ECE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan", category: "placed", rank: 1, company: "Amazon", package: "52 LPA", position: "Backend Developer", resumeUrl: "/resumes/karan_resume.pdf", achievement: "Placed at Amazon" },
  { id: "TOP012", studentId: "STU0012", name: "Divya Iyer", rollNumber: "21ECE006", branch: "ECE", year: "4th", picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Divya", category: "placed", rank: 2, company: "Meta", package: "50 LPA", position: "Full Stack Developer", resumeUrl: "/resumes/divya_resume.pdf", achievement: "Placed at Meta" },
]

// Mock News Feed Data
export const mockNewsFeed: NewsFeed[] = [
  {
    id: "NEWS001",
    title: "Placement Drive: Google Campus Recruitment",
    description: "Google conducted an amazing campus recruitment drive yesterday. 25 students were selected with packages ranging from 45-60 LPA. Congratulations to all selected students!",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
    type: "activity",
    uploadedBy: "Dr. Sharma",
    uploadedAt: "2025-01-15T10:00:00Z",
    likes: 234,
    comments: 45,
    tags: ["placement", "google", "recruitment"]
  },
  {
    id: "NEWS002",
    title: "Workshop on Machine Learning",
    description: "Successfully conducted a 3-day intensive workshop on Machine Learning and Deep Learning. Students learned TensorFlow, PyTorch, and practical ML applications.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    type: "activity",
    uploadedBy: "Prof. Kumar",
    uploadedAt: "2025-01-14T14:30:00Z",
    likes: 189,
    comments: 32,
    tags: ["workshop", "machine learning", "training"]
  },
  {
    id: "NEWS003",
    title: "Congratulations to Our Toppers!",
    description: "Proud to announce our academic toppers for this semester. Special recognition to students who achieved 9.5+ CGPA. Keep up the excellent work!",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    type: "achievement",
    uploadedBy: "Dr. Patel",
    uploadedAt: "2025-01-13T09:00:00Z",
    likes: 312,
    comments: 67,
    tags: ["achievement", "toppers", "academics"]
  },
  {
    id: "NEWS004",
    title: "Tech Fest 2025 - Registration Open",
    description: "Annual Tech Fest registration is now open! Participate in coding competitions, hackathons, and tech exhibitions. Last date: January 25, 2025.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    type: "event",
    uploadedBy: "Prof. Mehta",
    uploadedAt: "2025-01-12T11:00:00Z",
    likes: 156,
    comments: 28,
    tags: ["event", "tech fest", "competition"]
  },
  {
    id: "NEWS005",
    title: "Industry Visit to Infosys Campus",
    description: "Students from CSE and ECE branches visited Infosys campus for an industry exposure program. Learned about software development lifecycle and corporate culture.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    type: "activity",
    uploadedBy: "Dr. Verma",
    uploadedAt: "2025-01-11T15:00:00Z",
    likes: 201,
    comments: 41,
    tags: ["industry visit", "infosys", "exposure"]
  },
  {
    id: "NEWS006",
    title: "Placement Training Program Completed",
    description: "Successfully completed 6-week intensive placement training program. 200+ students participated in aptitude, technical, and HR interview preparation sessions.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    type: "activity",
    uploadedBy: "Prof. Singh",
    uploadedAt: "2025-01-10T10:00:00Z",
    likes: 278,
    comments: 52,
    tags: ["training", "placement", "preparation"]
  }
]

// Mock Company-Specific Interview Prep Data
export const mockCompanySpecificPrep: CompanySpecificPrep[] = [
  {
    id: "CSP001",
    company: "Google",
    topics: [
      "System Design - Scalability and Performance",
      "Data Structures - Trees, Graphs, Hash Tables",
      "Algorithms - Dynamic Programming, Greedy",
      "Behavioral Questions - Leadership and Problem Solving",
      "Technical Rounds - Coding Challenges"
    ],
    uploadedBy: "Admin",
    uploadedAt: "2025-01-10T10:00:00Z",
    description: "Comprehensive interview preparation guide for Google technical and behavioral interviews"
  },
  {
    id: "CSP002",
    company: "Microsoft",
    topics: [
      "Azure Cloud Services",
      "C# and .NET Framework",
      "System Design Patterns",
      "Problem Solving - LeetCode Medium to Hard",
      "Cultural Fit Questions"
    ],
    uploadedBy: "Admin",
    uploadedAt: "2025-01-11T10:00:00Z",
    description: "Microsoft interview preparation covering technical and cultural aspects"
  },
  {
    id: "CSP003",
    company: "Amazon",
    topics: [
      "Leadership Principles",
      "System Design - Distributed Systems",
      "Data Structures and Algorithms",
      "Behavioral Questions - STAR Method",
      "Coding Rounds - Online Assessment"
    ],
    uploadedBy: "Admin",
    uploadedAt: "2025-01-12T10:00:00Z",
    description: "Amazon interview guide focusing on leadership principles and technical skills"
  },
  {
    id: "CSP004",
    company: "TCS",
    topics: [
      "Aptitude Test - Quantitative and Verbal",
      "Programming - C, C++, Java Basics",
      "Technical Interview - Core Subjects",
      "HR Round - Communication Skills",
      "Group Discussion Topics"
    ],
    uploadedBy: "Admin",
    uploadedAt: "2025-01-13T10:00:00Z",
    description: "TCS placement preparation covering all rounds"
  },
  {
    id: "CSP005",
    company: "Infosys",
    topics: [
      "Aptitude and Reasoning",
      "Programming Fundamentals",
      "Technical Interview - Domain Knowledge",
      "HR Interview - Soft Skills",
      "System Design Basics"
    ],
    uploadedBy: "Admin",
    uploadedAt: "2025-01-14T10:00:00Z",
    description: "Infosys interview preparation materials"
  }
]

// Mock Faculty Feedback
export const mockFacultyFeedback: FacultyFeedback[] = [
  {
    id: "FFB001",
    studentId: "STU0001",
    facultyId: "FAC001",
    facultyName: "Dr. Sharma",
    category: "academics",
    subject: "Semester Performance Review",
    content: "Excellent performance in Data Structures. Keep up the good work! Focus on improving time complexity analysis.",
    rating: 4,
    timestamp: "2025-01-15T10:00:00Z"
  },
  {
    id: "FFB002",
    studentId: "STU0001",
    facultyId: "FAC002",
    facultyName: "Prof. Kumar",
    category: "training",
    subject: "Full Stack Training Feedback",
    content: "Good progress in React and Node.js. Practice more on database optimization and API design.",
    rating: 4,
    timestamp: "2025-01-14T14:30:00Z"
  },
  {
    id: "FFB003",
    studentId: "STU0002",
    facultyId: "FAC001",
    facultyName: "Dr. Sharma",
    category: "academics",
    subject: "Mid-Semester Evaluation",
    content: "Strong understanding of algorithms. Need to work on implementation speed for coding interviews.",
    rating: 5,
    timestamp: "2025-01-13T09:00:00Z"
  }
]

// Student Performance Interface
export interface StudentPerformance {
  studentId: string
  cgpa: number
  semesterMarks: {
    semester: number
    marks: number
    grade: string
  }[]
  trainingPerformance: {
    averageScore: number
    completedTrainings: number
  }
  assignmentPerformance: {
    averageScore: number
    submittedAssignments: number
  }
}

// Mock Student Performance Data
export const mockStudentPerformance: StudentPerformance[] = [
  {
    studentId: "STU0001",
    cgpa: 8.7,
    semesterMarks: [
      { semester: 1, marks: 85, grade: "A" },
      { semester: 2, marks: 88, grade: "A" },
      { semester: 3, marks: 87, grade: "A" },
      { semester: 4, marks: 90, grade: "A+" },
    ],
    trainingPerformance: {
      averageScore: 92,
      completedTrainings: 5,
    },
    assignmentPerformance: {
      averageScore: 88,
      submittedAssignments: 12,
    },
  },
  {
    studentId: "STU0002",
    cgpa: 8.9,
    semesterMarks: [
      { semester: 1, marks: 90, grade: "A+" },
      { semester: 2, marks: 89, grade: "A" },
      { semester: 3, marks: 91, grade: "A+" },
      { semester: 4, marks: 88, grade: "A" },
    ],
    trainingPerformance: {
      averageScore: 95,
      completedTrainings: 6,
    },
    assignmentPerformance: {
      averageScore: 91,
      submittedAssignments: 15,
    },
  },
  {
    studentId: "STU0003",
    cgpa: 7.6,
    semesterMarks: [
      { semester: 1, marks: 75, grade: "B+" },
      { semester: 2, marks: 78, grade: "A-" },
      { semester: 3, marks: 76, grade: "B+" },
      { semester: 4, marks: 80, grade: "A-" },
    ],
    trainingPerformance: {
      averageScore: 82,
      completedTrainings: 4,
    },
    assignmentPerformance: {
      averageScore: 79,
      submittedAssignments: 10,
    },
  },
]

// Resource Interface
export interface Resource {
  id: string
  title: string
  description: string
  category: "exam" | "mid" | "interview" | "company"
  fileUrl: string
  tags: string[]
  uploadedBy: string
  uploadedAt: string
}

// Mock Resources Data
export const mockResources: Resource[] = [
  {
    id: "RES001",
    title: "Final Exam Question Papers - 2024",
    description: "Previous year question papers for all branches",
    category: "exam",
    fileUrl: "https://example.com/exam-papers-2024.pdf",
    tags: ["exam", "question-papers", "2024"],
    uploadedBy: "Dr. Sharma",
    uploadedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "RES002",
    title: "Mid-Semester Syllabus - CSE",
    description: "Complete syllabus for mid-semester examinations",
    category: "mid",
    fileUrl: "https://example.com/mid-syllabus-cse.pdf",
    tags: ["mid", "syllabus", "CSE"],
    uploadedBy: "Prof. Kumar",
    uploadedAt: "2025-01-14T14:30:00Z",
  },
  {
    id: "RES003",
    title: "Interview Preparation Guide",
    description: "Comprehensive guide for technical and HR interviews",
    category: "interview",
    fileUrl: "https://example.com/interview-guide.pdf",
    tags: ["interview", "preparation", "guide"],
    uploadedBy: "Dr. Patel",
    uploadedAt: "2025-01-13T09:00:00Z",
  },
  {
    id: "RES004",
    title: "Google Company Profile",
    description: "Company information, interview process, and requirements",
    category: "company",
    fileUrl: "https://example.com/google-profile.pdf",
    tags: ["company", "google", "profile"],
    uploadedBy: "Prof. Mehta",
    uploadedAt: "2025-01-12T11:00:00Z",
  },
]