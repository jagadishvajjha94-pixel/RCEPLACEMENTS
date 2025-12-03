"use client"

import type React from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { StudentHeader } from "@/components/student-header"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <StudentSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <StudentHeader />
        <main className="flex-1 overflow-y-auto pt-16">
          {children}
        </main>
      </div>
    </div>
  )
}
