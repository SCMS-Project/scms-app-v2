"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Mock user data for development
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "Administrator",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "John Lecturer",
    email: "lecturer@campus.edu",
    password: "password123",
    role: "Lecturer",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Jane Student",
    email: "student@campus.edu",
    password: "password123",
    role: "Student",
    image: "/placeholder.svg?height=32&width=32",
  },
]

interface User {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user:", e)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)

    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Create a user object without the password
      const { password: _, ...userWithoutPassword } = foundUser

      // Store user in state and localStorage
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, error }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

