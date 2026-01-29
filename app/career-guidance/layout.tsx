"use client"

import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthService } from "@/lib/auth-service"

export default function CareerGuidanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navigate = useNavigate()

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (!user || (user.role !== "career-guidance" && user.role !== "admin")) {
      navigate("/login/career-guidance")
    }
  }, [navigate])

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
