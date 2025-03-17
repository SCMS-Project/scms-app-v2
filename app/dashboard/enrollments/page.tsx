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
import { MoreHorizontal, Plus, Search, Filter, Loader2, BookOpen, GraduationCap, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/app/services/api"
import type { Enrollment, Student, Course, Batch } from "../../types"
import { useToast } from "@/hooks/use-toast"
// Update imports to include our centralized constants
import { ENROLLMENT_STATUS_OPTIONS } from "@/app/constants/roles"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Enrollments() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddEnrollmentOpen, setIsAddEnrollmentOpen] = useState(false)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<{
    enrollments: boolean
    students: boolean
    courses: boolean
    batches: boolean
  }>({
    enrollments: false,
    students: false,
    courses: false,
    batches: false,
  })
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

  // Search state
  const [studentSearchQuery, setStudentSearchQuery] = useState("")
  const [courseSearchQuery, setCourseSearchQuery] = useState("")

  // Add these state variables at the top of the component with the other state declarations
  // This will help manage the dropdown state

  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false)
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false)

  // Enhance the filter functions to be more robust
  // Replace the existing filteredStudents and filteredCourses with these improved versions:

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      (student.id && student.id.toLowerCase().includes(studentSearchQuery.toLowerCase())),
  )

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.name?.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
      course.code?.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
      (course.id && course.id.toLowerCase().includes(courseSearchQuery.toLowerCase())),
  )

  const handleViewDetails = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    setIsViewDetailsOpen(true)
  }

  // Check API availability
  useEffect(() => {
    // Check which API methods are available
    const checkApiMethods = {
      enrollments: typeof api.getEnrollments === "function",
      students: typeof api.getStudents === "function",
      courses: typeof api.getCourses === "function",
      batches: typeof api.getBatches === "function",
    }

    setApiStatus(checkApiMethods)

    // If any required API method is missing, set an error
    if (!Object.values(checkApiMethods).every(Boolean)) {
      const missingMethods = Object.entries(checkApiMethods)
        .filter(([_, available]) => !available)
        .map(([method]) => method)

      setError(`API not fully implemented. Missing methods: ${missingMethods.join(", ")}`)

      toast({
        title: "API Configuration Error",
        description: "The API is not properly configured. Please contact the administrator.",
        variant: "destructive",
      })
    }
  }, [toast])

  // Fetch enrollments and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Initialize data arrays
        let enrollmentsData: Enrollment[] = []
        let studentsData: Student[] = []
        let coursesData: Course[] = []
        let batchesData: Batch[] = []

        // Fetch data from available API methods
        const fetchPromises = []

        if (apiStatus.enrollments) {
          fetchPromises.push(
            api
              .getEnrollments()
              .then((data) => {
                enrollmentsData = data
              })
              .catch((err) => {
                console.error("Error fetching enrollments:", err)
                throw new Error("Failed to fetch enrollments data")
              }),
          )
        }

        if (apiStatus.students) {
          fetchPromises.push(
            api
              .getStudents()
              .then((data) => {
                studentsData = data
              })
              .catch((err) => {
                console.error("Error fetching students:", err)
                throw new Error("Failed to fetch students data")
              }),
          )
        }

        if (apiStatus.courses) {
          fetchPromises.push(
            api
              .getCourses()
              .then((data) => {
                coursesData = data
              })
              .catch((err) => {
                console.error("Error fetching courses:", err)
                throw new Error("Failed to fetch courses data")
              }),
          )
        }

        if (apiStatus.batches) {
          fetchPromises.push(
            api
              .getBatches()
              .then((data) => {
                batchesData = data
              })
              .catch((err) => {
                console.error("Error fetching batches:", err)
                throw new Error("Failed to fetch batches data")
              }),
          )
        }

        // Wait for all available API calls to complete
        if (fetchPromises.length > 0) {
          await Promise.all(fetchPromises)

          // Set the data in state
          if (apiStatus.enrollments) setEnrollments(enrollmentsData)
          if (apiStatus.students) setStudents(studentsData)
          if (apiStatus.courses) setCourses(coursesData)
          if (apiStatus.batches) setBatches(batchesData)

          // If we have some data but not all, update the error message
          if (!Object.values(apiStatus).every(Boolean)) {
            setError("Some data could not be retrieved due to missing API methods")
          } else {
            setError(null)
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data from the API")

        toast({
          title: "Error",
          description: "Failed to fetch data from the API. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    // Only attempt to fetch if at least one API method is available
    if (Object.values(apiStatus).some(Boolean)) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [apiStatus, toast])

  // Reset search queries when dialog closes
  useEffect(() => {
    if (!isAddEnrollmentOpen) {
      setStudentSearchQuery("")
      setCourseSearchQuery("")
    }
  }, [isAddEnrollmentOpen])

  // Add this useEffect to handle clicks outside the dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (studentDropdownOpen || courseDropdownOpen) {
        const target = event.target as HTMLElement
        if (!target.closest(".student-dropdown") && !target.closest(".course-dropdown")) {
          setStudentDropdownOpen(false)
          setCourseDropdownOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [studentDropdownOpen, courseDropdownOpen])

  // Filter enrollments based on search query
  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.batchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  // Update the handleSelectChange function to be more robust
  // Replace the existing handleSelectChange function with this improved version:

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    if (id === "studentId") {
      const student = students.find((s) => s.id === value)
      if (student) {
        setNewEnrollment((prev) => ({
          ...prev,
          [id]: value,
          studentName: student.name || "",
        }))
        // Close the dropdown after selection
        setStudentDropdownOpen(false)
      }
    } else if (id === "courseId") {
      const course = courses.find((c) => c.id === value)
      if (course) {
        setNewEnrollment((prev) => ({
          ...prev,
          [id]: value,
          courseName: course.name || "",
        }))
        // Close the dropdown after selection
        setCourseDropdownOpen(false)
      }
    } else if (id === "batchId") {
      const batch = batches.find((b) => b.id === value)
      if (batch) {
        setNewEnrollment((prev) => ({
          ...prev,
          [id]: value,
          batchName: batch.name || "",
        }))
      }
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

      // Check if the API method exists
      if (!apiStatus.enrollments || typeof api.createEnrollment !== "function") {
        toast({
          title: "API Error",
          description: "The enrollment creation API is not available.",
          variant: "destructive",
        })
        return
      }

      // Create the enrollment using the API
      const createdEnrollment = await api.createEnrollment(newEnrollment as Omit<Enrollment, "id">)
      setEnrollments((prev) => [...prev, createdEnrollment])

      // Update the batch student count if the API is available
      const selectedBatch = batches.find((b) => b.id === newEnrollment.batchId)
      if (selectedBatch && apiStatus.batches && typeof api.updateBatch === "function") {
        const updatedBatch = await api.updateBatch(selectedBatch.id, {
          students: selectedBatch.students + 1,
        })

        // Update the batches state
        setBatches((prev) => prev.map((batch) => (batch.id === updatedBatch.id ? updatedBatch : batch)))
      }

      setIsAddEnrollmentOpen(false)
      setStudentSearchQuery("")
      setCourseSearchQuery("")
      setNewEnrollment({
        studentId: "",
        courseId: "",
        batchId: "",
        enrollmentDate: new Date().toISOString().split("T")[0],
        status: "Active",
      })

      toast({
        title: "Success",
        description: "Enrollment added successfully",
      })
    } catch (err) {
      console.error("Error creating enrollment:", err)
      toast({
        title: "Error",
        description: "Failed to create enrollment. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle enrollment deletion
  const handleDeleteEnrollment = async (id: string) => {
    try {
      setLoading(true)

      // Check if the API method exists
      if (!apiStatus.enrollments || typeof api.deleteEnrollment !== "function") {
        toast({
          title: "API Error",
          description: "The enrollment deletion API is not available.",
          variant: "destructive",
        })
        return
      }

      // Get the enrollment before deleting it
      const enrollmentToDelete = enrollments.find((e) => e.id === id)
      if (!enrollmentToDelete) {
        throw new Error(`Enrollment with ID ${id} not found`)
      }

      // Delete the enrollment using the API
      await api.deleteEnrollment(id)

      // Update local state after successful API call
      setEnrollments((prev) => prev.filter((enrollment) => enrollment.id !== id))

      // Update the batch student count if the API is available
      const batchToUpdate = batches.find((b) => b.id === enrollmentToDelete.batchId)
      if (batchToUpdate && batchToUpdate.students > 0 && apiStatus.batches && typeof api.updateBatch === "function") {
        const updatedBatch = await api.updateBatch(batchToUpdate.id, {
          students: batchToUpdate.students - 1,
        })

        // Update the batches state
        setBatches((prev) => prev.map((batch) => (batch.id === updatedBatch.id ? updatedBatch : batch)))
      }

      toast({
        title: "Success",
        description: "Enrollment deleted successfully",
      })
    } catch (err) {
      console.error("Error deleting enrollment:", err)
      toast({
        title: "Error",
        description: "Failed to delete enrollment. Please try again later.",
        variant: "destructive",
      })
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
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>API Error</AlertTitle>
          <AlertDescription>
            {error}
            {!Object.values(apiStatus).some(Boolean) && (
              <div className="mt-2">
                <p>Please ensure the API service is properly configured and running.</p>
                <p className="text-xs mt-1">Contact your administrator for assistance.</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

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
              <Button className="gap-1" disabled={!apiStatus.enrollments || typeof api.createEnrollment !== "function"}>
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
                  <div className="col-span-3 relative student-dropdown">
                    <Input
                      type="text"
                      placeholder="Search students..."
                      className="mb-2"
                      value={studentSearchQuery}
                      onChange={(e) => {
                        setStudentSearchQuery(e.target.value)
                        setStudentDropdownOpen(true)
                      }}
                      onFocus={() => setStudentDropdownOpen(true)}
                    />
                    {studentDropdownOpen && (
                      <div className="max-h-[200px] overflow-y-auto border rounded-md absolute w-full bg-white z-10 shadow-md">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <div
                              key={student.id}
                              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                newEnrollment.studentId === student.id ? "bg-blue-50" : ""
                              }`}
                              onClick={() => handleSelectChange("studentId", student.id)}
                            >
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-gray-500">{student.email}</div>
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">No students found</div>
                        )}
                      </div>
                    )}
                    {newEnrollment.studentId && !studentDropdownOpen && (
                      <div className="p-2 border rounded-md bg-blue-50">
                        <div className="font-medium">
                          {students.find((s) => s.id === newEnrollment.studentId)?.name || "Selected Student"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {students.find((s) => s.id === newEnrollment.studentId)?.email || ""}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="courseId" className="text-right">
                    Course
                  </Label>
                  <div className="col-span-3 relative course-dropdown">
                    <Input
                      type="text"
                      placeholder="Search courses..."
                      className="mb-2"
                      value={courseSearchQuery}
                      onChange={(e) => {
                        setCourseSearchQuery(e.target.value)
                        setCourseDropdownOpen(true)
                      }}
                      onFocus={() => setCourseDropdownOpen(true)}
                    />
                    {courseDropdownOpen && (
                      <div className="max-h-[200px] overflow-y-auto border rounded-md absolute w-full bg-white z-10 shadow-md">
                        {filteredCourses.length > 0 ? (
                          filteredCourses.map((course) => (
                            <div
                              key={course.id}
                              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                newEnrollment.courseId === course.id ? "bg-blue-50" : ""
                              }`}
                              onClick={() => handleSelectChange("courseId", course.id)}
                            >
                              <div className="font-medium">{course.name}</div>
                              <div className="text-xs text-gray-500">{course.code}</div>
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">No courses found</div>
                        )}
                      </div>
                    )}
                    {newEnrollment.courseId && !courseDropdownOpen && (
                      <div className="p-2 border rounded-md bg-blue-50">
                        <div className="font-medium">
                          {courses.find((c) => c.id === newEnrollment.courseId)?.name || "Selected Course"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {courses.find((c) => c.id === newEnrollment.courseId)?.code || ""}
                        </div>
                      </div>
                    )}
                  </div>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading enrollments...
                  </div>
                </TableCell>
              </TableRow>
            ) : error && !enrollments.length ? (
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
                        <DropdownMenuItem disabled={!apiStatus.enrollments}>Edit enrollment</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
                          disabled={!apiStatus.enrollments || typeof api.deleteEnrollment !== "function"}
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

