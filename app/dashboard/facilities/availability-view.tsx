"use client"

import React from "react"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { api } from "@/app/services/api"
import type { Facility, Reservation } from "@/app/types"

// Mock unavailable time slots data
// This represents maintenance periods, holidays, academic schedules, or events
const mockUnavailableSlots = [
  {
    facilityId: "FAC001",
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    timeSlots: ["10:00", "11:00", "12:00"], // Maintenance period
    reason: "Scheduled maintenance",
    type: "maintenance",
  },
  {
    facilityId: "FAC002",
    date: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow
    timeSlots: ["14:00", "15:00"], // Staff meeting
    reason: "Staff meeting",
    type: "administrative",
  },
  {
    facilityId: "FAC003",
    date: new Date(new Date().setDate(new Date().getDate() + 3)), // Three days from now
    allDay: true, // Entire day unavailable
    reason: "Facility cleaning",
    type: "maintenance",
  },
  // Academic schedule reservations
  {
    facilityId: "FAC001",
    date: new Date(new Date().setDate(new Date().getDate())), // Today
    timeSlots: ["09:00", "10:00", "11:00"],
    reason: "CS101: Introduction to Programming",
    type: "academic",
    courseCode: "CS101",
    instructor: "Dr. Smith",
  },
  {
    facilityId: "FAC002",
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    timeSlots: ["13:00", "14:00"],
    reason: "MATH201: Advanced Calculus",
    type: "academic",
    courseCode: "MATH201",
    instructor: "Dr. Johnson",
  },
  // Event reservations
  {
    facilityId: "FAC003",
    date: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow
    timeSlots: ["16:00", "17:00", "18:00"],
    reason: "Student Orientation",
    type: "event",
    eventId: "EVT001",
    organizer: "Student Affairs",
  },
  {
    facilityId: "FAC001",
    date: new Date(new Date().setDate(new Date().getDate() + 4)), // Four days from now
    timeSlots: ["14:00", "15:00", "16:00"],
    reason: "Career Fair",
    type: "event",
    eventId: "EVT002",
    organizer: "Career Services",
  },
  // Random unavailable slots for demo purposes
  ...Array.from({ length: 5 }, (_, i) => ({
    facilityId: ["FAC001", "FAC002", "FAC003", "FAC004"][Math.floor(Math.random() * 4)],
    date: new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 7))),
    timeSlots: [
      ["09:00", "10:00", "11:00"][Math.floor(Math.random() * 3)],
      ["13:00", "14:00", "15:00"][Math.floor(Math.random() * 3)],
    ],
    reason: ["Emergency maintenance", "Private event", "Staff training"][Math.floor(Math.random() * 3)],
    type: ["maintenance", "event", "administrative"][Math.floor(Math.random() * 3)],
  })),
]

interface AvailabilityViewProps {
  onReserve?: (date: Date, facility: string, room: string) => void
}

export function AvailabilityView({ onReserve }: AvailabilityViewProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  // const [rooms, setRooms] = useState<{ id: string; name: string }[]>([])

  // Add a search state and filtered facilities
  const [searchQuery, setSearchQuery] = useState<string>("")
  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Fetch facilities and reservations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [facilitiesData, reservationsData] = await Promise.all([api.getFacilities(), api.getReservations()])
        setFacilities(facilitiesData)
        setReservations(reservationsData)

        // Set default selected facility
        if (facilitiesData.length > 0 && !selectedFacility) {
          setSelectedFacility(facilitiesData[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedFacility])

  // Generate rooms when facility changes
  // useEffect(() => {
  //   if (!selectedFacility) return

  //   const facility = facilities.find((f) => f.id === selectedFacility)
  //   if (facility) {
  //     // Generate mock rooms based on the facility
  //     const mockRooms = Array.from({ length: facility.rooms }, (_, i) => ({
  //       id: `${facility.id}-R${i + 1}`,
  //       name: `Room ${i + 1}`,
  //     }))

  //     setRooms(mockRooms)
  //   }
  // }, [selectedFacility, facilities])

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Generate time slots (hourly from 8 AM to 8 PM)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8
    return `${hour.toString().padStart(2, "0")}:00`
  })

  // Check if a time slot is available
  const isTimeSlotAvailable = (day: Date, time: string) => {
    const formattedDate = format(day, "yyyy-MM-dd")
    const facilityName = facilities.find((f) => f.id === selectedFacility)?.name || ""

    // Check if there's a reservation for this time slot
    const reservationConflict = reservations.some(
      (reservation) =>
        reservation.facility === facilityName &&
        reservation.date === formattedDate &&
        ((time >= reservation.time.split(" - ")[0] && time < reservation.time.split(" - ")[1]) ||
          (Number.parseInt(time.split(":")[0]) + 1 + ":00" > reservation.time.split(" - ")[0] &&
            Number.parseInt(time.split(":")[0]) + 1 + ":00" <= reservation.time.split(" - ")[1])),
    )

    // Check if there's a mock unavailability for this time slot
    const unavailabilityConflict = mockUnavailableSlots.some(
      (slot) =>
        slot.facilityId === selectedFacility &&
        isSameDay(slot.date, day) &&
        (slot.allDay || slot.timeSlots.includes(time)),
    )

    return !reservationConflict && !unavailabilityConflict
  }

  // Get the reason for unavailability with context
  const getUnavailabilityReason = (day: Date, time: string) => {
    // Check for reservation conflict first
    const formattedDate = format(day, "yyyy-MM-dd")
    const facilityName = facilities.find((f) => f.id === selectedFacility)?.name || ""

    const reservationConflict = reservations.some(
      (reservation) =>
        reservation.facility === facilityName &&
        reservation.date === formattedDate &&
        ((time >= reservation.time.split(" - ")[0] && time < reservation.time.split(" - ")[1]) ||
          (Number.parseInt(time.split(":")[0]) + 1 + ":00" > reservation.time.split(" - ")[0] &&
            Number.parseInt(time.split(":")[0]) + 1 + ":00" <= reservation.time.split(" - ")[1])),
    )

    if (reservationConflict) {
      return "Reserved"
    }

    // Check for mock unavailability
    const unavailableSlot = mockUnavailableSlots.find(
      (slot) =>
        slot.facilityId === selectedFacility &&
        isSameDay(slot.date, day) &&
        (slot.allDay || slot.timeSlots.includes(time)),
    )

    if (unavailableSlot) {
      // Return reason with context based on type
      if (unavailableSlot.type === "academic") {
        return `Class: ${unavailableSlot.reason}`
      } else if (unavailableSlot.type === "event") {
        return `Event: ${unavailableSlot.reason}`
      } else {
        return unavailableSlot.reason
      }
    }

    return "Available"
  }

  // Add this function to get the appropriate CSS class based on unavailability type
  const getUnavailabilityClass = (day: Date, time: string) => {
    if (isTimeSlotAvailable(day, time)) {
      return "border-green-500 bg-green-50 hover:bg-green-100 cursor-pointer"
    }

    // Find the unavailable slot
    const unavailableSlot = mockUnavailableSlots.find(
      (slot) =>
        slot.facilityId === selectedFacility &&
        isSameDay(slot.date, day) &&
        (slot.allDay || slot.timeSlots.includes(time)),
    )

    if (unavailableSlot) {
      switch (unavailableSlot.type) {
        case "academic":
          return "border-blue-500 bg-blue-50"
        case "event":
          return "border-purple-500 bg-purple-50"
        case "maintenance":
          return "border-red-500 bg-red-50"
        case "administrative":
          return "border-amber-500 bg-amber-50"
        default:
          return "border-red-500 bg-red-50"
      }
    }

    // Default for other reservations
    return "border-red-500 bg-red-50"
  }

  // Handle week navigation
  const previousWeek = () => {
    setWeekStart(addDays(weekStart, -7))
  }

  const nextWeek = () => {
    setWeekStart(addDays(weekStart, 7))
  }

  // Handle reservation
  const handleReserve = (day: Date, time: string) => {
    if (onReserve) {
      const reservationDate = new Date(day)
      reservationDate.setHours(Number.parseInt(time.split(":")[0]))
      onReserve(reservationDate, selectedFacility || "", "")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Facility Availability</h3>
          <p className="text-sm text-muted-foreground">Check facility availability and make reservations</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
          <div className="relative w-full sm:w-[200px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedFacility
                    ? (() => {
                        const facility = facilities.find((f) => f.id === selectedFacility)
                        return facility ? (
                          <span className="truncate">
                            {facility.name} <span className="text-muted-foreground">({facility.id})</span>
                          </span>
                        ) : (
                          "Select facility..."
                        )
                      })()
                    : "Select facility..."}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search facilities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredFacilities.length > 0 ? (
                    filteredFacilities.map((facility) => (
                      <div
                        key={facility.id}
                        className={cn(
                          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                          selectedFacility === facility.id && "bg-accent text-accent-foreground",
                        )}
                        onClick={() => {
                          setSelectedFacility(facility.id)
                          setSearchQuery("")
                        }}
                      >
                        <span>{facility.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({facility.id})</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-2 text-sm text-muted-foreground">No facilities found</div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Weekly Availability</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={previousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
              </span>
              <Button variant="outline" size="icon" onClick={nextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {selectedFacility
              ? `Showing availability for ${facilities.find((f) => f.id === selectedFacility)?.name} (${selectedFacility})`
              : "Select a facility to view availability"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedFacility ? (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-1 min-w-[800px]">
                {/* Header row with days */}
                <div className="h-12 flex items-center justify-center font-medium bg-muted/50"></div>
                {weekDays.map((day, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-12 flex flex-col items-center justify-center font-medium bg-muted/50 rounded-md",
                      format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && "bg-primary/10",
                    )}
                  >
                    <span>{format(day, "EEE")}</span>
                    <span className="text-xs text-muted-foreground">{format(day, "MMM d")}</span>
                  </div>
                ))}

                {/* Time slots */}
                {facilities
                  .filter((f) => f.id === selectedFacility)
                  .map((facility) => (
                    <React.Fragment key={facility.id}>
                      <div className="h-12 flex items-center justify-center font-medium bg-muted/50 rounded-md">
                        {facility.name}
                      </div>
                      {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="h-12 grid grid-rows-1 gap-1">
                          <div
                            className={cn(
                              "flex items-center justify-center text-xs rounded-md border border-dashed",
                              isTimeSlotAvailable(day, "09:00")
                                ? "border-green-500 bg-green-50 hover:bg-green-100 cursor-pointer"
                                : "border-red-500 bg-red-50",
                            )}
                            onClick={() => isTimeSlotAvailable(day, "09:00") && handleReserve(day, "09:00")}
                            title={getUnavailabilityReason(day, "09:00")}
                          >
                            {isTimeSlotAvailable(day, "09:00") ? "Available" : getUnavailabilityReason(day, "09:00")}
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}

                {/* Time slots for each hour */}
                {timeSlots.map((time, timeIndex) => (
                  <React.Fragment key={time}>
                    <div className="h-12 flex items-center justify-center font-medium bg-muted/50 rounded-md">
                      {time}
                    </div>
                    {weekDays.map((day, dayIndex) => (
                      <div key={`${timeIndex}-${dayIndex}`} className="h-12 grid grid-rows-1 gap-1">
                        <div
                          className={cn(
                            "flex items-center justify-center text-xs rounded-md border border-dashed",
                            getUnavailabilityClass(day, time),
                          )}
                          onClick={() => isTimeSlotAvailable(day, time) && handleReserve(day, time)}
                          title={getUnavailabilityReason(day, time)}
                        >
                          {isTimeSlotAvailable(day, time) ? "Available" : getUnavailabilityReason(day, time)}
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-96 text-muted-foreground">
              Please select a facility to view availability
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 items-center mt-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-green-50 border border-dashed border-green-500 mr-2"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-blue-50 border border-dashed border-blue-500 mr-2"></div>
          <span className="text-sm">Academic Schedule</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-purple-50 border border-dashed border-purple-500 mr-2"></div>
          <span className="text-sm">Event</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-red-50 border border-dashed border-red-500 mr-2"></div>
          <span className="text-sm">Maintenance</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-amber-50 border border-dashed border-amber-500 mr-2"></div>
          <span className="text-sm">Administrative</span>
        </div>
        <div className="text-xs text-muted-foreground ml-2">(Hover over slots to see details)</div>
      </div>
    </div>
  )
}

