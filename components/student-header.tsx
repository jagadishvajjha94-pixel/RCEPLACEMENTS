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

  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    weekday: 'long'
  })

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-0 lg:left-72 right-0 z-20 shadow-sm">
      {/* Left side - Title */}
      <div className="flex items-center gap-6 ml-4 lg:ml-0">
        <h2 className="text-gray-900 font-semibold text-lg">Dashboard</h2>
      </div>

      {/* Right side - Date, Search */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{currentDate}</span>
        {/* Search Icon */}
        <button
          onClick={handleSearch}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}

