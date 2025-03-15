"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
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
import { MoreHorizontal, Plus, Search, Filter, Loader2, Users, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Update imports to reflect new file paths
import { api } from "@/app/services/api"
import type { Batch, Student, Course, Lecturer } from "../../types"
import { useToast } from "@/hooks/use-toast"

export default function Batches() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false)
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false)
  const [batches, setBatches] = useState<Batch[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newBatch, setNewBatch] = useState<Omit<Batch, "id">>({
    name: "",
    startDate: "",
    endDate: "",
    department: "",
    coordinator: "",
    students: 0,
    status: "Active",
    courses: [], // Add courses array
  })
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [studentSearchQuery, setStudentSearchQuery] = useState("")
  const [faculty, setFaculty] = useState<Lecturer[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { toast } = useToast()

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateBatchDetails = () => {
    const newErrors: Record<string, string> = {}

    if (!newBatch.name) newErrors.name = "Batch name is required"
    if (!newBatch.department) newErrors.department = "Department is required"
    if (!newBatch.startDate) newErrors.startDate = "Start date is required"
    if (!newBatch.endDate) newErrors.endDate = "End date is required"
    if (!newBatch.coordinator) newErrors.coordinator = "Coordinator is required"
    if (!newBatch.status) newErrors.status = "Status is required"
    if (!newBatch.courses || newBatch.courses.length === 0) {
      newErrors.courses = "At least one course must be selected"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Fetch batches data
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true)
        const data = await api.getBatches()
        setBatches(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch batches data")
        toast({
          title: "Error",
          description: "Failed to load batches data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBatches()
  }, [toast])

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await api.getStudents()
        setStudents(data)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load students data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchStudents()
  }, [toast])

  // Fetch courses data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses()
        setCourses(data)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load courses data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchCourses()
  }, [toast])

  // Add faculty fetch effect after the other useEffect hooks
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const data = await api.getLecturers()
        setFaculty(data)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load faculty data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchFaculty()
  }, [toast])

  // Filter batches based on search query
  const filteredBatches = useMemo(() => {
    return batches.filter(
      (batch) =>
        batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.coordinator.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [batches, searchQuery])

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredBatches.length / itemsPerPage)
  }, [filteredBatches, itemsPerPage])

  // Get current batches for the current page
  const currentBatches = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return filteredBatches.slice(indexOfFirstItem, indexOfLastItem)
  }, [filteredBatches, currentPage, itemsPerPage])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.year.toString().includes(studentSearchQuery.toLowerCase()),
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewBatch((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setNewBatch((prev) => ({ ...prev, [id]: value }))
  }

  // Handle numeric input changes
  const handleNumericChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue)) {
      setNewBatch((prev) => ({ ...prev, [id]: numValue }))
    }
  }

  // Handle student selection
  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId)
      } else {
        return [...prev, studentId]
      }
    })
  }

  // Handle batch creation
  const handleCreateBatch = async () => {
    if (!validateBatchDetails()) {
      toast({
        title: "Error",
        description: "Please fill in all required batch details before proceeding.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const batchData = {
        ...newBatch,
        students: selectedStudents.length,
      }

      const createdBatch = await api.createBatch(batchData)
      setBatches((prev) => [...prev, createdBatch])
      setIsAddBatchOpen(false)
      setNewBatch({
        name: "",
        startDate: "",
        endDate: "",
        department: "",
        coordinator: "",
        students: 0,
        status: "Active",
        courses: [],
      })
      setSelectedStudents([])
      setErrors({})
      toast({
        title: "Success",
        description: "Batch added successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add batch. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle batch deletion
  const handleDeleteBatch = async (id: string) => {
    try {
      setLoading(true)
      await api.deleteBatch(id)
      setBatches((prev) => prev.filter((batch) => batch.id !== id))
      toast({
        title: "Success",
        description: "Batch deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete batch. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Open manage students dialog
  const openManageStudents = (batch: Batch) => {
    setCurrentBatch(batch)
    // In a real app, you would fetch the students assigned to this batch
    // For now, we'll just use an empty array
    setSelectedStudents([])
    setIsManageStudentsOpen(true)
  }

  // Handle updating batch students
  const handleUpdateBatchStudents = async () => {
    if (!currentBatch) return

    try {
      setLoading(true)
      const updatedBatch = await api.updateBatch(currentBatch.id, {
        students: selectedStudents.length,
      })

      setBatches((prev) => prev.map((batch) => (batch.id === updatedBatch.id ? updatedBatch : batch)))

      setIsManageStudentsOpen(false)
      setCurrentBatch(null)
      setSelectedStudents([])

      toast({
        title: "Success",
        description: "Students assigned to batch successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update batch students. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const activeBatches = batches.filter((b) => b.status === "Active").length
  const totalStudents = batches.reduce((sum, batch) => sum + batch.students, 0)

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
        <h2 className="text-2xl font-bold">Batch Management</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search batches..."
              className="w-full sm:w-[250px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog open={isAddBatchOpen} onOpenChange={setIsAddBatchOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" /> Add Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Batch</DialogTitle>
                <DialogDescription>Enter the details of the new batch below.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details" className="relative">
                    Batch Details
                    {Object.keys(errors).length > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="students" disabled={Object.keys(errors).length > 0}>
                    Assign Students
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 py-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Batch Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="col-span-3 space-y-1">
                        <Input
                          id="name"
                          placeholder="CS Batch 2023"
                          value={newBatch.name}
                          onChange={handleInputChange}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">
                        Department <span className="text-red-500">*</span>
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
                      {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="courses" className="text-right">
                        Courses <span className="text-red-500">*</span>
                      </Label>
                      <div className="col-span-3 space-y-1">
                        <Select
                          onValueChange={(value) => {
                            setNewBatch((prev) => ({
                              ...prev,
                              courses: [...(prev.courses || []), value],
                            }))
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select courses" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name} ({course.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {newBatch.courses && newBatch.courses.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {newBatch.courses.map((courseId) => {
                              const course = courses.find((c) => c.id === courseId)
                              return course ? (
                                <Badge key={course.id} variant="secondary" className="flex items-center gap-1">
                                  {course.name}
                                  <button
                                    onClick={() => {
                                      setNewBatch((prev) => ({
                                        ...prev,
                                        courses: prev.courses?.filter((id) => id !== courseId) || [],
                                      }))
                                    }}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ) : null
                            })}
                          </div>
                        )}
                        {errors.courses && <p className="text-xs text-red-500">{errors.courses}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="startDate" className="text-right">
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        className="col-span-3"
                        value={newBatch.startDate}
                        onChange={handleInputChange}
                      />
                      {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="endDate" className="text-right">
                        End Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        className="col-span-3"
                        value={newBatch.endDate}
                        onChange={handleInputChange}
                      />
                      {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="coordinator" className="text-right">
                        Coordinator <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={(value) => handleSelectChange("coordinator", value)}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select coordinator" />
                        </SelectTrigger>
                        <SelectContent>
                          {faculty.map((member) => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.coordinator && <p className="text-xs text-red-500">{errors.coordinator}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Planned">Planned</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="students" className="py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Assign Students to Batch</h3>
                      <Badge variant="outline">{selectedStudents.length} selected</Badge>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search students..."
                        className="pl-8"
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                      />
                    </div>

                    <ScrollArea className="h-[300px] border rounded-md p-2">
                      <div className="space-y-2">
                        {filteredStudents.map((student) => (
                          <div key={student.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                            <Checkbox
                              id={`student-${student.id}`}
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() => handleStudentSelection(student.id)}
                            />
                            <div className="grid gap-0.5">
                              <Label htmlFor={`student-${student.id}`} className="text-sm font-medium cursor-pointer">
                                {student.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {student.department} • {student.year} Year • GPA: {student.gpa}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddBatchOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBatch} disabled={loading || Object.keys(errors).length > 0}>
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
            <CardTitle>Active Batches</CardTitle>
            <CardDescription>Currently running batches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeBatches}</div>
            <p className="text-xs text-muted-foreground">
              <Calendar className="inline h-3 w-3 mr-1" />
              {batches.length} total batches
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Students</CardTitle>
            <CardDescription>Students enrolled in all batches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <Users className="inline h-3 w-3 mr-1" />
              Across all departments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Coordinator</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading batches...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : currentBatches.length > 0 ? (
              currentBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.id}</TableCell>
                  <TableCell>{batch.name}</TableCell>
                  <TableCell>{batch.department}</TableCell>
                  <TableCell>{batch.startDate}</TableCell>
                  <TableCell>{batch.endDate}</TableCell>
                  <TableCell>{batch.coordinator}</TableCell>
                  <TableCell>{batch.students}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        batch.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : batch.status === "Completed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {batch.status}
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
                        <DropdownMenuItem>Edit batch</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openManageStudents(batch)}>Manage students</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteBatch(batch.id)}>
                          Delete batch
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No batches found.
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
            {Math.min(currentPage * itemsPerPage, filteredBatches.length)} of {filteredBatches.length} batches
          </div>
          <Pagination>
            <PaginationContent>{renderPaginationItems()}</PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Manage Students Dialog */}
      <Dialog open={isManageStudentsOpen} onOpenChange={setIsManageStudentsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Students for {currentBatch?.name}</DialogTitle>
            <DialogDescription>Assign or remove students from this batch.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Students</h3>
              <Badge variant="outline">{selectedStudents.length} selected</Badge>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
              />
            </div>

            <ScrollArea className="h-[300px] border rounded-md p-2">
              <div className="space-y-2">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                    <Checkbox
                      id={`manage-student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentSelection(student.id)}
                    />
                    <div className="grid gap-0.5">
                      <Label htmlFor={`manage-student-${student.id}`} className="text-sm font-medium cursor-pointer">
                        {student.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {student.department} • {student.year} Year • GPA: {student.gpa}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageStudentsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBatchStudents} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

