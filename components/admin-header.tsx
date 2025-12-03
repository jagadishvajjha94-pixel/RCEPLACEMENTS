"use client"

import { useState, useEffect } from "react"
import { Search, Bell, ChevronDown, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthService } from "@/lib/auth-service"
import { NotificationFeed, NotificationService } from "@/components/notification-feed"

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userName, setUserName] = useState("Admin")
  const [userInitials, setUserInitials] = useState("AD")

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const user = AuthService.getCurrentUser()
      setCurrentUser(user)
      const name = user?.name || "Admin"
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
    const interval = setInterval(updateUnreadCount, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [mounted])

  return (
    <header className="h-16 bg-[#1e3a5f] dark:bg-[#1e3a5f] border-b border-[#2a4a6f] flex items-center justify-between px-6 fixed top-0 left-72 right-0 z-20 shadow-sm">
      {/* Left side - Title */}
      <div className="flex items-center gap-6">
        <h2 className="text-white font-semibold text-lg">Admin Portal</h2>
      </div>

      {/* Right side - Search, Notifications, User */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative">
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
        </div>

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

        {/* Batch Selector */}
        <Select defaultValue="2026">
          <SelectTrigger className="w-24 bg-white/10 border-white/20 text-white hover:bg-white/15">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1e3a5f] border-[#2a4a6f]">
            <SelectItem value="2026" className="text-white hover:bg-white/10">2026</SelectItem>
            <SelectItem value="2025" className="text-white hover:bg-white/10">2025</SelectItem>
            <SelectItem value="2024" className="text-white hover:bg-white/10">2024</SelectItem>
          </SelectContent>
        </Select>

        {/* User Dropdown */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold">
            {userInitials}
          </div>
          <span className="text-white font-medium text-sm">{userName}</span>
          <ChevronDown className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  )
}

