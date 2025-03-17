// A simplified API implementation to get the application loading
import { mockUsers } from "./mock/data/users"
import { mockCourses } from "./mock/data/courses"
import { mockScheduleEvents } from "./mock/data/schedule"

// Basic API implementation with minimal functionality
class SimpleApiService {
  // Auth methods
  async login(email: string, password: string) {
    console.log("Simple API: Login attempt with:", email)

    // For demo purposes, allow login with test accounts
    const testAccounts = [
      { email: "test@test.com", password: "password" },
      { email: "demo@demo.com", password: "demo" },
      { email: "admin", password: "admin" },
      { email: "user", password: "user" },
      { email: "admin@example.com", password: "password123" },
    ]

    const testAccount = testAccounts.find(
      (account) => account.email.toLowerCase() === email.toLowerCase() && account.password === password,
    )

    if (testAccount) {
      return {
        id: `U${Math.floor(Math.random() * 1000)}`,
        name: email.split("@")[0],
        email: email,
        role: email.includes("admin") ? "admin" : "student",
        department: "Test Department",
        profileImage: "/placeholder.svg?height=40&width=40",
        lastLogin: new Date().toISOString(),
      }
    }

    // If not a test account, try to find in mock users
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      console.error("User not found with email:", email)
      throw new Error("Invalid credentials")
    }
    return user
  }

  async getUser(id: string) {
    const user = mockUsers.find((u) => u.id === id)
    if (!user) throw new Error(`User not found`)
    return user
  }

  async getUsers() {
    return mockUsers || []
  }

  async updateUser(id: string, userData: any) {
    console.log(`Simple API: Updating user with ID: ${id}`, userData)
    return { ...userData, id }
  }

  async createUser(userData: any) {
    console.log("Simple API: Creating user", userData)
    return { ...userData, id: `U${Date.now()}` }
  }

  // Courses
  async getCourses() {
    return mockCourses || []
  }

  async getCourseById(id: string) {
    const course = mockCourses.find((c) => c.id === id)
    if (!course) throw new Error(`Course not found`)
    return course
  }

  // Schedule
  async getScheduleEvents() {
    return mockScheduleEvents || []
  }

  // Fallback method for any other method calls
  async fallback(methodName: string, ...args: any[]) {
    console.warn(`Called unimplemented method ${methodName} with args:`, args)
    return null
  }
}

// Create a proxy to handle any method calls that aren't explicitly defined
const handler = {
  get(target: SimpleApiService, prop: string) {
    if (typeof target[prop as keyof SimpleApiService] === "function") {
      return target[prop as keyof SimpleApiService]
    }
    return (...args: any[]) => target.fallback(prop, ...args)
  },
}

// Create and export a proxied instance
const simpleApiInstance = new SimpleApiService()
export const simpleApi = new Proxy(simpleApiInstance, handler)

