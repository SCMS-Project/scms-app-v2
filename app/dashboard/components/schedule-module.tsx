"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, BookOpen, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ScheduleModule() {
  const router = useRouter()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Academic Schedule</span>
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
        <CardDescription>Manage your class schedule, register for courses, and view academic calendar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Features</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <CalendarIcon className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>View your weekly class schedule</span>
            </li>
            <li className="flex items-start">
              <BookOpen className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>Register for courses and manage enrollments</span>
            </li>
            <li className="flex items-start">
              <Clock className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>Receive notifications about schedule changes</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-2">
          <Button onClick={() => router.push("/dashboard/schedule")}>Go to Schedule</Button>
          <Button variant="outline" onClick={() => router.push("/dashboard/schedule")} className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Schedule
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/schedule?tab=registration">Course Registration</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

