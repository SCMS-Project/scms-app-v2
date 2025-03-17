import type React from "react"
import { AuthProvider } from "./contexts/auth-context"
import { ThemeProvider } from "@/app/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from "./components/error-boundary"
import "./globals.css"

// Add this metadata export
export const metadata = {
  title: "Campus Management System",
  description: "A comprehensive system for managing campus resources",
  icons: {
    icon: "/favicon.ico", // Place this file in the public directory
    apple: "/apple-icon.png", // Optional: for Apple devices
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}



import './globals.css'