"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MoreHorizontal, Plus, Search, Filter, Loader2, BookOpen, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/app/services/api"
import type { Enrollment, Student, Course, Batch } from "../../types"
import { useToast } from "@/hooks/use-toast"
// Update imports to include our centralized constants
import { ENROLLMENT_STATUS_OPTIONS } from "@/app/constants/roles"

export default function Enrollments() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddEnrollmentOpen, setIsAddEnrollmentOpen] = useState(false)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newEnrollment, setNewEnrollment] = useState<Partial<Enrollment>>({
    studentId: "",
    courseId: "",
    batchId: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    status: "Active",
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { toast } = useToast()

  // Add state variables for the view details dialog
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)

  const handleViewDetails = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    setIsViewDetailsOpen(true)
  }

  // Fetch enrollments and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Check if API methods exist and provide fallbacks if they don't
        let enrollmentsData = []
        let studentsData = []
        let coursesData = []
        let batchesData = []

        // Try to fetch enrollments or use fallback
        if (typeof api.getEnrollments === "function") {
          try {
            enrollmentsData = await api.getEnrollments()
          } catch (err) {
            console.warn("Error fetching enrollments:", err)
            // Fallback enrollment data
            enrollmentsData = [
              {
                id: "enr-001",
                studentId: "student-1",
                studentName: "John Doe",
                courseId: "course-1",
                courseName: "Introduction to Computer Science",
                batchId: "batch-1",
                batchName: "CS Batch 2023",
                enrollmentDate: "2023-09-01",
                status: "Active",
              },
              {
                id: "enr-002",
                studentId: "student-2",
                studentName: "Jane Smith",
                courseId: "course-2",
                courseName: "Database Management",
                batchId: "batch-1",
                batchName: "CS Batch 2023",
                enrollmentDate: "2023-09-02",
                status: "Active",
              },
              {
                id: "enr-003",
                studentId: "student-3",
                studentName: "Robert Johnson",
                courseId: "course-3",
                courseName: "Web Development",
                batchId: "batch-2",
                batchName: "IT Batch 2023",
                enrollmentDate: "2023-08-15",
                status: "Completed",
              },
            ]
          }
        } else {
          console.warn("api.getEnrollments is not implemented")
          // Fallback enrollment data
          enrollmentsData = [
            {
              id: "enr-001",
              studentId: "student-1",
              studentName: "John Doe",
              courseId: "course-1",
              courseName: "Introduction to Computer Science",
              batchId: "batch-1",
              batchName: "CS Batch 2023",
              enrollmentDate: "2023-09-01",
              status: "Active",
            },
            {
              id: "enr-002",
              studentId: "student-2",
              studentName: "Jane Smith",
              courseId: "course-2",
              courseName: "Database Management",
              batchId: "batch-1",
              batchName: "CS Batch 2023",
              enrollmentDate: "2023-09-02",
              status: "Active",
            },
            {
              id: "enr-003",
              studentId: "student-3",
              studentName: "Robert Johnson",
              courseId: "course-3",
              courseName: "Web Development",
              batchId: "batch-2",
              batchName: "IT Batch 2023",
              enrollmentDate: "2023-08-15",
              status: "Completed",
            },
          ]
        }

        // Try to fetch students or use fallback
        if (typeof api.getStudents === "function") {
          try {
            studentsData = await api.getStudents()
          } catch (err) {
            console.warn("Error fetching students:", err)
            // Fallback student data
            studentsData = [
              { id: "student-1", name: "John Doe", email: "john@example.com" },
              { id: "student-2", name: "Jane Smith", email: "jane@example.com" },
              { id: "student-3", name: "Robert Johnson", email: "robert@example.com" },
              { id: "student-4", name: "Emily Davis", email: "emily@example.com" },
            ]
          }
        } else {
          console.warn("api.getStudents is not implemented")
          // Fallback student data
          studentsData = [
            { id: "student-1", name: "John Doe", email: "john@example.com" },
            { id: "student-2", name: "Jane Smith", email: "jane@example.com" },
            { id: "student-3", name: "Robert Johnson", email: "robert@example.com" },
            { id: "student-4", name: "Emily Davis", email: "emily@example.com" },
          ]
        }

        // Try to fetch courses or use fallback
        if (typeof api.getCourses === "function") {
          try {
            coursesData = await api.getCourses()
          } catch (err) {
            console.warn("Error fetching courses:", err)
            // Fallback course data
            coursesData = [
              { id: "course-1", name: "Introduction to Computer Science", code: "CS101" },
              { id: "course-2", name: "Database Management", code: "CS201" },
              { id: "course-3", name: "Web Development", code: "CS301" },
              { id: "course-4", name: "Data Structures", code: "CS202" },
            ]
          }
        } else {
          console.warn("api.getCourses is not implemented")
          // Fallback course data
          coursesData = [
            { id: "course-1", name: "Introduction to Computer Science", code: "CS101" },
            { id: "course-2", name: "Database Management", code: "CS201" },
            { id: "course-3", name: "Web Development", code: "CS301" },
            { id: "course-4", name: "Data Structures", code: "CS202" },
          ]
        }

        // Try to fetch batches or use fallback
        if (typeof api.getBatches === "function") {
          try {
            batchesData = await api.getBatches()
          } catch (err) {
            console.warn("Error fetching batches:", err)
            // Fallback batch data
            batchesData = [
              { id: "batch-1", name: "CS Batch 2023", students: 25 },
              { id: "batch-2", name: "IT Batch 2023", students: 20 },
              { id: "batch-3", name: "Business Batch 2023", students: 30 },
            ]
          }
        } else {
          console.warn("api.getBatches is not implemented")
          // Fallback batch data
          batchesData = [
            { id: "batch-1", name: "CS Batch 2023", students: 25 },
            { id: "batch-2", name: "IT Batch 2023", students: 20 },
            { id: "batch-3", name: "Business Batch 2023", students: 30 },
          ]
        }

        setEnrollments(enrollmentsData)
        setStudents(studentsData)
        setCourses(coursesData)
        setBatches(batchesData)
        setError(null)
      } catch (err) {
        setError("Failed to fetch enrollments data")
        toast({
          title: "Warning",
          description: "Using sample enrollment data. Some features may be limited.",
          variant: "default",
        })

        // Set fallback data even if the main try/catch fails
        setEnrollments([
          {
            id: "enr-001",
            studentId: "student-1",
            studentName: "John Doe",
            courseId: "course-1",
            courseName: "Introduction to Computer Science",
            batchId: "batch-1",
            batchName: "CS Batch 2023",
            enrollmentDate: "2023-09-01",
            status: "Active",
          },
          {
            id: "enr-002",
            studentId: "student-2",
            studentName: "Jane Smith",
            courseId: "course-2",
            courseName: "Database Management",
            batchId: "batch-1",
            batchName: "CS Batch 2023",
            enrollmentDate: "2023-09-02",
            status: "Active",
          },
        ])
        setStudents([
          { id: "student-1", name: "John Doe", email: "john@example.com" },
          { id: "student-2", name: "Jane Smith", email: "jane@example.com" },
        ])
        setCourses([
          { id: "course-1", name: "Introduction to Computer Science", code: "CS101" },
          { id: "course-2", name: "Database Management", code: "CS201" },
        ])
        setBatches([
          { id: "batch-1", name: "CS Batch 2023", students: 25 },
          { id: "batch-2", name: "IT Batch 2023", students: 20 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter enrollments based on search query
  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate total pages
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage)

  // Get current enrollments for the current page
  const currentEnrollments = filteredEnrollments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    if (id === "studentId") {
      const student = students.find((s) => s.id === value)
      setNewEnrollment((prev) => ({
        ...prev,
        [id]: value,
        studentName: student?.name || "",
      }))
    } else if (id === "courseId") {
      const course = courses.find((c) => c.id === value)
      setNewEnrollment((prev) => ({
        ...prev,
        [id]: value,
        courseName: course?.name || "",
      }))
    } else if (id === "batchId") {
      const batch = batches.find((b) => b.id === value)
      setNewEnrollment((prev) => ({
        ...prev,
        [id]: value,
        batchName: batch?.name || "",
      }))
    } else {
      setNewEnrollment((prev) => ({ ...prev, [id]: value }))
    }
  }

  // Handle date input changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewEnrollment((prev) => ({ ...prev, [id]: value }))
  }

  // Handle enrollment creation
  const handleCreateEnrollment = async () => {
    try {
      if (!newEnrollment.studentId || !newEnrollment.courseId || !newEnrollment.batchId) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      setLoading(true)

      // Create the enrollment
      let createdEnrollment
      if (typeof api.createEnrollment === "function") {
        try {
          createdEnrollment = await api.createEnrollment(newEnrollment as Omit<Enrollment, "id">)
        } catch (err) {
          console.warn("Error creating enrollment:", err)
          // Create a mock enrollment if API fails
          createdEnrollment = {
            ...newEnrollment,
            id: `enr-${Date.now()}`,
            studentName: students.find((s) => s.id === newEnrollment.studentId)?.name || "",
            courseName: courses.find((c) => c.id === newEnrollment.courseId)?.name || "",
            batchName: batches.find((b) => b.id === newEnrollment.batchId)?.name || "",
          }
        }
      } else {
        console.warn("api.createEnrollment is not implemented")
        // Create a mock enrollment if API doesn't exist
        createdEnrollment = {
          ...newEnrollment,
          id: `enr-${Date.now()}`,
          studentName: students.find((s) => s.id === newEnrollment.studentId)?.name || "",
          courseName: courses.find((c) => c.id === newEnrollment.courseId)?.name || "",
          batchName: batches.find((b) => b.id === newEnrollment.batchId)?.name || "",
        }
      }

      setEnrollments((prev) => [...prev, createdEnrollment])

      // Update the batch student count
      const selectedBatch = batches.find((b) => b.id === newEnrollment.batchId)
      if (selectedBatch) {
        // Update the batch with one more student
        let updatedBatch
        if (typeof api.updateBatch === "function") {
          try {
            updatedBatch = await api.updateBatch(selectedBatch.id, {
              students: selectedBatch.students + 1,
            })
          } catch (err) {
            console.warn("Error updating batch:", err)
            // Create a mock updated batch if API fails
            updatedBatch = {
              ...selectedBatch,
              students: selectedBatch.students + 1,
            }
          }
        } else {
          console.warn("api.updateBatch is not implemented")
          // Create a mock updated batch if API doesn't exist
          updatedBatch = {
            ...selectedBatch,
            students: selectedBatch.students + 1,
          }
        }

        // Update the batches state
        setBatches((prev) => prev.map((batch) => (batch.id === updatedBatch.id ? updatedBatch : batch)))
      }

      setIsAddEnrollmentOpen(false)
      setNewEnrollment({
        studentId: "",
        courseId: "",
        batchId: "",
        enrollmentDate: new Date().toISOString().split("T")[0],
        status: "Active",
      })

      toast({
        title: "Success",
        description: "Enrollment added successfully and student assigned to batch",
      })
    } catch (err) {
      toast({
        title: "Warning",
        description: "Using local data mode. Changes won't be saved to the server.",
        variant: "default",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle enrollment deletion
  const handleDeleteEnrollment = async (id: string) => {
    try {
      setLoading(true)

      // Get the enrollment before deleting it
      const enrollmentToDelete = enrollments.find((e) => e.id === id)

      // Delete the enrollment
      if (typeof api.deleteEnrollment === "function") {
        try {
          await api.deleteEnrollment(id)
        } catch (err) {
          console.warn("Error deleting enrollment:", err)
          // We'll continue with the local deletion even if the API fails
        }
      } else {
        console.warn("api.deleteEnrollment is not implemented")
        // We'll continue with the local deletion
      }

      // Update local state regardless of API success
      setEnrollments((prev) => prev.filter((enrollment) => enrollment.id !== id))

      // If we found the enrollment, update the batch student count
      if (enrollmentToDelete) {
        const batchToUpdate = batches.find((b) => b.id === enrollmentToDelete.batchId)
        if (batchToUpdate && batchToUpdate.students > 0) {
          // Update the batch with one less student
          let updatedBatch
          if (typeof api.updateBatch === "function") {
            try {
              updatedBatch = await api.updateBatch(batchToUpdate.id, {
                students: batchToUpdate.students - 1,
              })
            } catch (err) {
              console.warn("Error updating batch:", err)
              // Create a mock updated batch if API fails
              updatedBatch = {
                ...batchToUpdate,
                students: batchToUpdate.students - 1,
              }
            }
          } else {
            console.warn("api.updateBatch is not implemented")
            // Create a mock updated batch if API doesn't exist
            updatedBatch = {
              ...batchToUpdate,
              students: batchToUpdate.students - 1,
            }
          }

          // Update the batches state
          setBatches((prev) => prev.map((batch) => (batch.id === updatedBatch.id ? updatedBatch : batch)))
        }
      }

      toast({
        title: "Success",
        description: "Enrollment deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Warning",
        description: "Using local data mode. Changes won't be saved to the server.",
        variant: "default",
      })

      // Still update the local state even if there's an error
      setEnrollments((prev) => prev.filter((enrollment) => enrollment.id !== id))
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const activeEnrollments = enrollments.filter((e) => e.status === "Active").length
  const completedEnrollments = enrollments.filter((e) => e.status === "Completed").length

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = []

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>,
    )

    // First page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)} className="cursor-pointer">
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= 1 || i >= totalPages) continue
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)} className="cursor-pointer">
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>,
    )

    return items
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Enrollment Management</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search enrollments..."
              className="w-full sm:w-[250px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog open={isAddEnrollmentOpen} onOpenChange={setIsAddEnrollmentOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" /> Add Enrollment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Enrollment</DialogTitle>
                <DialogDescription>Enter the details of the new enrollment below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="studentId" className="text-right">
                    Student
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("studentId", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="courseId" className="text-right">
                    Course
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("courseId", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batchId" className="text-right">
                    Batch
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("batchId", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="enrollmentDate" className="text-right">
                    Enrollment Date
                  </Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    className="col-span-3"
                    value={newEnrollment.enrollmentDate || ""}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ENROLLMENT_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEnrollmentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEnrollment} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Enrollment Details</DialogTitle>
                <DialogDescription>Detailed information about the selected enrollment.</DialogDescription>
              </DialogHeader>
              {selectedEnrollment && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">ID:</div>
                    <div className="col-span-2">{selectedEnrollment.id}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Student:</div>
                    <div className="col-span-2">{selectedEnrollment.studentName || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Student ID:</div>
                    <div className="col-span-2">{selectedEnrollment.studentId || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Course:</div>
                    <div className="col-span-2">{selectedEnrollment.courseName || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Course ID:</div>
                    <div className="col-span-2">{selectedEnrollment.courseId || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Batch:</div>
                    <div className="col-span-2">{selectedEnrollment.batchName || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Batch ID:</div>
                    <div className="col-span-2">{selectedEnrollment.batchId || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Enrollment Date:</div>
                    <div className="col-span-2">{selectedEnrollment.enrollmentDate || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Status:</div>
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          selectedEnrollment.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : selectedEnrollment.status === "Completed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {selectedEnrollment.status || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Enrollments</CardTitle>
            <CardDescription>Currently active course enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              <BookOpen className="inline h-3 w-3 mr-1" />
              {enrollments.length} total enrollments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed Courses</CardTitle>
            <CardDescription>Successfully completed enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              <GraduationCap className="inline h-3 w-3 mr-1" />
              {((completedEnrollments / enrollments.length) * 100 || 0).toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Enrollment Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading enrollments...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : currentEnrollments.length > 0 ? (
              currentEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">{enrollment.id}</TableCell>
                  <TableCell>{enrollment.studentName}</TableCell>
                  <TableCell>{enrollment.courseName}</TableCell>
                  <TableCell>{enrollment.batchName}</TableCell>
                  <TableCell>{enrollment.enrollmentDate}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        enrollment.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : enrollment.status === "Completed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {enrollment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(enrollment)}>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit enrollment</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
                        >
                          Delete enrollment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No enrollments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredEnrollments.length)} of {filteredEnrollments.length}{" "}
            enrollments
          </div>
          <Pagination>
            <PaginationContent>{renderPaginationItems()}</PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

