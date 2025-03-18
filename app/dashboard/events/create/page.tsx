"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  Search,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/services/api"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"

// Define event types and status options
const EVENT_TYPES = [
  { value: "Academic", label: "Academic" },
  { value: "Social", label: "Social" },
  { value: "Career", label: "Career" },
  { value: "Workshop", label: "Workshop" },
  { value: "Seminar", label: "Seminar" },
  { value: "Guest Lecture", label: "Guest Lecture" },
  { value: "Student Council", label: "Student Council" },
]

const EVENT_STATUS_OPTIONS = [
  { value: "Upcoming", label: "Upcoming" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
]

// Helper function to generate time options in 30-minute intervals
const generateTimeOptions = (startTime = "") => {
  const times = []
  const start = startTime ? Number.parseInt(startTime.split(":")[0]) * 60 + Number.parseInt(startTime.split(":")[1]) : 0

  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const timeInMinutes = hour * 60 + minute
      if (!startTime || timeInMinutes > start) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        times.push(`${formattedHour}:${formattedMinute}`)
      }
    }
  }
  return times
}

// Format time for display (convert 24h to 12h format)
const formatTimeForDisplay = (time) => {
  if (!time) return ""
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    organizer: "",
    facility: "",
    facilityId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    status: "Upcoming",
    attendees: 0,
    isPublic: true,
    resources: [] as string[],
    category: "",
    contactEmail: "",
    contactPhone: "",
    requiresRegistration: false,
    additionalNotes: "",
  })

  // Change this line
  const [resources, setResources] = useState<Array<{ id: string; name: string }>>([])
  const [isLoadingResources, setIsLoadingResources] = useState(false)
  const [attendeesError, setAttendeesError] = useState<string | null>(null)

  const [resourceAvailability, setResourceAvailability] = useState<
    Record<string, { available: boolean; message?: string }>
  >({})
  const [resourceSearchTerm, setResourceSearchTerm] = useState("")
  const [openResourcePopover, setOpenResourcePopover] = useState(false)
  const [selectedResources, setSelectedResources] = useState<any[]>([])

  const [facilities, setFacilities] = useState<any[]>([])
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFacility, setSelectedFacility] = useState<any>(null)
  const [facilityAvailability, setFacilityAvailability] = useState<
    Record<string, { available: boolean; message?: string }>
  >({})
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [reservations, setReservations] = useState<any[]>([])
  const [isLoadingReservations, setIsLoadingReservations] = useState(false)
  const [openFacilityPopover, setOpenFacilityPopover] = useState(false)

  // Filter facilities based on search term
  const filteredFacilities =
    searchTerm.trim() === ""
      ? facilities
      : facilities.filter(
          (facility) =>
            facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (facility.type && facility.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (facility.location && facility.location.toLowerCase().includes(searchTerm.toLowerCase())),
        )

  // Filter resources based on search term
  const filteredResources =
    resourceSearchTerm.trim() === ""
      ? resources
      : resources.filter(
          (resource) =>
            resource.name.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
            resource.id.toLowerCase().includes(resourceSearchTerm.toLowerCase()),
        )

  useEffect(() => {
    const fetchFacilities = async () => {
      setIsLoadingFacilities(true)
      try {
        const facilitiesData = await api.getFacilities()
        setFacilities(facilitiesData)
      } catch (error) {
        console.error("Failed to fetch facilities:", error)
        toast({
          title: "Error",
          description: "Failed to load facilities. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingFacilities(false)
      }
    }

    fetchFacilities()
  }, [toast])

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoadingResources(true)
      try {
        // Try to get resources from the API
        let resourcesData = []

        // Check if the getResources method exists
        if (typeof api.getResources === "function") {
          resourcesData = await api.getResources()
        } else if (typeof api.getEventResources === "function") {
          // Fallback to getEventResources if it exists
          resourcesData = await api.getEventResources()
        } else {
          // If neither method exists, create new data
          throw new Error("Resource API methods not available")
        }

        // Process the resources data based on its structure
        let processedResources = []

        if (Array.isArray(resourcesData)) {
          if (resourcesData.length > 0) {
            // Check if it's an array of strings or objects
            if (typeof resourcesData[0] === "string") {
              processedResources = resourcesData.map((r) => ({ id: r, name: r }))
            } else if (typeof resourcesData[0] === "object") {
              // If it's an array of objects, extract the id and name properties
              processedResources = resourcesData.map((r) => ({
                id: r.id || String(r),
                name: r.name || r.title || r.id || String(r),
              }))
            }
          }
        }

        // If no resources were found or processed, create new default resources
        if (processedResources.length === 0) {
          const defaultResourceNames = [
            "Projector",
            "Microphone",
            "Whiteboard",
            "Laptop",
            "Video Conference",
            "Chairs",
            "Tables",
            "Refreshments",
          ]

          processedResources = defaultResourceNames.map((name, index) => ({
            id: `resource-${index + 1}`,
            name,
          }))

          // If the API exists, try to create these resources
          if (typeof api.createResource === "function") {
            for (const resource of processedResources) {
              try {
                await api.createResource({ name: resource.name, type: "Equipment" })
              } catch (error) {
                console.error(`Failed to create resource ${resource.name}:`, error)
              }
            }
          }
        }

        setResources(processedResources)
      } catch (error) {
        console.error("Failed to fetch resources:", error)
        // Create new default resources if API fails
        const defaultResources = [
          "Projector",
          "Microphone",
          "Whiteboard",
          "Laptop",
          "Video Conference",
          "Chairs",
          "Tables",
          "Refreshments",
        ]
        const processedResources = defaultResources.map((name, index) => ({
          id: `resource-${index + 1}`,
          name,
        }))
        setResources(processedResources)

        // Try to create these resources in the API
        if (typeof api.createResource === "function") {
          for (const resource of processedResources) {
            try {
              await api.createResource({ name: resource.name, type: "Equipment" })
            } catch (createError) {
              console.error(`Failed to create resource ${resource.name}:`, createError)
            }
          }
        }
      } finally {
        setIsLoadingResources(false)
      }
    }

    fetchResources()
  }, [])

  const checkFacilityTimeAvailability = (facilityId: string, dateReservations: any[]) => {
    if (!formData.startTime) return true

    // Get reservations for this specific facility
    const facilityReservations = dateReservations.filter(
      (res) => res.facility === facilityId || res.facilityId === facilityId,
    )

    if (facilityReservations.length === 0) return true

    // Convert form times to minutes for easier comparison
    const startTimeParts = formData.startTime.split(":")
    const startTimeMinutes = Number.parseInt(startTimeParts[0]) * 60 + Number.parseInt(startTimeParts[1])

    let endTimeMinutes
    if (formData.endTime) {
      const endTimeParts = formData.endTime.split(":")
      endTimeMinutes = Number.parseInt(endTimeParts[0]) * 60 + Number.parseInt(endTimeParts[1])
    } else {
      // Default to 1 hour if no end time is specified
      endTimeMinutes = startTimeMinutes + 60
    }

    // Check for overlap with existing reservations
    return !facilityReservations.some((reservation) => {
      // Convert reservation times to minutes
      const resStartTimeParts = reservation.time.split(" - ")[0].split(":")
      const resStartTimeMinutes = Number.parseInt(resStartTimeParts[0]) * 60 + Number.parseInt(resStartTimeParts[1])

      const resEndTimeParts = reservation.time.split(" - ")[1].split(":")
      const resEndTimeMinutes = Number.parseInt(resEndTimeParts[0]) * 60 + Number.parseInt(resEndTimeParts[1])

      // Check for overlap
      return (
        (startTimeMinutes >= resStartTimeMinutes && startTimeMinutes < resEndTimeMinutes) || // Start time is during an existing reservation
        (endTimeMinutes > resStartTimeMinutes && endTimeMinutes <= resEndTimeMinutes) || // End time is during an existing reservation
        (startTimeMinutes <= resStartTimeMinutes && endTimeMinutes >= resEndTimeMinutes) // Completely encompasses an existing reservation
      )
    })
  }

  const checkResourceAvailability = (resourceId: string, dateReservations: any[]) => {
    if (!formData.startTime) return true

    // Get reservations for this specific resource
    const resourceReservations = dateReservations.filter(
      (res) =>
        res.resources &&
        (Array.isArray(res.resources) ? res.resources.includes(resourceId) : res.resources === resourceId),
    )

    if (resourceReservations.length === 0) return true

    // Convert form times to minutes for easier comparison
    const startTimeParts = formData.startTime.split(":")
    const startTimeMinutes = Number.parseInt(startTimeParts[0]) * 60 + Number.parseInt(startTimeParts[1])

    let endTimeMinutes
    if (formData.endTime) {
      const endTimeParts = formData.endTime.split(":")
      endTimeMinutes = Number.parseInt(endTimeParts[0]) * 60 + Number.parseInt(endTimeParts[1])
    } else {
      // Default to 1 hour if no end time is specified
      endTimeMinutes = startTimeMinutes + 60
    }

    // Check for overlap with existing reservations
    return !resourceReservations.some((reservation) => {
      // Convert reservation times to minutes
      const resStartTimeParts = reservation.time.split(" - ")[0].split(":")
      const resStartTimeMinutes = Number.parseInt(resStartTimeParts[0]) * 60 + Number.parseInt(resStartTimeParts[1])

      const resEndTimeParts = reservation.time.split(" - ")[1].split(":")
      const resEndTimeMinutes = Number.parseInt(resEndTimeParts[0]) * 60 + Number.parseInt(resEndTimeParts[1])

      // Check for overlap
      return (
        (startTimeMinutes >= resStartTimeMinutes && startTimeMinutes < resEndTimeMinutes) || // Start time is during an existing reservation
        (endTimeMinutes > resStartTimeMinutes && endTimeMinutes <= resEndTimeMinutes) || // End time is during an existing reservation
        (startTimeMinutes <= resStartTimeMinutes && endTimeMinutes >= resEndTimeMinutes) // Completely encompasses an existing reservation
      )
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "attendees" && selectedFacility && selectedFacility.capacity) {
      const attendeesCount = Number.parseInt(value || "0", 10)
      const facilityCapacity = Number.parseInt(selectedFacility.capacity, 10)

      if (attendeesCount > facilityCapacity) {
        setAttendeesError(`Exceeds facility capacity of ${facilityCapacity}`)
      } else {
        setAttendeesError(null)
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleResourceSelect = (resource: any) => {
    // Check if resource is already selected
    const isSelected = selectedResources.some((r) => r.id === resource.id)

    if (isSelected) {
      // Remove resource if already selected
      const updatedResources = selectedResources.filter((r) => r.id !== resource.id)
      setSelectedResources(updatedResources)
      setFormData((prev) => ({
        ...prev,
        resources: updatedResources.map((r) => r.id),
      }))
    } else {
      // Add resource if not already selected
      const updatedResources = [...selectedResources, resource]
      setSelectedResources(updatedResources)
      setFormData((prev) => ({
        ...prev,
        resources: updatedResources.map((r) => r.id),
      }))
    }
  }

  const handleFacilitySelect = (facility: any) => {
    setSelectedFacility(facility)
    setFormData((prev) => ({
      ...prev,
      facilityId: facility.id,
      facility: `${facility.name} - ${facility.type || "General"}`,
    }))

    // Check if attendees exceed the new facility's capacity
    if (
      facility.capacity &&
      Number.parseInt(formData.attendees.toString(), 10) > Number.parseInt(facility.capacity, 10)
    ) {
      setAttendeesError(`Exceeds facility capacity of ${facility.capacity}`)
    } else {
      setAttendeesError(null)
    }

    setOpenFacilityPopover(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.title ||
      !formData.type ||
      !formData.startDate ||
      !formData.startTime ||
      !formData.facilityId ||
      !formData.organizer
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Check if attendees exceed facility capacity
    if (attendeesError) {
      toast({
        title: "Validation Error",
        description: "The number of attendees exceeds the facility capacity.",
        variant: "destructive",
      })
      return
    }

    // Check if the selected facility is available
    if (facilityAvailability[formData.facilityId] && !facilityAvailability[formData.facilityId].available) {
      const confirmBooking = window.confirm(
        "The selected facility is already booked during this time. Do you still want to proceed?",
      )
      if (!confirmBooking) return
    }

    setIsSubmitting(true)

    try {
      // Ensure endDate is set if not provided
      const eventData = {
        ...formData,
        endDate: formData.endDate || formData.startDate,
        id: `event-${Date.now()}`, // This will be overwritten by the server
      }

      // Create event using API
      const result = await api.createEvent(eventData)

      toast({
        title: "Success",
        description: "Event created successfully!",
      })

      // Navigate back to events list
      router.push("/dashboard/events")
    } catch (error) {
      console.error("Failed to create event:", error)
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Separate function to check availability
  const checkAvailability = async (date, startTime, endTime) => {
    if (!date || !startTime) return

    setIsCheckingAvailability(true)

    try {
      // Fetch all reservations for the selected date
      const allReservations = await api.getReservations()

      // Filter reservations for the selected date
      const dateReservations = allReservations.filter((res) => res.date === date)
      setReservations(dateReservations)

      // Check availability for all facilities
      if (facilities.length > 0) {
        const availabilityMap = {}

        facilities.forEach((facility) => {
          const isAvailable = checkFacilityTimeAvailability(facility.id, dateReservations)
          availabilityMap[facility.id] = {
            available: isAvailable,
            message: isAvailable ? "Available at selected time" : "Already booked during this time",
          }
        })

        setFacilityAvailability(availabilityMap)
      }

      // Check availability for all resources
      if (resources.length > 0) {
        const resourceAvailabilityMap = {}

        resources.forEach((resource) => {
          const isAvailable = checkResourceAvailability(resource.id, dateReservations)
          resourceAvailabilityMap[resource.id] = {
            available: isAvailable,
            message: isAvailable ? "Available at selected time" : "Already booked during this time",
          }
        })

        setResourceAvailability(resourceAvailabilityMap)
      }
    } catch (error) {
      console.error("Failed to check availability:", error)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  // Add this after the other useEffect hooks
  useEffect(() => {
    // Initialize with today's date if not already set
    if (!formData.startDate) {
      const today = new Date().toISOString().split("T")[0]
      setFormData((prev) => ({ ...prev, startDate: today }))

      // Set default times
      const now = new Date()
      const currentHour = now.getHours()
      const nextHour = (currentHour + 1) % 24
      const defaultStartTime = `${currentHour.toString().padStart(2, "0")}:00`
      const defaultEndTime = `${nextHour.toString().padStart(2, "0")}:00`

      setFormData((prev) => ({
        ...prev,
        startDate: today,
        startTime: defaultStartTime,
        endTime: defaultEndTime,
      }))

      // Initial availability check
      setTimeout(() => checkAvailability(today, defaultStartTime, defaultEndTime), 500)
    }
  }, [])

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" className="mb-4 flex items-center gap-2" onClick={() => router.push("/dashboard/events")}>
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create New Event</h1>
        <p className="text-muted-foreground">
          Events are scheduled activities that take place at specific times and locations on campus. They can be
          academic sessions, workshops, seminars, social gatherings, or any organized activity that requires facility
          booking and resource allocation. Create a new event by filling out the form below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>Fill in the details to create a new campus event</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Event Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Time fields in one line */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Date & Time <span className="text-red-500">*</span>
                </Label>
                {(isLoadingReservations || isCheckingAvailability) && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Checking availability...
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    className="pl-10"
                    value={formData.startDate}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData((prev) => ({ ...prev, startDate: value, endDate: value })) // Set end date same as start date by default
                      // Delay checking availability to avoid UI freezes
                      setTimeout(() => checkAvailability(value, formData.startTime, formData.endTime), 100)
                    }}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    placeholder="Select Date"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Select
                    value={formData.startTime}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, startTime: value }))
                      // Delay checking availability to avoid UI freezes
                      setTimeout(() => checkAvailability(formData.startDate, value, formData.endTime), 100)
                    }}
                  >
                    <SelectTrigger id="startTime" className="pl-10">
                      <SelectValue placeholder="Start Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeOptions().map((time) => (
                        <SelectItem key={`start-${time}`} value={time}>
                          {formatTimeForDisplay(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Select
                    value={formData.endTime}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, endTime: value }))
                      // Delay checking availability to avoid UI freezes
                      setTimeout(() => checkAvailability(formData.startDate, formData.startTime, value), 100)
                    }}
                  >
                    <SelectTrigger id="endTime" className="pl-10">
                      <SelectValue placeholder="End Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeOptions(formData.startTime).map((time) => (
                        <SelectItem key={`end-${time}`} value={time}>
                          {formatTimeForDisplay(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formData.startDate && formData.startTime && (
                <div className="text-sm text-muted-foreground">
                  Showing availability for {new Date(formData.startDate).toLocaleDateString()} from{" "}
                  {formatTimeForDisplay(formData.startTime)} to {formatTimeForDisplay(formData.endTime)}
                </div>
              )}
            </div>

            {/* Facility and Resources in one line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="facilityId">
                    Facility <span className="text-red-500">*</span>
                  </Label>
                  {formData.startDate && formData.startTime && (
                    <div className="text-sm text-muted-foreground">
                      Showing availability for {new Date(formData.startDate).toLocaleDateString()} from{" "}
                      {formatTimeForDisplay(formData.startTime)} to {formatTimeForDisplay(formData.endTime)}
                    </div>
                  )}
                </div>

                <Popover open={openFacilityPopover} onOpenChange={setOpenFacilityPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFacilityPopover}
                      className="w-full justify-between"
                      aria-label="Select a facility - shows availability status and allows searching"
                    >
                      {selectedFacility ? (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{selectedFacility.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {formData.startDate && formData.startTime && facilityAvailability[selectedFacility.id] && (
                              <Badge
                                variant={
                                  facilityAvailability[selectedFacility.id].available ? "outline" : "destructive"
                                }
                              >
                                {facilityAvailability[selectedFacility.id].available ? (
                                  <div className="flex items-center text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Available
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-600 dark:text-red-400">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Booked
                                  </div>
                                )}
                              </Badge>
                            )}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span>Select facility</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                          className="flex h-8 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Search facilities..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {formData.startDate && formData.startTime && (
                        <div className="border-b px-3 py-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span>
                              Showing availability for {new Date(formData.startDate).toLocaleDateString()} from{" "}
                              {formatTimeForDisplay(formData.startTime)} to {formatTimeForDisplay(formData.endTime)}
                            </span>
                            {isCheckingAvailability && (
                              <div className="flex items-center">
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                <span>Checking...</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" /> Available
                            </Badge>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" /> Booked
                            </Badge>
                          </div>
                        </div>
                      )}
                      <CommandList className="max-h-[300px] overflow-auto">
                        <CommandEmpty>No facilities found.</CommandEmpty>
                        <CommandGroup>
                          {isLoadingFacilities ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span>Loading facilities...</span>
                            </div>
                          ) : (
                            filteredFacilities.map((facility) => {
                              const availability = facilityAvailability[facility.id]
                              const isAvailable =
                                !formData.startDate || !formData.startTime || !availability || availability.available

                              return (
                                <CommandItem
                                  key={facility.id}
                                  value={facility.id}
                                  onSelect={() => handleFacilitySelect(facility)}
                                  className="flex flex-col items-start py-2"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">{facility.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {formData.startDate && formData.startTime && (
                                        <Badge variant={isAvailable ? "outline" : "destructive"}>
                                          {isAvailable ? (
                                            <div className="flex items-center text-green-600 dark:text-green-400">
                                              <CheckCircle className="h-3 w-3 mr-1" />
                                              Available
                                            </div>
                                          ) : (
                                            <div className="flex items-center text-red-600 dark:text-red-400">
                                              <XCircle className="h-3 w-3 mr-1" />
                                              Booked
                                            </div>
                                          )}
                                        </Badge>
                                      )}
                                      {facility.type && <Badge variant="outline">{facility.type}</Badge>}
                                    </div>
                                  </div>
                                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                    {facility.location && <span className="mr-3">{facility.location}</span>}
                                    {facility.capacity && (
                                      <div className="flex items-center">
                                        <Users className="h-3 w-3 mr-1" />
                                        <span>Capacity: {facility.capacity}</span>
                                      </div>
                                    )}
                                  </div>
                                </CommandItem>
                              )
                            })
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className="text-xs text-muted-foreground mt-1 mb-2">
                  Displays facilities with availability status, search, and conflict detection
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Resources</Label>
                  {isLoadingResources && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Loading resources...
                    </div>
                  )}
                </div>

                <Popover open={openResourcePopover} onOpenChange={setOpenResourcePopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openResourcePopover}
                      className="w-full justify-between"
                      aria-label="Select resources - shows availability status and allows searching"
                    >
                      {selectedResources.length > 0 ? (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <span>
                              {selectedResources.length} resource{selectedResources.length !== 1 ? "s" : ""} selected
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span>Select resources</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                          className="flex h-8 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Search resources..."
                          value={resourceSearchTerm}
                          onChange={(e) => setResourceSearchTerm(e.target.value)}
                        />
                      </div>
                      {formData.startDate && formData.startTime && (
                        <div className="border-b px-3 py-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span>
                              Showing availability for {new Date(formData.startDate).toLocaleDateString()} from{" "}
                              {formatTimeForDisplay(formData.startTime)} to {formatTimeForDisplay(formData.endTime)}
                            </span>
                            {isCheckingAvailability && (
                              <div className="flex items-center">
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                <span>Checking...</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" /> Available
                            </Badge>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" /> Booked
                            </Badge>
                          </div>
                        </div>
                      )}
                      <CommandList className="max-h-[300px] overflow-auto">
                        <CommandEmpty>No resources found.</CommandEmpty>
                        <CommandGroup>
                          {isLoadingResources ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span>Loading resources...</span>
                            </div>
                          ) : (
                            filteredResources.map((resource) => {
                              const availability = resourceAvailability[resource.id]
                              const isAvailable =
                                !formData.startDate || !formData.startTime || !availability || availability.available
                              const isSelected = selectedResources.some((r) => r.id === resource.id)

                              return (
                                <CommandItem
                                  key={resource.id}
                                  value={resource.id}
                                  onSelect={() => handleResourceSelect(resource)}
                                  className="flex flex-col items-start py-2"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                      <div className="mr-2">
                                        {isSelected ? (
                                          <CheckCircle className="h-4 w-4 text-primary" />
                                        ) : (
                                          <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                                        )}
                                      </div>
                                      <span className="font-medium">{resource.name}</span>
                                      <span className="ml-2 text-xs text-muted-foreground">(ID: {resource.id})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {formData.startDate && formData.startTime && (
                                        <Badge variant={isAvailable ? "outline" : "destructive"}>
                                          {isAvailable ? (
                                            <div className="flex items-center text-green-600 dark:text-green-400">
                                              <CheckCircle className="h-3 w-3 mr-1" />
                                              Available
                                            </div>
                                          ) : (
                                            <div className="flex items-center text-red-600 dark:text-red-400">
                                              <XCircle className="h-3 w-3 mr-1" />
                                              Booked
                                            </div>
                                          )}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </CommandItem>
                              )
                            })
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className="text-xs text-muted-foreground mt-1 mb-2">
                  Select multiple resources for your event. Click on a resource to select/deselect it.
                </div>
              </div>
            </div>

            {/* Selected Facility and Resources in one line */}
            {(selectedFacility || selectedResources.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selected Facility Card */}
                {selectedFacility && (
                  <div
                    className={`p-4 border rounded-md shadow-sm ${
                      formData.startDate &&
                      formData.startTime &&
                      facilityAvailability[selectedFacility.id] &&
                      !facilityAvailability[selectedFacility.id].available
                        ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                        : "bg-muted/30"
                    }`}
                  >
                    <h4 className="text-sm font-medium mb-2">Selected Facility</h4>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedFacility.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.startDate && formData.startTime && facilityAvailability[selectedFacility.id] && (
                          <Badge
                            variant={facilityAvailability[selectedFacility.id].available ? "outline" : "destructive"}
                            className="ml-auto"
                          >
                            {facilityAvailability[selectedFacility.id].available ? (
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Available on {new Date(formData.startDate).toLocaleDateString()} from{" "}
                                {formatTimeForDisplay(formData.startTime)} to {formatTimeForDisplay(formData.endTime)}
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <XCircle className="h-3 w-3 mr-1" />
                                Booked on {new Date(formData.startDate).toLocaleDateString()} from{" "}
                                {formatTimeForDisplay(formData.startTime)} to {formatTimeForDisplay(formData.endTime)}
                              </div>
                            )}
                          </Badge>
                        )}
                        {selectedFacility.type && <Badge variant="outline">{selectedFacility.type}</Badge>}
                      </div>
                    </div>
                    {selectedFacility.description && (
                      <p className="mt-1 text-sm text-muted-foreground border-t pt-2">{selectedFacility.description}</p>
                    )}
                    <div className="flex flex-wrap items-center mt-2 text-xs text-muted-foreground gap-3">
                      {selectedFacility.location && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {selectedFacility.location}
                        </span>
                      )}
                      {selectedFacility.capacity && (
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>Capacity: {selectedFacility.capacity}</span>
                        </span>
                      )}
                    </div>

                    {formData.startDate &&
                      formData.startTime &&
                      facilityAvailability[selectedFacility.id] &&
                      !facilityAvailability[selectedFacility.id].available && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900 rounded text-sm flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span>
                            This facility is already booked during the selected time. Scheduling this event may cause a
                            conflict.
                          </span>
                        </div>
                      )}
                  </div>
                )}

                {/* Selected Resources Card */}
                {selectedResources.length > 0 && (
                  <div className="p-4 border rounded-md shadow-sm bg-muted/30">
                    <h4 className="text-sm font-medium mb-2">Selected Resources ({selectedResources.length})</h4>
                    <div className="space-y-2">
                      {selectedResources.map((resource) => {
                        const isAvailable =
                          !formData.startDate ||
                          !formData.startTime ||
                          !resourceAvailability[resource.id] ||
                          resourceAvailability[resource.id].available

                        return (
                          <div
                            key={resource.id}
                            className={`p-2 rounded-md flex items-center justify-between ${
                              !isAvailable ? "bg-red-50 dark:bg-red-950" : "bg-background"
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="font-medium">{resource.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">(ID: {resource.id})</span>
                            </div>
                            {formData.startDate && formData.startTime && resourceAvailability[resource.id] && (
                              <Badge variant={isAvailable ? "outline" : "destructive"}>
                                {isAvailable ? (
                                  <div className="flex items-center text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Available
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-600 dark:text-red-400">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Booked
                                  </div>
                                )}
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {selectedResources.some(
                      (resource) =>
                        formData.startDate &&
                        formData.startTime &&
                        resourceAvailability[resource.id] &&
                        !resourceAvailability[resource.id].available,
                    ) && (
                      <div className="mt-3 p-3 bg-red-100 dark:bg-red-900 rounded text-sm flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <span>
                          One or more resources are already booked during the selected time. Scheduling this event may
                          cause a conflict.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="organizer">
                  Organizer <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="organizer"
                  name="organizer"
                  placeholder="Enter organizer name"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendees">Expected Attendees</Label>
                <div className="relative">
                  <Input
                    id="attendees"
                    name="attendees"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.attendees.toString()}
                    onChange={(e) =>
                      handleInputChange({
                        ...e,
                        target: {
                          ...e.target,
                          name: "attendees",
                          value: e.target.value ? Number.parseInt(e.target.value, 10).toString() : "0",
                        },
                      })
                    }
                    className={attendeesError ? "border-red-500 pr-12" : ""}
                  />
                  {selectedFacility && selectedFacility.capacity && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                      Max: {selectedFacility.capacity}
                    </div>
                  )}
                </div>
                {attendeesError && <p className="text-sm text-red-500">{attendeesError}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Event Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Enter event category (e.g., Academic, Social)"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter event description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="Enter contact email"
                  value={formData.contactEmail || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  placeholder="Enter contact phone"
                  value={formData.contactPhone || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visibility & Settings</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleCheckboxChange("isPublic", checked as boolean)}
                  />
                  <Label htmlFor="isPublic" className="font-normal">
                    Make this event public
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresRegistration"
                    checked={formData.requiresRegistration || false}
                    onCheckedChange={(checked) => handleCheckboxChange("requiresRegistration", checked as boolean)}
                  />
                  <Label htmlFor="requiresRegistration" className="font-normal">
                    Requires registration
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                placeholder="Enter any additional notes or requirements"
                rows={3}
                value={formData.additionalNotes || ""}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/events")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

