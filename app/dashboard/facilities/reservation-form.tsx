"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { api } from "@/app/services/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Facility, Reservation } from "@/app/types"

// Define the form schema with Zod
const formSchema = z.object({
  facilityId: z.string({
    required_error: "Please select a facility",
  }),
  room: z.string({
    required_error: "Please select a room",
  }),
  purpose: z.string().min(5, {
    message: "Purpose must be at least 5 characters",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  endTime: z.string({
    required_error: "Please select an end time",
  }),
  attendees: z.coerce.number().min(1, {
    message: "At least 1 attendee is required",
  }),
  equipment: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ReservationFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  existingReservations: Reservation[]
}

export function ReservationForm({ onSuccess, onCancel, existingReservations }: ReservationFormProps) {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [rooms, setRooms] = useState<{ id: string; name: string; capacity: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [availabilityStatus, setAvailabilityStatus] = useState<"available" | "unavailable" | "unknown">("unknown")
  const [availabilityMessage, setAvailabilityMessage] = useState("")
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)

  const { toast } = useToast()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: "",
      attendees: 1,
      equipment: [],
      notes: "",
    },
  })

  // Watch form values for availability checking
  const watchedValues = form.watch(["facilityId", "room", "date", "startTime", "endTime"])

  // Fetch facilities on component mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true)
        const facilitiesData = await api.getFacilities()
        setFacilities(facilitiesData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load facilities. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFacilities()
  }, [toast])

  // Update rooms when facility changes
  useEffect(() => {
    const facilityId = form.getValues("facilityId")
    if (!facilityId) return

    const facility = facilities.find((f) => f.id === facilityId)
    if (facility) {
      setSelectedFacility(facility)

      // Generate mock rooms based on the facility
      // In a real app, this would come from an API call
      const mockRooms = Array.from({ length: facility.rooms }, (_, i) => ({
        id: `${facility.id}-R${i + 1}`,
        name: `Room ${i + 1}`,
        capacity: Math.floor(facility.capacity / facility.rooms),
      }))

      setRooms(mockRooms)
    }
  }, [form.getValues("facilityId"), facilities])

  // Check availability when relevant form values change
  useEffect(() => {
    const [facilityId, room, date, startTime, endTime] = watchedValues

    if (facilityId && room && date && startTime && endTime) {
      checkAvailability(facilityId, room, date, startTime, endTime)
    } else {
      setAvailabilityStatus("unknown")
      setAvailabilityMessage("")
    }
  }, [watchedValues])

  // Function to check if the requested time slot is available
  const checkAvailability = async (
    facilityId: string,
    room: string,
    date: Date,
    startTime: string,
    endTime: string,
  ) => {
    setCheckingAvailability(true)

    try {
      // Format the date to match the format in the reservations
      const formattedDate = format(date, "yyyy-MM-dd")

      // Check for conflicts with existing reservations
      const conflicts = existingReservations.filter((reservation) => {
        return (
          reservation.facility === facilities.find((f) => f.id === facilityId)?.name &&
          reservation.room === room &&
          reservation.date === formattedDate &&
          // Check if the requested time overlaps with an existing reservation
          ((startTime >= reservation.time.split(" - ")[0] && startTime < reservation.time.split(" - ")[1]) ||
            (endTime > reservation.time.split(" - ")[0] && endTime <= reservation.time.split(" - ")[1]) ||
            (startTime <= reservation.time.split(" - ")[0] && endTime >= reservation.time.split(" - ")[1]))
        )
      })

      if (conflicts.length > 0) {
        setAvailabilityStatus("unavailable")
        setAvailabilityMessage("This time slot is already booked. Please select a different time or room.")
      } else {
        setAvailabilityStatus("available")
        setAvailabilityMessage("This time slot is available!")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check availability. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCheckingAvailability(false)
    }
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (availabilityStatus === "unavailable") {
      toast({
        title: "Error",
        description: "Cannot reserve an unavailable time slot. Please select a different time or room.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Format the data for the API
      const facilityName = facilities.find((f) => f.id === data.facilityId)?.name || ""
      const formattedDate = format(data.date, "yyyy-MM-dd")
      const timeSlot = `${data.startTime} - ${data.endTime}`

      // Create the reservation
      await api.createReservation({
        facility: facilityName,
        room: data.room,
        purpose: data.purpose,
        date: formattedDate,
        time: timeSlot,
        requestedBy: "Current User", // In a real app, get this from auth context
        status: "Pending",
      })

      toast({
        title: "Success",
        description: "Reservation request submitted successfully!",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reservation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Generate time options (30-minute intervals)
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 8; hour < 22; hour++) {
      for (const minute of [0, 30]) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        options.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="facilityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    // Reset room when facility changes
                    form.setValue("room", "")
                  }}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a facility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name} ({facility.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the building or facility you want to reserve</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!form.getValues("facilityId") || loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.name}>
                        {room.name} (Capacity: {room.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the specific room you want to reserve</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        disabled={loading}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Select the date for your reservation (up to 3 months in advance)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={`start-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeOptions
                        .filter((time) => time > (form.getValues("startTime") || "00:00"))
                        .map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Class, Meeting, Event" {...field} disabled={loading} />
                </FormControl>
                <FormDescription>Briefly describe the purpose of your reservation</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Attendees</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>Estimated number of people attending</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any special requirements or additional information"
                    className="resize-none"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>Optional: Include any special requirements or additional information</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Availability status */}
        {availabilityStatus !== "unknown" && (
          <Alert variant={availabilityStatus === "available" ? "default" : "destructive"}>
            <Info className="h-4 w-4" />
            <AlertTitle>{availabilityStatus === "available" ? "Available" : "Unavailable"}</AlertTitle>
            <AlertDescription>
              {checkingAvailability ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Checking availability...
                </div>
              ) : (
                availabilityMessage
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || availabilityStatus === "unavailable"}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Reservation
          </Button>
        </div>
      </form>
    </Form>
  )
}

