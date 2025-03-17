"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  BookOpen,
  User,
  Calendar,
  MapPin,
  Users,
  Filter,
  CalendarClock,
  Loader2,
  Bell,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FacilityBooking } from "@/app/components/facility-booking"
import { ResourceReservation } from "@/app/components/resource-reservation"
import { api } from "@/app/services/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/contexts/auth-context"

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [eventFilter, setEventFilter] = useState("all")
  const { toast } = useToast()
  const { user } = useAuth()

  // State for student data
  const [studentProfile, setStudentProfile] = useState(null)
  const [scheduleEvents, setScheduleEvents] = useState([])
  const [assignments, setAssignments] = useState([])
  const [grades, setGrades] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [eventReminders, setEventReminders] = useState([])

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingSchedule, setLoadingSchedule] = useState(true)
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [loadingGrades, setLoadingGrades] = useState(true)
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingReminders, setLoadingReminders] = useState(true)

  // Error states
  const [error, setError] = useState(null)

  // Fetch student profile
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoadingProfile(true)
        // Assuming the first student in the list is the current user
        const students = await api.getStudents()
        if (students && students.length > 0) {
          setStudentProfile(students[0])
        }
      } catch (err) {
        console.error("Error fetching student profile:", err)
        setError("Failed to load student profile")
        toast({
          title: "Error",
          description: "Failed to load student profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchStudentProfile()
  }, [toast])

  // Fetch schedule events
  useEffect(() => {
    const fetchScheduleEvents = async () => {
      try {
        setLoadingSchedule(true)
        const events = await api.getScheduleEvents()
        setScheduleEvents(events)
      } catch (err) {
        console.error("Error fetching schedule:", err)
        toast({
          title: "Error",
          description: "Failed to load schedule. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoadingSchedule(false)
      }
    }

    fetchScheduleEvents()
  }, [toast])

  // Fetch events and registrations
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true)
        const events = await api.getEvents()

        // For demo purposes, mark some events as registered
        const eventsWithRegistration = events.map((event, index) => ({
          ...event,
          registered: index % 2 === 0, // Every other event is registered
          spots: `${Math.floor(Math.random() * 50) + 30}/${Math.floor(Math.random() * 50) + 80}`, // Random spots filled
        }))

        setUpcomingEvents(eventsWithRegistration)

        // Filter registered events
        const registered = eventsWithRegistration.filter((event) => event.registered)
        setRegisteredEvents(registered)
      } catch (err) {
        console.error("Error fetching events:", err)
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [toast])

  // Fetch event reminders and notifications
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoadingReminders(true)
        const notifications = await api.getScheduleNotifications(user?.id || "")

        // Transform notifications into reminders format
        const reminders = notifications.map((notification) => ({
          id: notification.id,
          eventId: `E${Math.floor(Math.random() * 1000)}`, // Mock event ID
          title: notification.title,
          message: notification.message,
          date: new Date(notification.date).toISOString().split("T")[0],
          time: new Date(notification.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: notification.isRead,
        }))

        setEventReminders(reminders)
      } catch (err) {
        console.error("Error fetching reminders:", err)
        toast({
          title: "Error",
          description: "Failed to load event reminders. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoadingReminders(false)
      }
    }

    if (user) {
      fetchReminders()
    }
  }, [toast, user])

  // Mock data for assignments, grades, and announcements (these would be API calls in a real app)
  useEffect(() => {
    // Simulate API calls with setTimeout
    setLoadingAssignments(true)
    setLoadingGrades(true)
    setLoadingAnnouncements(true)

    setTimeout(() => {
      // Mock assignments data
      setAssignments([
        {
          id: 1,
          course: "Computer Science 101",
          title: "Algorithm Analysis",
          dueDate: "2024-03-20",
          status: "pending",
        },
        {
          id: 2,
          course: "Database Systems",
          title: "SQL Project",
          dueDate: "2024-03-22",
          status: "in-progress",
        },
      ])
      setLoadingAssignments(false)

      // Mock grades data
      setGrades([
        {
          id: 1,
          course: "Data Structures",
          assignment: "Binary Trees Quiz",
          grade: "A",
          date: "2024-03-10",
        },
        {
          id: 2,
          course: "Computer Networks",
          assignment: "Protocol Design",
          grade: "B+",
          date: "2024-03-08",
        },
      ])
      setLoadingGrades(false)

      // Mock announcements data
      setAnnouncements([
        {
          id: 1,
          title: "Mid-Term Schedule Released",
          date: "2024-03-14",
          priority: "high",
        },
        {
          id: 2,
          title: "Campus Career Fair",
          date: "2024-03-16",
          priority: "medium",
        },
      ])
      setLoadingAnnouncements(false)
    }, 1000)
  }, [])

  // Filter events based on selected filter
  const filteredEvents =
    eventFilter === "all"
      ? upcomingEvents
      : upcomingEvents.filter((event) => event.type?.toLowerCase() === eventFilter.toLowerCase())

  // Handle event registration
  const handleEventRegistration = async (eventId, isRegistered) => {
    try {
      // Update UI optimistically
      setUpcomingEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === eventId ? { ...event, registered: !isRegistered } : event)),
      )

      // If registering, add to registered events
      if (!isRegistered) {
        const eventToAdd = upcomingEvents.find((event) => event.id === eventId)
        if (eventToAdd) {
          setRegisteredEvents((prev) => [...prev, { ...eventToAdd, registered: true }])
        }
      } else {
        // If unregistering, remove from registered events
        setRegisteredEvents((prev) => prev.filter((event) => event.id !== eventId))
      }

      // In a real app, you would call an API here
      // await api.registerForEvent(eventId, !isRegistered)

      toast({
        title: isRegistered ? "Registration Cancelled" : "Registration Successful",
        description: isRegistered
          ? "You have been removed from this event."
          : "You have successfully registered for this event.",
      })
    } catch (err) {
      console.error("Error updating registration:", err)

      // Revert UI changes on error
      setUpcomingEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === eventId ? { ...event, registered: isRegistered } : event)),
      )

      toast({
        title: "Error",
        description: "Failed to update registration. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle marking reminder as read
  const handleMarkReminderAsRead = async (reminderId) => {
    try {
      // Update UI optimistically
      setEventReminders((prevReminders) =>
        prevReminders.map((reminder) => (reminder.id === reminderId ? { ...reminder, read: true } : reminder)),
      )

      // In a real app, you would call an API here
      // await api.markReminderAsRead(reminderId)

      toast({
        title: "Reminder Updated",
        description: "Reminder marked as read.",
      })
    } catch (err) {
      console.error("Error updating reminder:", err)

      // Revert UI changes on error
      setEventReminders((prevReminders) =>
        prevReminders.map((reminder) => (reminder.id === reminderId ? { ...reminder, read: false } : reminder)),
      )

      toast({
        title: "Error",
        description: "Failed to update reminder. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Loading indicator for the entire dashboard
  if (loadingProfile && !studentProfile) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your academic portal.</p>
      </div>

      {/* Profile Summary */}
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
          <CardDescription>Your student information</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingProfile ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback>{studentProfile?.name?.charAt(0) || "S"}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="mt-2">
                  Change Photo
                </Button>
              </div>
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Student ID</h4>
                    <p className="font-medium">{studentProfile?.id || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Full Name</h4>
                    <p className="font-medium">{studentProfile?.name || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
                    <p className="font-medium">{studentProfile?.department || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Academic Year</h4>
                    <p className="font-medium">{studentProfile?.year || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <p className="font-medium">{studentProfile?.email || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">GPA</h4>
                    <p className="font-medium">{studentProfile?.gpa || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="outline" className="ml-auto" size="sm">
            <User className="mr-2 h-4 w-4" />
            View Full Profile
          </Button>
        </CardFooter>
      </Card>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Today's Schedule */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes for today</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSchedule ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : scheduleEvents.length > 0 ? (
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {scheduleEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {event.startTime} - {event.endTime}
                            </p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No classes scheduled for today.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Assignments */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>Deadlines approaching</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAssignments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : assignments.length > 0 ? (
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">{assignment.course}</p>
                            <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                          </div>
                          <Badge variant={assignment.status === "pending" ? "destructive" : "default"}>
                            {assignment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No upcoming assignments.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest academic updates</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingGrades ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : grades.length > 0 ? (
                <div className="space-y-4">
                  {grades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{grade.course}</h4>
                        <p className="text-sm text-muted-foreground">{grade.assignment}</p>
                        <p className="text-sm text-muted-foreground">Date: {grade.date}</p>
                      </div>
                      <Badge variant="outline" className="text-lg">
                        {grade.grade}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No recent activity to display.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Important Announcements</CardTitle>
              <CardDescription>Latest updates from your courses</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAnnouncements ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground">Posted: {announcement.date}</p>
                      </div>
                      <Badge variant={announcement.priority === "high" ? "destructive" : "default"}>
                        {announcement.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No announcements at this time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>Your weekly academic schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSchedule ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : scheduleEvents.length > 0 ? (
                <div className="space-y-4">
                  {scheduleEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.day}, {event.startTime} - {event.endTime}
                        </p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                        <Badge className="mt-2" variant="outline">
                          {event.type}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No schedule information available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Track your coursework and submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAssignments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">{assignment.course}</p>
                        <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={assignment.status === "pending" ? "destructive" : "default"}>
                          {assignment.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No assignments available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Grades</CardTitle>
              <CardDescription>View your academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingGrades ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : grades.length > 0 ? (
                <div className="space-y-4">
                  {grades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{grade.course}</h4>
                        <p className="text-sm text-muted-foreground">{grade.assignment}</p>
                        <p className="text-sm text-muted-foreground">Date: {grade.date}</p>
                      </div>
                      <Badge variant="outline" className="text-lg">
                        {grade.grade}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No grades available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Upcoming Campus Events */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Upcoming Campus Events</CardTitle>
                  <CardDescription>Workshops, guest lectures, and student club activities</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="workshop">Workshops</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingEvents ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredEvents.length > 0 ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {filteredEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{event.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                {event.startDate} • {event.startTime} - {event.endTime}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                event.type === "Workshop"
                                  ? "default"
                                  : event.type === "Academic"
                                    ? "secondary"
                                    : event.type === "Career"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {event.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex items-start gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                          <div className="flex items-start gap-2 mb-3">
                            <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="text-sm">
                              Organized by {event.organizer} • {event.spots || `${event.attendees}/200`} spots filled
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/50 px-6 py-3">
                          <div className="flex justify-between items-center w-full">
                            <div className="text-sm font-medium">
                              {event.registered ? "You're registered" : "Registration open"}
                            </div>
                            <Button
                              variant={event.registered ? "destructive" : "default"}
                              size="sm"
                              onClick={() => handleEventRegistration(event.id, event.registered)}
                            >
                              {event.registered ? "Cancel Registration" : "Register Now"}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No events found matching your filter criteria.</p>
                  <Button className="mt-4" variant="outline" onClick={() => setEventFilter("all")}>
                    View All Events
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Registration & RSVP */}
          <Card>
            <CardHeader>
              <CardTitle>Your Event Registrations</CardTitle>
              <CardDescription>Manage your event RSVPs</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingEvents ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : registeredEvents.length > 0 ? (
                <div className="space-y-4">
                  {registeredEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {event.startDate || event.date} • {event.startTime || event.time}
                          </p>
                          <p className="text-sm text-muted-foreground">{event.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Add to Calendar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleEventRegistration(event.id, true)}>
                          Cancel RSVP
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>You haven't registered for any upcoming events yet.</p>
                  <Button className="mt-4" variant="outline" onClick={() => setActiveTab("events")}>
                    Browse Events
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Reminders & Notifications */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Event Reminders & Notifications</CardTitle>
                  <CardDescription>Personalized alerts for your registered events</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="notifications" className="text-sm">
                    Notifications
                  </Label>
                  <Switch id="notifications" defaultChecked />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingReminders ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : eventReminders.length > 0 ? (
                <div className="space-y-4">
                  {eventReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`flex items-start justify-between p-4 border rounded-lg ${!reminder.read ? "bg-muted/50 border-primary/20" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`rounded-full p-2 ${!reminder.read ? "bg-primary/10" : "bg-muted"}`}>
                          <CalendarClock
                            className={`h-5 w-5 ${!reminder.read ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {reminder.title}
                            {!reminder.read && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{reminder.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {reminder.date} at {reminder.time}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleMarkReminderAsRead(reminder.id)}>
                        {reminder.read ? "Delete" : "Mark as Read"}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No event reminders at this time.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email-reminders" className="text-sm">
                    Email Reminders
                  </Label>
                  <Switch id="email-reminders" defaultChecked />
                </div>
                <Button variant="outline" size="sm">
                  Notification Settings
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="facilities">
          <FacilityBooking />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceReservation />
        </TabsContent>
      </Tabs>
    </div>
  )
}

