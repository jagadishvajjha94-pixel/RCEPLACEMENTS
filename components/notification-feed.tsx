"use client"

import { useState, useEffect } from "react"
import { X, Bell, Calendar, User, Building2, GraduationCap, Briefcase } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export interface Notification {
  id: string
  type: "placement" | "internship" | "training" | "event" | "announcement" | "general"
  title: string
  message: string
  timestamp: string
  author?: string
  link?: string
  read: boolean
}

// Mock notification service - in production, this would be an API
class NotificationService {
  private static STORAGE_KEY = "notifications"
  
  static getAll(): Notification[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // Return default notifications
    return [
      {
        id: "1",
        type: "placement",
        title: "New Placement Drive: Infosys",
        message: "Infosys is conducting a placement drive for 2025 batch. Registration opens tomorrow.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        author: "Placement Office",
        read: false,
      },
      {
        id: "2",
        type: "training",
        title: "Soft Skills Training Session",
        message: "Upcoming soft skills training session scheduled for next week. All students are encouraged to attend.",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        author: "Training Department",
        read: false,
      },
      {
        id: "3",
        type: "announcement",
        title: "Campus Placement Guidelines Updated",
        message: "New placement guidelines have been published. Please review the updated policies.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        author: "Admin",
        read: false,
      },
      {
        id: "4",
        type: "internship",
        title: "Summer Internship Opportunities",
        message: "Multiple companies are offering summer internships. Check the internship portal for details.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: "Placement Office",
        read: true,
      },
    ]
  }
  
  static markAsRead(id: string) {
    const notifications = this.getAll()
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
  }
  
  static markAllAsRead() {
    const notifications = this.getAll()
    const updated = notifications.map(n => ({ ...n, read: true }))
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
  }
  
  static getUnreadCount(): number {
    return this.getAll().filter(n => !n.read).length
  }
}

interface NotificationFeedProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationFeed({ isOpen, onClose }: NotificationFeedProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !isOpen) return
    if (typeof window !== "undefined") {
      const allNotifications = NotificationService.getAll()
      setNotifications(allNotifications)
      setUnreadCount(NotificationService.getUnreadCount())
    }
  }, [isOpen, mounted])

  const handleMarkAsRead = (id: string) => {
    NotificationService.markAsRead(id)
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead()
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    setUnreadCount(0)
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "placement":
        return <Briefcase className="w-5 h-5 text-blue-500" />
      case "internship":
        return <Building2 className="w-5 h-5 text-green-500" />
      case "training":
        return <GraduationCap className="w-5 h-5 text-purple-500" />
      case "event":
        return <Calendar className="w-5 h-5 text-orange-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "placement":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "internship":
        return "bg-green-100 text-green-700 border-green-200"
      case "training":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "event":
        return "bg-orange-100 text-orange-700 border-orange-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-4 top-20 w-96 max-w-[calc(100vw-2rem)] h-[calc(100vh-6rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold text-lg">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-sm text-blue-100">{unreadCount} unread</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-white hover:bg-white/20 h-8 px-3 text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Bell className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative cursor-pointer transition-all ${
                      !notification.read ? "bg-blue-50 dark:bg-blue-950/20" : "bg-gray-50 dark:bg-gray-800/50"
                    } rounded-lg p-4 border-2 ${
                      !notification.read ? "border-blue-200 dark:border-blue-800" : "border-gray-200 dark:border-gray-700"
                    } hover:shadow-md`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    {!notification.read && (
                      <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            {notification.author && (
                              <>
                                <User className="w-3 h-3" />
                                <span>{notification.author}</span>
                              </>
                            )}
                          </div>
                          <span>
                            {mounted && typeof window !== "undefined" 
                              ? formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })
                              : "Recently"
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Export the service for use in headers
export { NotificationService }

