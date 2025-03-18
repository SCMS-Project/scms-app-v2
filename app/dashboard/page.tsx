"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to analytics page
    router.push("/dashboard/analytics")
  }, [router])

  // Return a simple loading state without any charts or SVG elements
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Redirecting to Analytics...</h2>
        <div className="flex justify-center">
          <div className="animate-pulse h-2 w-24 bg-primary rounded"></div>
        </div>
      </div>
    </div>
  )
}

