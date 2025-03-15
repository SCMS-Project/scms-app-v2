"use client"

import { useAuth } from "@/app/contexts/auth-context"
import { StudentDashboard } from "./student-dashboard"
import { AdminDashboard } from "./admin-dashboard"

export default function DashboardContent() {
  const { user } = useAuth()

  // Show different dashboard based on user role
  if (user?.role === "student") {
    return <StudentDashboard />
  }

  // Default to admin dashboard for other roles
  return <AdminDashboard />
}

