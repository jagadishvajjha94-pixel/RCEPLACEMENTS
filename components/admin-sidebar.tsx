"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutGrid, Briefcase, Users, Settings, LogOut, TrendingUp, GraduationCap, BookCheck, Zap, Code, Image, Database, Bot } from "lucide-react"
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
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const handleSignOut = () => {
    AuthService.logout()
    navigate("/login")
  }

  return (
    <>
      {/* Sidebar - Always Visible */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 z-30 flex flex-col overflow-y-auto shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                RCE Hub
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={index} to={item.href}>
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
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link to="/admin/settings">
            <motion.div
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-sm">Settings</span>
            </motion.div>
          </Link>
          <Button onClick={handleSignOut} className="w-full gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  )
}
