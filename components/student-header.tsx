"use client"

import { useState, useEffect } from "react"
import { Search, Bell, ChevronDown, User, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthService } from "@/lib/auth-service"
import { NotificationFeed, NotificationService } from "@/components/notification-feed"
import { useNavigate } from "react-router-dom"

export function StudentHeader() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState("Student")
  const [userInitials, setUserInitials] = useState("ST")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const currentUser = AuthService.getCurrentUser()
      const name = currentUser?.name || "Student"
      setUserName(name)
      setUserInitials(name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2))
    }
  }, [])

  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setSidebarOpen(event.detail.isOpen)
    }
    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const updateUnreadCount = () => {
      if (typeof window !== "undefined") {
        setUnreadCount(NotificationService.getUnreadCount())
      }
    }
    updateUnreadCount()
    const interval = setInterval(updateUnreadCount, 5000)
    return () => clearInterval(interval)
  }, [mounted])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.user-dropdown')) {
        setUserDropdownOpen(false)
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [userDropdownOpen])

  const handleSignOut = () => {
    AuthService.logout()
    navigate("/login")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or filter content
      console.log("Searching for:", searchQuery)
      // You can implement actual search functionality here
    }
  }

  return (
    <header className={`h-16 bg-[#1e3a5f] dark:bg-[#1e3a5f] border-b border-[#2a4a6f] flex items-center justify-between px-6 fixed top-0 right-0 z-20 shadow-sm transition-all duration-300 ${sidebarOpen ? 'left-72' : 'left-0'}`}>
      {/* Left side - Title */}
      <div className={`flex items-center gap-6 transition-all duration-300 ${sidebarOpen ? 'ml-4' : 'ml-16'}`}>
        <h2 className="text-white font-semibold text-lg">Student Portal</h2>
      </div>

      {/* Right side - Search, Notifications, User */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-20 w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
            Ctrl + K
          </kbd>
        </form>

        {/* Notifications */}
        <button
          onClick={() => setNotificationOpen(!notificationOpen)}
          className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
        <NotificationFeed isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />

        {/* User Dropdown */}
        <div className="relative user-dropdown">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold">
              {userInitials}
            </div>
            <span className="text-white font-medium text-sm">{userName}</span>
            <ChevronDown className={`w-4 h-4 text-white transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

