"use client"

import type React from "react"
import { TaskManager } from "@/components/task-manager"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <TaskManager />
    </>
  )
}
