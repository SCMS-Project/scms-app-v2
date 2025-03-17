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
import { AddFacilityForm } from "./add-facility-form"
import { api } from "@/app/services/api"
import { useToast } from "@/hooks/use-toast"
import type { Facility, Reservation } from "@/app/types"
import { useAuth } from "@/app/contexts/auth-context"

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false)
  const [isAddFacilityDialogOpen, setIsAddFacilityDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null)
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  // Filter facilities based on search query
  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (facility.status && facility.status.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Fetch facilities and reservations
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if api.getFacilities exists
      if (typeof api.getFacilities !== "function") {
        console.error("api.getFacilities is not a function")
        setFacilities([])
      } else {
        const facilitiesData = await api.getFacilities()
        setFacilities(facilitiesData)
      }

      // Check if api.getReservations exists
      if (typeof api.getReservations !== "function") {
        console.error("api.getReservations is not a function")
        setReservations([])
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

  useEffect(() => {
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

  // Handle facility creation success
  const handleFacilityCreationSuccess = () => {
    setIsAddFacilityDialogOpen(false)
    // Refresh facilities
    fetchData()
  }

  // Handle reservation from availability view
  const handleReserve = (date: Date, facility: string) => {
    setSelectedDate(date)
    setSelectedFacility(facility)
    setIsReservationDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facilities Management</h1>
          <p className="text-muted-foreground">View, book, and manage campus facilities</p>
        </div>
        <div className="flex space-x-2">
          {user?.role === "admin" && (
            <Dialog open={isAddFacilityDialogOpen} onOpenChange={setIsAddFacilityDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Facility
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Add New Facility</DialogTitle>
                  <DialogDescription>Fill out the form below to add a new facility</DialogDescription>
                </DialogHeader>
                <AddFacilityForm
                  onSuccess={handleFacilityCreationSuccess}
                  onCancel={() => setIsAddFacilityDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}

          <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
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
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search facilities..."
                  className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery("")}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            {filteredFacilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFacilities.map((facility) => (
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
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No facilities found matching your search criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

