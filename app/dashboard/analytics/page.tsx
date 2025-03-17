"use client"

import { Suspense } from "react"
import { AnalyticsDashboard } from "@/app/dashboard/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading Analytics...</h2>
            <div className="flex justify-center">
              <div className="animate-pulse h-2 w-24 bg-primary rounded"></div>
            </div>
          </div>
        </div>
      }
    >
      <AnalyticsDashboard />
    </Suspense>
  )
}

