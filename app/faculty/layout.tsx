import type React from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { FacultyHeader } from "@/components/faculty-header"

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <FacultySidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 ml-0 lg:ml-72">
        <FacultyHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 px-6 pb-6">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
