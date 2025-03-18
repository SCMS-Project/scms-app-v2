import { NextResponse } from "next/server"

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123", // In a real app, passwords would be hashed
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

export async function POST(request: Request) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Parse request body
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user with matching credentials
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create a user object without the password
    const { password: _, ...userWithoutPassword } = user

    // Generate a mock token (in a real app, this would be a JWT)
    const token = btoa(`${user.id}:${user.email}:${Date.now()}`)

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

