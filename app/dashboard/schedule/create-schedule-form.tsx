"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect, useRef } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Check, ChevronsUpDown, AlertCircle, Clock, Search, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/services/api"
import type { Facility, ScheduleEvent, Course, Lecturer } from "@/app/types"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import React from "react"

// Update the form schema to remove courseCode
const formSchema = z.object({
  courseId: z.string().min(1, { message: "Course is required" }),
  lecturer: z.string().min(1, { message: "Lecturer is required" }),
  facilityId: z.string().min(1, { message: "Facility is required" }),
  day: z.string().min(3, { message: "Day is required" }),
  startTime: z.string().min(3, { message: "Start time is required" }),
  endTime: z.string().min(3, { message: "End time is required" }),
  type: z.string().min(3, { message: "Type is required" }),
})

// Define the props for the component
interface CreateScheduleFormProps {
  onScheduleCreated: (schedule: any) => void
}

// Interface for facility with availability status
interface FacilityWithStatus extends Facility {
  available: boolean
  conflictReason?: string
}

// Simple course selector component
function CourseSelector({
  courses,
  value,
  onChange,
}: {
  courses: Course[]
  value: string
  onChange: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.department && course.department.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Get selected course details
  const selectedCourse = courses.find((course) => course.id === value)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Clear course selection
  const clearCourseSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Selected course display / trigger button */}
      <div
        className={cn(
          "flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCourse ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span>{selectedCourse.name}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-muted">{selectedCourse.code}</span>
            </div>
            <X
              className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
              onClick={clearCourseSelection}
              aria-label="Clear course selection"
            />
          </div>
        ) : (
          <span className="text-muted-foreground">Select course</span>
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md">
          {/* Search input */}
          <div className="flex items-center border-b p-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchTerm("")
                }}
              />
            )}
          </div>

          {/* Course list */}
          <div className="max-h-[300px] overflow-y-auto py-1" tabIndex={-1}>
            {filteredCourses.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No courses found.</div>
            ) : (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    course.id === value && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => {
                    onChange(course.id)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span>{course.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-md bg-muted">{course.code}</span>
                    </div>
                    {course.department && <span className="text-xs text-muted-foreground">{course.department}</span>}
                  </div>
                  {course.id === value && <Check className="h-4 w-4 ml-2" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function CreateScheduleForm({ onScheduleCreated }: CreateScheduleFormProps) {
  const [open, setOpen] = useState(false)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [facilitiesWithStatus, setFacilitiesWithStatus] = useState<FacilityWithStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [facilityOpen, setFacilityOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [checking, setChecking] = useState(false)
  const [selectedFacilityConflict, setSelectedFacilityConflict] = useState<string | null>(null)
  const { toast } = useToast()
  const [scheduleCache, setScheduleCache] = useState<{
    [key: string]: ScheduleEvent[]
  }>({})
  const [courses, setCourses] = useState<Course[]>([])
  const [lecturers, setLecturers] = useState<Lecturer[]>([])

  // Lecturer selector state
  const [isLecturerDropdownOpen, setIsLecturerDropdownOpen] = useState(false)
  const [lecturerSearchTerm, setLecturerSearchTerm] = useState("")
  const lecturerContainerRef = useRef<HTMLDivElement>(null)

  // Add this with the other refs
  const facilityContainerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close facility dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (facilityContainerRef.current && !facilityContainerRef.current.contains(event.target as Node)) {
        setFacilityOpen(false)
      }
    }

    if (facilityOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [facilityOpen])

  // Handle click outside to close lecturer dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (lecturerContainerRef.current && !lecturerContainerRef.current.contains(event.target as Node)) {
        setIsLecturerDropdownOpen(false)
      }
    }

    if (isLecturerDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isLecturerDropdownOpen])

  // Fetch lecturers when component mounts
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        // Check if getLecturers method exists
        if (typeof api.getLecturers === "function") {
          const lecturersData = await api.getLecturers()
          setLecturers(lecturersData)
        } else {
          console.warn("api.getLecturers is not implemented, using fallback data")
          // Provide fallback data
          const fallbackLecturers = [
            { id: "L001", name: "Dr. John Smith", department: "Computer Science", position: "Professor" },
            { id: "L002", name: "Dr. Sarah Johnson", department: "Mathematics", position: "Associate Professor" },
            { id: "L003", name: "Prof. Michael Brown", department: "Physics", position: "Assistant Professor" },
            { id: "L004", name: "Dr. Emily Davis", department: "Engineering", position: "Senior Lecturer" },
            { id: "L005", name: "Dr. Robert Wilson", department: "Computer Science", position: "Lecturer" },
          ]
          setLecturers(fallbackLecturers)
        }
      } catch (error) {
        console.error("Failed to fetch lecturers:", error)
        // Provide fallback data in case of error
        const fallbackLecturers = [
          { id: "L001", name: "Dr. John Smith", department: "Computer Science", position: "Professor" },
          { id: "L002", name: "Dr. Sarah Johnson", department: "Mathematics", position: "Associate Professor" },
          { id: "L003", name: "Prof. Michael Brown", department: "Physics", position: "Assistant Professor" },
        ]
        setLecturers(fallbackLecturers)
        toast({
          title: "Warning",
          description: "Using sample lecturer data. Some features may be limited.",
          variant: "default",
        })
      }
    }

    fetchLecturers()
  }, [toast])

  // Initialize the form with the new courseId field
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      lecturer: "",
      facilityId: "",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      type: "Lecture",
    },
  })

  // Fetch facilities when component mounts
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true)
        // Check if getFacilities method exists
        if (typeof api.getFacilities === "function") {
          const facilitiesData = await api.getFacilities()
          setFacilities(facilitiesData)
          // Initialize all facilities as available
          setFacilitiesWithStatus(
            facilitiesData.map((facility) => ({
              ...facility,
              available: true,
            })),
          )
        } else {
          console.warn("api.getFacilities is not implemented, using fallback data")
          // Provide fallback data
          const fallbackFacilities = [
            { id: "F001", name: "Main Lecture Hall", code: "MLH", type: "Lecture Hall", capacity: 200 },
            { id: "F002", name: "Computer Lab A", code: "CLA", type: "Laboratory", capacity: 50 },
            { id: "F003", name: "Seminar Room 101", code: "SR101", type: "Seminar Room", capacity: 30 },
            { id: "F004", name: "Physics Lab", code: "PLAB", type: "Laboratory", capacity: 40 },
            { id: "F005", name: "Conference Room", code: "CONF", type: "Meeting Room", capacity: 20 },
          ]
          setFacilities(fallbackFacilities)
          // Initialize all facilities as available
          setFacilitiesWithStatus(
            fallbackFacilities.map((facility) => ({
              ...facility,
              available: true,
            })),
          )
        }
      } catch (error) {
        console.error("Failed to fetch facilities:", error)
        // Provide fallback data in case of error
        const fallbackFacilities = [
          { id: "F001", name: "Main Lecture Hall", code: "MLH", type: "Lecture Hall", capacity: 200 },
          { id: "F002", name: "Computer Lab A", code: "CLA", type: "Laboratory", capacity: 50 },
          { id: "F003", name: "Seminar Room 101", code: "SR101", type: "Seminar Room", capacity: 30 },
        ]
        setFacilities(fallbackFacilities)
        // Initialize all facilities as available
        setFacilitiesWithStatus(
          fallbackFacilities.map((facility) => ({
            ...facility,
            available: true,
          })),
        )
        toast({
          title: "Warning",
          description: "Using sample facility data. Some features may be limited.",
          variant: "default",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFacilities()
  }, [toast])

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Check if getCourses method exists
        if (typeof api.getCourses === "function") {
          const coursesData = await api.getCourses()
          setCourses(coursesData)
        } else {
          console.warn("api.getCourses is not implemented, using fallback data")
          // Provide fallback data
          const fallbackCourses = [
            {
              id: "C001",
              name: "Introduction to Computer Science",
              code: "CS101",
              department: "Computer Science",
              lecturers: ["L001", "L005"],
            },
            { id: "C002", name: "Calculus I", code: "MATH101", department: "Mathematics", lecturers: ["L002"] },
            { id: "C003", name: "Physics for Engineers", code: "PHYS201", department: "Physics", lecturers: ["L003"] },
            {
              id: "C004",
              name: "Database Systems",
              code: "CS301",
              department: "Computer Science",
              lecturers: ["L001"],
            },
            {
              id: "C005",
              name: "Software Engineering",
              code: "CS401",
              department: "Computer Science",
              lecturers: ["L005"],
            },
          ]
          setCourses(fallbackCourses)
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error)
        // Provide fallback data in case of error
        const fallbackCourses = [
          { id: "C001", name: "Introduction to Computer Science", code: "CS101", department: "Computer Science" },
          { id: "C002", name: "Calculus I", code: "MATH101", department: "Mathematics" },
          { id: "C003", name: "Physics for Engineers", code: "PHYS201", department: "Physics" },
        ]
        setCourses(fallbackCourses)
        toast({
          title: "Warning",
          description: "Using sample course data. Some features may be limited.",
          variant: "default",
        })
      }
    }

    fetchCourses()
  }, [toast])

  // Helper function to convert time string to minutes
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Handle course selection
  const handleCourseSelect = (courseId: string) => {
    const selectedCourse = courses.find((course) => course.id === courseId)
    if (selectedCourse) {
      form.setValue("courseId", courseId)
      // Remove the title setting line
      if (selectedCourse.lecturers && selectedCourse.lecturers.length > 0) {
        form.setValue("lecturer", selectedCourse.lecturers[0])
      }
    }
  }

  // Check facility availability whenever day or time changes
  useEffect(() => {
    const checkFacilityAvailability = async () => {
      const values = form.getValues()
      if (values.day && values.startTime && values.endTime) {
        setChecking(true)
        try {
          // Create cache key
          const cacheKey = `${values.day}-${values.startTime}-${values.endTime}`

          // Use cached schedules if available
          let existingSchedules: ScheduleEvent[]
          if (scheduleCache[cacheKey]) {
            existingSchedules = scheduleCache[cacheKey]
          } else {
            // Check if getScheduleEvents method exists
            if (typeof api.getScheduleEvents === "function") {
              existingSchedules = await api.getScheduleEvents()
            } else {
              console.warn("api.getScheduleEvents is not implemented, using fallback data")
              // Provide fallback data
              existingSchedules = [
                {
                  id: "SCH001",
                  title: "Introduction to Computer Science",
                  courseCode: "CS101",
                  instructor: "Dr. John Smith",
                  facilityId: "F001",
                  facilityName: "Main Lecture Hall",
                  facilityCode: "MLH",
                  day: "Monday",
                  startTime: "09:00",
                  endTime: "10:30",
                  type: "Lecture",
                  location: "Main Lecture Hall (MLH), Room 101",
                },
                {
                  id: "SCH002",
                  title: "Calculus I",
                  courseCode: "MATH101",
                  instructor: "Dr. Sarah Johnson",
                  facilityId: "F003",
                  facilityName: "Seminar Room 101",
                  facilityCode: "SR101",
                  day: "Wednesday",
                  startTime: "13:00",
                  endTime: "14:30",
                  type: "Tutorial",
                  location: "Seminar Room 101 (SR101), Room 101",
                },
              ]
            }
            // Cache the results
            setScheduleCache((prev) => ({
              ...prev,
              [cacheKey]: existingSchedules,
            }))
          }

          // Convert times to minutes for easier comparison
          const newStartTime = convertTimeToMinutes(values.startTime)
          const newEndTime = convertTimeToMinutes(values.endTime)

          // Process facilities in chunks to avoid blocking
          const chunkSize = 10
          const processChunk = (startIndex: number) => {
            const chunk = facilities.slice(startIndex, startIndex + chunkSize)

            const updatedFacilities = chunk.map((facility) => {
              // Filter schedules for this facility and day
              const facilitySchedules = existingSchedules.filter(
                (schedule) => schedule.facilityId === facility.id && schedule.day === values.day,
              )

              // Check for time conflicts
              let available = true
              let conflictReason = ""

              for (const schedule of facilitySchedules) {
                const scheduleStart = convertTimeToMinutes(schedule.startTime)
                const scheduleEnd = convertTimeToMinutes(schedule.endTime)

                if (
                  (newStartTime >= scheduleStart && newStartTime < scheduleEnd) ||
                  (newEndTime > scheduleStart && newEndTime <= scheduleEnd) ||
                  (newStartTime <= scheduleStart && newEndTime >= scheduleEnd)
                ) {
                  available = false
                  conflictReason = `Reserved for ${schedule.title} (${schedule.courseCode}) - ${schedule.startTime} to ${schedule.endTime}`
                  break
                }
              }

              return {
                ...facility,
                available,
                conflictReason,
              }
            })

            // Update state with processed chunk
            setFacilitiesWithStatus((prev) => {
              const newFacilities = [...prev]
              updatedFacilities.forEach((facility, index) => {
                newFacilities[startIndex + index] = facility
              })
              return newFacilities
            })

            // Process next chunk if there are more facilities
            if (startIndex + chunkSize < facilities.length) {
              setTimeout(() => processChunk(startIndex + chunkSize), 0)
            } else {
              setChecking(false)
            }
          }

          // Start processing first chunk
          processChunk(0)
        } catch (error) {
          console.error("Error checking facility availability:", error)
          // Set all facilities as available in case of error
          setFacilitiesWithStatus(
            facilities.map((facility) => ({
              ...facility,
              available: true,
            })),
          )
          toast({
            title: "Warning",
            description: "Could not check facility availability. All facilities shown as available.",
            variant: "default",
          })
          setChecking(false)
        }
      }
    }

    const debounceTimeout = setTimeout(checkFacilityAvailability, 800)
    return () => clearTimeout(debounceTimeout)
  }, [form.watch(["day", "startTime", "endTime"]), facilities])

  // Update conflict message when facility changes
  useEffect(() => {
    const facilityId = form.getValues("facilityId")
    if (facilityId) {
      const selectedFacility = facilitiesWithStatus.find((f) => f.id === facilityId)
      if (selectedFacility && !selectedFacility.available) {
        setSelectedFacilityConflict(
          selectedFacility.conflictReason || "This facility is not available at the selected time",
        )
      } else {
        setSelectedFacilityConflict(null)
      }
    } else {
      setSelectedFacilityConflict(null)
    }
  }, [form.watch("facilityId"), facilitiesWithStatus])

  // Filter facilities based on search query
  const memoizedFilteredFacilities = React.useMemo(
    () =>
      facilitiesWithStatus.filter(
        (facility) =>
          facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          facility.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          facility.code.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [facilitiesWithStatus, searchQuery],
  )

  // Filter lecturers based on search query

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Find the selected facility
      const selectedFacility = facilities.find((f) => f.id === values.facilityId)
      const selectedCourse = courses.find((course) => course.id === values.courseId)

      if (!selectedFacility) {
        throw new Error("Selected facility not found")
      }

      if (!selectedCourse) {
        throw new Error("Selected course not found")
      }

      const selectedLecturer = lecturers.find((l) => l.id === values.lecturer)
      const newSchedule = {
        id: `SCH${Date.now().toString().slice(-6)}`,
        title: selectedCourse.name, // Use course name instead of form title
        courseCode: selectedCourse.code,
        instructor: selectedLecturer ? selectedLecturer.name : values.lecturer, // Use lecturer name
        facilityId: values.facilityId,
        facilityName: selectedFacility.name,
        facilityCode: selectedFacility.code,
        day: values.day,
        startTime: values.startTime,
        endTime: values.endTime,
        type: values.type,
        location: `${selectedFacility.name} (${selectedFacility.code}), Room ${Math.floor(Math.random() * 100) + 100}`,
      }

      let createdSchedule
      // Check if createScheduleEvent method exists
      if (typeof api.createScheduleEvent === "function") {
        createdSchedule = await api.createScheduleEvent(newSchedule)
      } else {
        console.warn("api.createScheduleEvent is not implemented, using local data")
        // Simulate API response
        createdSchedule = { ...newSchedule, createdAt: new Date().toISOString() }
      }

      onScheduleCreated(createdSchedule)

      toast({
        title: "Academic Schedule Created",
        description: "Your academic schedule has been created successfully.",
      })

      form.reset()
      setOpen(false)
    } catch (error) {
      console.error("Error creating academic schedule:", error)
      toast({
        title: "Error",
        description: "Failed to create academic schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Clear lecturer selection
  const clearLecturerSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    form.setValue("lecturer", "")
    setIsLecturerDropdownOpen(false)
  }

  // Clear facility selection
  const clearFacilitySelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    form.setValue("facilityId", "")
    setFacilityOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Create Academic Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Academic Schedule</DialogTitle>
          <DialogDescription>Add a new class or academic event to your schedule.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Course Selection */}
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Course</FormLabel>
                  <FormControl>
                    <CourseSelector
                      courses={courses}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                        handleCourseSelect(value)
                      }}
                    />
                  </FormControl>
                  <FormDescription>Select a course to automatically fill course details</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lecturer field */}
            <FormField
              control={form.control}
              name="lecturer"
              render={({ field }) => {
                // Get selected lecturer details
                const selectedLecturer = lecturers.find((lecturer) => lecturer.id === field.value)

                // Filter lecturers based on search term
                const filteredLecturers = lecturers.filter(
                  (lecturer) =>
                    lecturer.name.toLowerCase().includes(lecturerSearchTerm.toLowerCase()) ||
                    (lecturer.department &&
                      lecturer.department.toLowerCase().includes(lecturerSearchTerm.toLowerCase())) ||
                    (lecturer.position && lecturer.position.toLowerCase().includes(lecturerSearchTerm.toLowerCase())),
                )

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Lecturer</FormLabel>
                    <div className="relative" ref={lecturerContainerRef}>
                      {/* Selected lecturer display / trigger button */}
                      <div
                        className={cn(
                          "flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer",
                        )}
                        onClick={() => setIsLecturerDropdownOpen(!isLecturerDropdownOpen)}
                      >
                        {selectedLecturer ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <span>{selectedLecturer.name}</span>
                              {selectedLecturer.department && (
                                <span className="text-xs px-1.5 py-0.5 rounded-md bg-muted">
                                  {selectedLecturer.department}
                                </span>
                              )}
                            </div>
                            <X
                              className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
                              onClick={clearLecturerSelection}
                              aria-label="Clear selection"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Select lecturer</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </div>

                      {/* Dropdown */}
                      {isLecturerDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md">
                          {/* Search input */}
                          <div className="flex items-center border-b p-2">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
                              placeholder="Search lecturers..."
                              value={lecturerSearchTerm}
                              onChange={(e) => setLecturerSearchTerm(e.target.value)}
                              autoFocus
                            />
                            {lecturerSearchTerm && (
                              <X
                                className="h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setLecturerSearchTerm("")
                                }}
                              />
                            )}
                          </div>

                          {/* Lecturer list */}
                          <div className="max-h-[300px] overflow-y-auto py-1" tabIndex={-1}>
                            {filteredLecturers.length === 0 ? (
                              <div className="py-6 text-center text-sm text-muted-foreground">No lecturers found.</div>
                            ) : (
                              filteredLecturers.map((lecturer) => (
                                <div
                                  key={lecturer.id}
                                  className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                                    "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                    lecturer.id === field.value && "bg-accent text-accent-foreground",
                                  )}
                                  onClick={() => {
                                    field.onChange(lecturer.id)
                                    setIsLecturerDropdownOpen(false)
                                  }}
                                >
                                  <div className="flex flex-col flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{lecturer.name}</span>
                                      {lecturer.department && (
                                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-muted">
                                          {lecturer.department}
                                        </span>
                                      )}
                                    </div>
                                    {lecturer.position && (
                                      <span className="text-xs text-muted-foreground">{lecturer.position}</span>
                                    )}
                                  </div>
                                  {lecturer.id === field.value && <Check className="h-4 w-4 ml-2" />}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <FormDescription>Select the lecturer for this class</FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Lecture">Lecture</SelectItem>
                        <SelectItem value="Lab">Lab</SelectItem>
                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                        <SelectItem value="Exam">Exam</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Show checking status */}
            {checking && (
              <div className="flex items-center justify-center text-sm text-muted-foreground bg-muted/50 rounded-md p-2">
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Updating facility availability...
              </div>
            )}

            <FormField
              control={form.control}
              name="facilityId"
              render={({ field }) => {
                // Get selected facility details
                const selectedFacility = facilitiesWithStatus.find((facility) => facility.id === field.value)

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Facility</FormLabel>
                    <div className="relative" ref={facilityContainerRef}>
                      {/* Selected facility display / trigger button */}
                      <div
                        className={cn(
                          "flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer",
                        )}
                        onClick={() => setFacilityOpen(!facilityOpen)}
                      >
                        {field.value ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <span>{facilitiesWithStatus.find((facility) => facility.id === field.value)?.name}</span>
                              <span className="text-xs px-1.5 py-0.5 rounded-md bg-muted">
                                {facilitiesWithStatus.find((facility) => facility.id === field.value)?.code}
                              </span>
                              {facilitiesWithStatus.find((facility) => facility.id === field.value)?.available ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                  Reserved
                                </Badge>
                              )}
                            </div>
                            <X
                              className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
                              onClick={clearFacilitySelection}
                              aria-label="Clear facility selection"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Select facility</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </div>

                      {/* Dropdown */}
                      {facilityOpen && (
                        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md">
                          {/* Search input */}
                          <div className="flex items-center border-b p-2">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
                              placeholder="Search facilities..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              autoFocus
                            />
                            {searchQuery && (
                              <X
                                className="h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSearchQuery("")
                                }}
                              />
                            )}
                          </div>

                          {/* Facility list */}
                          <div className="max-h-[300px] overflow-y-auto py-1" tabIndex={-1}>
                            {memoizedFilteredFacilities.length === 0 ? (
                              <div className="py-6 text-center text-sm text-muted-foreground">No facilities found.</div>
                            ) : (
                              memoizedFilteredFacilities.map((facility) => (
                                <div
                                  key={facility.id}
                                  className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                                    "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                    facility.id === field.value && "bg-accent text-accent-foreground",
                                    !facility.available && "border-l-2 border-red-500",
                                  )}
                                  onClick={() => {
                                    field.onChange(facility.id)
                                    setFacilityOpen(false)
                                  }}
                                >
                                  <div className="flex flex-col w-full">
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center gap-2">
                                        <span>{facility.name}</span>
                                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-muted">
                                          {facility.code}
                                        </span>
                                      </div>
                                      {facility.available ? (
                                        <Badge
                                          variant="outline"
                                          className="bg-green-100 text-green-800 border-green-300"
                                        >
                                          Available
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                          Reserved
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{facility.type}</span>
                                    {!facility.available && (
                                      <span className="text-xs text-red-500 mt-1">{facility.conflictReason}</span>
                                    )}
                                  </div>
                                  {facility.id === field.value && <Check className="h-4 w-4 ml-2" />}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      Where the class or event will take place (one facility per schedule)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            {/* Show conflict warning for selected facility */}
            {selectedFacilityConflict && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Facility Scheduling Conflict</AlertTitle>
                <AlertDescription>{selectedFacilityConflict}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button type="submit" disabled={checking}>
                Create Academic Schedule
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

