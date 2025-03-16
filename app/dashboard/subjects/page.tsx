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
import { MoreHorizontal, Plus, Search, Filter, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/app/services/api"
import type { Subject, Course } from "../../types"
import { useToast } from "@/hooks/use-toast"
// Add import for CreditInfo
import { CreditInfo } from "@/app/components/credit-info"

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
    credits: 15, // Changed from 2 to 15
    department: "",
    courseIds: [],
  })

  const { toast } = useToast()

  // Add pagination state and logic
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Fetch subjects and courses data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [subjectsData, coursesData] = await Promise.all([api.getSubjects(), api.getCourses()])
        setSubjects(subjectsData)
        setCourses(coursesData)
        setError(null)
      } catch (err) {
        setError("Failed to fetch data")
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.department.toLowerCase().includes(searchQuery.toLowerCase()),
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
      const createdSubject = await api.createSubject(newSubject)
      setSubjects((prev) => [...prev, createdSubject])
      setIsAddSubjectOpen(false)
      setNewSubject({
        name: "",
        code: "",
        description: "",
        credits: 15, // Changed from 2 to 15
        department: "",
        courseIds: [],
      })
      toast({
        title: "Success",
        description: "Subject added successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add subject. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle subject deletion
  const handleDeleteSubject = async (id: string) => {
    try {
      setLoading(true)
      await api.deleteSubject(id)
      setSubjects((prev) => prev.filter((subject) => subject.id !== id))
      toast({
        title: "Success",
        description: "Subject deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Get course names for a subject
  const getCoursesForSubject = (courseIds: string[]) => {
    return courseIds
      .map((id) => {
        const course = courses.find((c) => c.id === id)
        return course ? course.name : "Unknown Course"
      })
      .join(", ")
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
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredSubjects.length > 0 ? (
              currentSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.id}</TableCell>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.department}</TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>
                    <span className="line-clamp-1" title={getCoursesForSubject(subject.courseIds)}>
                      {getCoursesForSubject(subject.courseIds) || "None"}
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
                        <DropdownMenuItem>Edit subject</DropdownMenuItem>
                        <DropdownMenuItem>Manage courses</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteSubject(subject.id)}>
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
    </div>
  )
}

