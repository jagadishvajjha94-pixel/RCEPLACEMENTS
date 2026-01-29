// localStorage-based authentication service
export interface User {
  id: string
  email: string
  password: string
  role: "student" | "faculty" | "admin" | "placement-drives" | "career-guidance" | "training-assessments" | "servicenow" | "help-desk"
  name: string
  profile?: StudentProfile
}

export interface StudentProfile {
  rollNumber: string
  branch: string
  section: string
  year: string
  cgpa: number
  phone: string
  linkedin?: string
  github?: string
  resumeUrl?: string
  profilePictureUrl?: string
  technologies?: string[] // Technologies student has added to profile
}

export class AuthService {
  private static USERS_KEY = "rce_users"
  private static CURRENT_USER_KEY = "rce_current_user"

  // Initialize with default users
  static initialize() {
    const users = this.getUsers()
    if (users.length === 0) {
      // Add default admin (admin login doesn't require Gmail)
      this.registerUser({
        email: "admin@rce.edu",
        password: "admin123",
        role: "admin",
        name: "Admin User",
      })
      // Add default users for each section
      this.registerUser({
        email: "placement@rce.edu",
        password: "placement123",
        role: "placement-drives",
        name: "Placement Drives Manager",
      })
      this.registerUser({
        email: "career@rce.edu",
        password: "career123",
        role: "career-guidance",
        name: "Career Guidance Manager",
      })
      this.registerUser({
        email: "training@rce.edu",
        password: "training123",
        role: "training-assessments",
        name: "Training & Assessments Manager",
      })
      this.registerUser({
        email: "servicenow@rce.edu",
        password: "servicenow123",
        role: "servicenow",
        name: "ServiceNow Manager",
      })
      this.registerUser({
        email: "helpdesk@rce.edu",
        password: "helpdesk123",
        role: "help-desk",
        name: "Help Desk Manager",
      })
    }
  }

  static getUsers(): User[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.USERS_KEY)
    return data ? JSON.parse(data) : []
  }

  static saveUsers(users: User[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  static registerUser(userData: Omit<User, "id">): User | null {
    const users = this.getUsers()

    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return null
    }

    const newUser: User = {
      id: `USER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
    }

    users.push(newUser)
    this.saveUsers(users)
    return newUser
  }

  static login(email: string, password: string): User | null {
    const users = this.getUsers()
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      if (typeof window !== "undefined") {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
      }
      return user
    }
    return null
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(this.CURRENT_USER_KEY)
    return data ? JSON.parse(data) : null
  }

  static updateCurrentUser(updates: Partial<User>) {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return null

    const users = this.getUsers()
    const userIndex = users.findIndex(u => u.id === currentUser.id)

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      this.saveUsers(users)

      const updatedUser = users[userIndex]
      if (typeof window !== "undefined") {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser))
      }
      return updatedUser
    }
    return null
  }

  static updateProfile(profile: Partial<StudentProfile>): User | null {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return null

    return this.updateCurrentUser({
      profile: { ...currentUser.profile, ...profile } as StudentProfile,
    })
  }

  static logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.CURRENT_USER_KEY)
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

// Initialize on load
if (typeof window !== "undefined") {
  AuthService.initialize()
}