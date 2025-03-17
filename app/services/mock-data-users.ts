// Mock user data for development and testing
export const mockUsers = [
  {
    id: "U001",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "admin",
    department: "Administration",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-08-15T10:30:00Z",
  },
  {
    id: "U002",
    name: "John Smith",
    email: "john.smith@campus.edu",
    password: "password123",
    role: "student",
    department: "Computer Science",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-08-14T14:45:00Z",
  },
  {
    id: "U003",
    name: "Sarah Johnson",
    email: "sarah.johnson@campus.edu",
    password: "password123",
    role: "lecturer",
    department: "Mathematics",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-08-13T09:15:00Z",
  },
  // Add some common test accounts
  {
    id: "U004",
    name: "Test User",
    email: "test@test.com",
    password: "password",
    role: "student",
    department: "Testing",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-08-12T11:30:00Z",
  },
  {
    id: "U005",
    name: "Demo User",
    email: "demo@demo.com",
    password: "demo",
    role: "student",
    department: "Demo",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-08-11T15:20:00Z",
  },
  {
    id: "U006",
    name: "Admin",
    email: "admin",
    password: "admin",
    role: "admin",
    department: "Administration",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-08-10T09:45:00Z",
  },
  {
    id: "U007",
    name: "User",
    email: "user",
    password: "user",
    role: "student",
    department: "General",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-08-09T14:15:00Z",
  },
]

// Export a function to find a user by email (case-insensitive)
export function findUserByEmail(email: string) {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

// Export a function to find a user by ID
export function findUserById(id: string) {
  return mockUsers.find((user) => user.id === id)
}

