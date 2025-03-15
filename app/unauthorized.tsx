"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ShieldAlert } from "lucide-react"

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

