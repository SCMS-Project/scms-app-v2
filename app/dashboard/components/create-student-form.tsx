"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/services/api"

// Title options
const TITLES = [
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
  { value: "ms", label: "Ms." },
  { value: "dr", label: "Dr." },
]

// Address/Residence options
const RESIDENCE_TYPES = [
  { value: "home", label: "Home" },
  { value: "hostel", label: "Hostel" },
  { value: "rental", label: "Rental" },
]

interface GuestUser {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  fullName?: string
  phoneNumber?: string
  nicNumber?: string
  dateOfBirth?: string
  title?: string
  addressType?: string
  addressDetails?: string
}

export function CreateStudentForm() {
  const [guestUsers, setGuestUsers] = useState<GuestUser[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    nicNumber: "",
    addressType: "",
    addressDetails: "",
    department: "",
    year: "1st",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Fetch guest users on component mount
  useEffect(() => {
    const fetchGuestUsers = async () => {
      setIsLoading(true)
      try {
        const users = await api.getUsers({ role: "guest" })
        setGuestUsers(users)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load guest users",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuestUsers()
  }, [toast])

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)

    const selectedUser = guestUsers.find((user) => user.id === userId)
    if (selectedUser) {
      // Populate form with user data if available
      setFormData({
        title: selectedUser.title || "",
        fullName: selectedUser.fullName || "",
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        dateOfBirth: selectedUser.dateOfBirth || "",
        email: selectedUser.email,
        phoneNumber: selectedUser.phoneNumber || "",
        nicNumber: selectedUser.nicNumber || "",
        addressType: selectedUser.addressType || "",
        addressDetails: selectedUser.addressDetails || "",
        department: "",
        year: "1st",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      })
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Get the next student ID
      const students = await api.getStudents()
      const lastStudent = students[students.length - 1]
      const lastId = lastStudent ? Number.parseInt(lastStudent.id.replace("ST", "")) : 0
      const newId = `ST${String(lastId + 1).padStart(3, "0")}`

      // Create student
      const studentData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        department: formData.department,
        year: formData.year,
        // Additional fields not in the Student type but stored for reference
        title: formData.title,
        fullName: formData.fullName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        nicNumber: formData.nicNumber,
        addressType: formData.addressType,
        addressDetails: formData.addressDetails,
      }

      await api.createStudent(studentData)

      // Update user role from guest to student
      await api.updateUserRole(selectedUserId, "student")

      toast({
        title: "Success",
        description: "Student created successfully",
      })

      // Reset form
      setFormData({
        title: "",
        fullName: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        email: "",
        phoneNumber: "",
        nicNumber: "",
        addressType: "",
        addressDetails: "",
        department: "",
        year: "1st",
      })
      setSelectedUserId("")

      // Remove the user from the guest users list
      setGuestUsers((prev) => prev.filter((user) => user.id !== selectedUserId))
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create student",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Student</CardTitle>
        <CardDescription>Convert a guest user to a student</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Email (Guest User Selection) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Select
              value={selectedUserId}
              onValueChange={handleUserSelect}
              disabled={isLoading || guestUsers.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a guest user" />
              </SelectTrigger>
              <SelectContent>
                {guestUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {guestUsers.length === 0 && !isLoading && (
              <p className="text-sm text-muted-foreground">No guest users available</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Select
              value={formData.title}
              onValueChange={(value) => handleSelectChange("title", value)}
              disabled={!selectedUserId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                {TITLES.map((title) => (
                  <SelectItem key={title.value} value={title.value}>
                    {title.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={formData.fullName} onChange={handleInputChange} disabled={!selectedUserId} />
          </div>

          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!selectedUserId}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!selectedUserId}
                required
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={!selectedUserId}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!selectedUserId}
              required
            />
          </div>

          {/* NIC Number */}
          <div className="space-y-2">
            <Label htmlFor="nicNumber">NIC Number</Label>
            <Input
              id="nicNumber"
              value={formData.nicNumber}
              onChange={handleInputChange}
              disabled={!selectedUserId}
              required
            />
          </div>

          {/* Address/Residence */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addressType">Address/Residence Type</Label>
              <Select
                value={formData.addressType}
                onValueChange={(value) => handleSelectChange("addressType", value)}
                disabled={!selectedUserId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select residence type" />
                </SelectTrigger>
                <SelectContent>
                  {RESIDENCE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressDetails">Address Details</Label>
              <Input
                id="addressDetails"
                value={formData.addressDetails}
                onChange={handleInputChange}
                disabled={!selectedUserId}
                required
              />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleSelectChange("department", value)}
              disabled={!selectedUserId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Medicine">Medicine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select
              value={formData.year}
              onValueChange={(value) => handleSelectChange("year", value)}
              disabled={!selectedUserId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st">1st Year</SelectItem>
                <SelectItem value="2nd">2nd Year</SelectItem>
                <SelectItem value="3rd">3rd Year</SelectItem>
                <SelectItem value="4th">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting || isLoading || !selectedUserId} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Student
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

