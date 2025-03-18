"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/app/contexts/auth-context"
import type { Resource, Reservation } from "@/app/types"

const formSchema = z.object({
  resourceId: z.string({
    required_error: "Please select a resource",
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
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ResourceReservation() {
  const [activeTab, setActiveTab] = useState("available")
  const [resources, setResources] = useState<Resource[]>([])
  const [myReservations, setMyReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: "",
      notes: "",
    },
  })

  // Fetch resources and reservations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [resourcesData, reservationsData] = await Promise.all([
          api.getResources(),
          api.getReservations(user?.id), // Now passing user ID to get user-specific reservations
        ])

        const availableResources = resourcesData.filter((resource) => resource.status === "Available")
        setResources(availableResources)
        setMyReservations(reservationsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load resources data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast, user?.id])

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to make a reservation.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const selectedResource = resources.find((r) => r.id === data.resourceId)

      if (!selectedResource) {
        throw new Error("Selected resource not found")
      }

      const formattedDate = format(data.date, "yyyy-MM-dd")
      const timeSlot = `${data.startTime} - ${data.endTime}`

      await api.createReservation({
        facility: selectedResource.type,
        room: selectedResource.location,
        purpose: data.purpose,
        date: formattedDate,
        time: timeSlot,
        requestedBy: user.name,
        userId: user.id,
        userRole: user.role,
        status: "Pending",
      })

      toast({
        title: "Success",
        description: "Resource reservation submitted successfully!",
      })

      form.reset()

      // Refresh the resources and reservations
      const [updatedResources, updatedReservations] = await Promise.all([
        api.getResources(),
        api.getReservations(user.id),
      ])

      setResources(updatedResources.filter((resource) => resource.status === "Available"))
      setMyReservations(updatedReservations)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reservation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resource Reservation</CardTitle>
        <CardDescription>Reserve campus resources for your academic needs</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available" onClick={() => setActiveTab("available")}>
              Available Resources
            </TabsTrigger>
            <TabsTrigger value="reserve" onClick={() => setActiveTab("reserve")}>
              Reserve a Resource
            </TabsTrigger>
            <TabsTrigger value="my-reservations" onClick={() => setActiveTab("my-reservations")}>
              My Reservations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <p>Loading resources...</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.length > 0 ? (
                      resources.map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell className="font-medium">{resource.name}</TableCell>
                          <TableCell>{resource.type}</TableCell>
                          <TableCell>{resource.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            >
                              {resource.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveTab("reserve")
                                form.setValue("resourceId", resource.id)
                              }}
                            >
                              Reserve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No available resources found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reserve">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="resourceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resource</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a resource" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {resources.map((resource) => (
                              <SelectItem key={resource.id} value={resource.id}>
                                {resource.name} ({resource.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the resource you want to reserve</FormDescription>
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
                                date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 1))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Select the date for your reservation (up to 1 month in advance)
                        </FormDescription>
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
                          <Input placeholder="e.g., Group Study, Project Work" {...field} disabled={loading} />
                        </FormControl>
                        <FormDescription>Briefly describe the purpose of your reservation</FormDescription>
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
                        <FormDescription>
                          Optional: Include any special requirements or additional information
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => form.reset()} disabled={loading || submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Reservation
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="my-reservations">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <p>Loading your reservations...</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {myReservations.length > 0 ? (
                    myReservations.map((reservation) => (
                      <div key={reservation.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">
                              {reservation.facility} - {reservation.room}
                            </h4>
                            <Badge
                              variant={
                                reservation.status === "Approved"
                                  ? "default"
                                  : reservation.status === "Pending"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {reservation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Purpose: {reservation.purpose}</p>
                          <p className="text-sm text-muted-foreground">
                            {reservation.date} • {reservation.time}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You don't have any reservations yet.</p>
                      <Button variant="outline" className="mt-4" onClick={() => setActiveTab("reserve")}>
                        Make a Reservation
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

