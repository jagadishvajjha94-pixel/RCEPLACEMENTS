"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { StudentHeader } from "@/components/student-header"
import { User, Plus, ArrowRight, Bell, Mail, AlertCircle, ChevronLeft, X } from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import type { User as AuthUser } from "@/lib/auth-service"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userName, setUserName] = useState("Student")
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setUserName(currentUser.name || "Student")
    }
  }, [])

  // Refresh user data when navigating back (for profile picture updates)
  useEffect(() => {
    const handleFocus = () => {
      const currentUser = AuthService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setUserName(currentUser.name || "Student")
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const profilePictureUrl = user?.profile?.profilePictureUrl

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <StudentHeader />
        <div className="flex-1 flex overflow-hidden pt-16">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
            <div className="w-full max-w-full">
              {children}
            </div>
          </main>
          {/* Arrow Button to Open Drawer - Only visible when drawer is closed */}
          {!isRightSidebarOpen && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsRightSidebarOpen(true)}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}

          {/* Right Sidebar Drawer - User Profile */}
          <AnimatePresence>
            {isRightSidebarOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsRightSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
                
                {/* Drawer */}
                <motion.aside
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-gray-200 overflow-y-auto z-50 shadow-2xl lg:relative lg:z-auto lg:shadow-none"
                >
            <div className="p-6 space-y-6">
                    {/* Header with Logout and Close Button */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => {
                    AuthService.logout()
                    navigate("/login")
                  }}
                  className="text-sm text-gray-900 hover:text-gray-700 transition-colors font-medium"
                >
                  Logout
                </button>
                      <button
                        onClick={() => setIsRightSidebarOpen(false)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {/* User Profile - Centered */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  {/* Large Avatar with light purple border */}
                  <div className="w-32 h-32 rounded-full border-2 border-purple-200 bg-purple-50 flex items-center justify-center overflow-hidden">
                    {profilePictureUrl ? (
                      <img 
                        src={profilePictureUrl} 
                        alt={userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-purple-400" />
                    )}
                  </div>
                  {/* Blue circle with plus sign overlapping bottom right - Clickable */}
                  <button
                    onClick={() => navigate("/student/profile")}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                {/* Name and Role */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{userName}</h3>
                <p className="text-sm text-purple-400 font-medium">Student</p>
              </div>

              {/* Language Proficiency Levels */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 rounded bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">B2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">English</p>
                    <p className="text-xs text-gray-500">High intermediate</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 rounded bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">C1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Spanish</p>
                    <p className="text-xs text-gray-500">Advanced</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>

              {/* Reminders Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Reminders</h3>
                  <div className="relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 rounded bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Eng - Vocabulary test</p>
                      <p className="text-xs text-gray-500 mt-0.5">24 Sep 2024, Friday</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Eng - Send grammar homework</p>
                      <p className="text-xs text-gray-500 mt-0.5">29 Sep 2024, Wednesday</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Spanish - Send essay</p>
                      <p className="text-xs text-gray-500 mt-0.5">05 Oct 2024, Monday</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg opacity-50">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Spanish - Reading task</p>
                      <p className="text-xs text-gray-500 mt-0.5">10 Oct 2024, Saturday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
