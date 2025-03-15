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

  // Fetch enrollments and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [enrollmentsData, studentsData, coursesData, batchesData] = await Promise.all([
          api.getEnrollments(),
          api.getStudents(),
          api.getCourses(),
          api.getBatches(),
        ])
        setEnrollments(enrollmentsData)
        setStudents(studentsData)
        setCourses(coursesData)
        setBatches(batchesData)
        setError(null)
      } catch (err) {
        setError("Failed to fetch enrollments data")
        toast({
          title: "Error",
          description: "Failed to load enrollments data. Please try again.",
          variant: "destructive",
        })
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
      const createdEnrollment = await api.createEnrollment(newEnrollment as Omit<Enrollment, "id">)
      setEnrollments((prev) => [...prev, createdEnrollment])

      // Update the batch student count
      const selectedBatch = batches.find((b) => b.id === newEnrollment.batchId)
      if (selectedBatch) {
        // Update the batch with one more student
        const updatedBatch = await api.updateBatch(selectedBatch.id, {
          students: selectedBatch.students + 1,
        })

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
        title: "Error",
        description: "Failed to add enrollment. Please try again.",
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

      // Get the enrollment before deleting it
      const enrollmentToDelete = enrollments.find((e) => e.id === id)

      // Delete the enrollment
      await api.deleteEnrollment(id)
      setEnrollments((prev) => prev.filter((enrollment) => enrollment.id !== id))

      // If we found the enrollment, update the batch student count
      if (enrollmentToDelete) {
        const batchToUpdate = batches.find((b) => b.id === enrollmentToDelete.batchId)
        if (batchToUpdate && batchToUpdate.students > 0) {
          // Update the batch with one less student
          const updatedBatch = await api.updateBatch(batchToUpdate.id, {
            students: batchToUpdate.students - 1,
          })

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
        title: "Error",
        description: "Failed to delete enrollment. Please try again.",
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
                        <DropdownMenuItem>View details</DropdownMenuItem>
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

