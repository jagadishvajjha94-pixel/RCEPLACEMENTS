"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutGrid, Briefcase, Users, Settings, LogOut, Menu, X, TrendingUp, GraduationCap, BookCheck, Zap, Code, Image, Database, Bot } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AuthService } from "@/lib/auth-service"

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/admin/dashboard" },
  { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
  { icon: Bot, label: "AI Automation", href: "/admin/ai-automation" },
  { icon: Briefcase, label: "Placement Drives", href: "/admin/placements" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: BookCheck, label: "Training & Assessments", href: "/admin/training-assessments" },
  { icon: Zap, label: "Boot Camps & Infosys", href: "/admin/bootcamp-infosys" },
  { icon: Code, label: "Interview Prep", href: "/admin/interview-prep" },
  { icon: GraduationCap, label: "Mid Marks & Syllabus", href: "/admin/mid-marks-syllabus" },
  { icon: Image, label: "Activities & Posters", href: "/admin/activities-posters" },
  { icon: Database, label: "AICTE / RiseUp", href: "/admin/aicte-riseup" },
]

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkDesktop = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1024)
      if (width >= 1024) {
        setIsOpen(true) // Always open on desktop
      }
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#CC5500] hover:bg-[#B84E00] text-white border border-[#A34700]"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isDesktop ? 0 : (isOpen ? 0 : -280)
        }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-72 bg-[#CC5500] dark:bg-[#CC5500] border-r border-[#A34700] z-30 flex flex-col overflow-y-auto"
      >
        <div className="p-6 border-b border-[#A34700]">
          <h1 className="text-2xl font-bold text-white">
            RCE Hub
          </h1>
          <p className="text-xs text-gray-400 mt-1">Admin Portal</p>
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

        <div className="p-6 border-t border-[#A34700] space-y-2">
          <Link to="/admin/settings">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </motion.div>
          </Link>
          <Button onClick={handleSignOut} className="w-full gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/20">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
