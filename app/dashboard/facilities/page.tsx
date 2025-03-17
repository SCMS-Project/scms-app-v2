"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReservationForm } from "./reservation-form"
import { AvailabilityView } from "./availability-view"
import { api } from "@/app/services/api"
import { useToast } from "@/hooks/use-toast"
import type { Facility, Reservation } from "@/app/types"

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const { toast } = useToast()

  // Fetch facilities and reservations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if api.getFacilities exists
        if (typeof api.getFacilities !== "function") {
          console.error("api.getFacilities is not a function")
          // Use fallback data
          setFacilities([
            {
              id: "fac-1",
              name: "Main Building",
              type: "Academic",
              capacity: 500,
              rooms: 20,
              status: "Available",
            },
            {
              id: "fac-2",
              name: "Library",
              type: "Study",
              capacity: 200,
              rooms: 10,
              status: "Partially Available",
            },
            {
              id: "fac-3",
              name: "Sports Complex",
              type: "Recreation",
              capacity: 300,
              rooms: 5,
              status: "Available",
            },
          ])
        } else {
          const facilitiesData = await api.getFacilities()
          setFacilities(facilitiesData)
        }

        // Check if api.getReservations exists
        if (typeof api.getReservations !== "function") {
          console.error("api.getReservations is not a function")
          // Use fallback data
          setReservations([
            {
              id: "res-1",
              facility: "Main Building",
              room: "Room 1",
              date: "2023-12-15",
              time: "09:00 - 11:00",
              purpose: "Meeting",
              requestedBy: "John Doe",
              status: "Approved",
            },
            {
              id: "res-2",
              facility: "Library",
              room: "Study Room 3",
              date: "2023-12-16",
              time: "14:00 - 16:00",
              purpose: "Group Study",
              requestedBy: "Jane Smith",
              status: "Pending",
            },
          ])
        } else {
          const reservationsData = await api.getReservations()
          setReservations(reservationsData)
        }
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load facilities data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Handle reservation success
  const handleReservationSuccess = () => {
    setIsReservationDialogOpen(false)
    // Refresh reservations
    api
      .getReservations()
      .then(setReservations)
      .catch((err) => {
        console.error("Failed to refresh reservations:", err)
        toast({
          title: "Error",
          description: "Failed to refresh reservations",
          variant: "destructive",
        })
      })
  }

  // Handle reservation from availability view
  const handleReserve = (date: Date, facility: string, room: string) => {
    setSelectedDate(date)
    setSelectedFacility(facility)
    setSelectedRoom(room)
    setIsReservationDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facilities Management</h1>
          <p className="text-muted-foreground">View, book, and manage campus facilities</p>
        </div>
        <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Reservation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Reserve a Facility</DialogTitle>
              <DialogDescription>Fill out the form below to request a facility reservation</DialogDescription>
            </DialogHeader>
            <ReservationForm
              onSuccess={handleReservationSuccess}
              onCancel={() => setIsReservationDialogOpen(false)}
              existingReservations={reservations}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-destructive text-lg">Error: {error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="availability">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="facilities">Facilities List</TabsTrigger>
          </TabsList>
          <TabsContent value="availability" className="mt-6">
            <AvailabilityView onReserve={handleReserve} />
          </TabsContent>
          <TabsContent value="facilities" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <Card key={facility.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{facility.name}</CardTitle>
                    <CardDescription>
                      {facility.type} - Capacity: {facility.capacity}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span
                          className={`text-sm font-medium ${
                            facility.status === "Available"
                              ? "text-green-500"
                              : facility.status === "Partially Available"
                                ? "text-amber-500"
                                : "text-red-500"
                          }`}
                        >
                          {facility.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rooms:</span>
                        <span className="text-sm font-medium">{facility.rooms}</span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => {
                          setSelectedFacility(facility.id)
                          setIsReservationDialogOpen(true)
                        }}
                      >
                        Reserve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

