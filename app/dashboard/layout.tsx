"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils" // Add the missing import
import Header from "../components/header"
import Sidebar from "../components/sidebar"
import ProtectedRoute from "../components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Header setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
          <main
            className={cn(
              "flex-1 overflow-auto transition-all duration-300",
              isSidebarOpen ? "lg:ml-64" : "lg:ml-[60px]",
            )}
          >
            <div className="container mx-auto p-4 md:p-6 max-w-7xl bg-background rounded-lg shadow-sm border border-border/40 my-4 md:my-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

