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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MoreHorizontal, Plus, Search, Filter, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
// Update imports to reflect new file paths
import { api } from "@/app/services/api"
import type { Course } from "../../types"
import { useToast } from "@/hooks/use-toast"

// Import useRouter
import { useRouter } from "next/navigation"

// Add router inside the component
export default function Courses() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newCourse, setNewCourse] = useState<Omit<Course, "id">>({
    name: "",
    department: "",
    credits: 3,
    instructor: "",
    students: 0,
    status: "Active",
  })

  const { toast } = useToast()

  // Add pagination state and logic
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Fetch courses data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const data = await api.getCourses()
        setCourses(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch courses data")
        toast({
          title: "Error",
          description: "Failed to load courses data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [toast])

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Pagination logic
  const indexOfLastCourse = currentPage * itemsPerPage
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Add this effect to reset pagination when search changes significantly
  useEffect(() => {
    if (currentPage > Math.ceil(filteredCourses.length / itemsPerPage) && currentPage > 1) {
      setCurrentPage(1)
    }
  }, [searchQuery, filteredCourses.length, currentPage, itemsPerPage])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewCourse((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setNewCourse((prev) => ({ ...prev, [id]: value }))
  }

  // Handle numeric input changes
  const handleNumericChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue)) {
      setNewCourse((prev) => ({ ...prev, [id]: numValue }))
    }
  }

  // Handle course creation
  const handleCreateCourse = async () => {
    try {
      setLoading(true)
      const createdCourse = await api.createCourse(newCourse)
      setCourses((prev) => [...prev, createdCourse])
      setIsAddCourseOpen(false)
      setNewCourse({
        name: "",
        department: "",
        credits: 3,
        instructor: "",
        students: 0,
        status: "Active",
      })
      toast({
        title: "Success",
        description: "Course added successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle course deletion
  const handleDeleteCourse = async (id: string) => {
    try {
      setLoading(true)
      await api.deleteCourse(id)
      setCourses((prev) => prev.filter((course) => course.id !== id))
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Add a function to navigate to course detail
  const handleViewCourseDetails = (courseId: string) => {
    router.push(`/dashboard/courses/${courseId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="w-full sm:w-[250px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" /> Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>Enter the details of the new course below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Course Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Introduction to..."
                    className="col-span-3"
                    value={newCourse.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("department", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Sciences">Sciences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="credits" className="text-right">
                    Credits
                  </Label>
                  <Select onValueChange={(value) => handleNumericChange("credits", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select credits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Credit</SelectItem>
                      <SelectItem value="2">2 Credits</SelectItem>
                      <SelectItem value="3">3 Credits</SelectItem>
                      <SelectItem value="4">4 Credits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="instructor" className="text-right">
                    Instructor
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("instructor", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Robert Chen">Dr. Robert Chen</SelectItem>
                      <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                      <SelectItem value="Dr. Michael Lee">Dr. Michael Lee</SelectItem>
                      <SelectItem value="Dr. Emily Davis">Dr. Emily Davis</SelectItem>
                      <SelectItem value="Dr. James Wilson">Dr. James Wilson</SelectItem>
                      <SelectItem value="Dr. Lisa Brown">Dr. Lisa Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Course description..."
                    className="col-span-3"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCourseOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCourse} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading courses...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredCourses.length > 0 ? (
              currentCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.id}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        course.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {course.status}
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
                        <DropdownMenuItem onClick={() => handleViewCourseDetails(course.id)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit course</DropdownMenuItem>
                        <DropdownMenuItem>Manage students</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCourse(course.id)}>
                          Delete course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            />
          </PaginationItem>

          {pageNumbers.length > 0 &&
            pageNumbers.map((number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  className="cursor-pointer"
                  isActive={currentPage === number}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}

          {pageNumbers.length === 0 && (
            <PaginationItem>
              <PaginationLink isActive>1</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              className={
                currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

