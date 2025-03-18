"use client"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function ResourcesModule() {
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  const handleViewDetails = (resource: Resource) => {
    setSelectedResource(resource)
    setIsViewDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Resources Management</h2>
      <p>Resources module content will be displayed here.</p>
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Resource Details</DialogTitle>
            <DialogDescription>Detailed information about the selected resource.</DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-2">{selectedResource.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-2">{selectedResource.name || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Type:</div>
                <div className="col-span-2">{selectedResource.type || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Location:</div>
                <div className="col-span-2">{selectedResource.location || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-2">{selectedResource.status || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Last Checked Out:</div>
                <div className="col-span-2">{selectedResource.lastCheckedOut || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Checked Out By:</div>
                <div className="col-span-2">{selectedResource.checkedOutBy || "N/A"}</div>
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

interface Resource {
  id: string
  name?: string
  type?: string
  location?: string
  status?: string
  lastCheckedOut?: string
  checkedOutBy?: string
}

