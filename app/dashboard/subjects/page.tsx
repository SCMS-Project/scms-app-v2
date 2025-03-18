"use client"

import { DialogTrigger } from "@/components/ui/dialog"

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
import { MoreHorizontal, Plus, Search, Filter, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import type { Subject, Course } from "../../types"
import { useToast } from "@/hooks/use-toast"
// Add import for CreditInfo
import { CreditInfo } from "@/app/components/credit-info"
import { api } from "@/app/services/api"

export default function Subjects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newSubject, setNewSubject] = useState<Omit<Subject, "id">>({
    name: "",
    code: "",
    description: "",
    credits: 15,
    department: "",
    courseIds: [],
  })

  const { toast } = useToast()

  // Add pagination state and logic
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Add these state variables after the existing state variables
  const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null)

  // Fetch subjects and courses data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching subjects and courses data...")

      // Check if API is available
      if (!api) {
        console.error("API service is not available")
        setError("API service is not available. Please check your configuration.")
        setSubjects([])
        setCourses([])
        setLoading(false)
        return
      }

      // Fetch subjects
      try {
        const subjectsData = await api.getSubjects()
        console.log("Subjects data fetched successfully:", subjectsData)

        if (Array.isArray(subjectsData) && subjectsData.length > 0) {
          setSubjects(subjectsData)
        } else {
          console.warn("No subjects data returned from API.")
          setSubjects([])
          setError("No subjects found in the database. Please add some subjects or create sample data.")
        }
      } catch (err) {
        console.error("Failed to fetch subjects:", err)
        setSubjects([])
        setError("Failed to fetch subjects. Please try again or create sample data.")
      }

      // Fetch courses
      try {
        const coursesData = await api.getCourses()
        console.log("Courses data fetched successfully:", coursesData)

        if (Array.isArray(coursesData) && coursesData.length > 0) {
          setCourses(coursesData)
        } else {
          console.warn("No courses data returned from API.")
          setCourses([])
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err)
        setCourses([])
      }
    } catch (err) {
      console.error("Error in fetchData:", err)
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(`Error: ${errorMessage}`)
      setSubjects([])
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Create sample data function
  const createSampleData = () => {
    setLoading(true)

    // Sample subjects
    const sampleSubjects = [
      {
        id: `sub-${Date.now()}-1`,
        name: "Introduction to Programming",
        code: "CS101",
        description: "Fundamentals of programming concepts and problem-solving",
        credits: 15,
        department: "Computer Science",
        courseIds: [`course-${Date.now()}-1`, `course-${Date.now()}-2`],
      },
      {
        id: `sub-${Date.now()}-2`,
        name: "Database Systems",
        code: "CS301",
        description: "Design and implementation of database systems",
        credits: 30,
        department: "Computer Science",
        courseIds: [`course-${Date.now()}-3`],
      },
      {
        id: `sub-${Date.now()}-3`,
        name: "Calculus I",
        code: "MATH101",
        description: "Introduction to differential and integral calculus",
        credits: 15,
        department: "Mathematics",
        courseIds: [`course-${Date.now()}-4`],
      },
    ]

    // Sample courses
    const sampleCourses = [
      {
        id: `course-${Date.now()}-1`,
        name: "Computer Science Fundamentals",
        code: "CSF100",
        department: "Computer Science",
      },
      {
        id: `course-${Date.now()}-2`,
        name: "Software Engineering",
        code: "SE200",
        department: "Computer Science",
      },
      {
        id: `course-${Date.now()}-3`,
        name: "Data Science",
        code: "DS300",
        department: "Computer Science",
      },
      {
        id: `course-${Date.now()}-4`,
        name: "Applied Mathematics",
        code: "AM100",
        department: "Mathematics",
      },
    ]

    // Update state with sample data
    setSubjects(sampleSubjects)
    setCourses(sampleCourses)
    setError("Using sample data. API methods are not implemented.")
    setLoading(false)

    toast({
      title: "Sample Data Created",
      description: "Sample subjects and courses have been created for demonstration purposes.",
      variant: "warning",
    })
  }

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter(
    (subject) =>
      (subject.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (subject.code?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (subject.department?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  )

  // Pagination logic
  const indexOfLastSubject = currentPage * itemsPerPage
  const indexOfFirstSubject = indexOfLastSubject - itemsPerPage
  const currentSubjects = filteredSubjects.slice(indexOfFirstSubject, indexOfLastSubject)
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage)

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
    if (currentPage > Math.ceil(filteredSubjects.length / itemsPerPage) && currentPage > 1) {
      setCurrentPage(1)
    }
  }, [searchQuery, filteredSubjects.length, currentPage, itemsPerPage])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewSubject((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setNewSubject((prev) => ({ ...prev, [id]: value }))
  }

  // Handle numeric input changes
  const handleNumericChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue)) {
      setNewSubject((prev) => ({ ...prev, [id]: numValue }))
    }
  }

  // Handle course selection
  const handleCourseSelection = (courseId: string) => {
    setNewSubject((prev) => {
      const courseIds = [...prev.courseIds]
      if (courseIds.includes(courseId)) {
        return { ...prev, courseIds: courseIds.filter((id) => id !== courseId) }
      } else {
        return { ...prev, courseIds: [...courseIds, courseId] }
      }
    })
  }

  // Handle subject creation
  const handleCreateSubject = async () => {
    try {
      setLoading(true)
      console.log("Creating subject:", newSubject)

      // Call the API to create the subject
      const createdSubject = await api.createSubject(newSubject)
      console.log("Subject created successfully:", createdSubject)
      setSubjects((prev) => [...prev, createdSubject])
      setIsAddSubjectOpen(false)
      setNewSubject({
        name: "",
        code: "",
        description: "",
        credits: 15,
        department: "",
        courseIds: [],
      })

      toast({
        title: "Success",
        description: "Subject added successfully",
      })
    } catch (err) {
      console.error("Error creating subject:", err)
      const errorMessage = err instanceof Error ? err.message : String(err)

      // Create a new subject in the UI only as fallback
      const newId = `sub-${Date.now()}`
      const createdSubject = { ...newSubject, id: newId }
      setSubjects((prev) => [...prev, createdSubject])
      setIsAddSubjectOpen(false)
      setNewSubject({
        name: "",
        code: "",
        description: "",
        credits: 15,
        department: "",
        courseIds: [],
      })

      toast({
        title: "Warning",
        description: "Subject was added to the UI only. API error: " + errorMessage,
        variant: "warning",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle subject deletion
  const handleDeleteSubject = async (id: string) => {
    try {
      setLoading(true)
      console.log("Deleting subject with ID:", id)

      // Call the API to delete the subject
      await api.deleteSubject(id)
      console.log("Subject deleted successfully")
      setSubjects((prev) => prev.filter((subject) => subject.id !== id))

      toast({
        title: "Success",
        description: "Subject deleted successfully",
      })

      setIsDeleteConfirmOpen(false)
    } catch (err) {
      console.error("Error deleting subject:", err)
      const errorMessage = err instanceof Error ? err.message : String(err)

      // Delete the subject from the UI only as fallback
      setSubjects((prev) => prev.filter((subject) => subject.id !== id))
      setIsDeleteConfirmOpen(false)

      toast({
        title: "Warning",
        description: "Subject was removed from the UI only. API error: " + errorMessage,
        variant: "warning",
      })
    } finally {
      setLoading(false)
    }
  }

  // Get course names for a subject
  const getCoursesForSubject = (courseIds: string[]) => {
    if (!Array.isArray(courseIds) || courseIds.length === 0) return "None"

    return courseIds
      .map((id) => {
        const course = courses.find((c) => c.id === id)
        // Return both code and name for better clarity
        return course ? `${course.code || "N/A"} (${course.name})` : "Unknown"
      })
      .join(", ")
  }

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  const handleViewDetails = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsViewDetailsOpen(true)
  }

  // Handle opening the edit dialog
  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject)
    setIsEditSubjectOpen(true)
  }

  // Handle edit form input changes
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    if (editingSubject) {
      setEditingSubject((prev) => (prev ? { ...prev, [id]: value } : null))
    }
  }

  // Handle edit form select changes
  const handleEditSelectChange = (id: string, value: string) => {
    if (editingSubject) {
      setEditingSubject((prev) => (prev ? { ...prev, [id]: value } : null))
    }
  }

  // Handle edit form numeric changes
  const handleEditNumericChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue) && editingSubject) {
      setEditingSubject((prev) => (prev ? { ...prev, [id]: numValue } : null))
    }
  }

  // Handle edit form course selection
  const handleEditCourseSelection = (courseId: string) => {
    if (editingSubject) {
      setEditingSubject((prev) => {
        if (!prev) return null
        const courseIds = [...prev.courseIds]
        if (courseIds.includes(courseId)) {
          return { ...prev, courseIds: courseIds.filter((id) => id !== courseId) }
        } else {
          return { ...prev, courseIds: [...courseIds, courseId] }
        }
      })
    }
  }

  // Handle updating the subject
  const handleUpdateSubject = async () => {
    if (!editingSubject) return

    try {
      setLoading(true)
      console.log("Updating subject:", editingSubject)

      // Call the API to update the subject
      const updatedSubject = await api.updateSubject(editingSubject.id, editingSubject)

      // Update the local state
      setSubjects((prev) => prev.map((subject) => (subject.id === updatedSubject.id ? updatedSubject : subject)))

      setIsEditSubjectOpen(false)
      toast({
        title: "Success",
        description: "Subject updated successfully",
      })
    } catch (err) {
      console.error("Error updating subject:", err)
      const errorMessage = err instanceof Error ? err.message : String(err)

      // Update the subject in the UI only as fallback
      setSubjects((prev) => prev.map((subject) => (subject.id === editingSubject.id ? editingSubject : subject)))
      setIsEditSubjectOpen(false)

      toast({
        title: "Warning",
        description: "Subject was updated in the UI only. API error: " + errorMessage,
        variant: "warning",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle opening the delete confirmation dialog
  const handleConfirmDelete = (subject: Subject) => {
    setSubjectToDelete(subject)
    setIsDeleteConfirmOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Subject Management</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subjects..."
              className="w-full sm:w-[250px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" /> Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>Enter the details of the new subject below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Subject Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Introduction to..."
                    className="col-span-3"
                    value={newSubject.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Subject Code
                  </Label>
                  <Input
                    id="code"
                    placeholder="CS101-A"
                    className="col-span-3"
                    value={newSubject.code}
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
                {/* Add the CreditInfo component next to the Credits label */}
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
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Subject description..."
                    className="col-span-3"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Courses</Label>
                  <div className="col-span-3 border rounded-md p-3 max-h-40 overflow-y-auto">
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <div key={course.id} className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            id={`course-${course.id}`}
                            checked={newSubject.courseIds.includes(course.id)}
                            onChange={() => handleCourseSelection(course.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label htmlFor={`course-${course.id}`} className="text-sm">
                            {course.name} ({course.department})
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No courses available</p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddSubjectOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSubject} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Subject Details</DialogTitle>
                <DialogDescription>Detailed information about the selected subject.</DialogDescription>
              </DialogHeader>
              {selectedSubject && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">ID:</div>
                    <div className="col-span-2">{selectedSubject.id}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Code:</div>
                    <div className="col-span-2">{selectedSubject.code || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Name:</div>
                    <div className="col-span-2">{selectedSubject.name || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Department:</div>
                    <div className="col-span-2">{selectedSubject.department || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Credits:</div>
                    <div className="col-span-2">{selectedSubject.credits || 0}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Description:</div>
                    <div className="col-span-2">{selectedSubject.description || "No description available."}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Courses:</div>
                    <div className="col-span-2">{getCoursesForSubject(selectedSubject.courseIds)}</div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditSubjectOpen} onOpenChange={setIsEditSubjectOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Subject</DialogTitle>
                <DialogDescription>Update the details of the subject below.</DialogDescription>
              </DialogHeader>
              {editingSubject && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Subject Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Introduction to..."
                      className="col-span-3"
                      value={editingSubject.name}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Subject Code
                    </Label>
                    <Input
                      id="code"
                      placeholder="CS101-A"
                      className="col-span-3"
                      value={editingSubject.code}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Select
                      onValueChange={(value) => handleEditSelectChange("department", value)}
                      defaultValue={editingSubject.department}
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
                      defaultValue={editingSubject.credits.toString()}
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
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Subject description..."
                      className="col-span-3"
                      value={editingSubject.description}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Courses</Label>
                    <div className="col-span-3 border rounded-md p-3 max-h-40 overflow-y-auto">
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <div key={course.id} className="flex items-center space-x-2 mb-2">
                            <input
                              type="checkbox"
                              id={`edit-course-${course.id}`}
                              checked={editingSubject.courseIds.includes(course.id)}
                              onChange={() => handleEditCourseSelection(course.id)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor={`edit-course-${course.id}`} className="text-sm">
                              {course.name} ({course.department})
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No courses available</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditSubjectOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateSubject} disabled={loading}>
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
              <TableHead>Courses</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading subjects...
                  </div>
                </TableCell>
              </TableRow>
            ) : error && subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-6 w-6 text-amber-500" />
                    <p className="text-amber-500">
                      {typeof error === "string" ? error : "An issue occurred with data fetching"}
                    </p>
                    <div className="text-xs text-muted-foreground mt-1 mb-2 max-w-md text-center">
                      <p>
                        Debug info: The mock API service might not be properly initialized or the getSubjects method may
                        not be implemented.
                      </p>
                      <p className="mt-1">Check the console for more details.</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Try Again
                      </Button>
                      <Button variant="default" size="sm" onClick={createSampleData} disabled={loading}>
                        Create Sample Data
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredSubjects.length > 0 ? (
              currentSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.id}</TableCell>
                  <TableCell>{subject.code || "N/A"}</TableCell>
                  <TableCell>{subject.name || "N/A"}</TableCell>
                  <TableCell>{subject.department || "N/A"}</TableCell>
                  <TableCell>{subject.credits || 0}</TableCell>
                  <TableCell>
                    <span className="line-clamp-1" title={getCoursesForSubject(subject.courseIds)}>
                      {getCoursesForSubject(subject.courseIds)}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(subject)}>View details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditSubject(subject)}>Edit subject</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleConfirmDelete(subject)}>
                          Delete subject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No subjects found.
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
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subject? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {subjectToDelete && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-2">{subjectToDelete.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Code:</div>
                <div className="col-span-2">{subjectToDelete.code || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-2">{subjectToDelete.name || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Department:</div>
                <div className="col-span-2">{subjectToDelete.department || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Credits:</div>
                <div className="col-span-2">{subjectToDelete.credits || 0}</div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => subjectToDelete && handleDeleteSubject(subjectToDelete.id)}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

