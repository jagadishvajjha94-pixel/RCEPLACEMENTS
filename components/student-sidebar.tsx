"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Briefcase,
  LayoutGrid,
  FileText,
  LogOut,
  Menu,
  X,
  BookOpen,
  MessageSquare,
  Calendar,
  CheckSquare,
  Sparkles,
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
  const [isDesktop, setIsDesktop] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  // Expose isOpen state to parent components via custom event
  useEffect(() => {
    const event = new CustomEvent('sidebar-toggle', { detail: { isOpen } })
    window.dispatchEvent(event)
  }, [isOpen])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkDesktop = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1024)
      // Sidebar closed by default on all screen sizes
    }
    
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  const handleSignOut = () => {
    AuthService.logout()
    navigate("/login")
  }

  return (
    <>
      {/* Menu Button - Show on all screen sizes */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-40 p-2 rounded-lg bg-[#CC5500] hover:bg-[#B84E00] text-white border border-[#A34700] shadow-lg transition-all duration-300 ${isOpen ? 'left-[280px]' : 'left-4'}`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -280
        }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-72 bg-[#CC5500] dark:bg-[#CC5500] border-r border-[#A34700] z-30 flex flex-col overflow-y-auto"
      >
        <div className="p-6 border-b border-[#A34700]">
          <h1 className="text-2xl font-bold text-white">
            RCE Hub
          </h1>
          <p className="text-xs text-gray-400 mt-1">Student Portal</p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={index} to={item.href} onClick={() => setIsOpen(false)}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-[#A34700]">
          <Button onClick={handleSignOut} className="w-full gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/20">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setIsOpen(false)} />}
    </>
  )
}
