"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Loader2, Info, Check, ChevronsUpDown, CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import the API service
import { api } from "@/app/services/api"
import type { Resource } from "@/app/types"
import { useAuth } from "@/app/contexts/auth-context"

// Update the Resource interface to include reservation fields
interface ExtendedResource extends Resource {
  code?: string
  reservationType?: "event" | "individual" | null
  reservedBy?: string
  reservedForEvent?: string
  reservationStartDate?: string
  reservationEndDate?: string
  notes?: string
}

// Sample users for the dropdown
const users = [
  { value: "john.doe", label: "John Doe", role: "Student" },
  { value: "jane.smith", label: "Jane Smith", role: "Faculty" },
  { value: "robert.johnson", label: "Robert Johnson", role: "Student" },
  { value: "emily.davis", label: "Emily Davis", role: "Staff" },
  { value: "michael.wilson", label: "Michael Wilson", role: "Faculty" },
  { value: "sarah.brown", label: "Sarah Brown", role: "Student" },
  { value: "david.miller", label: "David Miller", role: "Staff" },
  { value: "lisa.taylor", label: "Lisa Taylor", role: "Faculty" },
  { value: "james.anderson", label: "James Anderson", role: "Student" },
  { value: "jennifer.thomas", label: "Jennifer Thomas", role: "Staff" },
]

// Fallback resources data in case the API fails
const fallbackResources: Resource[] = [
  { id: "RS001", code: "PRJ-A", name: "Projector A", type: "Equipment", status: "Available" },
  {
    id: "RS002",
    code: "LPC-1",
    name: "Laptop Cart 1",
    type: "Equipment",
    status: "In Use",
    checkedOutBy: "Dr. Lisa Brown",
    checkedOutAt: "2023-09-12T10:30:00Z",
  },
  { id: "RS003", code: "CRK-1", name: "Conference Room Kit", type: "Equipment", status: "Available" },
  {
    id: "RS004",
    code: "CAM-1",
    name: "Digital Camera",
    type: "Equipment",
    status: "In Use",
    checkedOutBy: "James Davis",
    checkedOutAt: "2023-09-14T14:45:00Z",
  },
  { id: "RS005", code: "WB-1", name: "Portable Whiteboard", type: "Equipment", status: "Available" },
  { id: "RS006", code: "AUD-1", name: "Audio System", type: "Equipment", status: "Under Maintenance" },
  { id: "RS007", code: "DOC-1", name: "Introduction to Programming", type: "document", status: "Available" },
  { id: "RS008", code: "DOC-2", name: "Database Systems Textbook", type: "document", status: "Available" },
  { id: "RS009", code: "DOC-3", name: "Marketing Strategies", type: "document", status: "Available" },
  { id: "RS010", code: "DOC-4", name: "Physics Lab Manual", type: "document", status: "Available" },
  { id: "RS011", code: "VID-1", name: "Lecture Recording - CS101", type: "video", status: "Available" },
  { id: "RS012", code: "VID-2", name: "Guest Speaker Series", type: "video", status: "Available" },
  { id: "RS013", code: "VID-3", name: "Lab Demonstration", type: "video", status: "Available" },
]

// Sample resource reservations for the weekly view
const sampleReservations = [
  {
    resourceId: "RS001",
    date: "2025-03-18",
    startTime: "09:00",
    endTime: "11:00",
    reservedBy: "John Doe",
  },
  {
    resourceId: "RS003",
    date: "2025-03-19",
    startTime: "13:00",
    endTime: "15:00",
    reservedBy: "Jane Smith",
  },
  {
    resourceId: "RS005",
    date: "2025-03-20",
    startTime: "10:00",
    endTime: "12:00",
    reservedBy: "Robert Johnson",
  },
]

export default function Resources() {
  const [resources, setResources] = useState<ExtendedResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newResource, setNewResource] = useState({
    name: "",
    code: "",
    type: "",
    status: "Available",
  })

  const { user } = useAuth()
  const { toast } = useToast()

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<ExtendedResource | null>(null)

  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false)
  const [reservationData, setReservationData] = useState({
    type: "individual",
    name: "",
    eventName: "",
    startDate: "",
    endDate: "",
    notes: "",
  })

  const [userComboboxOpen, setUserComboboxOpen] = useState(false)

  // Weekly view state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [weeklyViewOpen, setWeeklyViewOpen] = useState(false)
  const [selectedResourceType, setSelectedResourceType] = useState<string>("all")

  // Get the days of the current week
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }) // Start on Monday
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [selectedDate])

  const handleViewDetails = (resource: Resource) => {
    setSelectedResource(resource)
    setIsViewDetailsOpen(true)
  }

  // Fetch resources data
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if api.getResources exists
        if (!api || typeof api.getResources !== "function") {
          console.warn("API service is not properly configured, using fallback data")
          setResources(fallbackResources as ExtendedResource[])
          return
        }

        const data = await api.getResources()

        // Validate the response
        if (!Array.isArray(data)) {
          console.warn("Invalid response format from API, using fallback data")
          setResources(fallbackResources as ExtendedResource[])
          return
        }

        setResources(data as ExtendedResource[])
      } catch (err) {
        console.error("Error fetching resources:", err)
        setError("Failed to fetch resources data. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load resources data. Using fallback data.",
          variant: "destructive",
        })

        // Use fallback data when API fails
        setResources(fallbackResources as ExtendedResource[])
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [toast])

  // Filter resources based on search query and resource type
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = searchQuery
        ? resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.type?.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      const matchesType =
        selectedResourceType === "all" || resource.type?.toLowerCase() === selectedResourceType.toLowerCase()

      return matchesSearch && matchesType
    })
  }, [resources, searchQuery, selectedResourceType])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewResource((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setNewResource((prev) => ({ ...prev, [id]: value }))
  }

  // Check if a resource is reserved on a specific day
  const isResourceReserved = (resourceId: string, date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    return sampleReservations.some(
      (reservation) => reservation.resourceId === resourceId && reservation.date === formattedDate,
    )
  }

  // Get reservation details for a resource on a specific day
  const getReservationDetails = (resourceId: string, date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    return sampleReservations.find(
      (reservation) => reservation.resourceId === resourceId && reservation.date === formattedDate,
    )
  }

  // Handle resource creation
  const handleCreateResource = async () => {
    try {
      if (!newResource.name || !newResource.type || !newResource.code) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      setLoading(true)

      // Check if the API method exists
      if (!api || typeof api.createResource !== "function") {
        // Simulate API call with fallback
        const createdResource = {
          ...newResource,
          id: `RS${String(resources.length + 1).padStart(3, "0")}`,
          status: "Available",
          checkedOutBy: null,
          checkedOutAt: null,
        }

        setResources((prev) => [...prev, createdResource as ExtendedResource])
        toast({
          title: "Success",
          description: "Resource added successfully",
        })
      } else {
        const createdResource = await api.createResource(newResource)
        setResources((prev) => [...prev, createdResource as ExtendedResource])
        toast({
          title: "Success",
          description: "Resource added successfully",
        })
      }

      // Reset form
      setNewResource({
        name: "",
        code: "",
        type: "",
        status: "Available",
      })
    } catch (err) {
      console.error("Error creating resource:", err)
      toast({
        title: "Error",
        description: "Failed to add resource. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle resource checkout/return
  const handleResourceAction = async (id: string, action: "checkout" | "return") => {
    try {
      setLoading(true)

      // Check if the API methods exist
      if (
        !api ||
        (action === "checkout" && typeof api.checkoutResource !== "function") ||
        (action === "return" && typeof api.returnResource !== "function")
      ) {
        // Simulate API call with fallback
        const updatedResource = {
          ...resources.find((r) => r.id === id),
          status: action === "checkout" ? "In Use" : "Available",
          checkedOutBy: action === "checkout" ? user?.name || "Current User" : null,
          checkedOutAt: action === "checkout" ? new Date().toISOString() : null,
        }

        setResources((prev) => prev.map((resource) => (resource.id === id ? updatedResource : resource)))
        toast({
          title: "Success",
          description: `Resource ${action === "checkout" ? "checked out" : "returned"} successfully`,
        })
      } else {
        let updatedResource

        if (action === "checkout") {
          updatedResource = await api.checkoutResource(id, user?.id || "", user?.name || "")
        } else {
          updatedResource = await api.returnResource(id)
        }

        setResources((prev) => prev.map((resource) => (resource.id === id ? updatedResource : resource)))
        toast({
          title: "Success",
          description: `Resource ${action === "checkout" ? "checked out" : "returned"} successfully`,
        })
      }
    } catch (err) {
      console.error(`Error ${action} resource:`, err)
      toast({
        title: "Error",
        description: `Failed to ${action} resource. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle resource reservation
  const handleReserveResource = async (id: string) => {
    try {
      setLoading(true)

      const resource = resources.find((r) => r.id === id)
      if (!resource) {
        toast({
          title: "Error",
          description: "Resource not found",
          variant: "destructive",
        })
        return
      }

      // Find the selected user's full name from the value
      const selectedUser = users.find((u) => u.value === reservationData.name)
      const userName = selectedUser ? selectedUser.label : reservationData.name

      // Create updated resource with reservation data
      const updatedResource: ExtendedResource = {
        ...resource,
        status: "Reserved",
        reservationType: reservationData.type as "event" | "individual",
        reservedBy: reservationData.type === "individual" ? userName : user?.name || "Current User",
        reservedForEvent: reservationData.type === "event" ? reservationData.eventName : undefined,
        reservationStartDate: reservationData.startDate,
        reservationEndDate: reservationData.endDate,
        notes: reservationData.notes,
      }

      // In a real implementation, this would call an API
      // For now, just update the local state
      setResources((prev) => prev.map((r) => (r.id === id ? updatedResource : r)))

      // Update the selected resource to show updated details
      setSelectedResource(updatedResource)

      toast({
        title: "Success",
        description: `Resource reserved successfully`,
      })

      // Reset form and close dialog
      setReservationData({
        type: "individual",
        name: "",
        eventName: "",
        startDate: "",
        endDate: "",
        notes: "",
      })
      setIsReserveDialogOpen(false)

      // Open the details dialog to show the reservation details
      setIsViewDetailsOpen(true)
    } catch (err) {
      console.error(`Error reserving resource:`, err)
      toast({
        title: "Error",
        description: `Failed to reserve resource. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedResourceType("all")
  }

  useEffect(() => {
    if (selectedResource) {
      console.log("Selected resource details:", selectedResource)
    }
  }, [selectedResource])

  // Get unique resource types for filtering
  const resourceTypes = useMemo(() => {
    const types = new Set<string>()
    resources.forEach((resource) => {
      if (resource.type) {
        types.add(resource.type)
      }
    })
    return Array.from(types)
  }, [resources])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Resource Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Upload Resource</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload New Resource</DialogTitle>
              <DialogDescription>Upload a new resource for students, faculty, or staff</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input id="code" className="col-span-3" value={newResource.code} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" value={newResource.name} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  File
                </Label>
                <Input id="file" type="file" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateResource}
                disabled={loading || !newResource.name || !newResource.type || !newResource.code}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Resource Details</DialogTitle>
              <DialogDescription>Detailed information about the selected resource.</DialogDescription>
            </DialogHeader>
            {selectedResource && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">ID:</div>
                  <div className="col-span-2">{selectedResource.id}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Code:</div>
                  <div className="col-span-2">{selectedResource.code || "N/A"}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Name:</div>
                  <div className="col-span-2">{selectedResource.name || "N/A"}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Type:</div>
                  <div className="col-span-2">{selectedResource.type || "N/A"}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Status:</div>
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        selectedResource.status === "Available"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : selectedResource.status === "In Use"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : selectedResource.status === "Reserved"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {selectedResource.status || "N/A"}
                    </span>
                  </div>
                </div>
                {selectedResource.checkedOutBy && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Checked Out By:</div>
                    <div className="col-span-2">{selectedResource.checkedOutBy}</div>
                  </div>
                )}
                {selectedResource.checkedOutAt && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium">Checked Out At:</div>
                    <div className="col-span-2">{new Date(selectedResource.checkedOutAt).toLocaleString()}</div>
                  </div>
                )}
                {selectedResource.reservationType && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">Reservation Type:</div>
                      <div className="col-span-2">
                        {selectedResource.reservationType === "event" ? "Event" : "Individual"}
                      </div>
                    </div>
                    {selectedResource.reservationType === "event" && selectedResource.reservedForEvent && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">Event:</div>
                        <div className="col-span-2">{selectedResource.reservedForEvent}</div>
                      </div>
                    )}
                    {selectedResource.reservedBy && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">Reserved By:</div>
                        <div className="col-span-2">{selectedResource.reservedBy}</div>
                      </div>
                    )}
                    {selectedResource.reservationStartDate && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">From:</div>
                        <div className="col-span-2">
                          {new Date(selectedResource.reservationStartDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    {selectedResource.reservationEndDate && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">To:</div>
                        <div className="col-span-2">
                          {new Date(selectedResource.reservationEndDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    {selectedResource.notes && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">Notes:</div>
                        <div className="col-span-2">{selectedResource.notes}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isReserveDialogOpen} onOpenChange={setIsReserveDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reserve Resource</DialogTitle>
              <DialogDescription>Reserve this resource for an event or individual use.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reservationType" className="text-right">
                  Reservation Type
                </Label>
                <Select
                  value={reservationData.type}
                  onValueChange={(value) => setReservationData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select reservation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reservationData.type === "individual" ? (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Reserved By
                  </Label>
                  <Popover open={userComboboxOpen} onOpenChange={setUserComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={userComboboxOpen}
                        className="col-span-3 justify-between"
                      >
                        {reservationData.name
                          ? `${users.find((user) => user.value === reservationData.name)?.label} (${users.find((user) => user.value === reservationData.name)?.role})`
                          : "Select user..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="col-span-3 p-0">
                      <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                key={user.value}
                                value={user.value}
                                onSelect={(currentValue) => {
                                  setReservationData((prev) => ({
                                    ...prev,
                                    name: currentValue === reservationData.name ? "" : currentValue,
                                  }))
                                  setUserComboboxOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    reservationData.name === user.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <span>{user.label}</span>
                                <span className="ml-2 text-muted-foreground">({user.role})</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="eventName" className="text-right">
                    Event Name
                  </Label>
                  <Input
                    id="eventName"
                    className="col-span-3"
                    value={reservationData.eventName}
                    onChange={(e) => setReservationData((prev) => ({ ...prev, eventName: e.target.value }))}
                  />
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  className="col-span-3"
                  value={reservationData.startDate}
                  onChange={(e) => setReservationData((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  className="col-span-3"
                  value={reservationData.endDate}
                  onChange={(e) => setReservationData((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  className="col-span-3"
                  value={reservationData.notes}
                  onChange={(e) => setReservationData((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => handleReserveResource(selectedResource?.id || "")}
                disabled={
                  loading ||
                  (reservationData.type === "individual" && !reservationData.name) ||
                  (reservationData.type === "event" && !reservationData.eventName) ||
                  !reservationData.startDate ||
                  !reservationData.endDate
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reserve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>View and manage all campus resources</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={user?.role === "admin" ? "list" : "weekly"} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                {user?.role === "admin" && <TabsTrigger value="list">List View</TabsTrigger>}
                <TabsTrigger value="weekly">Weekly Availability</TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(selectedDate, "MMM d, yyyy")}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Select value={selectedResourceType} onValueChange={setSelectedResourceType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {resourceTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full items-center">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit">Search</Button>
                {(searchQuery || selectedResourceType !== "all") && (
                  <Button variant="outline" onClick={resetFilters} size="sm">
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            <TabsContent value="list" className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin mr-2" />
                  <p>Loading resources...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col justify-center items-center h-64 text-red-500">
                  <Info className="h-8 w-8 mb-2" />
                  {typeof error === "string"
                    ? error
                    : error instanceof Error
                      ? error.message
                      : "An error occurred while loading resources"}
                  <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : filteredResources.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Code</th>
                        <th className="p-2 text-left font-medium">Name</th>
                        <th className="p-2 text-left font-medium">Type</th>
                        <th className="p-2 text-left font-medium">Status</th>
                        <th className="p-2 text-left font-medium">Checked Out By</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResources.map((resource: ExtendedResource) => (
                        <tr key={resource.id} className="border-b">
                          <td className="p-2">{resource.code}</td>
                          <td className="p-2">{resource.name}</td>
                          <td className="p-2">{resource.type}</td>
                          <td className="p-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                resource.status === "Available"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : resource.status === "In Use"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : resource.status === "Reserved"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              {resource.status}
                            </span>
                          </td>
                          <td className="p-2">{resource.checkedOutBy || "-"}</td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              {resource.status === "Available" ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedResource(resource)
                                      setIsReserveDialogOpen(true)
                                    }}
                                  >
                                    Reserve
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleResourceAction(resource.id, "checkout")}
                                  >
                                    Check Out
                                  </Button>
                                </>
                              ) : resource.status === "In Use" ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResourceAction(resource.id, "return")}
                                >
                                  Return
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" disabled>
                                  Unavailable
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(resource)}>
                                View details
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  <p>No resources found.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium min-w-[200px]">Resource</th>
                      {weekDays.map((day) => (
                        <th key={day.toString()} className="p-2 text-center font-medium min-w-[120px]">
                          {format(day, "EEE")}
                          <br />
                          {format(day, "MMM d")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="p-4 text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          <p className="mt-2">Loading resources...</p>
                        </td>
                      </tr>
                    ) : filteredResources.length > 0 ? (
                      filteredResources.map((resource) => (
                        <tr key={resource.id} className="border-b">
                          <td className="p-2 font-medium">
                            <div>{resource.name}</div>
                            <div className="text-xs text-muted-foreground">{resource.type}</div>
                          </td>
                          {weekDays.map((day) => {
                            const isReserved = isResourceReserved(resource.id, day)
                            const reservation = getReservationDetails(resource.id, day)

                            return (
                              <td key={day.toString()} className="p-2 text-center">
                                {isReserved ? (
                                  <div>
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                      Reserved
                                    </span>
                                    <div className="text-xs mt-1">
                                      {reservation?.startTime} - {reservation?.endTime}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[100px] mx-auto">
                                      {reservation?.reservedBy}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    Available
                                  </span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-4 text-center text-muted-foreground">
                          No resources found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

