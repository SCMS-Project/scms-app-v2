"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error)
  }, [error])

  // Simple error display component
  const ErrorDisplay = () => (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <AlertTriangle className="h-12 w-12 text-warning" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Dashboard Error</h2>
        <p className="text-center mb-6">
          There was a problem loading the dashboard. This could be due to a temporary issue or a problem with your
          connection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()} variant="default">
            Try Again
          </Button>
          <Link href="/" passHref>
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )

  return <ErrorDisplay />
}

