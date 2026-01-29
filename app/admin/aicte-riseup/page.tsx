"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import AICTERiseUpContent from "@/components/aicte-riseup-content"

export default function AICTERiseUpPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="p-8 space-y-8">
            <AICTERiseUpContent />
          </div>
        </main>
      </div>
    </div>
  )
}
