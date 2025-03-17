"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

// Import the API service
import { api } from "@/app/services/api"
import type { Event } from "@/app/types"

// Define event resources, status options, and types
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

const EVENT_STATUS_OPTIONS = [
  { value: "Upcoming", label: "Upcoming" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
]

const EVENT_TYPES = [
  { value: "Academic", label: "Academic" },
  { value: "Social", label: "Social" },
  { value: "Career", label: "Career" },
  { value: "Workshop", label: "Workshop" },
  { value: "Seminar", label: "Seminar" },
  { value: "Guest Lecture", label: "Guest Lecture" },
  { value: "Student Council", label: "Student Council" },
]

// Define extended event type with additional fields
interface ExtendedEvent extends Event {
  attendees: number
  attendeesList?: {
    id: string
    name: string
    email: string
    role: string
    status: "confirmed" | "pending" | "declined"
  }[]
  resources?: string[]
  documents?: {
    id: string
    name: string
    type: string
    size: string
    uploadedBy: string
    uploadedAt: string
    url: string
  }[]
  feedback?: {
    rating: number
    comments: string
    submittedBy: string
    submittedAt: string
  }[]
}

// Define event announcement type
interface EventAnnouncement {
  id: string
  eventId: string
  title: string
  message: string
  sentTo: string[]
  sentAt: string
  sentBy: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await api.getEvents()
      setEvents(data)
    } catch (error) {
      console.error("Failed to fetch events:", error)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = () => {
    router.push("/dashboard/events/create")
  }

  const handleViewEvent = (id: string) => {
    try {
      // Use router.push with catch to handle any navigation errors
      router.push(`/dashboard/events/${id}`)

      // Add a toast notification for better user feedback
      toast({
        title: "Navigating to event details",
        description: `Loading details for event ID: ${id}`,
      })
    } catch (error) {
      console.error("Navigation error:", error)
      toast({
        title: "Navigation Error",
        description: "Failed to navigate to event details. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredEvents = events
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((event) => filterType === "all" || event.type === filterType)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "in progress":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "scheduled":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "planning":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const eventTypes = [...new Set(events.map((event) => event.type))]

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Campus Events</CardTitle>
            <CardDescription>View and manage all campus events</CardDescription>
          </div>
          <Button onClick={() => router.push("/dashboard/events/create")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Event
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No events found</p>
              <Button onClick={fetchEvents} variant="outline" className="mr-2">
                Refresh
              </Button>
              <Button onClick={handleCreateEvent}>Create New Event</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead className="min-w-[180px]">Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">{event.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{event.startDate ? format(new Date(event.startDate), "MMM d, yyyy") : "N/A"}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.startTime || "N/A"} {event.endTime ? `- ${event.endTime}` : ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{event.location || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.type || "Unspecified"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status || "")}>{event.status || "Unknown"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{typeof event.attendees === "number" ? event.attendees : "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEvent(event.id)}
                          className="flex items-center gap-1"
                        >
                          <span>View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

