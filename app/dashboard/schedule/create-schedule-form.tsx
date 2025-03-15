"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  type: z.enum(["Lecture", "Lab", "Tutorial", "Exam", "Other"]),
  courseCode: z.string().min(1, { message: "Course code is required" }),
  instructor: z.string().min(1, { message: "Instructor name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  date: z.date(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateScheduleFormProps {
  onScheduleCreated: (newSchedule: any) => void
}

export function CreateScheduleForm({ onScheduleCreated }: CreateScheduleFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Lecture",
      courseCode: "",
      instructor: "",
      location: "",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      date: new Date(),
    },
  })

  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      // Generate a unique ID for the new schedule event
      const newId = `SCH${Date.now().toString().slice(-6)}`

      // Create the new schedule event object
      const newScheduleEvent = {
        id: newId,
        title: data.title,
        courseCode: data.courseCode,
        instructor: data.instructor,
        location: data.location,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type,
        date: format(data.date, "yyyy-MM-dd"),
        description: data.description || "",
      }

      // In a real app, we would call an API to save the new schedule
      // For now, we'll simulate an API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the callback to update the parent component
      onScheduleCreated(newScheduleEvent)

      // Show success message
      toast({
        title: "Schedule Created",
        description: "Your academic schedule has been created successfully.",
      })

      // Close the dialog and reset the form
      setOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create schedule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Create Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Academic Schedule</DialogTitle>
          <DialogDescription>Add a new class or event to your academic schedule.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduction to Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the class or event"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
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

              <FormField
                control={form.control}
                name="courseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Code</FormLabel>
                    <FormControl>
                      <Input placeholder="CS101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Science Building, Room 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                )}
                Create Schedule
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

