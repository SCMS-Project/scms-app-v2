"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface Batch {
  id: string
  name?: string
  department?: string
  startDate?: string
  endDate?: string
  coordinator?: string
  students?: number
  status?: string
}

export default function BatchesModule() {
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)

  const handleViewDetails = (batch: Batch) => {
    setSelectedBatch(batch)
    setIsViewDetailsOpen(true)
  }

  const batch: Batch = { id: "123" } // Dummy batch data for demonstration

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Batch Management</h2>
      <p>Batches module content will be displayed here.</p>

      <DropdownMenuItem onClick={() => handleViewDetails(batch)}>View details</DropdownMenuItem>

      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Batch Details</DialogTitle>
            <DialogDescription>Detailed information about the selected batch.</DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-2">{selectedBatch.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-2">{selectedBatch.name || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Department:</div>
                <div className="col-span-2">{selectedBatch.department || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Start Date:</div>
                <div className="col-span-2">{selectedBatch.startDate || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">End Date:</div>
                <div className="col-span-2">{selectedBatch.endDate || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Coordinator:</div>
                <div className="col-span-2">{selectedBatch.coordinator || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Students:</div>
                <div className="col-span-2">{selectedBatch.students || 0}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-2">{selectedBatch.status || "N/A"}</div>
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

