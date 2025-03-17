"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { CreditInfo } from "@/app/components/credit-info"
import { MultiSelect } from "@/components/ui/multi-select"
import { useToast } from "@/hooks/use-toast"
import type { Course } from "@/app/types"

// Import the centralized API service
import { api } from "@/app/services/api"

// Get lecturers from the API instead of hardcoding
export default function Courses() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [lecturers, setLecturers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: "",
    code: "",
    department: "",
    credits: 30,
    lecturers: [],
    students: 0,
    status: "Active",
    subjectIds: [],
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course)
    setIsViewDetailsOpen(true)
  }

  // Fetch lecturers from the API
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        console.log("Fetching lecturers from API...")

        // Check if the getLecturers method exists
        if (typeof api.getLecturers !== "function") {
          console.warn("api.getLecturers is not a function, using fallback data")
          const fallbackLecturers = [
            { value: "Dr. Robert Chen", label: "Dr. Robert Chen" },
            { value: "Dr. Sarah Johnson", label: "Dr. Sarah Johnson" },
            { value: "Dr. Michael Lee", label: "Dr. Michael Lee" },
            { value: "Dr. Emily Davis", label: "Dr. Emily Davis" },
            { value: "Dr. James Wilson", label: "Dr. James Wilson" },
            { value: "Dr. Lisa Brown", label: "Dr. Lisa Brown" },
          ]
          setLecturers(fallbackLecturers)
          return
        }

        const data = await api.getLecturers()
        console.log("Lecturers data received:", data)

        // Validate data is an array
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API")
        }

        // Transform the lecturers data into the format needed for the dropdown
        const lecturerOptions = data.map((lecturer) => ({
          value: lecturer.name,
          label: lecturer.name,
        }))

        setLecturers(lecturerOptions)
      } catch (err) {
        console.error("Error fetching lecturers:", err)
        // Fallback to hardcoded lecturers if API fails
        setLecturers([
          { value: "Dr. Robert Chen", label: "Dr. Robert Chen" },
          { value: "Dr. Sarah Johnson", label: "Dr. Sarah Johnson" },
          { value: "Dr. Michael Lee", label: "Dr. Michael Lee" },
          { value: "Dr. Emily Davis", label: "Dr. Emily Davis" },
          { value: "Dr. James Wilson", label: "Dr. James Wilson" },
          { value: "Dr. Lisa Brown", label: "Dr. Lisa Brown" },
        ])
      }
    }

    fetchLecturers()
  }, [])

  // Fetch courses from the centralized mock API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        console.log("Fetching courses from API...")

        // Check if the getCourses method exists
        if (typeof api.getCourses !== "function") {
          console.warn("api.getCourses is not a function, using fallback data")
          const fallbackData = [
            {
              id: "C001",
              name: "Introduction to Computer Science",
              code: "CS101",
              department: "Computer Science",
              credits: 30,
              lecturers: ["Dr. Robert Chen"],
              students: 65,
              status: "Active",
            },
            {
              id: "C002",
              name: "Data Structures and Algorithms",
              code: "CS201",
              department: "Computer Science",
              credits: 45,
              lecturers: ["Dr. Sarah Johnson", "Dr. Michael Lee"],
              students: 42,
              status: "Active",
            },
            {
              id: "C003",
              name: "Database Systems",
              code: "CS301",
              department: "Computer Science",
              credits: 30,
              lecturers: ["Dr. Emily Davis"],
              students: 38,
              status: "Active",
            },
            {
              id: "C004",
              name: "Introduction to Business",
              code: "BUS101",
              department: "Business",
              credits: 30,
              lecturers: ["Dr. James Wilson"],
              students: 75,
              status: "Active",
            },
            {
              id: "C005",
              name: "Molecular Biology",
              code: "BIO201",
              department: "Sciences",
              credits: 45,
              lecturers: ["Dr. Lisa Brown"],
              students: 32,
              status: "Inactive",
            },
          ]
          setCourses(fallbackData)
          setError(null)
          return
        }

        const data = await api.getCourses()
        console.log("Courses data received:", data)

        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format received from API")
        }

        setCourses(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching courses:", err)
        setError("Failed to fetch courses data")
        toast({
          title: "Warning",
          description: "Using sample course data instead of API data.",
          variant: "warning",
        })

        // Use fallback data on error
        const fallbackData = [
          {
            id: "C001",
            name: "Introduction to Computer Science",
            code: "CS101",
            department: "Computer Science",
            credits: 30,
            lecturers: ["Dr. Robert Chen"],
            students: 65,
            status: "Active",
          },
          {
            id: "C002",
            name: "Data Structures and Algorithms",
            code: "CS201",
            department: "Computer Science",
            credits: 45,
            lecturers: ["Dr. Sarah Johnson", "Dr. Michael Lee"],
            students: 42,
            status: "Active",
          },
          {
            id: "C003",
            name: "Database Systems",
            code: "CS301",
            department: "Computer Science",
            credits: 30,
            lecturers: ["Dr. Emily Davis"],
            students: 38,
            status: "Active",
          },
        ]
        setCourses(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [toast])

  // Add null checks to prevent toLowerCase errors
  const filteredCourses = courses.filter((course) => {
    // Safely access properties with null checks
    const name = course.name?.toLowerCase() || ""
    const id = course.id?.toLowerCase() || ""
    const department = course.department?.toLowerCase() || ""
    const lecturers = Array.isArray(course.lecturers) ? course.lecturers.join(", ").toLowerCase() : ""

    const query = searchQuery.toLowerCase()

    return name.includes(query) || id.includes(query) || department.includes(query) || lecturers.includes(query)
  })

  const indexOfLastCourse = currentPage * itemsPerPage
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Reset pagination when search changes significantly
  useEffect(() => {
    if (currentPage > Math.ceil(filteredCourses.length / itemsPerPage) && currentPage > 1) {
      setCurrentPage(1)
    }
  }, [searchQuery, filteredCourses.length, currentPage, itemsPerPage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewCourse((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setNewCourse((prev) => ({ ...prev, [id]: value }))
  }

  const handleNumericChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue)) {
      setNewCourse((prev) => ({ ...prev, [id]: numValue }))
    }
  }

  const handleCreateCourse = async () => {
    try {
      setLoading(true)
      console.log("Creating new course:", newCourse)

      // Check if createCourse method exists
      if (typeof api.createCourse !== "function") {
        console.warn("api.createCourse is not a function, simulating creation")
        // Simulate course creation
        const createdCourse = {
          ...newCourse,
          id: `C${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}`,
          students: 0,
          status: "Active",
        } as Course

        setCourses((prev) => [...prev, createdCourse])
        setIsAddCourseOpen(false)
        setNewCourse({
          name: "",
          code: "",
          department: "",
          credits: 30,
          lecturers: [],
          students: 0,
          status: "Active",
          subjectIds: [],
        })

        toast({
          title: "Success",
          description: "Course added successfully (simulated)",
        })
        return
      }

      const createdCourse = await api.createCourse(newCourse)
      console.log("Course created:", createdCourse)
      setCourses((prev) => [...prev, createdCourse])
      setIsAddCourseOpen(false)
      setNewCourse({
        name: "",
        code: "",
        department: "",
        credits: 30,
        lecturers: [],
        students: 0,
        status: "Active",
        subjectIds: [],
      })
      toast({
        title: "Success",
        description: "Course added successfully",
      })
    } catch (err) {
      console.error("Error creating course:", err)
      toast({
        title: "Error",
        description: "Failed to add course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    try {
      setLoading(true)
      console.log("Deleting course with ID:", id)

      // Check if deleteCourse method exists
      if (typeof api.deleteCourse !== "function") {
        console.warn("api.deleteCourse is not a function, simulating deletion")
        // Simulate course deletion
        setCourses((prev) => prev.filter((course) => course.id !== id))
        toast({
          title: "Success",
          description: "Course deleted successfully (simulated)",
        })
        setIsDeleteConfirmOpen(false)
        return
      }

      await api.deleteCourse(id)
      setCourses((prev) => prev.filter((course) => course.id !== id))
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
      setIsDeleteConfirmOpen(false)
    } catch (err) {
      console.error("Error deleting course:", err)
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewCourseDetails = (courseId: string) => {
    router.push(`/dashboard/courses/${courseId}`)
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setIsEditCourseOpen(true)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setEditingCourse((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleEditSelectChange = (id: string, value: string) => {
    setEditingCourse((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleEditNumericChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue)) {
      setEditingCourse((prev) => (prev ? { ...prev, [id]: numValue } : null))
    }
  }

  const handleUpdateCourse = async () => {
    if (!editingCourse) return

    try {
      setLoading(true)
      console.log("Updating course:", editingCourse)

      // Check if updateCourse method exists
      if (typeof api.updateCourse !== "function") {
        console.warn("api.updateCourse is not a function, simulating update")
        // Simulate course update
        setCourses((prev) => prev.map((course) => (course.id === editingCourse.id ? editingCourse : course)))

        setIsEditCourseOpen(false)
        setEditingCourse(null)
        toast({
          title: "Success",
          description: "Course updated successfully (simulated)",
        })
        return
      }

      const updatedCourse = await api.updateCourse(editingCourse.id, editingCourse)
      console.log("Course updated:", updatedCourse)

      // Update the courses list with the updated course
      setCourses((prev) => prev.map((course) => (course.id === updatedCourse.id ? updatedCourse : course)))

      setIsEditCourseOpen(false)
      setEditingCourse(null)
      toast({
        title: "Success",
        description: "Course updated successfully",
      })
    } catch (err) {
      console.error("Error updating course:", err)
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = (course: Course) => {
    setCourseToDelete(course)
    setIsDeleteConfirmOpen(true)
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
                  <Label htmlFor="code" className="text-right">
                    Course Code
                  </Label>
                  <Input
                    id="code"
                    placeholder="CS101"
                    className="col-span-3"
                    value={newCourse.code}
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
                  <Label htmlFor="credits" className="text-right flex items-center justify-end gap-1">
                    Credits
                    <CreditInfo />
                  </Label>
                  <Select onValueChange={(value) => handleNumericChange("credits", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select credits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 Credits</SelectItem>
                      <SelectItem value="30">30 Credits</SelectItem>
                      <SelectItem value="45">45 Credits</SelectItem>
                      <SelectItem value="60">60 Credits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lecturers" className="text-right">
                    Lecturers
                  </Label>
                  <div className="col-span-3">
                    <MultiSelect
                      selected={newCourse.lecturers || []}
                      options={lecturers}
                      onChange={(selected) => {
                        setNewCourse((prev) => ({
                          ...prev,
                          lecturers: selected,
                        }))
                      }}
                      placeholder="Select lecturers..."
                    />
                  </div>
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
          <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Course Details</DialogTitle>
                <DialogDescription>Detailed information about the selected course.</DialogDescription>
              </DialogHeader>
              {selectedCourse && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">ID:</div>
                    <div className="col-span-2">{selectedCourse.id}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Code:</div>
                    <div className="col-span-2">{selectedCourse.code || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Name:</div>
                    <div className="col-span-2">{selectedCourse.name || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Department:</div>
                    <div className="col-span-2">{selectedCourse.department || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Credits:</div>
                    <div className="col-span-2">{selectedCourse.credits || 0}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Students:</div>
                    <div className="col-span-2">{selectedCourse.students || 0}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Status:</div>
                    <div className="col-span-2">{selectedCourse.status || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Lecturers:</div>
                    <div className="col-span-2">
                      {Array.isArray(selectedCourse.lecturers) && selectedCourse.lecturers.length > 0
                        ? selectedCourse.lecturers.join(", ")
                        : "None assigned"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Description:</div>
                    <div className="col-span-2">{selectedCourse.description || "No description available."}</div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Course</DialogTitle>
                <DialogDescription>Update the details of the course.</DialogDescription>
              </DialogHeader>
              {editingCourse && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Course Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Introduction to..."
                      className="col-span-3"
                      value={editingCourse.name || ""}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Course Code
                    </Label>
                    <Input
                      id="code"
                      placeholder="CS101"
                      className="col-span-3"
                      value={editingCourse.code || ""}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Select
                      onValueChange={(value) => handleEditSelectChange("department", value)}
                      defaultValue={editingCourse.department}
                    >
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
                    <Label htmlFor="credits" className="text-right flex items-center justify-end gap-1">
                      Credits
                      <CreditInfo />
                    </Label>
                    <Select
                      onValueChange={(value) => handleEditNumericChange("credits", value)}
                      defaultValue={editingCourse.credits?.toString()}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select credits" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 Credits</SelectItem>
                        <SelectItem value="30">30 Credits</SelectItem>
                        <SelectItem value="45">45 Credits</SelectItem>
                        <SelectItem value="60">60 Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lecturers" className="text-right">
                      Lecturers
                    </Label>
                    <div className="col-span-3">
                      <MultiSelect
                        selected={editingCourse.lecturers || []}
                        options={lecturers}
                        onChange={(selected) => {
                          setEditingCourse((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  lecturers: selected,
                                }
                              : null,
                          )
                        }}
                        placeholder="Select lecturers..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Course description..."
                      className="col-span-3"
                      value={editingCourse.description || ""}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditCourseOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCourse} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Lecturers</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading courses...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-amber-500">
                  Data could not be fetched from the API. Showing sample data instead.
                </TableCell>
              </TableRow>
            ) : filteredCourses.length > 0 ? (
              currentCourses.map((course) => (
                <TableRow key={course.id || `course-${Math.random()}`}>
                  <TableCell className="font-medium">{course.id || "N/A"}</TableCell>
                  <TableCell>{course.code || "N/A"}</TableCell>
                  <TableCell>{course.name || "N/A"}</TableCell>
                  <TableCell>{course.department || "N/A"}</TableCell>
                  <TableCell>{course.credits || 0}</TableCell>
                  <TableCell>{Array.isArray(course.lecturers) ? course.lecturers.join(", ") : "N/A"}</TableCell>
                  <TableCell>{course.students || 0}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        course.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {course.status || "Unknown"}
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
                        <DropdownMenuItem onClick={() => course.id && handleViewDetails(course)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => course.id && handleEditCourse(course)}>
                          Edit course
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => course.id && handleConfirmDelete(course)}
                          disabled={!course.id}
                        >
                          Delete course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
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
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {courseToDelete && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-2">{courseToDelete.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Code:</div>
                <div className="col-span-2">{courseToDelete.code || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-2">{courseToDelete.name || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Department:</div>
                <div className="col-span-2">{courseToDelete.department || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Students:</div>
                <div className="col-span-2">{courseToDelete.students || 0}</div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => courseToDelete?.id && handleDeleteCourse(courseToDelete.id)}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

