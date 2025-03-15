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
import { MoreHorizontal, Plus, Search, Filter, Loader2 } from "lucide-react"
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

  // Fetch lecturers data
  useEffect(() => {
    const fetchLecturers = async () => {
      // Changed from fetchFaculty to fetchLecturers
      try {
        setLoading(true)
        const data = await api.getLecturers() // Changed from getFaculty to getLecturers
        setLecturers(data) // Changed from setFaculty to setLecturers
        setError(null)
      } catch (err) {
        setError("Failed to fetch lecturers data") // Changed from faculty to lecturers
        toast({
          title: "Error",
          description: "Failed to load lecturers data. Please try again.", // Changed from faculty to lecturers
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLecturers() // Changed from fetchFaculty to fetchLecturers
  }, [toast])

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
                <TableCell colSpan={7} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredLecturers.length > 0 ? ( // Changed from filteredFaculty to filteredLecturers
              filteredLecturers.map(
                (
                  member, // Changed from filteredFaculty to filteredLecturers
                ) => (
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
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit lecturer</DropdownMenuItem> {/* Changed from faculty to lecturer */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteLecturer(member.id)}>
                            {" "}
                            {/* Changed from handleDeleteFaculty to handleDeleteLecturer */}
                            Delete lecturer {/* Changed from faculty to lecturer */}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ),
              )
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
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

