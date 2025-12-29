import type React from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { StudentHeader } from "@/components/student-header"
import { StudentNewsFeed } from "@/components/student-news-feed"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 overflow-hidden">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader />
        <div className="pt-16 px-4 pb-2">
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
