import type { User } from "@/app/types"

// Mock User Data
export const mockUsers: User[] = [
  {
    id: "U001",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    department: "Administration",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-09-01T10:30:00Z",
  },
  {
    id: "U002",
    name: "Student User",
    email: "student@example.com",
    password: "password123",
    role: "student",
    department: "Computer Science",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-09-02T14:45:00Z",
  },
  {
    id: "U003",
    name: "Lecturer User",
    email: "lecturer@example.com",
    password: "password123",
    role: "lecturer",
    department: "Mathematics",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-09-03T09:15:00Z",
  },
  {
    id: "U004",
    name: "John Smith",
    email: "john.smith@campus.edu",
    password: "password123",
    role: "student",
    department: "Engineering",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-09-04T11:20:00Z",
  },
  {
    id: "U005",
    name: "Sarah Johnson",
    email: "sarah.johnson@campus.edu",
    password: "password123",
    role: "lecturer",
    department: "Biology",
    profileImage: "/placeholder.svg?height=40&width=40",
    lastLogin: "2023-09-05T16:10:00Z",
  },
]

