"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { StudentHeader } from "@/components/student-header"
import { StudentNewsFeed } from "@/components/student-news-feed"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setSidebarOpen(event.detail.isOpen)
    }
    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
  }, [])

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <StudentHeader />
        <div className={`pt-16 px-4 pb-2 transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
          <StudentNewsFeed />
        </div>
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="w-full max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
