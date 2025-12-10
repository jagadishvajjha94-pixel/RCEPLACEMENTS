import type React from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { FacultyHeader } from "@/components/faculty-header"

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <FacultySidebar />
      <div className="flex-1 flex flex-col ml-72">
        <FacultyHeader />
        <main className="flex-1 overflow-y-auto pt-16">
          {children}
        </main>
      </div>
    </div>
  )
}
