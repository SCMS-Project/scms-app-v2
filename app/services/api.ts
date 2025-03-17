// Update any imports that might be referencing the incorrect path

// This file serves as a unified API service that can be used throughout the application
// It will use the mock API service during development and can be switched to a real API service in production

// Import necessary types and mock data
import type { User } from "@/app/types"
import { mockLecturers } from "./mock/data/lecturers"
import { mockUsers } from "./mock/data/users"
import { delay } from "./utils/delay"

// Import necessary interfaces and services
import type { ApiService } from "./interfaces/api-service"
import { mockApiService } from "./mock/mock-api-service"
import { realApiService } from "./real/real-api-service"

// Determine which API service to use based on environment variable
const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true"

// Export the appropriate API service
export const api: ApiService = useRealApi ? realApiService : mockApiService

// Export both services for direct access if needed
export { mockApiService, realApiService }

// Simulate API delay
const simulateDelay = async (ms = 300) => {
  await delay(ms)
}

// Mock API implementation with comprehensive CRUD operations
export const mockApi = {
  // ===== USER METHODS =====
  getUsers: async (): Promise<User[]> => {
    await simulateDelay()
    console.log("Mock API: Getting users")
    return [...mockUsers]
  },

  // ... other methods ...

  // ===== LECTURER METHODS =====
  getLecturers: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting lecturers")
    return [...mockLecturers]
  },

  getLecturerById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting lecturer with ID: ${id}`)
    const lecturer = mockLecturers.find((l) => l.id === id)
    if (!lecturer) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    return { ...lecturer }
  },

  createLecturer: async (lecturerData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating lecturer", lecturerData)
    const newLecturer = {
      ...lecturerData,
      id: `lecturer-${Date.now()}`,
    }
    return { ...newLecturer }
  },

  updateLecturer: async (id: string, lecturerData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating lecturer with ID: ${id}`, lecturerData)
    const lecturerIndex = mockLecturers.findIndex((l) => l.id === id)
    if (lecturerIndex === -1) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    return {
      ...lecturerData,
      id,
    }
  },

  deleteLecturer: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting lecturer with ID: ${id}`)
    const lecturerIndex = mockLecturers.findIndex((l) => l.id === id)
    if (lecturerIndex === -1) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    return { success: true }
  },

  // ... other methods ...
}

// Create a safe wrapper for API methods
const createSafeMethod = (methodName, fallbackFn) => {
  return (...args) => {
    try {
      // Check if the method exists in mockApi
      if (typeof mockApi[methodName] === "function") {
        return mockApi[methodName](...args)
      } else {
        console.warn(`API method ${methodName} not found, using fallback`)
        return fallbackFn(...args)
      }
    } catch (error) {
      console.error(`Error in API method ${methodName}:`, error)
      return fallbackFn(...args)
    }
  }
}

// Define fallback implementations for critical API methods
const fallbacks = {
  getUsers: async () => {
    console.log("API: Using fallback getUsers")
    return [
      {
        id: "admin-1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        password: "password",
        department: "Administration",
      },
      {
        id: "student-1",
        name: "Student User",
        email: "student@example.com",
        role: "student",
        password: "password",
        department: "Computer Science",
      },
      {
        id: "lecturer-1",
        name: "Lecturer User",
        email: "lecturer@example.com",
        role: "lecturer",
        password: "password",
        department: "Computer Science",
      },
    ]
  },
  getStudents: async () => {
    console.log("API: Using fallback getStudents")
    return [
      {
        id: "student-1",
        name: "John Doe",
        email: "john.doe@example.com",
        department: "Computer Science",
        enrollments: [],
      },
      {
        id: "student-2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        department: "Business",
        enrollments: [],
      },
    ]
  },
  getReservations: async () => {
    console.log("API: Using fallback getReservations")
    return [
      {
        id: "res-1",
        facility: "Main Building",
        room: "Room 1",
        date: "2023-12-15",
        time: "09:00 - 11:00",
        purpose: "Meeting",
        requestedBy: "John Doe",
        status: "Approved",
      },
      {
        id: "res-2",
        facility: "Library",
        room: "Study Room 3",
        date: "2023-12-16",
        time: "14:00 - 16:00",
        purpose: "Group Study",
        requestedBy: "Jane Smith",
        status: "Pending",
      },
    ]
  },
  getFacilities: async () => {
    console.log("API: Using fallback getFacilities")
    return [
      {
        id: "fac-1",
        name: "Main Building",
        type: "Academic",
        capacity: 500,
        rooms: 20,
        status: "Available",
      },
      {
        id: "fac-2",
        name: "Library",
        type: "Study",
        capacity: 200,
        rooms: 10,
        status: "Partially Available",
      },
    ]
  },
  getResources: async () => {
    console.log("API: Using fallback getResources")
    return [
      {
        id: "res-1",
        name: "Introduction to Programming",
        type: "Document",
        url: "#",
        uploadedBy: "Admin User",
        uploadDate: "2023-09-01",
      },
      {
        id: "res-2",
        name: "Database Design Principles",
        type: "Document",
        url: "#",
        uploadedBy: "Dr. Sarah Johnson",
        uploadDate: "2023-09-05",
      },
    ]
  },
  getDashboardStats: async () => {
    console.log("API: Using fallback getDashboardStats")
    return {
      totalStudents: 250,
      totalCourses: 45,
      totalLecturers: 30,
      activeEnrollments: 1200,
      recentActivity: [
        { id: "act1", description: "New course added: Advanced Web Development", timestamp: "2023-09-10T10:30:00" },
        { id: "act2", description: "Student enrollment: John Doe in CS101", timestamp: "2023-09-09T14:15:00" },
      ],
    }
  },
}

// Create the API object with safe methods
// export const api = {
//   ...mockApi,
//   getUsers: createSafeMethod("getUsers", fallbacks.getUsers),
//   getStudents: createSafeMethod("getStudents", fallbacks.getStudents),
//   getReservations: createSafeMethod("getReservations", fallbacks.getReservations),
//   getFacilities: createSafeMethod("getFacilities", fallbacks.getFacilities),
//   getResources: createSafeMethod("getResources", fallbacks.getResources),
//   getDashboardStats: createSafeMethod("getDashboardStats", fallbacks.getDashboardStats),
// }

console.log("API service initialized successfully")

