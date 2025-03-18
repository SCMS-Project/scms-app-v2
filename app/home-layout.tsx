"use client"

import type React from "react"

import { useState } from "react"
import Header from "./components/header"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <main className="flex-1">{children}</main>
    </div>
  )
}

