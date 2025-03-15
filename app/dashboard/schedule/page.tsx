"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  CalendarIcon,
  Clock,
  Search,
  Bell,
  BookOpen,
  Users,
  MapPin,
  AlertCircle,
  Filter,
  CalendarPlus2Icon as CalendarIcon2,
  CheckCircle2,
  XCircle,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/contexts/auth-context"
import { api } from "@/app/services/api"
import { format, addDays } from "date-fns"

// Import the CreateScheduleForm component at the top of the file
import { CreateScheduleForm } from "./create-schedule-form"

// Define interfaces for our data types
interface ScheduleEvent {
  id: string
  title: string
  courseCode: string
  instructor: string
  location: string
  day: string
  startTime: string
  endTime: string
  type: "Lecture" | "Lab" | "Tutorial" | "Exam" | "Other"
}

interface Course {
  id: string
  code: string
  name: string
  instructor: string
  credits: number
  schedule: {
    day: string
    startTime: string
    endTime: string
    location: string
    type: "Lecture" | "Lab" | "Tutorial"
  }[]
  capacity: number
  enrolled: number
  status: "Open" | "Closed" | "Waitlist"
  description?: string
  prerequisites?: string[]
  department?: string
}

interface ScheduleNotification {
  id: string
  title: string
  message: string
  date: string
  isRead: boolean
  type: "Cancellation" | "Reschedule" | "RoomChange" | "NewClass" | "Reminder" | "Registration"
}

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDay, setSelectedDay] = useState<string>(getDayName(new Date()))
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([])
  const [notifications, setNotifications] = useState<ScheduleNotification[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [filterCredits, setFilterCredits] = useState<string>("all")
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [weekView, setWeekView] = useState(false)
  const [weekStartDate, setWeekStartDate] = useState<Date>(getStartOfWeek(new Date()))

  const { user } = useAuth()
  const { toast } = useToast()

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

  // Mock data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all schedule data from the API
        const [eventsData, notificationsData, coursesData, registeredCoursesData] = await Promise.all([
          api.getScheduleEvents().catch((error) => {
            console.error("Failed to fetch schedule events:", error)
            toast({
              title: "Error",
              description: "Failed to load schedule events. Please try again.",
              variant: "destructive",
            })
            return []
          }),
          api.getScheduleNotifications(user?.id || "").catch((error) => {
            console.error("Failed to fetch notifications:", error)
            return []
          }),
          api.getCourses().catch((error) => {
            console.error("Failed to fetch courses:", error)
            return []
          }),
          api.getStudentEnrollments(user?.id || "").catch((error) => {
            console.error("Failed to fetch enrollments:", error)
            return []
          }),
        ])

        // Only update state if the component is still mounted
        setScheduleEvents(eventsData)
        setNotifications(notificationsData)

        // Transform courses data to match our Course interface
        const availableCourses = coursesData.map((course) => ({
          id: course.id,
          code: course.id,
          name: course.name,
          instructor: course.instructor,
          credits: course.credits,
          schedule: generateCourseSchedule(course),
          capacity: course.students + 10,
          enrolled: course.students,
          status: course.status === "Active" ? "Open" : "Closed",
          department: course.department,
          description: `Course in ${course.department} taught by ${course.instructor}.`,
          prerequisites: [],
        }))

        // Filter out courses the student is already enrolled in
        const enrolledCourseIds = registeredCoursesData.map((enrollment) => enrollment.courseId)
        const availableCoursesFiltered = availableCourses.filter((course) => !enrolledCourseIds.includes(course.id))

        // Transform enrollments to registered courses
        const registeredCourses = await Promise.all(
          registeredCoursesData.map(async (enrollment) => {
            try {
              const courseDetails = await api.getCourse(enrollment.courseId)
              return {
                id: courseDetails.id,
                code: courseDetails.id,
                name: courseDetails.name,
                instructor: courseDetails.instructor,
                credits: courseDetails.credits,
                schedule: generateCourseSchedule(courseDetails),
                capacity: courseDetails.students + 10,
                enrolled: courseDetails.students,
                status: "Open",
                department: courseDetails.department,
                description: `Course in ${courseDetails.department} taught by ${courseDetails.instructor}.`,
                prerequisites: [],
              }
            } catch (error) {
              console.error(`Failed to fetch course details for ${enrollment.courseId}:`, error)
              return null
            }
          }),
        )

        setAvailableCourses(availableCoursesFiltered)
        setRegisteredCourses(registeredCourses.filter(Boolean))
      } catch (error) {
        console.error("Failed to load schedule data:", error)
        toast({
          title: "Error",
          description: "Failed to load schedule data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast, user?.id])

  // Add this helper function after the useEffect
  // Helper function to generate course schedule
  function generateCourseSchedule(course: any) {
    const days = ["Monday", "Wednesday", "Friday", "Tuesday", "Thursday"]
    const startTimes = ["09:00", "11:00", "13:00", "15:00"]
    const endTimes = ["10:30", "12:30", "14:30", "16:30"]
    const locations = [
      "Science Building, Room 101",
      "Science Building, Room 102",
      "Math Building, Room 201",
      "Arts Building, Room 105",
    ]
    const types: ("Lecture" | "Lab" | "Tutorial")[] = ["Lecture", "Lab", "Tutorial"]

    // Generate 1-3 schedule slots based on course ID
    const numSlots = (Number.parseInt(course.id.replace(/\D/g, "")) % 3) + 1
    const schedule = []

    for (let i = 0; i < numSlots; i++) {
      const dayIndex = (Number.parseInt(course.id.replace(/\D/g, "")) + i) % days.length
      const timeIndex = (Number.parseInt(course.id.replace(/\D/g, "")) + i) % startTimes.length
      const locationIndex = (Number.parseInt(course.id.replace(/\D/g, "")) + i) % locations.length
      const typeIndex = i === 1 ? 1 : i === 2 ? 2 : 0 // First slot is lecture, second is lab, third is tutorial

      schedule.push({
        day: days[dayIndex],
        startTime: startTimes[timeIndex],
        endTime: endTimes[timeIndex],
        location: locations[locationIndex],
        type: types[typeIndex],
      })
    }

    return schedule
  }

  // Filter events for the selected day
  const filteredEvents = useMemo(() => {
    return scheduleEvents.filter((event) => event.day === selectedDay)
  }, [scheduleEvents, selectedDay])

  // Sort events by start time
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime)
    })
  }, [filteredEvents])

  // Filter available courses based on search query and filters
  const filteredCourses = useMemo(() => {
    return availableCourses.filter((course) => {
      const matchesSearch =
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDepartment = filterDepartment === "all" || course.department === filterDepartment
      const matchesCredits = filterCredits === "all" || course.credits.toString() === filterCredits

      return matchesSearch && matchesDepartment && matchesCredits
    })
  }, [availableCourses, searchQuery, filterDepartment, filterCredits])

  // Get all departments from available courses
  const departments = useMemo(() => {
    const depts = new Set<string>()
    availableCourses.forEach((course) => {
      if (course.department) depts.add(course.department)
    })
    return Array.from(depts)
  }, [availableCourses])

  // Get all credit options from available courses
  const creditOptions = useMemo(() => {
    const credits = new Set<number>()
    availableCourses.forEach((course) => {
      credits.add(course.credits)
    })
    return Array.from(credits).sort((a, b) => a - b)
  }, [availableCourses])

  // Handle day selection when calendar date changes
  function handleDateChange(date: Date | undefined) {
    setDate(date)
    if (date) {
      setSelectedDay(getDayName(date))
    }
  }

  // Get day name from date
  function getDayName(date: Date): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[date.getDay()]
  }

  // Handle course selection for registration
  function handleCourseSelection(courseId: string) {
    setSelectedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId)
      } else {
        return [...prev, courseId]
      }
    })
  }

  // Update the handleRegisterCourses function to use the API
  // Replace the current handleRegisterCourses function with this implementation:

  // Handle course registration
  function handleRegisterCourses() {
    setIsRegistering(true)

    // Get the course IDs to register
    const courseIds = selectedCourses

    // Call the API to check for conflicts
    api
      .checkScheduleConflicts(user?.id || "", courseIds)
      .then((hasConflicts) => {
        if (hasConflicts) {
          toast({
            title: "Schedule Conflict",
            description: "One or more selected courses conflict with your existing schedule.",
            variant: "destructive",
          })
          setIsRegistering(false)
          return
        }

        // No conflicts, proceed with registration
        return api.registerForCourses(user?.id || "", courseIds).then((success) => {
          if (success) {
            // Find the selected courses
            const coursesToRegister = availableCourses.filter((course) => selectedCourses.includes(course.id))

            // Add them to registered courses
            setRegisteredCourses((prev) => [...prev, ...coursesToRegister])

            // Remove them from available courses
            setAvailableCourses((prev) => prev.filter((course) => !selectedCourses.includes(course.id)))

            // Add registration notification
            const newNotification: ScheduleNotification = {
              id: `SCHNOT${Date.now()}`,
              title: "Course Registration Successful",
              message: `You have successfully registered for ${coursesToRegister.length} course(s): ${coursesToRegister.map((c) => c.code).join(", ")}`,
              date: new Date().toISOString(),
              isRead: false,
              type: "Registration",
            }

            setNotifications((prev) => [newNotification, ...prev])

            // Clear selection
            setSelectedCourses([])

            // Show success message
            toast({
              title: "Success",
              description: `Successfully registered for ${coursesToRegister.length} course(s).`,
            })
          } else {
            toast({
              title: "Error",
              description: "Failed to register for courses. Please try again.",
              variant: "destructive",
            })
          }
        })
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "An error occurred while processing your registration. Please try again.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsRegistering(false)
      })
  }

  // Check for schedule conflicts
  function checkScheduleConflicts(newCourses: Course[], existingCourses: Course[]): boolean {
    // Combine all schedule slots from existing courses
    const existingSchedule = existingCourses.flatMap((course) => course.schedule)

    // Check each new course's schedule against existing schedule
    for (const newCourse of newCourses) {
      for (const newSlot of newCourse.schedule) {
        for (const existingSlot of existingSchedule) {
          if (newSlot.day === existingSlot.day) {
            // Convert times to minutes for easier comparison
            const newStart = timeToMinutes(newSlot.startTime)
            const newEnd = timeToMinutes(newSlot.endTime)
            const existingStart = timeToMinutes(existingSlot.startTime)
            const existingEnd = timeToMinutes(existingSlot.endTime)

            // Check for overlap
            if (
              (newStart >= existingStart && newStart < existingEnd) ||
              (newEnd > existingStart && newEnd <= existingEnd) ||
              (newStart <= existingStart && newEnd >= existingEnd)
            ) {
              return true // Conflict found
            }
          }
        }
      }
    }

    return false // No conflicts
  }

  // Convert time string (HH:MM) to minutes
  function timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Handle marking notification as read
  function handleMarkAsRead(id: string) {
    api
      .markScheduleNotificationAsRead(id)
      .then((updatedNotification) => {
        setNotifications((prev) =>
          prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
        )
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to mark notification as read.",
          variant: "destructive",
        })
      })
  }

  // View course details
  function viewCourseDetails(course: Course) {
    setSelectedCourseDetails(course)
  }

  // Navigate to previous week
  function previousWeek() {
    setWeekStartDate((prevDate) => addDays(prevDate, -7))
  }

  // Navigate to next week
  function nextWeek() {
    setWeekStartDate((prevDate) => addDays(prevDate, 7))
  }

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Move renderScheduleCell inside the component
  function renderScheduleCell(day: string, timeSlot: string) {
    // Extract the start time from the time slot (e.g., "8:00 - 8:50" -> "8:00")
    const slotStartTime = timeSlot.split(" - ")[0]

    // Find events that match this day and time slot
    const events = scheduleEvents.filter((event) => {
      return event.day === day && event.startTime === slotStartTime
    })

    if (events.length === 0) return null

    return events.map((event) => (
      <div key={event.id} className="p-1 text-xs rounded-md bg-primary/10 dark:bg-primary/20">
        <div className="font-medium">{event.title}</div>
        <div className="text-muted-foreground">{event.location}</div>
      </div>
    ))
  }

  // Move renderWeeklyEvents inside the component
  function renderWeeklyEvents(day: string) {
    return scheduleEvents
      .filter((event) => event.day === day)
      .map((event) => {
        // Convert event time to position
        const startHour = Number.parseInt(event.startTime.split(":")[0])
        const startMinute = Number.parseInt(event.startTime.split(":")[1])
        const duration = 50 // assuming 50-minute classes

        const top = (startHour - 8) * 64 + (startMinute / 60) * 64 // 64px is the height of a time slot

        return (
          <div
            key={event.id}
            className={`absolute left-0 right-0 mx-1 p-1 rounded-md ${getEventTypeColor(event.type)} text-white`}
            style={{
              top: `${top}px`,
              height: `${(duration / 60) * 64}px`,
            }}
          >
            <div className="text-xs font-medium truncate">{event.title}</div>
            <div className="text-xs truncate">{event.location}</div>
          </div>
        )
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Schedule</h1>
          <p className="text-muted-foreground">
            Manage your class schedule, register for courses, and view notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateScheduleForm
            onScheduleCreated={(newSchedule) => {
              // Add the new schedule to the scheduleEvents state
              setScheduleEvents((prev) => [...prev, newSchedule])

              // Update the selected day if it matches the new schedule's day
              if (newSchedule.day === selectedDay) {
                // Force a re-render by updating the state
                setSelectedDay(selectedDay)
              }

              // Show a notification about the new schedule
              const newNotification = {
                id: `SCHNOT${Date.now()}`,
                title: "New Schedule Created",
                message: `A new ${newSchedule.type.toLowerCase()} has been added to your schedule: ${newSchedule.title}`,
                date: new Date().toISOString(),
                isRead: false,
                type: "NewClass",
              }

              setNotifications((prev) => [newNotification, ...prev])
            }}
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule Notifications</DialogTitle>
                <DialogDescription>Stay updated with changes to your academic schedule</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4 mt-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg ${notification.isRead ? "bg-background" : "bg-muted"}`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${getNotificationIconColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{notification.title}</h4>
                              <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                            </div>
                            <p className="text-sm mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Weekly Schedule
          </TabsTrigger>
          <TabsTrigger value="registration">
            <BookOpen className="h-4 w-4 mr-2" />
            Course Registration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setWeekView(!weekView)}>
              {weekView ? "Day View" : "Week View"}
            </Button>
          </div>

          {weekView ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <CardDescription>
                    {format(weekStartDate, "MMMM d, yyyy")} - {format(addDays(weekStartDate, 6), "MMMM d, yyyy")}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={previousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-8 gap-2">
                      <div className="sticky left-0 bg-background z-10">
                        <div className="h-12"></div>
                        {generateTimeSlots().map((timeSlot) => (
                          <div
                            key={timeSlot}
                            className="h-16 border-t flex items-center justify-end pr-2 text-sm text-muted-foreground"
                          >
                            {timeSlot}
                          </div>
                        ))}
                      </div>

                      {weekDates.map((date, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="h-12 flex flex-col items-center justify-center border-b">
                            <div className="text-sm font-medium">{format(date, "EEE")}</div>
                            <div className="text-xs text-muted-foreground">{format(date, "MMM d")}</div>
                          </div>
                          <div className="relative">
                            {generateTimeSlots().map((timeSlot) => (
                              <div key={timeSlot} className="h-16 border-t border-r"></div>
                            ))}

                            {renderWeeklyEvents(getDayName(date))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-3">
              <Card className="col-span-3 md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view your schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={date} onSelect={handleDateChange} className="rounded-md border" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">Selected Day</p>
                    <p className="text-lg font-bold">{selectedDay}</p>
                  </div>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </CardFooter>
              </Card>

              <Card className="col-span-4 md:col-span-5 lg:col-span-2 dark:bg-gray-900">
                <CardHeader>
                  <CardTitle>Daily Schedule - {selectedDay}</CardTitle>
                  <CardDescription>Your classes and academic activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-[400px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : sortedEvents.length > 0 ? (
                    <div className="space-y-4">
                      {sortedEvents.map((event) => (
                        <div key={event.id} className="flex border rounded-lg overflow-hidden">
                          <div className={`w-2 ${getEventTypeColor(event.type)}`}></div>
                          <div className="p-4 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h3 className="font-semibold">{event.title}</h3>
                                <p className="text-sm text-muted-foreground">{event.courseCode}</p>
                              </div>
                              <Badge variant="outline">{event.type}</Badge>
                            </div>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                {event.startTime} - {event.endTime}
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                {event.location}
                              </div>
                              <div className="flex items-center text-sm sm:col-span-2">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                {event.instructor}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <CalendarIcon2 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg">No Classes Scheduled</h3>
                      <p className="text-muted-foreground">You don't have any classes scheduled for {selectedDay}.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>Your complete weekly schedule at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-800">
                      <TableHead className="w-[100px] dark:text-gray-400">Time</TableHead>
                      <TableHead className="dark:text-gray-400">Monday</TableHead>
                      <TableHead className="dark:text-gray-400">Tuesday</TableHead>
                      <TableHead className="dark:text-gray-400">Wednesday</TableHead>
                      <TableHead className="dark:text-gray-400">Thursday</TableHead>
                      <TableHead className="dark:text-gray-400">Friday</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generateTimeSlots().map((timeSlot) => (
                      <TableRow key={timeSlot} className="dark:border-gray-800">
                        <TableCell className="font-medium dark:text-gray-400">{timeSlot}</TableCell>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                          <TableCell key={day} className="dark:border-gray-800">
                            {renderScheduleCell(day, timeSlot)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registration" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Available Courses</CardTitle>
                <CardDescription>Browse and register for available courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>

                  {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                      <div>
                        <label className="text-sm font-medium">Department</label>
                        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Departments" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Credits</label>
                        <Select value={filterCredits} onValueChange={setFilterCredits}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Credits" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Credits</SelectItem>
                            {creditOptions.map((credit) => (
                              <SelectItem key={credit} value={credit.toString()}>
                                {credit} Credits
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-md border mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedCourses.includes(course.id)}
                                onCheckedChange={() => handleCourseSelection(course.id)}
                                disabled={course.status === "Closed"}
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{course.code}</p>
                                <p className="text-sm text-muted-foreground">{course.name}</p>
                              </div>
                            </TableCell>
                            <TableCell>{course.instructor}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {course.schedule.map((slot, index) => (
                                  <div key={index} className="text-sm">
                                    <span className="font-medium">{slot.day}:</span> {slot.startTime} - {slot.endTime}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{course.credits}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(course.status)}>{course.status}</Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {course.enrolled}/{course.capacity} enrolled
                              </p>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => viewCourseDetails(course)}>
                                <Info className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No courses found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">{selectedCourses.length} course(s) selected</p>
                  <Button onClick={handleRegisterCourses} disabled={selectedCourses.length === 0 || isRegistering}>
                    {isRegistering && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                    )}
                    Register for Selected Courses
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Registration</CardTitle>
                <CardDescription>Your registered courses for this semester</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : registeredCourses.length > 0 ? (
                  <div className="space-y-4">
                    {registeredCourses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{course.code}</h3>
                            <p className="text-sm">{course.name}</p>
                          </div>
                          <Badge>{course.credits} credits</Badge>
                        </div>
                        <Separator className="my-2" />
                        <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
                        <div className="mt-2 space-y-1">
                          {course.schedule.map((slot, index) => (
                            <div key={index} className="text-sm flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${getEventTypeColor(slot.type)}`}></div>
                              <span className="font-medium">{slot.day}:</span> {slot.startTime} - {slot.endTime} (
                              {slot.location})
                            </div>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2" onClick={() => viewCourseDetails(course)}>
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg">No Registered Courses</h3>
                    <p className="text-muted-foreground">You haven't registered for any courses yet.</p>
                  </div>
                )}

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Registration Deadline</AlertTitle>
                  <AlertDescription>Course registration for this semester closes on April 15, 2025.</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Course Details Dialog */}
      <Dialog open={!!selectedCourseDetails} onOpenChange={(open) => !open && setSelectedCourseDetails(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCourseDetails?.code}: {selectedCourseDetails?.name}
            </DialogTitle>
            <DialogDescription>Course details and information</DialogDescription>
          </DialogHeader>

          {selectedCourseDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Department</h4>
                  <p className="text-sm">{selectedCourseDetails.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Credits</h4>
                  <p className="text-sm">{selectedCourseDetails.credits}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Instructor</h4>
                  <p className="text-sm">{selectedCourseDetails.instructor}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <Badge variant={getStatusVariant(selectedCourseDetails.status)}>{selectedCourseDetails.status}</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm">{selectedCourseDetails.description}</p>
              </div>

              {selectedCourseDetails.prerequisites && selectedCourseDetails.prerequisites.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">Prerequisites</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedCourseDetails.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="outline">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium">Schedule</h4>
                <div className="space-y-2 mt-1">
                  {selectedCourseDetails.schedule.map((slot, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getEventTypeColor(slot.type)}`}></div>
                      <span className="font-medium">{slot.day}:</span> {slot.startTime} - {slot.endTime} (
                      {slot.location}) - {slot.type}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium">Enrollment</h4>
                <div className="w-full bg-secondary h-2 rounded-full mt-2">
                  <div
                    className={`h-2 rounded-full ${selectedCourseDetails.enrolled / selectedCourseDetails.capacity > 0.8 ? "bg-destructive" : "bg-primary"}`}
                    style={{ width: `${(selectedCourseDetails.enrolled / selectedCourseDetails.capacity) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCourseDetails.enrolled} of {selectedCourseDetails.capacity} seats filled
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper functions that don't need access to component state can remain outside
function generateTimeSlots() {
  const slots = []
  for (let hour = 8; hour <= 18; hour++) {
    slots.push(`${hour}:00 - ${hour}:50`)
  }
  return slots
}

function getEventTypeColor(type: string) {
  switch (type) {
    case "Lecture":
      return "bg-blue-500 dark:bg-blue-600"
    case "Lab":
      return "bg-green-500 dark:bg-green-600"
    case "Tutorial":
      return "bg-purple-500 dark:bg-purple-600"
    case "Exam":
      return "bg-red-500 dark:bg-red-600"
    default:
      return "bg-gray-500 dark:bg-gray-600"
  }
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Open":
      return "success"
    case "Closed":
      return "destructive"
    case "Waitlist":
      return "warning"
    default:
      return "default"
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "Cancellation":
      return <XCircle className="h-4 w-4" />
    case "Reschedule":
      return <Clock className="h-4 w-4" />
    case "RoomChange":
      return <MapPin className="h-4 w-4" />
    case "NewClass":
      return <BookOpen className="h-4 w-4" />
    case "Reminder":
      return <Bell className="h-4 w-4" />
    case "Registration":
      return <CheckCircle2 className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

function getNotificationIconColor(type: string) {
  switch (type) {
    case "Cancellation":
      return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
    case "Reschedule":
      return "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
    case "RoomChange":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
    case "NewClass":
      return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
    case "Reminder":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
    case "Registration":
      return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
  }
}

// Fix the formatDate function to handle invalid date values
function formatDate(dateString: string | undefined | null) {
  if (!dateString) {
    return "Unknown date"
  }

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", error, "Date string:", dateString)
    return "Invalid date"
  }
}

