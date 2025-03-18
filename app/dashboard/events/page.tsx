"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Plus, Clock, MapPin, Users, LinkIcon, UsersIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
    registeredAt?: string
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

  const [filterCategory, setFilterCategory] = useState("all")

  // Add a new state for managing registration links and attendees
  const [registrationLinks, setRegistrationLinks] = useState<Record<string, string>>({})
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [currentEventId, setCurrentEventId] = useState<string | null>(null)
  const [formPreviewMode, setFormPreviewMode] = useState(false)
  const [showAttendeesModal, setShowAttendeesModal] = useState(false)
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Add pagination for attendees
  const [currentPage, setCurrentPage] = useState(1)
  const [attendeesPerPage] = useState(10)
  const [attendeeStatusFilter, setAttendeeStatusFilter] = useState("all")
  const [attendeeSearchTerm, setAttendeeSearchTerm] = useState("")

  // Extract unique categories from events
  const eventCategories = [...new Set(events.filter((event) => event.category).map((event) => event.category))]

  const filteredEvents = events
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((event) => filterType === "all" || event.type === filterType)
    .filter((event) => filterCategory === "all" || event.category === filterCategory)

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
      // Find the event by ID
      const event = events.find((e) => e.id === id)
      if (event) {
        setSelectedEvent(event)
        setShowEventDetailsModal(true)

        // Add a toast notification for better user feedback
        toast({
          title: "Event details loaded",
          description: `Viewing details for: ${event.title}`,
        })
      } else {
        throw new Error("Event not found")
      }
    } catch (error) {
      console.error("Error loading event details:", error)
      toast({
        title: "Error",
        description: "Failed to load event details. Please try again.",
        variant: "destructive",
      })
    }
  }

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

  // Add a function to generate a registration link
  const generateRegistrationLink = (eventId: string) => {
    // In a real implementation, this would call an API to generate a unique link
    const link = `${window.location.origin}/register/event/${eventId}?token=${Date.now()}`
    setRegistrationLinks((prev) => ({ ...prev, [eventId]: link }))
    return link
  }

  // Add a function to handle registration link generation and sharing
  const handleRegistrationLink = (event: Event) => {
    setCurrentEventId(event.id)
    setShowRegistrationModal(true)
  }

  // Add a function to preview the registration form
  const handlePreviewForm = (eventId: string) => {
    setCurrentEventId(eventId)
    setFormPreviewMode(true)
    setShowRegistrationModal(true)
  }

  // Update the function to view registered attendees
  const handleViewAttendees = (eventId: string) => {
    // Reset pagination and filters when opening the modal
    setCurrentPage(1)
    setAttendeeStatusFilter("all")
    setAttendeeSearchTerm("")

    // Show the modal with attendees
    setCurrentEventId(eventId)
    setShowAttendeesModal(true)
  }

  // Function to handle attendee status change
  const handleAttendeeStatusChange = (attendeeId: string, newStatus: "confirmed" | "pending" | "declined") => {
    // In a real app, this would call an API to update the status
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === currentEventId && event.attendeesList) {
          return {
            ...event,
            attendeesList: event.attendeesList.map((attendee) =>
              attendee.id === attendeeId ? { ...attendee, status: newStatus } : attendee,
            ),
            confirmedAttendees:
              newStatus === "confirmed" ? (event.confirmedAttendees || 0) + 1 : (event.confirmedAttendees || 0) - 1,
          }
        }
        return event
      }),
    )

    toast({
      title: "Status Updated",
      description: `Attendee status has been updated to ${newStatus}.`,
    })
  }

  // Get filtered and paginated attendees for the current event
  const getCurrentEventAttendees = () => {
    const currentEvent = events.find((e) => e.id === currentEventId)
    if (!currentEvent || !currentEvent.attendeesList) return []

    // Filter attendees based on search and status filter
    const filteredAttendees = currentEvent.attendeesList.filter(
      (attendee) =>
        (attendeeStatusFilter === "all" || attendee.status === attendeeStatusFilter) &&
        (attendee.name.toLowerCase().includes(attendeeSearchTerm.toLowerCase()) ||
          attendee.email.toLowerCase().includes(attendeeSearchTerm.toLowerCase())),
    )

    // Calculate pagination
    const indexOfLastAttendee = currentPage * attendeesPerPage
    const indexOfFirstAttendee = indexOfLastAttendee - attendeesPerPage

    return {
      attendees: filteredAttendees.slice(indexOfFirstAttendee, indexOfLastAttendee),
      totalAttendees: filteredAttendees.length,
      totalPages: Math.ceil(filteredAttendees.length / attendeesPerPage),
    }
  }

  return (
    <div className="w-full py-6">
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
            <div className="w-full md:w-48">
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
            <div className="w-full md:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {eventCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
                    <TableHead>Facility</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Public</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Confirmed</TableHead>
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
                        <Badge variant="secondary">{event.category || "General"}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{event.organizer || "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status || "")}>{event.status || "Unknown"}</Badge>
                      </TableCell>
                      <TableCell>
                        {event.isPublic !== undefined ? (
                          <Badge variant={event.isPublic ? "default" : "outline"}>
                            {event.isPublic ? "Public" : "Private"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {event.requiresRegistration ? (
                          <Badge
                            variant="success"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            Required
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Required</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{typeof event.attendees === "number" ? event.attendees : "0"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                          >
                            {event.confirmedAttendees || "0"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEvent(event.id)}
                            disabled={loading}
                          >
                            View
                          </Button>
                          {event.requiresRegistration && (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegistrationLink(event)}
                                title="Generate registration link"
                              >
                                <LinkIcon className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewAttendees(event.id)}
                                title="View registered attendees"
                              >
                                <UsersIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {showRegistrationModal && currentEventId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">
              {formPreviewMode ? "Registration Form Preview" : "Event Registration Link"}
            </h2>

            {formPreviewMode ? (
              <div className="border p-4 rounded-md bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  {events.find((e) => e.id === currentEventId)?.title} - Registration Form
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="John Doe"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="john@example.com"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="+1 (555) 123-4567"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Organization/Institution
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="Company/University"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Special Requirements
                    </label>
                    <textarea
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
                      rows={3}
                      placeholder="Any dietary restrictions, accessibility needs, etc."
                      disabled
                    ></textarea>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-4">Share this link with potential attendees to register for the event:</p>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={registrationLinks[currentEventId] || generateRegistrationLink(currentEventId)}
                    className="flex-1 p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                    readOnly
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(registrationLinks[currentEventId] || "")
                      toast({
                        title: "Link copied",
                        description: "Registration link copied to clipboard",
                      })
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This link will allow attendees to register for the event. Their information will be saved in the
                  system.
                </p>
              </>
            )}

            <div className="flex justify-between mt-6">
              {formPreviewMode && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormPreviewMode(false)
                  }}
                >
                  Back to Link
                </Button>
              )}
              <div className="ml-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRegistrationModal(false)
                    setCurrentEventId(null)
                    setFormPreviewMode(false)
                  }}
                  className="mr-2"
                >
                  Close
                </Button>
                {!formPreviewMode && (
                  <Button
                    onClick={() => {
                      setFormPreviewMode(true)
                    }}
                  >
                    Preview Form
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Attendees Modal */}
      {showAttendeesModal && currentEventId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full">
            <h2 className="text-xl font-bold mb-4">
              Registered Attendees - {events.find((e) => e.id === currentEventId)?.title}
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search attendees..."
                  value={attendeeSearchTerm}
                  onChange={(e) => {
                    setAttendeeSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page on search
                  }}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={attendeeStatusFilter}
                  onValueChange={(value) => {
                    setAttendeeStatusFilter(value)
                    setCurrentPage(1) // Reset to first page on filter change
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-auto max-h-[60vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCurrentEventAttendees().attendees.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableCell className="font-medium">{attendee.name}</TableCell>
                      <TableCell>{attendee.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            attendee.status === "confirmed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : attendee.status === "pending"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(attendee.registeredAt || Date.now()).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Email
                          </Button>
                          {attendee.status !== "confirmed" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAttendeeStatusChange(attendee.id, "confirmed")}
                            >
                              Confirm
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAttendeeStatusChange(attendee.id, "declined")}
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getCurrentEventAttendees().attendees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No registered attendees found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {getCurrentEventAttendees().totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: getCurrentEventAttendees().totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === getCurrentEventAttendees().totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, getCurrentEventAttendees().totalPages))}
                >
                  Next
                </Button>
              </div>
            )}

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {getCurrentEventAttendees().attendees.length} of {getCurrentEventAttendees().totalAttendees}{" "}
                attendees
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAttendeesModal(false)
                  setCurrentEventId(null)
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Event Details Modal */}
      {showEventDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full">
            <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p>{selectedEvent.description}</p>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedEvent.startDate ? format(new Date(selectedEvent.startDate), "MMM d, yyyy") : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedEvent.startTime || "N/A"} {selectedEvent.endTime ? `- ${selectedEvent.endTime}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.location || "N/A"}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge variant="outline">{selectedEvent.type || "Unspecified"}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge variant="secondary">{selectedEvent.category || "General"}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(selectedEvent.status || "")}>
                      {selectedEvent.status || "Unknown"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Attendance Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Organizer</p>
                    <p>{selectedEvent.organizer || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Required</p>
                    <Badge
                      variant={selectedEvent.requiresRegistration ? "success" : "outline"}
                      className={
                        selectedEvent.requiresRegistration
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : ""
                      }
                    >
                      {selectedEvent.requiresRegistration ? "Required" : "Not Required"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Visibility</p>
                    <Badge variant={selectedEvent.isPublic ? "default" : "outline"}>
                      {selectedEvent.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Attendees</p>
                    <p>{typeof selectedEvent.attendees === "number" ? selectedEvent.attendees : "0"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confirmed Attendees</p>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      {selectedEvent.confirmedAttendees || "0"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <div>
                {selectedEvent.requiresRegistration && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEventDetailsModal(false)
                      setCurrentEventId(selectedEvent.id)
                      setShowAttendeesModal(true)
                    }}
                    className="mr-2"
                  >
                    View Attendees
                  </Button>
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEventDetailsModal(false)
                    setSelectedEvent(null)
                  }}
                  className="mr-2"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    try {
                      router.push(`/dashboard/events/${selectedEvent.id}/edit`)
                    } catch (error) {
                      console.error("Navigation error:", error)
                      toast({
                        title: "Navigation Error",
                        description: "Failed to navigate to edit page. Please try again.",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  Edit Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

