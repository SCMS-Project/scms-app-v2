"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would verify the token with the server
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          // Verify the user still exists
          const userData = await api.getUser(parsedUser.id)
          setUser(userData)
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

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Auth context: Attempting login with email:", email)

      // In a real app, this would make an API call to verify credentials
      // For demo purposes, we'll just find a user with matching email
      const users = await api.getUsers()
      console.log("Auth context: Found users:", users.length)

      const foundUser = users.find((u) => u.email === email)
      console.log("Auth context: Found user:", foundUser ? "Yes" : "No")

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Update last login time
      const updatedUser = await api.updateUserProfile(foundUser.id, {
        lastLogin: new Date().toISOString(),
      })

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      console.log("Auth context: Login successful")
    } catch (err) {
      console.error("Auth context error:", err)
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: Omit<User, "id" | "lastLogin">) => {
    try {
      setIsLoading(true)
      setError(null)

      // In a real app, this would make an API call to create a new user
      // For demo purposes, we'll simulate user creation
      const users = await api.getUsers()

      // Check if email already exists
      if (users.some((u) => u.email === userData.email)) {
        throw new Error("Email already in use")
      }

      // Create a new user ID
      const newId = `U${String(users.length + 1).padStart(3, "0")}`
      const newUser: User = {
        id: newId,
        ...userData,
        lastLogin: new Date().toISOString(),
      }

      // In a real app, this would be handled by the server
      // For demo, we'll add the user to our mock data
      const createdUser = await api.updateUserProfile(newId, newUser)

      setUser(createdUser)
      localStorage.setItem("user", JSON.stringify(createdUser))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = (callback?: () => void) => {
    localStorage.removeItem("user")
    setUser(null)
    if (callback) {
      callback()
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true)
      setError(null)

      if (!user) {
        throw new Error("Not authenticated")
      }

      const updatedUser = await api.updateUserProfile(user.id, data)

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile update failed")
      throw err
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

