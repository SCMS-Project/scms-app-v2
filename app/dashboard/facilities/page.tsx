"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MoreHorizontal, Plus, Search, Filter, Calendar, Loader2, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/app/services/api"
import type { Facility, Reservation } from "../../types"
import { useToast } from "@/hooks/use-toast"
import { ReservationForm } from "./reservation-form"
import { FACILITY_STATUS_OPTIONS, FACILITY_TYPES } from "@/app/constants/roles"

export default function Facilities() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false)
  const [isReservationOpen, setIsReservationOpen] = useState(false)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("facilities")
  const [newFacility, setNewFacility] = useState<Omit<Facility, "id">>({
    name: "",
    type: "",
    capacity: 0,
    rooms: 0,
    status: "Operational",
  })

  const { toast } = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Fetch facilities and reservations data
  useEffect(() => {
    let isMounted = true // Add a flag to track component mount status

    const fetchData = async () => {
      try {
        setLoading(true)
        const [facilitiesData, reservationsData] = await Promise.all([api.getFacilities(), api.getReservations()])
        if (isMounted) {
          setFacilities(facilitiesData)
          setReservations(reservationsData)
        }
        setError(null)
      } catch (err) {
        setError("Failed to fetch facilities data")
        toast({
          title: "Error",
          description: "Failed to load facilities data. Please try again.",
          variant: "destructive",
        })
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false // Set the flag to false when the component unmounts
    }
  }, [toast])

  // Filter facilities based on search query
  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination for facilities
  const indexOfLastFacility = currentPage * itemsPerPage
  const indexOfFirstFacility = indexOfLastFacility - itemsPerPage
  const paginatedFacilities = filteredFacilities.slice(indexOfFirstFacility, indexOfLastFacility)
  const totalFacilityPages = Math.ceil(filteredFacilities.length / itemsPerPage)

  // Filter reservations based on search query
  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination for reservations
  const indexOfLastReservation = currentPage * itemsPerPage
  const indexOfFirstReservation = indexOfLastReservation - itemsPerPage
  const paginatedReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation)
  const totalReservationPages = Math.ceil(filteredReservations.length / itemsPerPage)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewFacility((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setNewFacility((prev) => ({ ...prev, [id]: value }))
  }

  // Handle numeric input changes
  const handleNumericChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue)) {
      setNewFacility((prev) => ({ ...prev, [id]: numValue }))
    }
  }

  // Handle facility creation
  const handleCreateFacility = async () => {
    try {
      setLoading(true)
      const createdFacility = await api.createFacility(newFacility)
      setFacilities((prev) => [...prev, createdFacility])
      setIsAddFacilityOpen(false)
      setNewFacility({
        name: "",
        type: "",
        capacity: 0,
        rooms: 0,
        status: "Operational",
      })
      toast({
        title: "Success",
        description: "Facility added successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add facility. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle facility deletion
  const handleDeleteFacility = async (id: string) => {
    try {
      setLoading(true)
      await api.deleteFacility(id)
      setFacilities((prev) => prev.filter((facility) => facility.id !== id))
      toast({
        title: "Success",
        description: "Facility deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete facility. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle reservation success
  const handleReservationSuccess = () => {
    setIsReservationOpen(false)
    // Refresh reservations
    api
      .getReservations()
      .then((data) => {
        setReservations(data)
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to refresh reservations.",
          variant: "destructive",
        })
      })
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Calculate stats
  const totalCapacity = facilities.reduce((sum, facility) => sum + facility.capacity, 0)
  const totalRooms = facilities.reduce((sum, facility) => sum + facility.rooms, 0)
  const operationalFacilities = facilities.filter((f) => f.status === "Operational").length
  const pendingReservations = reservations.filter((r) => r.status === "Pending").length
  const approvedReservations = reservations.filter((r) => r.status === "Approved").length

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  if (loading && facilities.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading facilities data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Facility Management</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search facilities..."
              className="w-full sm:w-[250px] pl-8"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Calendar className="h-4 w-4" /> Reserve Facility
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Reserve a Facility</DialogTitle>
                <DialogDescription>Fill out the form below to request a facility reservation.</DialogDescription>
              </DialogHeader>
              <ReservationForm
                onSuccess={handleReservationSuccess}
                onCancel={() => setIsReservationOpen(false)}
                existingReservations={reservations}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isAddFacilityOpen} onOpenChange={setIsAddFacilityOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" /> Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Facility</DialogTitle>
                <DialogDescription>Enter the details of the new facility below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Facility Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Building name"
                    className="col-span-3"
                    value={newFacility.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACILITY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="0"
                    className="col-span-3"
                    value={newFacility.capacity || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleNumericChange("capacity", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rooms" className="text-right">
                    Rooms
                  </Label>
                  <Input
                    id="rooms"
                    type="number"
                    placeholder="0"
                    className="col-span-3"
                    value={newFacility.rooms || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumericChange("rooms", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACILITY_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFacilityOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFacility} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Facilities</CardTitle>
            <CardDescription>Campus-wide buildings and spaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{facilities.length}</div>
            <p className="text-xs text-muted-foreground">{operationalFacilities} operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Capacity</CardTitle>
            <CardDescription>Maximum occupancy across all facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCapacity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{totalRooms} rooms available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reservations</CardTitle>
            <CardDescription>Current facility bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reservations.length}</div>
            <p className="text-xs text-muted-foreground">
              {approvedReservations} approved, {pendingReservations} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="facilities">
            <BookOpen className="h-4 w-4 mr-2" />
            Facilities
          </TabsTrigger>
          <TabsTrigger value="reservations">
            <Calendar className="h-4 w-4 mr-2" />
            Reservations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="facilities" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && facilities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading facilities...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : paginatedFacilities.length > 0 ? (
                  paginatedFacilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">{facility.id}</TableCell>
                      <TableCell>{facility.name}</TableCell>
                      <TableCell>{facility.type}</TableCell>
                      <TableCell>{facility.capacity}</TableCell>
                      <TableCell>{facility.rooms}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            facility.status === "Operational"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {facility.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit facility</DropdownMenuItem>
                            <DropdownMenuItem>Manage rooms</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsReservationOpen(true)}>
                              Reserve facility
                            </DropdownMenuItem>
                            <DropdownMenuItem>Schedule maintenance</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteFacility(facility.id)}
                            >
                              Delete facility
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No facilities found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Facility Reservations</h3>
            <Button onClick={() => setIsReservationOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              New Reservation
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && reservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading reservations...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedReservations.length > 0 ? (
                  paginatedReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.id}</TableCell>
                      <TableCell>{reservation.facility}</TableCell>
                      <TableCell>{reservation.room}</TableCell>
                      <TableCell>{reservation.purpose}</TableCell>
                      <TableCell>{reservation.date}</TableCell>
                      <TableCell>{reservation.time}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            reservation.status === "Approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : reservation.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit reservation</DropdownMenuItem>
                            {reservation.status === "Pending" && (
                              <DropdownMenuItem>Approve reservation</DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Cancel reservation</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No reservations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {activeTab === "facilities"
            ? Array.from({ length: Math.min(5, totalFacilityPages) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink onClick={() => handlePageChange(pageNumber)} isActive={currentPage === pageNumber}>
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })
            : Array.from({ length: Math.min(5, totalReservationPages) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink onClick={() => handlePageChange(pageNumber)} isActive={currentPage === pageNumber}>
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

          {activeTab === "facilities" && totalFacilityPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {activeTab === "reservations" && totalReservationPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handlePageChange(
                  activeTab === "facilities"
                    ? Math.min(totalFacilityPages, currentPage + 1)
                    : Math.min(totalReservationPages, currentPage + 1),
                )
              }
              className={
                (activeTab === "facilities" && currentPage === totalFacilityPages) ||
                (activeTab === "reservations" && currentPage === totalReservationPages)
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

