"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, HelpCircle } from "lucide-react"
import { AuthService } from "@/lib/auth-service"

export default function HelpDeskLoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = AuthService.login(loginData.email, loginData.password)
    
    if (user) {
      if (user.role !== "help-desk" && user.role !== "admin") {
        setError("Access denied. This account does not have help desk access.")
        return
      }

      if (user.role === "admin") {
        navigate("/admin/help-desk")
      } else {
        navigate("/help-desk/dashboard")
      }
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
            T&P Help Desk Portal
          </h1>
          <p className="text-gray-600">Manage support tickets and queries</p>
        </div>

        <Card className="border-2 border-gray-300 shadow-sm bg-white p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full ring-2 ring-[#CC5500]/40 bg-gradient-to-r from-black to-purple-200 flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-8 h-8 text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
            <p className="text-sm text-gray-600">Sign in to your help desk account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="helpdesk@rce.edu"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-gray-900"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Main Login
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
