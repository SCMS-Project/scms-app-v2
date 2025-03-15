"use client"

import React from "react"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { api } from "@/app/services/api"
import type { Facility, Reservation } from "@/app/types"

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
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([])

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
  useEffect(() => {
    if (!selectedFacility) return

    const facility = facilities.find((f) => f.id === selectedFacility)
    if (facility) {
      // Generate mock rooms based on the facility
      const mockRooms = Array.from({ length: facility.rooms }, (_, i) => ({
        id: `${facility.id}-R${i + 1}`,
        name: `Room ${i + 1}`,
      }))

      setRooms(mockRooms)
    }
  }, [selectedFacility, facilities])

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Generate time slots (hourly from 8 AM to 8 PM)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8
    return `${hour.toString().padStart(2, "0")}:00`
  })

  // Check if a time slot is available
  const isTimeSlotAvailable = (day: Date, time: string, room: string) => {
    const formattedDate = format(day, "yyyy-MM-dd")
    const facilityName = facilities.find((f) => f.id === selectedFacility)?.name || ""

    // Check if there's a reservation for this time slot
    const conflict = reservations.some(
      (reservation) =>
        reservation.facility === facilityName &&
        reservation.room === room &&
        reservation.date === formattedDate &&
        ((time >= reservation.time.split(" - ")[0] && time < reservation.time.split(" - ")[1]) ||
          (Number.parseInt(time.split(":")[0]) + 1 + ":00" > reservation.time.split(" - ")[0] &&
            Number.parseInt(time.split(":")[0]) + 1 + ":00" <= reservation.time.split(" - ")[1])),
    )

    return !conflict
  }

  // Handle week navigation
  const previousWeek = () => {
    setWeekStart(addDays(weekStart, -7))
  }

  const nextWeek = () => {
    setWeekStart(addDays(weekStart, 7))
  }

  // Handle reservation
  const handleReserve = (day: Date, time: string, room: string) => {
    if (onReserve) {
      const reservationDate = new Date(day)
      reservationDate.setHours(Number.parseInt(time.split(":")[0]))
      onReserve(reservationDate, selectedFacility || "", room)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Facility Availability</h3>
          <p className="text-sm text-muted-foreground">Check room availability and make reservations</p>
        </div>
        <div className="flex items-center gap-2">
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
          <Select value={selectedFacility || ""} onValueChange={setSelectedFacility}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map((facility) => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              ? `Showing availability for ${facilities.find((f) => f.id === selectedFacility)?.name}`
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
                {rooms.map((room) => (
                  <React.Fragment key={room.id}>
                    <div className="h-12 flex items-center justify-center font-medium bg-muted/50 rounded-md">
                      {room.name}
                    </div>
                    {weekDays.map((day, dayIndex) => (
                      <div key={dayIndex} className="h-12 grid grid-rows-1 gap-1">
                        <div
                          className={cn(
                            "flex items-center justify-center text-xs rounded-md border border-dashed",
                            isTimeSlotAvailable(day, "09:00", room.name)
                              ? "border-green-500 bg-green-50 hover:bg-green-100 cursor-pointer"
                              : "border-red-500 bg-red-50",
                          )}
                          onClick={() =>
                            isTimeSlotAvailable(day, "09:00", room.name) && handleReserve(day, "09:00", room.name)
                          }
                        >
                          {isTimeSlotAvailable(day, "09:00", room.name) ? "Available" : "Booked"}
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
                        {rooms.map((room, roomIndex) => (
                          <div
                            key={`${timeIndex}-${dayIndex}-${roomIndex}`}
                            className={cn(
                              "flex items-center justify-center text-xs rounded-md border border-dashed",
                              isTimeSlotAvailable(day, time, room.name)
                                ? "border-green-500 bg-green-50 hover:bg-green-100 cursor-pointer"
                                : "border-red-500 bg-red-50",
                            )}
                            onClick={() =>
                              isTimeSlotAvailable(day, time, room.name) && handleReserve(day, time, room.name)
                            }
                          >
                            {room.name}: {isTimeSlotAvailable(day, time, room.name) ? "Available" : "Booked"}
                          </div>
                        ))}
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
    </div>
  )
}

