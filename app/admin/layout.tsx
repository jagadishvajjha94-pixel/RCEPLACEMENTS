import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { TaskManager } from "@/components/task-manager"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto pt-16">
          {children}
        </main>
      </div>
      <TaskManager />
    </div>
  )
}
