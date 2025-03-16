"use client"

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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Check, ChevronsUpDown, AlertCircle, Clock, Search, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/services/api"
import type { Facility, ScheduleEvent, Course, Lecturer } from "@/app/types"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import React from "react"

// Update the form schema to remove courseCode
const formSchema = z.object({
  courseId: z.string().min(1, { message: "Course is required" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
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
          <div className="flex items-center gap-2">
            <span>{selectedCourse.name}</span>
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-muted">{selectedCourse.code}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Select course</span>
        )}
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
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
            />
            {searchTerm && (
              <X className="h-4 w-4 shrink-0 opacity-50 cursor-pointer" onClick={() => setSearchTerm("")} />
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

  // Fetch lecturers when component mounts
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const lecturersData = await api.getLecturers()
        setLecturers(lecturersData)
      } catch (error) {
        console.error("Failed to fetch lecturers:", error)
        toast({
          title: "Error",
          description: "Failed to load lecturers. Please try again.",
          variant: "destructive",
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
      title: "",
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
        const facilitiesData = await api.getFacilities()
        setFacilities(facilitiesData)
        // Initialize all facilities as available
        setFacilitiesWithStatus(
          facilitiesData.map((facility) => ({
            ...facility,
            available: true,
          })),
        )
      } catch (error) {
        console.error("Failed to fetch facilities:", error)
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

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await api.getCourses()
        setCourses(coursesData)
      } catch (error) {
        console.error("Failed to fetch courses:", error)
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
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
      form.setValue("title", selectedCourse.name)
      // If the course has assigned lecturers, set the first one as default
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
            existingSchedules = await api.getScheduleEvents()
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
          toast({
            title: "Error",
            description: "Failed to check facility availability. Please try again.",
            variant: "destructive",
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
        title: values.title,
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

      // Rest of the submission logic remains the same
      const createdSchedule = await api.createScheduleEvent(newSchedule)
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

            {/* Title field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduction to Computer Science" {...field} />
                  </FormControl>
                  <FormDescription>The name of the class or event</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lecturer field */}
            <FormField
              control={form.control}
              name="lecturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lecturer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lecturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lecturers.map((lecturer) => (
                        <SelectItem key={lecturer.id} value={lecturer.id}>
                          {lecturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the lecturer for this class</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
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
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Facility</FormLabel>
                  <Popover open={facilityOpen} onOpenChange={setFacilityOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={facilityOpen}
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? (
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
                          ) : (
                            "Select facility"
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search facilities..."
                          className="h-9"
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>No facility found.</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-auto">
                            {memoizedFilteredFacilities.map((facility) => (
                              <CommandItem
                                key={facility.id}
                                value={facility.id}
                                onSelect={() => {
                                  form.setValue("facilityId", facility.id)
                                  setFacilityOpen(false)
                                }}
                                className={cn(!facility.available && "border-l-2 border-red-500")}
                              >
                                <div className="flex flex-col w-full">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                      <span>{facility.name}</span>
                                      <span className="text-xs px-1.5 py-0.5 rounded-md bg-muted">{facility.code}</span>
                                    </div>
                                    {facility.available ? (
                                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
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
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    facility.id === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Where the class or event will take place (one facility per schedule)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
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

