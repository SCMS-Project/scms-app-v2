"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, BookMarked, Plus, Trash2 } from "lucide-react"
import { api } from "@/app/services/api"
import type { Course, Subject } from "@/app/types"
import { useToast } from "@/hooks/use-toast"

export default function CourseDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [isAddSubjectsOpen, setIsAddSubjectsOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [courseData, courseSubjects, allSubjectsData] = await Promise.all([
          api.getCourse(courseId),
          api.getCourseSubjects(courseId),
          api.getSubjects(),
        ])
        setCourse(courseData)
        setSubjects(courseSubjects)
        setAllSubjects(allSubjectsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load course data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, toast])

  const handleSubjectSelection = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId)
      } else {
        return [...prev, subjectId]
      }
    })
  }

  const handleAddSubjects = async () => {
    try {
      setLoading(true)
      const updatedCourse = await api.assignSubjectsToCourse(courseId, selectedSubjects)
      setCourse(updatedCourse)

      // Refresh the subjects list
      const courseSubjects = await api.getCourseSubjects(courseId)
      setSubjects(courseSubjects)

      setIsAddSubjectsOpen(false)
      setSelectedSubjects([])

      toast({
        title: "Success",
        description: "Subjects added to course successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add subjects to course",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSubject = async (subjectId: string) => {
    try {
      setLoading(true)
      await api.removeSubjectsFromCourse(courseId, [subjectId])

      // Refresh the data
      const [updatedCourse, courseSubjects] = await Promise.all([
        api.getCourse(courseId),
        api.getCourseSubjects(courseId),
      ])

      setCourse(updatedCourse)
      setSubjects(courseSubjects)

      toast({
        title: "Success",
        description: "Subject removed from course successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove subject from course",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Course not found</h2>
        <Button onClick={() => router.push("/dashboard/courses")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
    )
  }

  // Filter out subjects that are already assigned to the course
  const availableSubjects = allSubjects.filter((subject) => !subjects.some((s) => s.id === subject.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/dashboard/courses")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>View and manage course information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Course ID</h3>
              <p className="text-lg font-semibold">{course.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Course Name</h3>
              <p className="text-lg font-semibold">{course.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
              <p className="text-lg font-semibold">{course.department}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Credits</h3>
              <p className="text-lg font-semibold">{course.credits}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Instructor</h3>
              <p className="text-lg font-semibold">{course.instructor}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Badge className={course.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {course.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Subjects</CardTitle>
              <CardDescription>Subjects associated with this course</CardDescription>
            </div>
            <Dialog open={isAddSubjectsOpen} onOpenChange={setIsAddSubjectsOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Subjects
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Subjects to Course</DialogTitle>
                  <DialogDescription>Select subjects to add to {course.name}</DialogDescription>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto py-4">
                  {availableSubjects.length > 0 ? (
                    availableSubjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2 py-2">
                        <input
                          type="checkbox"
                          id={`subject-${subject.id}`}
                          checked={selectedSubjects.includes(subject.id)}
                          onChange={() => handleSubjectSelection(subject.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={`subject-${subject.id}`} className="flex-1">
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {subject.code} - {subject.department}
                          </div>
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No available subjects to add</p>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddSubjectsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSubjects} disabled={selectedSubjects.length === 0 || loading}>
                    Add Selected Subjects
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {subjects.length > 0 ? (
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <BookMarked className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {subject.code} - {subject.credits} credits
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSubject(subject.id)}
                      title="Remove subject from course"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookMarked className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No subjects assigned</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This course doesn't have any subjects assigned yet.
                </p>
                <Button variant="outline" onClick={() => setIsAddSubjectsOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Subjects
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

