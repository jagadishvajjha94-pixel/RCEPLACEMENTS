"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, Lock, User, GraduationCap, BookOpen, Shield, Chrome, Briefcase, HelpCircle, Sparkles, List, LayoutGrid } from "lucide-react"
import { AuthService } from "@/lib/auth-service"

type RoleType = "student" | "faculty" | "admin" | "placement-drives" | "career-guidance" | "training-assessments" | "servicenow" | "help-desk"

const ROLE_OPTIONS: { value: RoleType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "student", label: "Student", icon: <GraduationCap className="w-4 h-4" />, color: "from-blue-500 to-cyan-500" },
  { value: "faculty", label: "Faculty", icon: <BookOpen className="w-4 h-4" />, color: "from-purple-500 to-pink-500" },
  { value: "admin", label: "Admin", icon: <Shield className="w-4 h-4" />, color: "from-indigo-500 to-purple-500" },
  { value: "placement-drives", label: "Placement Drives", icon: <Briefcase className="w-4 h-4" />, color: "from-emerald-500 to-teal-500" },
  { value: "career-guidance", label: "Career Guidance", icon: <GraduationCap className="w-4 h-4" />, color: "from-orange-500 to-red-500" },
  { value: "training-assessments", label: "Training & Assessments", icon: <BookOpen className="w-4 h-4" />, color: "from-violet-500 to-purple-500" },
  { value: "servicenow", label: "ServiceNow & AICTE", icon: <BookOpen className="w-4 h-4" />, color: "from-cyan-500 to-blue-500" },
  { value: "help-desk", label: "T&P Help Desk", icon: <HelpCircle className="w-4 h-4" />, color: "from-rose-500 to-pink-500" },
]

type RoleViewMode = "dropdown" | "cards"

export default function LoginPage() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<RoleType>("student")
  const [roleViewMode, setRoleViewMode] = useState<RoleViewMode>("dropdown")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const sectionRoles = ["placement-drives", "career-guidance", "training-assessments", "servicenow", "help-desk", "admin"]
  const selectedRoleData = ROLE_OPTIONS.find(r => r.value === selectedRole)!

  const [loginData, setLoginData] = useState({ email: "", password: "" })
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
    setTimeout(() => {
      const googleEmail = `user${Date.now()}@gmail.com`
      const user = AuthService.registerUser({
        name: "Google User",
        email: googleEmail,
        password: "google-oauth-" + Date.now(),
        role: selectedRole,
        profile: selectedRole === "student" ? {
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
        if (selectedRole === "student") navigate("/student/dashboard")
        else if (selectedRole === "faculty") navigate("/faculty/dashboard")
      }
      setIsGoogleLoading(false)
    }, 1000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const user = AuthService.login(loginData.email, loginData.password)
    if (user) {
      if (user.role !== selectedRole && user.role !== "admin") {
        setError(`This account is registered as ${user.role}, not ${selectedRole}`)
        return
      }
      if (user.role === "student") navigate("/student/dashboard")
      else if (user.role === "faculty") navigate("/faculty/dashboard")
      else if (user.role === "admin") {
        if (selectedRole === "placement-drives") navigate("/admin/placements")
        else if (selectedRole === "career-guidance") navigate("/admin/career-guidance")
        else if (selectedRole === "training-assessments") navigate("/admin/training-assessments")
        else if (selectedRole === "servicenow") navigate("/admin/servicenow-modules")
        else if (selectedRole === "help-desk") navigate("/admin/help-desk")
        else navigate("/admin/dashboard")
      } else if (user.role === "placement-drives") navigate("/placement-drives/dashboard")
      else if (user.role === "career-guidance") navigate("/career-guidance/dashboard")
      else if (user.role === "training-assessments") navigate("/training-assessments/dashboard")
      else if (user.role === "servicenow") navigate("/servicenow/dashboard")
      else if (user.role === "help-desk") navigate("/help-desk/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if ((selectedRole === "student" || selectedRole === "faculty") && !registerData.email.endsWith("@gmail.com")) {
      setError("Please use a Gmail address (@gmail.com)")
      return
    }
    const user = AuthService.registerUser({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      role: selectedRole,
      profile: selectedRole === "student" ? {
        rollNumber: registerData.rollNumber,
        branch: registerData.branch,
        section: registerData.section,
        year: registerData.year,
        cgpa: 0,
        phone: "",
      } : undefined,
    })
    if (user) {
      AuthService.login(registerData.email, registerData.password)
      if (selectedRole === "student") navigate("/student/dashboard")
      else if (selectedRole === "faculty") navigate("/faculty/dashboard")
    } else {
      setError("Email already registered. Please login instead.")
    }
  }

  const getPlaceholderEmail = () => {
    switch (selectedRole) {
      case "admin": return "admin@rce.edu"
      case "placement-drives": return "placement@rce.edu"
      case "career-guidance": return "career@rce.edu"
      case "training-assessments": return "training@rce.edu"
      case "servicenow": return "servicenow@rce.edu"
      case "help-desk": return "helpdesk@rce.edu"
      default: return "your.email@gmail.com"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        className={`w-full relative z-10 ${roleViewMode === "cards" ? "max-w-2xl" : "max-w-md"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo/Header Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4 shadow-lg shadow-blue-500/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            RCE Career Hub
          </h1>
          <p className="text-gray-600 text-sm">Your gateway to career success</p>
        </motion.div>

        {/* Main Card */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
          <div className={`h-1 bg-gradient-to-r ${selectedRoleData.color}`} />
          
          <div className="p-8">
            {/* View Toggle: Dropdown vs Cards */}
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Select Your Role
              </label>
              <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50/80">
                <button
                  type="button"
                  onClick={() => setRoleViewMode("dropdown")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    roleViewMode === "dropdown"
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Dropdown
                </button>
                <button
                  type="button"
                  onClick={() => setRoleViewMode("cards")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    roleViewMode === "cards"
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Cards
                </button>
              </div>
            </div>

            {/* Role Selector: Dropdown or Cards */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {roleViewMode === "dropdown" ? (
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as RoleType)}>
                  <SelectTrigger className="w-full h-12 bg-gray-50/50 border-2 border-gray-200 hover:border-gray-300 transition-colors text-gray-900 font-medium">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${selectedRoleData.color} text-white shadow-sm`}>
                        {selectedRoleData.icon}
                      </div>
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {ROLE_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="cursor-pointer py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${opt.color} text-white`}>
                            {opt.icon}
                          </div>
                          <span className="font-medium">{opt.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ROLE_OPTIONS.map((opt) => {
                    const isSelected = selectedRole === opt.value
                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedRole(opt.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? `border-transparent bg-gradient-to-br ${opt.color} text-white shadow-lg`
                            : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-100/80 text-gray-700"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-white/20 text-white" : `bg-gradient-to-br ${opt.color} text-white`}`}>
                          {opt.icon}
                        </div>
                        <span className={`text-xs font-semibold leading-tight text-center ${isSelected ? "text-white" : "text-gray-700"}`}>
                          {opt.label}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </motion.div>

            {/* Welcome Message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                className="text-center mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {isRegistering ? "Create Your Account" : "Welcome Back"}
                </h2>
                <p className="text-sm text-gray-500">
                  {isRegistering
                    ? `Join as ${selectedRoleData.label}`
                    : `Sign in to continue to ${selectedRoleData.label}`}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-4 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Sign In */}
            {(selectedRole === "student" || selectedRole === "faculty") && !isRegistering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  variant="outline"
                  className="w-full h-11 mb-4 gap-2 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium"
                >
                  <Chrome className="w-5 h-5" />
                  {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                </Button>
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-400 font-medium">OR</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Forms */}
            <AnimatePresence mode="wait">
              {!isRegistering || sectionRoles.includes(selectedRole) ? (
                <motion.form
                  key="login"
                  onSubmit={handleLogin}
                  className="space-y-5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="email"
                        placeholder={getPlaceholderEmail()}
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-11 h-11 bg-gray-50/50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-11 h-11 bg-gray-50/50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full h-11 bg-gradient-to-r ${selectedRoleData.color} hover:opacity-90 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all`}
                  >
                    Sign In
                  </Button>

                  {(selectedRole === "student" || selectedRole === "faculty") && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Don&apos;t have an account? <span className="underline">Register here</span>
                      </button>
                    </div>
                  )}
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  onSubmit={handleRegister}
                  className="space-y-5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="h-11 bg-gray-50/50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Email Address {selectedRole !== "admin" && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="your.email@gmail.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="pl-11 h-11 bg-gray-50/50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                    {(selectedRole === "student" || selectedRole === "faculty") && (
                      <p className="text-xs text-gray-500 mt-1">Must be a Gmail address</p>
                    )}
                  </div>

                  {selectedRole === "student" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Roll Number</label>
                        <Input
                          type="text"
                          placeholder="21CSE001"
                          value={registerData.rollNumber}
                          onChange={(e) => setRegisterData({ ...registerData, rollNumber: e.target.value })}
                          className="h-11 bg-gray-50/50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-gray-700">Branch</label>
                          <select
                            value={registerData.branch}
                            onChange={(e) => setRegisterData({ ...registerData, branch: e.target.value })}
                            className="w-full h-11 px-3 rounded-md border-2 border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:bg-white text-gray-900 text-sm font-medium transition-colors"
                          >
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="Mechanical">Mech</option>
                            <option value="Civil">Civil</option>
                            <option value="EEE">EEE</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-gray-700">Section</label>
                          <select
                            value={registerData.section}
                            onChange={(e) => setRegisterData({ ...registerData, section: e.target.value })}
                            className="w-full h-11 px-3 rounded-md border-2 border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:bg-white text-gray-900 text-sm font-medium transition-colors"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-gray-700">Year</label>
                          <select
                            value={registerData.year}
                            onChange={(e) => setRegisterData({ ...registerData, year: e.target.value })}
                            className="w-full h-11 px-3 rounded-md border-2 border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:bg-white text-gray-900 text-sm font-medium transition-colors"
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

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="password"
                        placeholder="Create a strong password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="pl-11 h-11 bg-gray-50/50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="password"
                        placeholder="Re-enter your password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="pl-11 h-11 bg-gray-50/50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full h-11 bg-gradient-to-r ${selectedRoleData.color} hover:opacity-90 text-white font-semibold shadow-lg transition-all`}
                  >
                    Create Account
                  </Button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(false)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Already have an account? <span className="underline">Sign in</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          © 2025 RCE Career Hub. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}
