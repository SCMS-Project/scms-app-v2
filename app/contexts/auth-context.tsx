"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api } from "../services/api"
import type { User } from "../types"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: Omit<User, "id" | "lastLogin">) => Promise<void>
  logout: (callback?: () => void) => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would verify the token with the server
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } catch (parseErr) {
            console.error("Failed to parse stored user:", parseErr)
            localStorage.removeItem("user")
          }
        }
      } catch (err) {
        console.error("Authentication error:", err)
        localStorage.removeItem("user")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Simplified login function with better error handling
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Safety check for empty inputs
      if (!email || !password) {
        setError("Please enter both email and password")
        return Promise.reject(new Error("Please enter both email and password"))
      }

      console.log("Attempting login with:", email)

      // For demo purposes, allow login with any of these test accounts
      const testAccounts = [
        { email: "test@test.com", password: "password" },
        { email: "demo@demo.com", password: "demo" },
        { email: "admin", password: "admin" },
        { email: "user", password: "user" },
        { email: "admin@example.com", password: "password123" },
        { email: "john.smith@campus.edu", password: "password123" },
        { email: "sarah.johnson@campus.edu", password: "password123" },
      ]

      // Check for test account match
      const testAccount = testAccounts.find(
        (account) => account.email.toLowerCase() === email.toLowerCase() && account.password === password,
      )

      if (testAccount) {
        console.log("Test account login successful")
        // Create a user object for the test account
        const testUser: User = {
          id: `U${Math.floor(Math.random() * 1000)}`,
          name: email.split("@")[0],
          email: email,
          role: email.includes("admin") ? "admin" : "student",
          department: "Test Department",
          profileImage: "/placeholder.svg?height=40&width=40",
          lastLogin: new Date().toISOString(),
        }

        setUser(testUser)
        localStorage.setItem("user", JSON.stringify(testUser))
        router.push("/dashboard/analytics")
        return Promise.resolve()
      }

      // If not a test account, try to use the API
      try {
        // Try to get users from API
        let users: User[] = []

        if (typeof api.getUsers === "function") {
          const response = await api.getUsers()
          users = Array.isArray(response) ? response : []
        }

        // Find matching user
        const foundUser = users.find(
          (u) =>
            u.email?.toLowerCase() === email.toLowerCase() && (u.password === password || password === "password123"), // Fallback password for testing
        )

        if (foundUser) {
          console.log("API login successful")
          const loginUser = {
            ...foundUser,
            lastLogin: new Date().toISOString(),
          }

          setUser(loginUser)
          localStorage.setItem("user", JSON.stringify(loginUser))
          router.push("/dashboard/analytics")
          return Promise.resolve()
        }
      } catch (apiError) {
        console.error("API login attempt failed:", apiError)
      }

      // If we get here, no login method succeeded
      // As a last resort, allow any login with password "password123" for testing
      if (password === "password123") {
        console.log("Fallback login successful")
        const fallbackUser: User = {
          id: `U${Math.floor(Math.random() * 1000)}`,
          name: email.split("@")[0],
          email: email,
          role: email.includes("admin") ? "admin" : "student",
          department: "Test Department",
          profileImage: "/placeholder.svg?height=40&width=40",
          lastLogin: new Date().toISOString(),
        }

        setUser(fallbackUser)
        localStorage.setItem("user", JSON.stringify(fallbackUser))
        router.push("/dashboard/analytics")
        return Promise.resolve()
      }

      // If all login attempts fail
      setError("Invalid email or password")
      return Promise.reject(new Error("Invalid email or password"))
    } catch (err) {
      console.error("Login process failed:", err)
      setError(err instanceof Error ? err.message : "Login failed")
      return Promise.reject(err)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: Omit<User, "id" | "lastLogin">) => {
    try {
      setIsLoading(true)
      setError(null)

      // Create a new user with a random ID
      const newUser: User = {
        id: `U${Math.floor(Math.random() * 1000)}`,
        ...userData,
        lastLogin: new Date().toISOString(),
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      router.push("/dashboard/analytics")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed"
      setError(errorMessage)
      return Promise.reject(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = (callback?: () => void) => {
    localStorage.removeItem("user")
    setUser(null)
    if (callback) {
      callback()
    } else {
      router.push("/")
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true)
      setError(null)

      if (!user) {
        setError("Not authenticated")
        return Promise.reject("Not authenticated")
      }

      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Profile update failed"
      setError(errorMessage)
      return Promise.reject(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

