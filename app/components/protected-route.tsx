"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: Array<"admin" | "faculty" | "student">
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized")
    }
  }, [user, isLoading, router, allowedRoles])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

