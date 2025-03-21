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
import { MoreHorizontal, Plus, Search, Filter, Loader2, AlertTriangle } from "lucide-react"
// Update import paths if needed
import { api } from "@/app/services/api"
import type { Lecturer } from "../../types" // Changed from Faculty to Lecturer
import { useToast } from "@/hooks/use-toast"
// Update imports to include our centralized constants
import { DEPARTMENTS, FACULTY_POSITIONS } from "@/app/constants/roles"

export default function LecturersComponent() {
  // Changed from FacultyComponent to LecturersComponent
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddLecturerOpen, setIsAddLecturerOpen] = useState(false) // Changed from isAddFacultyOpen to isAddLecturerOpen
  const [lecturers, setLecturers] = useState<Lecturer[]>([]) // Changed from faculty to lecturers
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newLecturer, setNewLecturer] = useState<Omit<Lecturer, "id">>({
    // Changed from newFaculty to newLecturer
    name: "",
    email: "",
    department: "",
    position: "",
    courses: 0,
  })

  const { toast } = useToast()

  // Add these state variables after the existing state declarations
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  // Add state variables for the view details dialog
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null)

  const [isEditLecturerOpen, setIsEditLecturerOpen] = useState(false)
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null)

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [lecturerToDelete, setLecturerToDelete] = useState<Lecturer | null>(null)

  const handleViewDetails = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer)
    setIsViewDetailsOpen(true)
  }

  const handleEditLecturer = (lecturer: Lecturer) => {
    setEditingLecturer({ ...lecturer })
    setIsEditLecturerOpen(true)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setEditingLecturer((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleEditSelectChange = (id: string, value: string) => {
    setEditingLecturer((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleUpdateLecturer = async () => {
    if (!editingLecturer) return

    try {
      setLoading(true)
      const updatedLecturer = await api.updateLecturer(editingLecturer.id, editingLecturer)
      setLecturers((prev) => prev.map((lecturer) => (lecturer.id === updatedLecturer.id ? updatedLecturer : lecturer)))
      setIsEditLecturerOpen(false)
      setEditingLecturer(null)
      toast({
        title: "Success",
        description: "Lecturer updated successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update lecturer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch lecturers data
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true)
        console.log("Attempting to fetch lecturers data...")

        // Check if the API method exists
        if (typeof api.getLecturers !== "function") {
          console.warn("api.getLecturers is not a function, using fallback data")
          // Provide fallback data
          const fallbackData = [
            {
              id: "L001",
              name: "Dr. John Smith",
              email: "john.smith@campus.edu",
              department: "Computer Science",
              position: "Professor",
              courses: 3,
            },
            {
              id: "L002",
              name: "Dr. Sarah Johnson",
              email: "sarah.johnson@campus.edu",
              department: "Mathematics",
              position: "Associate Professor",
              courses: 2,
            },
            {
              id: "L003",
              name: "Prof. Michael Brown",
              email: "michael.brown@campus.edu",
              department: "Physics",
              position: "Assistant Professor",
              courses: 4,
            },
          ]
          setLecturers(fallbackData)
          setTotalPages(Math.ceil(fallbackData.length / itemsPerPage))
          setError(null)
          setLoading(false)
          return
        }

        // If the API method exists, call it
        console.log("Calling api.getLecturers()...")
        const data = await api.getLecturers()
        console.log("Received lecturers data:", data)

        if (!Array.isArray(data)) {
          console.error("Received non-array data from api.getLecturers():", data)
          throw new Error("Invalid data format received from API")
        }

        setLecturers(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
        setError(null)
      } catch (err) {
        console.error("Failed to fetch lecturers:", err)
        setError("Failed to fetch lecturers data. Using fallback data.")

        // Provide fallback data even in case of error
        const fallbackData = [
          {
            id: "L001",
            name: "Dr. John Smith",
            email: "john.smith@campus.edu",
            department: "Computer Science",
            position: "Professor",
            courses: 3,
          },
          {
            id: "L002",
            name: "Dr. Sarah Johnson",
            email: "sarah.johnson@campus.edu",
            department: "Mathematics",
            position: "Associate Professor",
            courses: 2,
          },
        ]
        setLecturers(fallbackData)
        setTotalPages(Math.ceil(fallbackData.length / itemsPerPage))
      } finally {
        setLoading(false)
      }
    }

    fetchLecturers()
  }, [toast, itemsPerPage])

  // Filter lecturers based on search query
  const filteredLecturers = lecturers.filter(
    // Changed from filteredFaculty and faculty to filteredLecturers and lecturers
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Add this function to handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Add this to get the current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredLecturers.slice(startIndex, endIndex)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewLecturer((prev) => ({ ...prev, [id]: value })) // Changed from setNewFaculty to setNewLecturer
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setNewLecturer((prev) => ({ ...prev, [id]: value })) // Changed from setNewFaculty to setNewLecturer
  }

  // Handle lecturer creation
  const handleCreateLecturer = async () => {
    // Changed from handleCreateFaculty to handleCreateLecturer
    try {
      setLoading(true)
      const createdLecturer = await api.createLecturer(newLecturer) // Changed from createFacultyMember to createLecturer
      setLecturers((prev) => [...prev, createdLecturer]) // Changed from setFaculty to setLecturers
      setIsAddLecturerOpen(false) // Changed from setIsAddFacultyOpen to setIsAddLecturerOpen
      setNewLecturer({
        // Changed from setNewFaculty to setNewLecturer
        name: "",
        email: "",
        department: "",
        position: "",
        courses: 0,
      })
      toast({
        title: "Success",
        description: "Lecturer added successfully", // Changed from Faculty member to Lecturer
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add lecturer. Please try again.", // Changed from faculty member to lecturer
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle lecturer deletion
  const handleDeleteLecturer = async (id: string) => {
    // Changed from handleDeleteFaculty to handleDeleteLecturer
    try {
      setLoading(true)
      await api.deleteLecturer(id) // Changed from deleteFacultyMember to deleteLecturer
      setLecturers((prev) => prev.filter((member) => member.id !== id)) // Changed from setFaculty to setLecturers
      toast({
        title: "Success",
        description: "Lecturer deleted successfully", // Changed from Faculty member to Lecturer
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete lecturer. Please try again.", // Changed from faculty member to lecturer
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = (lecturer: Lecturer) => {
    setLecturerToDelete(lecturer)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!lecturerToDelete) return

    try {
      setLoading(true)
      await api.deleteLecturer(lecturerToDelete.id)
      setLecturers((prev) => prev.filter((member) => member.id !== lecturerToDelete.id))
      setIsDeleteConfirmOpen(false)
      setLecturerToDelete(null)
      toast({
        title: "Success",
        description: "Lecturer deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete lecturer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Lecturer Management</h2> {/* Changed from Faculty to Lecturer */}
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search lecturers..." // Changed from faculty to lecturers
              className="w-full sm:w-[250px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog open={isAddLecturerOpen} onOpenChange={setIsAddLecturerOpen}>
            {" "}
            {/* Changed from isAddFacultyOpen to isAddLecturerOpen */}
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" /> Add Lecturer {/* Changed from Faculty to Lecturer */}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lecturer</DialogTitle> {/* Changed from Faculty Member to Lecturer */}
                <DialogDescription>Enter the details of the new lecturer below.</DialogDescription>{" "}
                {/* Changed from faculty member to lecturer */}
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Dr. John Smith"
                    className="col-span-3"
                    value={newLecturer.name} // Changed from newFaculty to newLecturer
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
                    placeholder="lecturer@example.edu" // Changed from faculty to lecturer
                    className="col-span-3"
                    value={newLecturer.email} // Changed from newFaculty to newLecturer
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Position
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("position", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACULTY_POSITIONS.map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddLecturerOpen(false)}>
                  {" "}
                  {/* Changed from setIsAddFacultyOpen to setIsAddLecturerOpen */}
                  Cancel
                </Button>
                <Button onClick={handleCreateLecturer} disabled={loading}>
                  {" "}
                  {/* Changed from handleCreateFaculty to handleCreateLecturer */}
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Lecturer Details</DialogTitle>
                <DialogDescription>Detailed information about the selected lecturer.</DialogDescription>
              </DialogHeader>
              {selectedLecturer && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">ID:</div>
                    <div className="col-span-2">{selectedLecturer.id}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Name:</div>
                    <div className="col-span-2">{selectedLecturer.name || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Email:</div>
                    <div className="col-span-2">{selectedLecturer.email || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Department:</div>
                    <div className="col-span-2">{selectedLecturer.department || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Position:</div>
                    <div className="col-span-2">{selectedLecturer.position || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Courses:</div>
                    <div className="col-span-2">{selectedLecturer.courses || 0}</div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Edit Lecturer Dialog */}
          <Dialog open={isEditLecturerOpen} onOpenChange={setIsEditLecturerOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Lecturer</DialogTitle>
                <DialogDescription>Update the details of the lecturer below.</DialogDescription>
              </DialogHeader>
              {editingLecturer && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Dr. John Smith"
                      className="col-span-3"
                      value={editingLecturer.name}
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
                      placeholder="lecturer@example.edu"
                      className="col-span-3"
                      value={editingLecturer.email}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Select
                      defaultValue={editingLecturer.department}
                      onValueChange={(value) => handleEditSelectChange("department", value)}
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="position" className="text-right">
                      Position
                    </Label>
                    <Select
                      defaultValue={editingLecturer.position}
                      onValueChange={(value) => handleEditSelectChange("position", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {FACULTY_POSITIONS.map((position) => (
                          <SelectItem key={position.value} value={position.value}>
                            {position.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditLecturerOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateLecturer} disabled={loading}>
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
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
                    Loading lecturers data... {/* Changed from faculty to lecturers */}
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-amber-500">
                  {error}
                  <div className="mt-2 text-sm text-gray-600">Showing sample data instead.</div>
                </TableCell>
              </TableRow>
            ) : filteredLecturers.length > 0 ? (
              getCurrentPageItems().map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.courses}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(member)}>View details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditLecturer(member)}>Edit lecturer</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleConfirmDelete(member)}>
                          Delete lecturer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No lecturers found. {/* Changed from faculty members to lecturers */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-red-500 mt-1">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-red-500 text-lg font-semibold">Confirm Deletion</DialogTitle>
                <DialogDescription className="mt-1">
                  Are you sure you want to delete this lecturer? This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </div>

          {lecturerToDelete && (
            <div className="border rounded-md mx-4 mb-4">
              <div className="grid grid-cols-2 gap-y-3 p-4">
                <div className="font-semibold">ID:</div>
                <div className="text-blue-600">{lecturerToDelete.id}</div>

                <div className="font-semibold">Name:</div>
                <div className="text-blue-600">{lecturerToDelete.name || "N/A"}</div>

                <div className="font-semibold">Email:</div>
                <div className="text-blue-600">{lecturerToDelete.email || "N/A"}</div>

                <div className="font-semibold">Department:</div>
                <div className="text-blue-600">{lecturerToDelete.department || "N/A"}</div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 p-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-0"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Lecturer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

