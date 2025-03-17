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
import { MoreHorizontal, Plus, Search, Download, Upload, Filter, Loader2, AlertTriangle } from "lucide-react"
import { api } from "@/app/services/api" // Use the unified API service instead of mockApi directly
import type { Student } from "../../types"
import { useToast } from "@/hooks/use-toast"
import { DEPARTMENTS } from "@/app/constants/roles"

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    department: "",
    // Remove year: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage] = useState(5)

  const { toast } = useToast()

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
    setIsViewDetailsOpen(true)
  }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        // Check if the API service is available and if the getStudents method exists
        if (api && typeof api.getStudents === "function") {
          const data = await api.getStudents()
          if (Array.isArray(data)) {
            setStudents(data)
            setError(null)
          } else {
            console.error("Invalid data format returned from API:", data)
            throw new Error("Invalid data format returned from API")
          }
        } else {
          console.error("API method not implemented: getStudents")
          setError("API method not implemented: getStudents")
          setStudents([])
        }
      } catch (err) {
        console.error("Error fetching students:", err)
        setError("Failed to fetch students data. Please check the API connection.")
        setStudents([])
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [toast])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewStudent((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setNewStudent((prev) => ({ ...prev, [id]: value }))
  }

  const handleCreateStudent = async () => {
    try {
      setLoading(true)
      if (api && typeof api.createStudent === "function") {
        const createdStudent = await api.createStudent(newStudent)
        setStudents((prev) => [...prev, createdStudent])
        setIsAddStudentOpen(false)
        setNewStudent({
          name: "",
          email: "",
          department: "",
        })
        toast({
          title: "Success",
          description: "Student added successfully",
        })
      } else {
        console.error("mockApi.createStudent is not implemented")
        toast({
          title: "Error",
          description: "API method not implemented: createStudent",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = (student: Student) => {
    setStudentToDelete(student)
    setIsDeleteConfirmationOpen(true)
  }

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return

    try {
      setLoading(true)
      if (api && typeof api.deleteStudent === "function") {
        await api.deleteStudent(studentToDelete.id)
        setStudents((prev) => prev.filter((student) => student.id !== studentToDelete.id))
        setIsDeleteConfirmationOpen(false)
        setStudentToDelete(null)
        toast({
          title: "Success",
          description: "Student deleted successfully",
        })

        if (currentStudents.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      } else {
        console.error("mockApi.deleteStudent is not implemented")
        toast({
          title: "Error",
          description: "API method not implemented: deleteStudent",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setIsEditStudentOpen(true)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    if (editingStudent) {
      setEditingStudent((prev) => (prev ? { ...prev, [id]: value } : null))
    }
  }

  const handleEditSelectChange = (id: string, value: string) => {
    if (editingStudent) {
      setEditingStudent((prev) => (prev ? { ...prev, [id]: value } : null))
    }
  }

  const handleUpdateStudent = async () => {
    if (!editingStudent) return

    try {
      setLoading(true)
      if (api && typeof api.updateStudent === "function") {
        const updatedStudent = await api.updateStudent(editingStudent.id, editingStudent)
        setStudents((prev) => prev.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)))
        setIsEditStudentOpen(false)
        toast({
          title: "Success",
          description: "Student updated successfully",
        })
      } else {
        console.error("mockApi.updateStudent is not implemented")
        toast({
          title: "Error",
          description: "API method not implemented: updateStudent",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="w-full sm:w-[250px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" className="gap-1">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>Enter the details of the new student below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    className="col-span-3"
                    value={newStudent.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    className="col-span-3"
                    value={newStudent.email}
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
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateStudent} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogDescription>Update the details of the student below.</DialogDescription>
              </DialogHeader>
              {editingStudent && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Smith"
                      className="col-span-3"
                      value={editingStudent.name}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      className="col-span-3"
                      value={editingStudent.email}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Select
                      onValueChange={(value) => handleEditSelectChange("department", value)}
                      defaultValue={editingStudent.department}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value}>
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditStudentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStudent} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Student Details</DialogTitle>
                <DialogDescription>Detailed information about the selected student.</DialogDescription>
              </DialogHeader>
              {selectedStudent && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">ID:</div>
                    <div className="col-span-2">{selectedStudent.id}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Name:</div>
                    <div className="col-span-2">{selectedStudent.name || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Email:</div>
                    <div className="col-span-2">{selectedStudent.email || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Department:</div>
                    <div className="col-span-2">{selectedStudent.department || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Enrollments:</div>
                    <div className="col-span-2">
                      {selectedStudent.enrollments ? selectedStudent.enrollments.length : 0} course(s)
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading students...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.department}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(student)}>View details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditStudent(student)}>Edit student</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleConfirmDelete(student)}>
                          Delete student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredStudents.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={prevPage}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {pageNumbers.map((number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  onClick={() => paginate(number)}
                  isActive={currentPage === number}
                  className="cursor-pointer"
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={nextPage}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Separate the delete confirmation dialog from the other dialogs */}
      <Dialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {studentToDelete && (
            <div className="space-y-4 py-4 border rounded-md p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-gray-900 dark:text-gray-100">ID:</div>
                <div className="col-span-2 text-gray-700 dark:text-gray-300">{studentToDelete.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-gray-900 dark:text-gray-100">Name:</div>
                <div className="col-span-2 text-gray-700 dark:text-gray-300">{studentToDelete.name || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-gray-900 dark:text-gray-100">Email:</div>
                <div className="col-span-2 text-gray-700 dark:text-gray-300">{studentToDelete.email || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-gray-900 dark:text-gray-100">Department:</div>
                <div className="col-span-2 text-gray-700 dark:text-gray-300">{studentToDelete.department || "N/A"}</div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

