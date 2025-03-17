"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Clock, MapPin, Users, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { apiService } from "../../services/api-service" // This should be correct
import { format, parseISO } from "date-fns"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function EventsModule() {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const events = await apiService.getEvents()

        const upcoming = events
          .filter((event) => new Date(event.startDate) >= new Date())
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 3) // Get only the next 3 events

        setUpcomingEvents(upcoming)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Get event type badge variant
  const getEventTypeBadge = (type: string) => {
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

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event)
    setIsViewDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events Management</h2>
        <Link href="/dashboard/events">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Manage Events
          </Button>
        </Link>
      </div>

      <p className="text-muted-foreground">
        Plan, announce, and manage campus events including seminars, guest lectures, and student council meetings.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant={getEventTypeBadge(event.type)}>{event.type}</Badge>
                </div>
                <CardDescription>{event.organizer}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(parseISO(event.startDate), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/events" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 border rounded-md">
            <p className="text-muted-foreground">No upcoming events found</p>
            <Link href="/dashboard/events">
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link href="/dashboard/events">
          <Button variant="link">View All Events</Button>
        </Link>
      </div>

      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>Detailed information about the selected event.</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-2">{selectedEvent.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Title:</div>
                <div className="col-span-2">{selectedEvent.title || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Type:</div>
                <div className="col-span-2">{selectedEvent.type || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Description:</div>
                <div className="col-span-2">{selectedEvent.description || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Organizer:</div>
                <div className="col-span-2">{selectedEvent.organizer || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Location:</div>
                <div className="col-span-2">{selectedEvent.location || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Start Date:</div>
                <div className="col-span-2">{selectedEvent.startDate || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Start Time:</div>
                <div className="col-span-2">{selectedEvent.startTime || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">End Date:</div>
                <div className="col-span-2">{selectedEvent.endDate || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">End Time:</div>
                <div className="col-span-2">{selectedEvent.endTime || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Attendees:</div>
                <div className="col-span-2">{selectedEvent.attendees || 0}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-2">{selectedEvent.status || "N/A"}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

