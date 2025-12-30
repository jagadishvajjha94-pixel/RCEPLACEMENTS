
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, GraduationCap, BookOpen, Shield, Chrome } from "lucide-react"
import { AuthService } from "@/lib/auth-service"

type RoleType = "student" | "faculty" | "admin"

export default function LoginPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<RoleType>("student")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rollNumber: "",
    branch: "CSE",
    section: "A",
    year: "3rd",
  })

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")

    // Simulate Google OAuth - In production, this would use actual Google OAuth
    setTimeout(() => {
      // Auto-create user account with Google email
      const googleEmail = `user${Date.now()}@gmail.com`
      const user = AuthService.registerUser({
        name: "Google User",
        email: googleEmail,
        password: "google-oauth-" + Date.now(),
        role: activeTab,
        profile: activeTab === "student" ? {
          rollNumber: "AUTO" + Date.now(),
          branch: "CSE",
          section: "A",
          year: "3rd",
          cgpa: 0,
          phone: "",
        } : undefined,
      })

      if (user) {
        AuthService.login(googleEmail, user.password)
        
        if (activeTab === "student") {
          navigate("/student/dashboard")
        } else if (activeTab === "faculty") {
          navigate("/faculty/dashboard")
        }
      }
      setIsGoogleLoading(false)
    }, 1000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = AuthService.login(loginData.email, loginData.password)
    
    if (user) {
      if (user.role !== activeTab) {
        setError(`This account is registered as ${user.role}, not ${activeTab}`)
        return
      }

      // Redirect based on role
      if (user.role === "student") {
        navigate("/student/dashboard")
      } else if (user.role === "faculty") {
        navigate("/faculty/dashboard")
      } else if (user.role === "admin") {
        navigate("/admin/dashboard")
      }
    } else {
      setError("Invalid email or password")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate email format (must be Gmail for students and faculty)
    if (activeTab !== "admin" && !registerData.email.endsWith("@gmail.com")) {
      setError("Please use a Gmail address (@gmail.com)")
      return
    }

    const user = AuthService.registerUser({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      role: activeTab,
      profile: activeTab === "student" ? {
        rollNumber: registerData.rollNumber,
        branch: registerData.branch,
        section: registerData.section,
        year: registerData.year,
        cgpa: 0,
        phone: "",
      } : undefined,
    })

    if (user) {
      // Auto login after registration
      AuthService.login(registerData.email, registerData.password)
      
      if (activeTab === "student") {
        navigate("/student/dashboard")
      } else if (activeTab === "faculty") {
        navigate("/faculty/dashboard")
      }
    } else {
      setError("Email already registered. Please login instead.")
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-6 h-6" />
      case "faculty":
        return <BookOpen className="w-6 h-6" />
      case "admin":
        return <Shield className="w-6 h-6" />
      default:
        return <User className="w-6 h-6" />
    }
  }

  const getRoleColor = (role: string) => {
    // Unified blue to purple gradient for all roles
    return "from-blue-600 to-purple-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
            RCE Career Hub
          </h1>
          <p className="text-muted-foreground">Your gateway to career success</p>
        </div>

        <Card className="border-2 border-[#5A4636] shadow-2xl bg-[#2B2222]/90 backdrop-blur-sm p-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RoleType)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-transparent">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            {(["student", "faculty", "admin"] as RoleType[]).map((role) => (
              <TabsContent key={role} value={role}>
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full ring-2 ring-[#CC5500]/40 bg-gradient-to-r ${getRoleColor(role)} flex items-center justify-center mx-auto mb-3`}>
                    {getRoleIcon(role)}
                  </div>
                  <h2 className="text-2xl font-bold mb-1">
                    {isRegistering ? "Create Account" : "Welcome Back"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isRegistering ? `Register as ${role}` : `Sign in to your ${role} account`}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                {/* Google Sign In - Only for Student and Faculty */}
                {role !== "admin" && !isRegistering && (
                  <>
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      className={`w-full mb-4 bg-gradient-to-r ${getRoleColor(role)} hover:opacity-90 gap-2`}
                    >
                      <Chrome className="w-5 h-5" />
                      {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
                    </Button>

                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#2B2222] text-[#C9B7A6]">Or continue with email</span>
                      </div>
                    </div>
                  </>
                )}

                {!isRegistering ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          type="email"
                          placeholder={role === "admin" ? "admin@rce.edu" : "your.email@gmail.com"}
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className="pl-10 bg-[#2E2424] border-[#5A4636] text-[#F5EDE6] placeholder:text-[#C9B7A6] focus-visible:ring-[#CC5500]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="pl-10 bg-[#2E2424] border-[#5A4636] text-[#F5EDE6] placeholder:text-[#C9B7A6] focus-visible:ring-[#CC5500]"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className={`w-full bg-gradient-to-r ${getRoleColor(role)} hover:opacity-90`}
                    >
                      Sign In
                    </Button>

                    {role !== "admin" && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setIsRegistering(true)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Don't have an account? Register
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Full Name</label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Gmail Address {role !== "admin" && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          type="email"
                          placeholder="your.email@gmail.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          className="pl-10 bg-[#2E2424] border-[#5A4636] text-[#F5EDE6] placeholder:text-[#C9B7A6] focus-visible:ring-[#CC5500]"
                          required
                        />
                      </div>
                      {role !== "admin" && (
                        <p className="text-xs text-muted-foreground mt-1">Must be a Gmail address</p>
                      )}
                    </div>

                    {role === "student" && (
                      <>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Roll Number</label>
                          <Input
                            type="text"
                            placeholder="21CSE001"
                            value={registerData.rollNumber}
                            onChange={(e) => setRegisterData({ ...registerData, rollNumber: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-sm font-semibold mb-2 block">Branch</label>
                            <select
                              value={registerData.branch}
                              onChange={(e) => setRegisterData({ ...registerData, branch: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border bg-background"
                            >
                              <option value="CSE">CSE</option>
                              <option value="ECE">ECE</option>
                              <option value="Mechanical">Mech</option>
                              <option value="Civil">Civil</option>
                              <option value="EEE">EEE</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-2 block">Section</label>
                            <select
                              value={registerData.section}
                              onChange={(e) => setRegisterData({ ...registerData, section: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border bg-background"
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-2 block">Year</label>
                            <select
                              value={registerData.year}
                              onChange={(e) => setRegisterData({ ...registerData, year: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border bg-background"
                            >
                              <option value="1st">1st</option>
                              <option value="2nd">2nd</option>
                              <option value="3rd">3rd</option>
                              <option value="4th">4th</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-sm font-semibold mb-2 block">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="pl-10 bg-[#2E2424] border-[#5A4636] text-[#F5EDE6] placeholder:text-[#C9B7A6] focus-visible:ring-[#CC5500]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          className="pl-10 bg-[#2E2424] border-[#5A4636] text-[#F5EDE6] placeholder:text-[#C9B7A6] focus-visible:ring-[#CC5500]"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className={`w-full bg-gradient-to-r ${getRoleColor(role)} hover:opacity-90`}
                    >
                      Create Account
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Already have an account? Sign in
                      </button>
                    </div>
                  </form>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        <p className="text-center text-sm text-[#C9B7A6] mt-6">
          © 2025 RCE Career Hub. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}