"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface Facility {
  id: string
  code?: string | null
  name?: string | null
  type?: string | null
  capacity?: string | null
  rooms?: number | null
  status?: string | null
}

export default function FacilitiesModule() {
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)

  const handleViewDetails = (facility: Facility) => {
    setSelectedFacility(facility)
    setIsViewDetailsOpen(true)
  }

  const facility: Facility = { id: "123" } // Dummy facility data for testing

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Facilities Management</h2>
      <p>
        A facility in a university refers to any physical or digital infrastructure, resource, or service that is
        provided to support academic, administrative, recreational, or residential needs of students, faculty, and
        staff. These facilities include classrooms, libraries, laboratories, student centers, dormitories, sports
        complexes, and technology services, ensuring a conducive environment for learning, research, and personal
        development.
      </p>

      <div className="mt-4">
        <h3 className="text-lg font-medium">Online Reservation System</h3>
        <p className="text-muted-foreground">Our new online reservation system allows users to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
          <li>Reserve equipment and facilities online</li>
          <li>Check real-time availability of resources</li>
          <li>Avoid scheduling conflicts with automatic conflict detection</li>
          <li>Track and manage your reservations in one place</li>
          <li>Receive notifications about reservation status changes</li>
        </ul>
      </div>

      <DropdownMenuItem onClick={() => handleViewDetails(facility)}>View details</DropdownMenuItem>

      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Facility Details</DialogTitle>
            <DialogDescription>Detailed information about the selected facility.</DialogDescription>
          </DialogHeader>
          {selectedFacility && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-2">{selectedFacility.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Code:</div>
                <div className="col-span-2">{selectedFacility.code || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-2">{selectedFacility.name || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Type:</div>
                <div className="col-span-2">{selectedFacility.type || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Capacity:</div>
                <div className="col-span-2">{selectedFacility.capacity || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-2">{selectedFacility.status || "N/A"}</div>
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

