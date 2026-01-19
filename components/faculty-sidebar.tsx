"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutGrid, Users, BookOpen, FileText, Settings, LogOut, Menu, X, BarChart3, CheckSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AuthService } from "@/lib/auth-service"

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/faculty/dashboard" },
  { icon: Users, label: "Manage Students", href: "/faculty/students" },
  { icon: BookOpen, label: "Trainings", href: "/faculty/trainings" },
  { icon: CheckSquare, label: "Assignments", href: "/faculty/assignments" },
  { icon: FileText, label: "Resources", href: "/faculty/resources" },
  { icon: BarChart3, label: "Reports", href: "/faculty/reports" },
]

export function FacultySidebar() {
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
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-lg"
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
              <p className="text-xs text-gray-500 mt-0.5">Faculty Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={index} to={item.href} onClick={() => setIsOpen(false)}>
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
          <Link to="/faculty/settings">
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
      </motion.aside>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
