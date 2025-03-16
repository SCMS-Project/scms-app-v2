"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Megaphone,
  UserPlus,
  FileText,
  Trash,
  Edit,
  AlertCircle,
  CalendarPlus2Icon as CalendarIcon2,
  Share2,
  StarIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format, addDays, isSameDay, parseISO, isAfter, isBefore, isToday } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Import the API service
import { api } from "@/app/services/api"
import type { Event } from "@/app/types"
import { useAuth } from "@/app/contexts/auth-context"
import type { Facility } from "@/app/types"

// Update imports to include our centralized constants
import { EVENT_RESOURCES, EVENT_STATUS_OPTIONS, EVENT_TYPES } from "@/app/constants/roles"

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

export default function Events() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<ExtendedEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<ExtendedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEvent | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [announcements, setAnnouncements] = useState<EventAnnouncement[]>([])
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    sendToAll: true,
    sendToAttendees: false,
    sendToFaculty: false,
    sendToStudents: false,
  })
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "upcoming">("calendar")
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month")
  const [weekStartDate, setWeekStartDate] = useState<Date>(getStartOfWeek(new Date()))
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "",
    organizer: "",
    facilityId: "",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endDate: new Date().toISOString().split("T")[0],
    endTime: "10:00",
    attendees: 0,
    status: "Upcoming",
    isPublic: true,
    requiresRegistration: false,
    maxAttendees: "",
    resources: [],
    notifyAttendees: true,
  })
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)
  const [isEditingEvent, setIsEditingEvent] = useState(false)
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [attendeeEmail, setAttendeeEmail] = useState("")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [resources, setResources] = useState<string[]>([])

  const { toast } = useToast()
  const { user } = useAuth()

  // Get start of week (Sunday)
  function getStartOfWeek(date: Date): Date {
    const day = date.getDay() // 0 for Sunday, 1 for Monday, etc.
    const diff = date.getDate() - day
    return new Date(date.setDate(diff))
  }

  // Generate week dates
  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i))
  }, [weekStartDate])

  // Fetch events data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await api.getEvents()

        // Extend the events with additional mock data
        const extendedData: ExtendedEvent[] = data.map((event) => ({
          ...event,
          attendeesList: generateMockAttendees(event.attendees),
          resources: generateMockResources(event.type),
          documents: generateMockDocuments(event.id),
          feedback: generateMockFeedback(event.id),
        }))

        setEvents(extendedData)
        setFilteredEvents(extendedData)
        setError(null)

        try {
          // Fetch announcements
          const announcementsData = await api.getEventAnnouncements()
          setAnnouncements(announcementsData)
        } catch (err) {
          console.error("Failed to fetch announcements:", err)
          // Don't set error state here, just log it
        }
      } catch (err) {
        setError("Failed to fetch events data")
        toast({
          title: "Error",
          description: "Failed to load events data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Generate mock attendees
  const generateMockAttendees = (count: number) => {
    if (count <= 0) return []

    // Limit to 10 for mock data
    const actualCount = Math.min(count, 10)
    const roles = ["Student", "Faculty", "Staff", "Guest"]
    const statuses = ["confirmed", "pending", "declined"] as const

    return Array.from({ length: actualCount }, (_, i) => ({
      id: `ATT${i + 1}`,
      name: `Attendee ${i + 1}`,
      email: `attendee${i + 1}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }))
  }

  // Generate mock resources
  const generateMockResources = (eventType: string) => {
    const resources = [
      "Projector",
      "Microphone",
      "Whiteboard",
      "Laptop",
      "Video Conference Equipment",
      "Chairs",
      "Tables",
      "Refreshments",
    ]

    // Select 2-4 random resources
    const count = Math.floor(Math.random() * 3) + 2
    const shuffled = [...resources].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // Generate mock documents
  const generateMockDocuments = (eventId: string) => {
    const docTypes = ["PDF", "DOCX", "PPTX", "XLSX"]
    const docCount = Math.floor(Math.random() * 3) // 0-2 documents

    return Array.from({ length: docCount }, (_, i) => ({
      id: `DOC${eventId}${i}`,
      name: `Document ${i + 1}`,
      type: docTypes[Math.floor(Math.random() * docTypes.length)],
      size: `${Math.floor(Math.random() * 10) + 1}MB`,
      uploadedBy: "Admin User",
      uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      url: "#",
    }))
  }

  // Generate mock feedback
  const generateMockFeedback = (eventId: string) => {
    // Only generate feedback for some events (completed ones)
    if (Math.random() > 0.3) return []

    const feedbackCount = Math.floor(Math.random() * 5) + 1 // 1-5 feedback entries

    return Array.from({ length: feedbackCount }, (_, i) => ({
      rating: Math.floor(Math.random() * 5) + 1,
      comments: `Feedback comment ${i + 1}`,
      submittedBy: `Attendee ${i + 1}`,
      submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }))
  }

  // Helper function to safely format dates
  const safeFormatDate = (dateString: string | undefined, formatString: string): string => {
    if (!dateString) return "N/A"
    try {
      return format(parseISO(dateString), formatString)
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error)
      return "Invalid Date"
    }
  }

  // Filter events based on search query, filter type, filter status, and selected date
  useEffect(() => {
    let filtered = [...events]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query),
      )
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((event) => event.type === filterType)
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((event) => event.status === filterStatus)
    }

    // Apply date filter for calendar view
    if (viewMode === "calendar" && date) {
      if (calendarView === "day") {
        filtered = filtered.filter((event) => {
          if (!event.startDate) return false
          try {
            return isSameDay(parseISO(event.startDate), date)
          } catch (error) {
            console.error(`Error parsing date for event ${event.id}:`, error)
            return false
          }
        })
      } else if (calendarView === "week") {
        const weekEnd = addDays(weekStartDate, 6)
        filtered = filtered.filter((event) => {
          if (!event.startDate) return false
          try {
            const eventDate = parseISO(event.startDate)
            return (
              (isAfter(eventDate, weekStartDate) || isSameDay(eventDate, weekStartDate)) &&
              (isBefore(eventDate, weekEnd) || isSameDay(eventDate, weekEnd))
            )
          } catch (error) {
            console.error(`Error parsing date for event ${event.id}:`, error)
            return false
          }
        })
      }
      // Month view logic remains the same
    }

    // For upcoming view, only show future events
    if (viewMode === "upcoming") {
      filtered = filtered.filter((event) => {
        if (!event.startDate) return false
        try {
          const eventDate = parseISO(event.startDate)
          return isAfter(eventDate, new Date()) || isToday(eventDate)
        } catch (error) {
          console.error(`Error parsing date for event ${event.id}:`, error)
          return false
        }
      })

      // Sort by date (closest first)
      filtered.sort((a, b) => {
        try {
          if (!a.startDate) return 1
          if (!b.startDate) return -1
          return parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
        } catch (error) {
          console.error("Error sorting dates:", error)
          return 0
        }
      })
    }

    setFilteredEvents(filtered)
  }, [events, searchQuery, filterType, filterStatus, date, viewMode, calendarView, weekStartDate])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewEvent((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setNewEvent((prev) => ({ ...prev, [id]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setNewEvent((prev) => ({ ...prev, [id]: checked }))
  }

  // Handle announcement input changes
  const handleAnnouncementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewAnnouncement((prev) => ({ ...prev, [id]: value }))
  }

  // Handle announcement checkbox changes
  const handleAnnouncementCheckboxChange = (id: string, checked: boolean) => {
    setNewAnnouncement((prev) => ({ ...prev, [id]: checked }))
  }

  // Handle event creation
  const handleCreateEvent = async () => {
    try {
      setIsCreatingEvent(true)

      // Validate form
      if (
        !newEvent.title ||
        !newEvent.type ||
        !newEvent.organizer ||
        !newEvent.facilityId ||
        !newEvent.startDate ||
        !newEvent.startTime ||
        !newEvent.endDate ||
        !newEvent.endTime
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Create event
      const createdEvent = await api.createEvent(newEvent as Omit<Event, "id">)

      // Extend with additional data
      const extendedEvent: ExtendedEvent = {
        ...createdEvent,
        attendeesList: [],
        resources: newEvent.resources as string[],
        documents: [],
        feedback: [],
      }

      // Add to events list
      setEvents((prev) => [...prev, extendedEvent])

      // Show success message
      toast({
        title: "Success",
        description: "Event added successfully",
      })

      // Reset form and close dialog
      setNewEvent({
        title: "",
        description: "",
        type: "",
        organizer: "",
        facilityId: "",
        startDate: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endDate: new Date().toISOString().split("T")[0],
        endTime: "10:00",
        attendees: 0,
        status: "Upcoming",
        isPublic: true,
        requiresRegistration: false,
        maxAttendees: "",
        resources: [],
        notifyAttendees: true,
      })
      setCurrentStep(1)

      // If notify attendees is checked, create an announcement
      if (newEvent.notifyAttendees) {
        const announcement: EventAnnouncement = {
          id: `ANN${Date.now()}`,
          eventId: extendedEvent.id,
          title: `New Event: ${extendedEvent.title}`,
          message: `A new event "${extendedEvent.title}" has been scheduled for ${extendedEvent.startDate} at ${extendedEvent.startTime}. ${extendedEvent.description}`,
          sentTo: ["All"],
          sentAt: new Date().toISOString(),
          sentBy: user?.name || "Admin",
        }

        setAnnouncements((prev) => [...prev, announcement])
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingEvent(false)
    }
  }

  // Handle event update
  const handleUpdateEvent = async () => {
    if (!selectedEvent) return

    try {
      setIsEditingEvent(true)

      // Update event
      const updatedEvent = await api.updateEvent(selectedEvent.id, selectedEvent)

      // Update events list
      setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event)))

      // Show success message
      toast({
        title: "Success",
        description: "Event updated successfully",
      })

      // Close dialog
      setSelectedEvent(null)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEditingEvent(false)
    }
  }

  // Handle event deletion
  const handleDeleteEvent = async (id: string) => {
    try {
      setLoading(true)
      await api.deleteEvent(id)
      setEvents((prev) => prev.filter((event) => event.id !== id))
      setFilteredEvents((prev) => prev.filter((event) => event.id !== id))
      toast({
        title: "Success",
        description: "Event deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle sending announcement
  const handleSendAnnouncement = async () => {
    if (!selectedEvent) return

    try {
      setIsSendingAnnouncement(true)

      // Validate form
      if (!newAnnouncement.title || !newAnnouncement.message) {
        toast({
          title: "Validation Error",
          description: "Please provide a title and message for the announcement.",
          variant: "destructive",
        })
        return
      }

      // Determine recipients
      const recipients: string[] = []
      if (newAnnouncement.sendToAll) recipients.push("All")
      if (newAnnouncement.sendToAttendees) recipients.push("Attendees")
      if (newAnnouncement.sendToFaculty) recipients.push("Faculty")
      if (newAnnouncement.sendToStudents) recipients.push("Students")

      // Create announcement
      const announcement: EventAnnouncement = {
        id: `ANN${Date.now()}`,
        eventId: selectedEvent.id,
        title: newAnnouncement.title,
        message: newAnnouncement.message,
        sentTo: recipients,
        sentAt: new Date().toISOString(),
        sentBy: user?.name || "Admin",
      }

      // In a real app, you would call an API to send the announcement
      // For now, we'll just add it to our local state
      setAnnouncements((prev) => [...prev, announcement])

      // Show success message
      toast({
        title: "Success",
        description: "Announcement sent successfully",
      })

      // Reset form
      setNewAnnouncement({
        title: "",
        message: "",
        sendToAll: true,
        sendToAttendees: false,
        sendToFaculty: false,
        sendToStudents: false,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send announcement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingAnnouncement(false)
    }
  }

  // Handle adding attendee
  const handleAddAttendee = () => {
    if (!selectedEvent || !attendeeEmail) return

    // Validate email
    if (!attendeeEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // Check if attendee already exists
    if (selectedEvent.attendeesList?.some((a) => a.email === attendeeEmail)) {
      toast({
        title: "Duplicate",
        description: "This attendee is already in the list.",
        variant: "destructive",
      })
      return
    }

    // Add attendee
    const newAttendee = {
      id: `ATT${Date.now()}`,
      name: attendeeEmail.split("@")[0], // Use part of email as name
      email: attendeeEmail,
      role: "Guest",
      status: "pending" as const,
    }

    // Update selected event
    setSelectedEvent((prev) => {
      if (!prev) return null

      const updatedAttendeesList = [...(prev.attendeesList || []), newAttendee]
      return {
        ...prev,
        attendeesList: updatedAttendeesList,
        attendees: updatedAttendeesList.length,
      }
    })

    // Reset email input
    setAttendeeEmail("")

    // Show success message
    toast({
      title: "Success",
      description: "Attendee added successfully",
    })
  }

  // Handle removing attendee
  const handleRemoveAttendee = (id: string) => {
    if (!selectedEvent) return

    // Update selected event
    setSelectedEvent((prev) => {
      if (!prev || !prev.attendeesList) return prev

      const updatedAttendeesList = prev.attendeesList.filter((a) => a.id !== id)
      return {
        ...prev,
        attendeesList: updatedAttendeesList,
        attendees: updatedAttendeesList.length,
      }
    })

    // Show success message
    toast({
      title: "Success",
      description: "Attendee removed successfully",
    })
  }

  // Navigate to previous week
  const previousWeek = () => {
    setWeekStartDate((prevDate) => addDays(prevDate, -7))
  }

  // Navigate to next week
  const nextWeek = () => {
    setWeekStartDate((prevDate) => addDays(prevDate, 7))
  }

  // Get event type badge variant
  const getEventTypeBadge = (type: string | undefined) => {
    if (!type) return "default" // Default variant if type is undefined

    switch (type.toLowerCase()) {
      case "academic":
        return "default"
      case "social":
        return "secondary"
      case "career":
        return "outline"
      case "workshop":
        return "destructive"
      case "seminar":
        return "blue"
      case "guest lecture":
        return "purple"
      case "student council":
        return "orange"
      default:
        return "default"
    }
  }

  // Get event status badge variant
  const getEventStatusBadge = (status: string | undefined) => {
    if (!status) return "outline" // Default variant if status is undefined

    switch (status.toLowerCase()) {
      case "upcoming":
        return "outline"
      case "in progress":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Get event type background color
  const getEventTypeBackground = (type: string | undefined) => {
    if (!type) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" // Default background if type is undefined

    switch (type.toLowerCase()) {
      case "academic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "social":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "career":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "workshop":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "seminar":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      case "guest lecture":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      case "student council":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Render event card
  const renderEventCard = (event: ExtendedEvent) => {
    return (
      <Card key={event.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.organizer}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={getEventTypeBadge(event.type)}>{event.type}</Badge>
              <Badge variant={getEventStatusBadge(event.status)}>{event.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm mb-2">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {event.startDate ? safeFormatDate(event.startDate, "MMMM d, yyyy") : "Date not set"}
                  {event.startDate &&
                    event.endDate &&
                    event.startDate !== event.endDate &&
                    ` - ${safeFormatDate(event.endDate, "MMMM d, yyyy")}`}
                </span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {event.startTime || "Time not set"} {event.endTime && `- ${event.endTime}`}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{facilities.find((f) => f.id === event.facilityId)?.name || "Unknown Facility"}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm mb-2">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.attendees} attendees</span>
              </div>
              {event.resources && event.resources.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {event.resources.map((resource, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {resource}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm mt-4">{event.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(event)}>
            View Details
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedEvent(event)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedEvent(event)
                  setNewAnnouncement({
                    title: `Announcement: ${event.title}`,
                    message: "",
                    sendToAll: true,
                    sendToAttendees: false,
                    sendToFaculty: false,
                    sendToStudents: false,
                  })
                }}
              >
                <Megaphone className="mr-2 h-4 w-4" />
                Send Announcement
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedEvent(event)
                  setSelectedAttendees([])
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Manage Attendees
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    )
  }

  // Render calendar day cell
  const renderCalendarDayCell = (date: Date) => {
    // Add null checks and proper date parsing
    const dayEvents = filteredEvents.filter((event) => {
      // Check if event.startDate exists before trying to parse it
      if (!event.startDate) return false

      try {
        return isSameDay(parseISO(event.startDate), date)
      } catch (error) {
        // If parsing fails, log the error and skip this event
        console.error(`Error parsing date for event ${event.id}:`, error)
        return false
      }
    })

    return (
      <div className="min-h-[100px] p-1">
        <div className="font-medium text-sm mb-1">{format(date, "d")}</div>
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className={`text-xs p-1 rounded truncate cursor-pointer ${getEventTypeBackground(event.type)}`}
              onClick={() => setSelectedEvent(event)}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>}
        </div>
      </div>
    )
  }

  // Add useEffect to fetch facilities and resources
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch facilities
        const facilitiesData = await api.getFacilities()
        setFacilities(facilitiesData)

        try {
          // Fetch resources separately to isolate errors
          const resourcesData = await api.getEventResources()
          setResources(resourcesData)
        } catch (err) {
          console.error("Failed to fetch resources:", err)
          // Use default resources if API call fails
          setResources([
            "Projector",
            "Microphone",
            "Whiteboard",
            "Laptop",
            "Video Conference Equipment",
            "Chairs",
            "Tables",
            "Refreshments",
          ])
        }
      } catch (err) {
        console.error("Failed to fetch facilities:", err)
        toast({
          title: "Warning",
          description: "Some data could not be loaded. Functionality may be limited.",
          variant: "destructive",
        })
        // Set empty facilities if API call fails
        setFacilities([])
      }
    }

    fetchData()
  }, [toast])

  // Render week view
  const renderWeekView = () => {
    return (
      <div className="border rounded-md">
        <div className="grid grid-cols-7 border-b">
          {weekDates.map((date, index) => (
            <div key={index} className="p-2 text-center border-r last:border-r-0">
              <div className="font-medium">{format(date, "EEE")}</div>
              <div className="text-sm text-muted-foreground">{format(date, "MMM d")}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[500px]">
          {weekDates.map((date, index) => (
            <div key={index} className="border-r last:border-r-0">
              {renderCalendarDayCell(date)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render month view
  const renderMonthView = () => {
    // In a real implementation, this would generate a proper month calendar
    // For simplicity, we'll just show the current week
    return renderWeekView()
  }

  // Render day view
  const renderDayView = () => {
    const dayEvents = filteredEvents.filter((event) => {
      if (!date || !event.startDate) return false
      try {
        return isSameDay(parseISO(event.startDate), date)
      } catch (error) {
        console.error(`Error parsing date for event ${event.id}:`, error)
        return false
      }
    })

    return (
      <div className="border rounded-md p-4">
        <h3 className="font-medium text-lg mb-4">{date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}</h3>

        {dayEvents.length > 0 ? (
          <div className="space-y-4">{dayEvents.map((event) => renderEventCard(event))}</div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No events scheduled for this day</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground">Plan, announce, and manage campus events</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  {currentStep === 1
                    ? "Enter the basic details for your event."
                    : currentStep === 2
                      ? "Configure additional event settings."
                      : "Review and create your event."}
                </DialogDescription>
              </DialogHeader>

              {/* Step 1: Basic Details */}
              {currentStep === 1 && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title*
                    </Label>
                    <Input id="title" className="col-span-3" value={newEvent.title} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type*
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger className="col-span-3">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="organizer" className="text-right">
                      Organizer*
                    </Label>
                    <Input
                      id="organizer"
                      className="col-span-3"
                      value={newEvent.organizer}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="facilityId" className="text-right">
                      Facility*
                    </Label>
                    <Select
                      value={newEvent.facilityId}
                      onValueChange={(value) => handleSelectChange("facilityId", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select campus facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.id}>
                            {facility.name} ({facility.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date*
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      className="col-span-3"
                      value={newEvent.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                      Start Time*
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      className="col-span-3"
                      value={newEvent.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date*
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      className="col-span-3"
                      value={newEvent.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">
                      End Time*
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      className="col-span-3"
                      value={newEvent.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      className="col-span-3"
                      rows={4}
                      value={newEvent.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Additional Settings */}
              {currentStep === 2 && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      defaultValue={newEvent.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger className="col-span-3">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-right">
                      <Label>Visibility</Label>
                    </div>
                    <div className="col-span-3">
                      <RadioGroup
                        defaultValue={newEvent.isPublic ? "public" : "private"}
                        onValueChange={(value) => handleCheckboxChange("isPublic", value === "public")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public">Public (visible to all)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private">Private (by invitation only)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <div className="text-right pt-2">
                      <Label>Registration</Label>
                    </div>
                    <div className="col-span-3 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="requiresRegistration"
                          checked={newEvent.requiresRegistration}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("requiresRegistration", checked as boolean)
                          }
                        />
                        <Label htmlFor="requiresRegistration">Require registration</Label>
                      </div>

                      {newEvent.requiresRegistration && (
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label htmlFor="maxAttendees">Maximum attendees</Label>
                          <Input
                            id="maxAttendees"
                            type="number"
                            value={newEvent.maxAttendees}
                            onChange={handleInputChange}
                            placeholder="Leave blank for unlimited"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Resources</Label>
                    <div className="col-span-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {EVENT_RESOURCES.map((resource) => (
                          <div key={resource} className="flex items-center space-x-2">
                            <Checkbox
                              id={`resource-${resource}`}
                              checked={newEvent.resources.includes(resource)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewEvent((prev) => ({
                                    ...prev,
                                    resources: [...prev.resources, resource],
                                  }))
                                } else {
                                  setNewEvent((prev) => ({
                                    ...prev,
                                    resources: prev.resources.filter((r) => r !== resource),
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={`resource-${resource}`}>{resource}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-right">
                      <Label>Notification</Label>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="notifyAttendees"
                          checked={newEvent.notifyAttendees}
                          onCheckedChange={(checked) => handleCheckboxChange("notifyAttendees", checked as boolean)}
                        />
                        <Label htmlFor="notifyAttendees">Send announcement when event is created</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="py-4">
                  <div className="rounded-md border p-4 mb-4">
                    <h3 className="font-medium mb-2">Event Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Title:</div>
                      <div>{newEvent.title}</div>

                      <div className="font-medium">Type:</div>
                      <div>{newEvent.type}</div>

                      <div className="font-medium">Organizer:</div>
                      <div>{newEvent.organizer}</div>

                      <div className="font-medium">Location:</div>
                      <div>{newEvent.facilityId}</div>

                      <div className="font-medium">Date:</div>
                      <div>
                        {newEvent.startDate} to {newEvent.endDate}
                      </div>

                      <div className="font-medium">Time:</div>
                      <div>
                        {newEvent.startTime} - {newEvent.endTime}
                      </div>

                      <div className="font-medium">Status:</div>
                      <div>{newEvent.status}</div>

                      <div className="font-medium">Visibility:</div>
                      <div>{newEvent.isPublic ? "Public" : "Private"}</div>

                      <div className="font-medium">Registration:</div>
                      <div>
                        {newEvent.requiresRegistration
                          ? `Required${newEvent.maxAttendees ? ` (Max: ${newEvent.maxAttendees})` : ""}`
                          : "Not required"}
                      </div>

                      <div className="font-medium">Resources:</div>
                      <div>{newEvent.resources.length > 0 ? newEvent.resources.join(", ") : "None"}</div>
                    </div>

                    {newEvent.description && (
                      <>
                        <div className="font-medium mt-2">Description:</div>
                        <p className="text-sm mt-1">{newEvent.description}</p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Please review the event details before creating.</p>
                  </div>
                </div>
              )}

              <DialogFooter>
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                    Back
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button type="button" onClick={handleCreateEvent} disabled={isCreatingEvent}>
                    {isCreatingEvent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Event
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[300px]"
          />
          <Button variant="ghost" size="icon" onClick={() => setShowFilters(!showFilters)} className="ml-2">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <FileText className="mr-2 h-4 w-4" />
            List
          </Button>
          <Button
            variant={viewMode === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("upcoming")}
          >
            <CalendarIcon2 className="mr-2 h-4 w-4" />
            Upcoming
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label>Event Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Guest Lecture">Guest Lecture</SelectItem>
                    <SelectItem value="Student Council">Student Council</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterType("all")
                    setFilterStatus("all")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "calendar" && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Event Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={calendarView === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("month")}
                >
                  Month
                </Button>
                <Button
                  variant={calendarView === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("week")}
                >
                  Week
                </Button>
                <Button
                  variant={calendarView === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("day")}
                >
                  Day
                </Button>
              </div>
            </div>
            <CardDescription>
              {calendarView === "day" && date
                ? format(date, "MMMM d, yyyy")
                : calendarView === "week"
                  ? `${format(weekStartDate, "MMMM d")} - ${format(addDays(weekStartDate, 6), "MMMM d, yyyy")}`
                  : format(new Date(), "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" size="sm" onClick={previousWeek}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDate(new Date())
                    setWeekStartDate(getStartOfWeek(new Date()))
                  }}
                >
                  Today
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={nextWeek}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {calendarView === "month" && renderMonthView()}
            {calendarView === "week" && renderWeekView()}
            {calendarView === "day" && renderDayView()}
          </CardContent>
        </Card>
      )}

      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>
              {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <p>Loading events...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64 text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="space-y-4">{filteredEvents.map((event) => renderEventCard(event))}</div>
            ) : (
              <div className="flex justify-center items-center h-64 text-muted-foreground">
                <p>No events found. Create your first event!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === "upcoming" && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled for the future</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <p>Loading events...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64 text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="space-y-4">{filteredEvents.map((event) => renderEventCard(event))}</div>
            ) : (
              <div className="flex justify-center items-center h-64 text-muted-foreground">
                <p>No upcoming events found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>View and manage event information</DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <Tabs defaultValue="details">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={selectedEvent.title}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-type">Type</Label>
                    <Select
                      value={selectedEvent.type}
                      onValueChange={(value) => setSelectedEvent({ ...selectedEvent, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Career">Career</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Guest Lecture">Guest Lecture</SelectItem>
                        <SelectItem value="Student Council">Student Council</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-organizer">Organizer</Label>
                    <Input
                      id="edit-organizer"
                      value={selectedEvent.organizer}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, organizer: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-facility">Facility</Label>
                    <Select
                      value={selectedEvent.facilityId}
                      onValueChange={(value) => setSelectedEvent({ ...selectedEvent, facilityId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select campus facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.id}>
                            {facility.name} ({facility.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={selectedEvent.location}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={selectedEvent.startDate}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-startTime">Start Time</Label>
                    <Input
                      id="edit-startTime"
                      type="time"
                      value={selectedEvent.startTime}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={selectedEvent.endDate}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, endDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-endTime">End Time</Label>
                    <Input
                      id="edit-endTime"
                      type="time"
                      value={selectedEvent.endTime}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, endTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={selectedEvent.status}
                      onValueChange={(value) => setSelectedEvent({ ...selectedEvent, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-attendees">Expected Attendees</Label>
                    <Input
                      id="edit-attendees"
                      type="number"
                      value={selectedEvent.attendees}
                      onChange={(e) =>
                        setSelectedEvent({ ...selectedEvent, attendees: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    rows={4}
                    value={selectedEvent.description}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateEvent} disabled={isEditingEvent}>
                    {isEditingEvent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </TabsContent>

              <TabsContent value="attendees" className="space-y-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="attendee-email">Add Attendee</Label>
                    <Input
                      id="attendee-email"
                      placeholder="Email address"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddAttendee}>Add</Button>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox
                            checked={selectedEvent.attendeesList?.length === selectedAttendees.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAttendees(selectedEvent.attendeesList?.map((a) => a.id) || [])
                              } else {
                                setSelectedAttendees([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEvent.attendeesList && selectedEvent.attendeesList.length > 0 ? (
                        selectedEvent.attendeesList.map((attendee) => (
                          <TableRow key={attendee.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedAttendees.includes(attendee.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedAttendees((prev) => [...prev, attendee.id])
                                  } else {
                                    setSelectedAttendees((prev) => prev.filter((id) => id !== attendee.id))
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>{attendee.name}</TableCell>
                            <TableCell>{attendee.email}</TableCell>
                            <TableCell>{attendee.role}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  attendee.status === "confirmed"
                                    ? "default"
                                    : attendee.status === "pending"
                                      ? "outline"
                                      : "destructive"
                                }
                              >
                                {attendee.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveAttendee(attendee.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No attendees added yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {selectedAttendees.length > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">{selectedAttendees.length} attendee(s) selected</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // In a real app, this would send emails to selected attendees
                          toast({
                            title: "Notification Sent",
                            description: `Notification sent to ${selectedAttendees.length} attendee(s)`,
                          })
                        }}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Notify Selected
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          // Remove selected attendees
                          if (selectedEvent.attendeesList) {
                            const updatedAttendeesList = selectedEvent.attendeesList.filter(
                              (a) => !selectedAttendees.includes(a.id),
                            )
                            setSelectedEvent({
                              ...selectedEvent,
                              attendeesList: updatedAttendeesList,
                              attendees: updatedAttendeesList.length,
                            })
                            setSelectedAttendees([])
                            toast({
                              title: "Attendees Removed",
                              description: "Selected attendees have been removed",
                            })
                          }
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Remove Selected
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Required Resources</h3>
                    <div className="space-y-2">
                      {[
                        "Projector",
                        "Microphone",
                        "Whiteboard",
                        "Laptop",
                        "Video Conference",
                        "Chairs",
                        "Tables",
                        "Refreshments",
                      ].map((resource) => (
                        <div key={resource} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-resource-${resource}`}
                            checked={selectedEvent.resources?.includes(resource)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedEvent({
                                  ...selectedEvent,
                                  resources: [...(selectedEvent.resources || []), resource],
                                })
                              } else {
                                setSelectedEvent({
                                  ...selectedEvent,
                                  resources: selectedEvent.resources?.filter((r) => r !== resource) || [],
                                })
                              }
                            }}
                          />
                          <Label htmlFor={`edit-resource-${resource}`}>{resource}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Documents</h3>
                    {selectedEvent.documents && selectedEvent.documents.length > 0 ? (
                      <div className="space-y-2">
                        {selectedEvent.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground border rounded-md">
                        <p>No documents uploaded</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        Upload Document
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedEvent.feedback && selectedEvent.feedback.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Feedback</h3>
                    <div className="space-y-2">
                      {selectedEvent.feedback.map((feedback, index) => (
                        <div key={index} className="p-3 border rounded-md">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{feedback.submittedBy}</p>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${i < feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm mt-1">{feedback.comments}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Submitted on {safeFormatDate(feedback.submittedAt, "PPP")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="announcements" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="announcement-title">Announcement Title</Label>
                    <Input
                      id="announcement-title"
                      placeholder="Enter announcement title"
                      value={newAnnouncement.title}
                      onChange={(e) =>
                        handleAnnouncementChange({
                          target: { id: "title", value: e.target.value },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="announcement-message">Message</Label>
                    <Textarea
                      id="announcement-message"
                      placeholder="Enter announcement message"
                      rows={4}
                      value={newAnnouncement.message}
                      onChange={(e) =>
                        handleAnnouncementChange({
                          target: { id: "message", value: e.target.value },
                        } as React.ChangeEvent<HTMLTextAreaElement>)
                      }
                    />
                  </div>
                  <div>
                    <Label>Recipients</Label>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sendToAll"
                          checked={newAnnouncement.sendToAll}
                          onCheckedChange={(checked) =>
                            handleAnnouncementCheckboxChange("sendToAll", checked as boolean)
                          }
                        />
                        <Label htmlFor="sendToAll">All users</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sendToAttendees"
                          checked={newAnnouncement.sendToAttendees}
                          onCheckedChange={(checked) =>
                            handleAnnouncementCheckboxChange("sendToAttendees", checked as boolean)
                          }
                        />
                        <Label htmlFor="sendToAttendees">Event attendees only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sendToFaculty"
                          checked={newAnnouncement.sendToFaculty}
                          onCheckedChange={(checked) =>
                            handleAnnouncementCheckboxChange("sendToFaculty", checked as boolean)
                          }
                        />
                        <Label htmlFor="sendToFaculty">Faculty members</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sendToStudents"
                          checked={newAnnouncement.sendToStudents}
                          onCheckedChange={(checked) =>
                            handleAnnouncementCheckboxChange("sendToStudents", checked as boolean)
                          }
                        />
                        <Label htmlFor="sendToStudents">Students</Label>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleSendAnnouncement}
                    disabled={isSendingAnnouncement || !newAnnouncement.title || !newAnnouncement.message}
                  >
                    {isSendingAnnouncement && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Announcement
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Previous Announcements</h3>
                  <ScrollArea className="h-[200px]">
                    {announcements.filter((a) => a.eventId === selectedEvent.id).length > 0 ? (
                      <div className="space-y-3">
                        {announcements
                          .filter((a) => a.eventId === selectedEvent.id)
                          .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
                          .map((announcement) => (
                            <div key={announcement.id} className="p-3 border rounded-md">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{announcement.title}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {safeFormatDate(announcement.sentAt, "PPp")}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{announcement.message}</p>
                              <div className="flex items-center mt-2">
                                <Megaphone className="h-3 w-3 mr-1 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                  Sent to: {announcement.sentTo.join(", ")} by {announcement.sentBy}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No announcements sent yet</p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

