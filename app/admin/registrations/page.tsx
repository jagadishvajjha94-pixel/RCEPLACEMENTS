
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthService } from "@/lib/auth-service"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminRegistrationManager } from "@/components/admin-registration-manager"
import { motion } from "framer-motion"
import type { User as AuthUser } from "@/lib/auth-service"

export default function AdminRegistrationsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login")
      return
    }
    setUser(currentUser)
  }, [navigate])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto pt-16">
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/10 dark:to-accent/5">
          <div className="p-4 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                Registration Management
              </h1>
              <p className="text-muted-foreground">
                Manage student registrations with deadline tracking, automated data collection, and Excel export
              </p>
            </motion.div>

            {/* Registration Manager */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AdminRegistrationManager />
            </motion.div>
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}
