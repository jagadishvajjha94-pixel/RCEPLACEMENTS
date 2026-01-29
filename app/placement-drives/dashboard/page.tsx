"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminPlacements from "@/app/admin/placements/page"

export default function PlacementDrivesDashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    // This page just redirects to the admin placements page
    // The layout handles authentication
  }, [navigate])

  return <AdminPlacements />
}
