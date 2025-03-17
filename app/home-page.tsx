"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "./contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, Users, BookOpen, Building, Calendar } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleDashboardClick = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Smart Campus Management System</h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            A comprehensive solution for educational institutions to manage students, faculty, courses, and resources
            efficiently.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={handleDashboardClick}>
              {user ? "Go to Dashboard" : "Login"}
            </Button>
            {!user && (
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Users className="h-10 w-10 text-blue-500" />}
            title="Student Management"
            description="Efficiently manage student records, attendance, and academic performance."
          />
          <FeatureCard
            icon={<GraduationCap className="h-10 w-10 text-green-500" />}
            title="Faculty Management"
            description="Organize faculty information, teaching assignments, and evaluations."
          />
          <FeatureCard
            icon={<BookOpen className="h-10 w-10 text-purple-500" />}
            title="Course Management"
            description="Create and manage courses, curricula, and academic programs."
          />
          <FeatureCard
            icon={<Building className="h-10 w-10 text-orange-500" />}
            title="Facility Management"
            description="Track and allocate campus facilities, classrooms, and resources."
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10 text-red-500" />}
            title="Event Management"
            description="Schedule and organize campus events, seminars, and activities."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-indigo-500" />}
            title="User-Friendly Interface"
            description="Intuitive design for administrators, faculty, and students."
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="flex flex-col items-center text-center">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

