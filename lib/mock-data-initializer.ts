// Mock Data Initializer - Populates 200 items for testing
import { PlacementDriveService, RegistrationService, type PlacementDrive, type StudentRegistration } from "./placement-service"
import { AuthService, type User } from "./auth-service"

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Adobe", "Oracle", "IBM", "Intel",
  "Nvidia", "Salesforce", "Uber", "Airbnb", "Twitter", "LinkedIn", "PayPal", "Stripe", "Shopify", "Square",
  "Zoom", "Slack", "Dropbox", "Spotify", "Pinterest", "Snapchat", "TikTok", "ByteDance", "Alibaba", "Tencent",
  "Infosys", "TCS", "Wipro", "HCL", "Accenture", "Cognizant", "Capgemini", "Tech Mahindra", "L&T", "Mindtree",
  "Zoho", "Freshworks", "Razorpay", "PhonePe", "Paytm", "Flipkart", "Myntra", "Ola", "Swiggy", "Zomato",
  "Byju's", "Unacademy", "Vedantu", "WhiteHat Jr", "Coding Ninjas", "GeeksforGeeks", "InterviewBit", "LeetCode", "HackerRank", "CodeChef",
  "Goldman Sachs", "JPMorgan", "Morgan Stanley", "Deutsche Bank", "Barclays", "Credit Suisse", "Citibank", "HSBC", "BNP Paribas", "UBS",
  "McKinsey", "BCG", "Bain", "Deloitte", "PwC", "EY", "KPMG", "Roland Berger", "Oliver Wyman", "AT Kearney",
  "Samsung", "LG", "Sony", "Panasonic", "Philips", "Bosch", "Siemens", "GE", "Honeywell", "ABB",
  "Tesla", "Ford", "BMW", "Mercedes", "Audi", "Volkswagen", "Toyota", "Honda", "Nissan", "Hyundai",
  "Reliance", "Tata", "Adani", "Mahindra", "Bajaj", "Hero", "Maruti", "Ashok Leyland", "Godrej", "ITC",
  "HDFC Bank", "ICICI Bank", "Axis Bank", "SBI", "Kotak", "IndusInd", "Yes Bank", "Federal Bank", "PNB", "Canara Bank",
  "Airtel", "Jio", "Vodafone", "BSNL", "Idea", "Tata Communications", "Tech Mahindra", "Mphasis", "Hexaware", "Persistent",
  "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Razer", "Corsair", "Logitech", "SteelSeries",
  "Nike", "Adidas", "Puma", "Reebok", "Under Armour", "New Balance", "Converse", "Vans", "Skechers", "Fila",
  "Coca-Cola", "Pepsi", "Red Bull", "Monster", "Starbucks", "Dunkin", "McDonald's", "KFC", "Pizza Hut", "Domino's",
  "Nestle", "Unilever", "P&G", "Colgate", "Johnson & Johnson", "L'Oreal", "Estee Lauder", "Shiseido", "Amway", "Avon",
  "Disney", "Warner Bros", "Universal", "Sony Pictures", "Paramount", "20th Century", "Lionsgate", "MGM", "Netflix", "Amazon Prime",
  "EA", "Ubisoft", "Activision", "Blizzard", "Epic Games", "Riot Games", "Supercell", "King", "Zynga", "Glu Mobile"
]

const roles = [
  "Software Engineer", "Senior Software Engineer", "Full Stack Developer", "Backend Developer", "Frontend Developer",
  "DevOps Engineer", "Cloud Engineer", "Data Engineer", "Data Scientist", "ML Engineer",
  "AI Engineer", "QA Engineer", "Test Engineer", "Automation Engineer", "Security Engineer",
  "Product Manager", "Product Designer", "UI/UX Designer", "Business Analyst", "Data Analyst",
  "Project Manager", "Scrum Master", "Technical Lead", "Engineering Manager", "Architect",
  "Database Administrator", "System Administrator", "Network Engineer", "Cybersecurity Analyst", "Penetration Tester",
  "Mobile Developer", "iOS Developer", "Android Developer", "React Native Developer", "Flutter Developer",
  "Blockchain Developer", "Web3 Developer", "Game Developer", "Unity Developer", "Unreal Developer",
  "Sales Engineer", "Solutions Architect", "Customer Success Manager", "Technical Writer", "Content Writer",
  "Marketing Manager", "Digital Marketing", "SEO Specialist", "Social Media Manager", "Growth Hacker"
]

const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE", "AIDS", "AI/ML", "Cybersecurity", "IoT", "ServiceNow"]
const years = ["1st", "2nd", "3rd", "4th"]
const statuses: ("active" | "closed" | "upcoming")[] = ["active", "closed", "upcoming"]
const types: ("placement" | "internship")[] = ["placement", "internship"]

const packages = [
  "15-20 LPA", "20-25 LPA", "25-30 LPA", "30-35 LPA", "35-40 LPA",
  "40-45 LPA", "45-50 LPA", "50-60 LPA", "60-70 LPA", "70-80 LPA",
  "80-100 LPA", "100+ LPA", "12-15 LPA", "18-22 LPA", "22-28 LPA"
]

// Initialize 200 Mock Drives
export function initializeMockDrives(force: boolean = false) {
  if (typeof window === "undefined") return

  const existing = PlacementDriveService.getAll()
  if (!force && existing.length >= 200) return // Already initialized

  const drives: PlacementDrive[] = Array.from({ length: 200 }, (_, i) => {
    const company = companies[i % companies.length]
    const role = roles[i % roles.length]
    const status = statuses[i % statuses.length]
    const type = types[i % types.length]
    const packageRange = packages[i % packages.length]
    const minCGPA = Number((6.0 + Math.random() * 2.5).toFixed(1))
    const eligibleBranches = branches.slice(0, Math.floor(Math.random() * 5) + 1)
    const eligibleYears = years.slice(0, Math.floor(Math.random() * 3) + 1)
    
    // Create deadline dates (some past, some future)
    const daysOffset = Math.floor(Math.random() * 90) - 30 // -30 to +60 days
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + daysOffset)
    
    return {
      id: `DRV_${String(i + 1).padStart(4, "0")}`,
      companyName: `${company}${i > companies.length ? ` ${Math.floor(i / companies.length) + 1}` : ""}`,
      jobDescription: `Join ${company} as a ${role}. We are looking for talented individuals to work on cutting-edge projects. Responsibilities include developing scalable applications, collaborating with cross-functional teams, and contributing to innovative solutions. Requirements: Strong problem-solving skills, excellent communication, and passion for technology.`,
      package: packageRange,
      eligibilityCriteria: {
        minCGPA: minCGPA,
        branches: eligibleBranches.length > 0 ? eligibleBranches : undefined,
        years: eligibleYears.length > 0 ? eligibleYears : undefined,
        specificStudents: undefined,
      },
      position: role,
      registrationLink: `https://${company.toLowerCase().replace(/\s+/g, "")}.com/careers/apply/${i + 1}`,
      companyInfoLink: `https://${company.toLowerCase().replace(/\s+/g, "")}.com/about`,
      seriesNumber: `SN${String(i + 1).padStart(6, "0")}`,
      status: status,
      deadline: deadline.toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "admin",
      type: type,
    }
  })

  // Save to localStorage
  localStorage.setItem("rce_placement_drives", JSON.stringify(drives))
}

// Initialize 200 Mock Registrations
export function initializeMockRegistrations(force: boolean = false) {
  if (typeof window === "undefined") return

  const existing = RegistrationService.getAll()
  if (!force && existing.length >= 200) return // Already initialized

  const drives = PlacementDriveService.getAll()
  if (drives.length === 0) {
    initializeMockDrives()
    // Reload drives
    const updatedDrives = PlacementDriveService.getAll()
    if (updatedDrives.length === 0) return
  }

  const allDrives = PlacementDriveService.getAll()
  const studentNames = [
    "Arjun Singh", "Priya Sharma", "Rahul Kumar", "Sneha Patel", "Vikram Reddy",
    "Ananya Desai", "Karan Mehta", "Isha Joshi", "Rohan Agarwal", "Divya Nair",
    "Aman Gupta", "Kavya Iyer", "Siddharth Rao", "Meera Krishnan", "Aditya Menon",
    "Pooja Nair", "Rishabh Shah", "Neha Kapoor", "Varun Malhotra", "Shreya Reddy"
  ]

  const registrations: StudentRegistration[] = Array.from({ length: 200 }, (_, i) => {
    const drive = allDrives[i % allDrives.length]
    const studentName = studentNames[i % studentNames.length]
    const branch = branches[i % branches.length]
    const year = years[i % years.length]
    const cgpa = Number((6.5 + Math.random() * 2.5).toFixed(2))
    const hasOffer = Math.random() > 0.7 // 30% have offers
    const status: "submitted" | "pending" | "expired" = 
      Math.random() > 0.8 ? "expired" : Math.random() > 0.3 ? "submitted" : "pending"
    
    const submittedAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)

    return {
      id: `REG_${String(i + 1).padStart(4, "0")}`,
      driveId: drive.id,
      studentId: `STU${String((i % 100) + 1).padStart(4, "0")}`,
      studentName: `${studentName} ${Math.floor(i / 20) + 1}`,
      rollNumber: `202${Math.floor(Math.random() * 4) + 1}${branch}${String((i % 100) + 1).padStart(3, "0")}`,
      branch: branch,
      year: year,
      cgpa: cgpa,
      email: `student${i + 1}@rce.edu.in`,
      phone: `+91 ${9000000000 + i}`,
      linkedin: `https://linkedin.com/in/student${i + 1}`,
      github: `https://github.com/student${i + 1}`,
      status: status,
      submittedAt: submittedAt.toISOString(),
      hasOffer: hasOffer,
      offerDocuments: hasOffer ? {
        offerLetter: Math.random() > 0.5 ? `https://storage.example.com/offers/offer_${i + 1}.pdf` : undefined,
        emailConfirmation: Math.random() > 0.5 ? `https://storage.example.com/offers/email_${i + 1}.pdf` : undefined,
        loi: Math.random() > 0.5 ? `https://storage.example.com/offers/loi_${i + 1}.pdf` : undefined,
        internshipOffer: drive.type === "internship" && Math.random() > 0.5 
          ? `https://storage.example.com/offers/internship_${i + 1}.pdf` 
          : undefined,
      } : undefined,
    }
  })

  // Save to localStorage
  localStorage.setItem("rce_student_registrations", JSON.stringify(registrations))
}

// Initialize all mock data
export function initializeAllMockData(force: boolean = false) {
  if (typeof window === "undefined") return

  console.log("Initializing mock data...")
  initializeMockDrives(force)
  initializeMockRegistrations(force)
  console.log("Mock data initialized successfully!")
  
  // Also initialize default admin user if not exists
  const users = AuthService.getUsers()
  if (users.length === 0) {
    AuthService.initialize()
  }
}

// Auto-initialize on import (client-side only)
if (typeof window !== "undefined") {
  // Initialize after a short delay to ensure localStorage is ready
  setTimeout(() => {
    try {
      const drives = PlacementDriveService.getAll()
      const registrations = RegistrationService.getAll()
      
      if (drives.length < 200 || registrations.length < 200) {
        initializeAllMockData()
      }
    } catch (error) {
      console.error("Error auto-initializing mock data:", error)
    }
  }, 1000)
}

