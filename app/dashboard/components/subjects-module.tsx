"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookMarked, ArrowRight } from "lucide-react"
import { api } from "@/app/services/api"
import type { Subject } from "../../types"
import { useRouter } from "next/navigation"

export default function SubjectsModule() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true)
        const data = await api.getSubjects()
        setSubjects(data)
      } catch (error) {
        console.error("Failed to fetch subjects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  // Get the count of subjects by department
  const getDepartmentCounts = () => {
    const counts: Record<string, number> = {}
    subjects.forEach((subject) => {
      counts[subject.department] = (counts[subject.department] || 0) + 1
    })
    return counts
  }

  const departmentCounts = getDepartmentCounts()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Subjects</CardTitle>
          <CardDescription>Manage and view all subjects</CardDescription>
        </div>
        <BookMarked className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(departmentCounts)
              .slice(0, 6)
              .map(([department, count]) => (
                <div key={department} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{department}</p>
                    <p className="text-xs text-muted-foreground">{count} subjects</p>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
          </div>
          <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/subjects")}>
            View All Subjects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

