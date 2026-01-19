"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Briefcase,
  LayoutGrid,
  FileText,
  LogOut,
  BookOpen,
  MessageSquare,
  Calendar,
  CheckSquare,
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AuthService } from "@/lib/auth-service"

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/student/dashboard" },
  { icon: Briefcase, label: "Placement Drives", href: "/student/drives" },
  { icon: CheckSquare, label: "My Applications", href: "/student/applications" },
  { icon: FileText, label: "My Documents", href: "/student/documents" },
  { icon: Sparkles, label: "Resume Builder", href: "/student/resume-builder" },
  { icon: BookOpen, label: "Interview Prep", href: "/student/interview-prep" },
  { icon: MessageSquare, label: "Feedback", href: "/student/feedback" },
  { icon: Calendar, label: "Schedule", href: "/student/schedule" },
]

export function StudentSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkMobile = () => {
      const width = window.innerWidth
      setIsMobile(width < 1024)
      // On desktop, always show sidebar
      if (width >= 1024) {
        setIsOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleSignOut = () => {
    AuthService.logout()
    navigate("/login")
  }

  return (
    <>
      {/* Menu Button - Only on Mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 z-40 p-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-lg transition-all duration-300 ${isOpen ? 'left-[280px]' : 'left-4'}`}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Sidebar - Always Visible on Desktop, Toggleable on Mobile */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isMobile ? (isOpen ? 0 : -280) : 0
        }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 z-30 flex flex-col overflow-y-auto shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                RCE Hub
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Student Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={index} to={item.href} onClick={() => isMobile && setIsOpen(false)}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-blue-50 text-blue-600 font-medium" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="text-sm">{item.label}</span>
                  {item.label === "Feedback" && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">4</span>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button 
            onClick={handleSignOut} 
            className="w-full gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
            </Button>
        </div>
      </motion.aside>

      {/* Overlay - Only on Mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </>
  )
}
