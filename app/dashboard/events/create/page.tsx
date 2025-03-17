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

const EVENT_RESOURCES = [
  "Projector",
  "Microphone",
  "Whiteboard",
  "Laptop",
  "Video Conference",
  "Chairs",
  "Tables",
  "Refreshments",
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
    location: "",
    facilityId: "",
    startDate: "",
    startTime: "",
    endTime: "",
    status: "Upcoming",
    attendees: 0,
    isPublic: true,
    resources: [] as string[],
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleResourceToggle = (resource: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      resources: checked ? [...prev.resources, resource] : prev.resources.filter((r) => r !== resource),
    }))
  }

  const handleFacilitySelect = (facility: any) => {
    setSelectedFacility(facility)
    setFormData((prev) => ({
      ...prev,
      facilityId: facility.id,
      location: `${facility.name} - ${facility.type || "General"}`,
    }))
    setOpenFacilityPopover(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.type || !formData.startDate || !formData.startTime || !formData.facilityId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
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
      // Create event using API
      const result = await api.createEvent({
        ...formData,
        id: `event-${Date.now()}`, // This will be overwritten by the server
      })

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
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
                      setFormData((prev) => ({ ...prev, startDate: value }))
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

            {/* Facility Selection Section */}
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
                              variant={facilityAvailability[selectedFacility.id].available ? "outline" : "destructive"}
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

              {/* Selected Facility Card */}
              {selectedFacility && (
                <div
                  className={`mt-4 p-4 border rounded-md shadow-sm ${
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  name="organizer"
                  placeholder="Enter organizer name"
                  value={formData.organizer}
                  onChange={handleInputChange}
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

            <div className="space-y-2">
              <Label>Visibility</Label>
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
            </div>

            <div className="space-y-2">
              <Label>Required Resources</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {EVENT_RESOURCES.map((resource) => (
                  <div key={resource} className="flex items-center space-x-2">
                    <Checkbox
                      id={`resource-${resource}`}
                      checked={formData.resources.includes(resource)}
                      onCheckedChange={(checked) => handleResourceToggle(resource, checked as boolean)}
                    />
                    <Label htmlFor={`resource-${resource}`} className="font-normal">
                      {resource}
                    </Label>
                  </div>
                ))}
              </div>
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

