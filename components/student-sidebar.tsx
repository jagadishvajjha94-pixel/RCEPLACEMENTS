"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Briefcase,
  LayoutGrid,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  MessageSquare,
  Calendar,
  CheckSquare,
} from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth-service"

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/student/dashboard" },
  { icon: Briefcase, label: "Placement Drives", href: "/student/drives" },
  { icon: CheckSquare, label: "My Applications", href: "/student/applications" },
  { icon: FileText, label: "My Documents", href: "/student/documents" },
  { icon: BookOpen, label: "Interview Prep", href: "/student/interview-prep" },
  { icon: MessageSquare, label: "Feedback", href: "/student/feedback" },
  { icon: Calendar, label: "Schedule", href: "/student/schedule" },
]

export function StudentSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

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
    router.push("/login")
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#1e3a5f] text-white border border-[#2a4a6f]"
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
        className="fixed left-0 top-0 h-screen w-72 bg-[#1e3a5f] dark:bg-[#1e3a5f] border-r border-[#2a4a6f] z-30 flex flex-col overflow-y-auto"
      >
        <div className="p-6 border-b border-[#2a4a6f]">
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
              <Link key={index} href={item.href} onClick={() => setIsOpen(false)}>
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

        <div className="p-6 border-t border-[#2a4a6f] space-y-2">
          <Link href="/student/settings">
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
