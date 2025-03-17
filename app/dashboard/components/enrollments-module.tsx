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

interface Enrollment {
  id: string
  studentId?: string
  studentName?: string
  courseId?: string
  courseName?: string
  batchId?: string
  batchName?: string
  enrollmentDate?: string
  status?: string
  grade?: string
}

export default function EnrollmentsModule() {
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)

  const handleViewDetails = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    setIsViewDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Enrollment Management</h2>
      <p>Enrollments module content will be displayed here.</p>

      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enrollment Details</DialogTitle>
            <DialogDescription>Detailed information about the selected enrollment.</DialogDescription>
          </DialogHeader>
          {selectedEnrollment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-2">{selectedEnrollment.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Student ID:</div>
                <div className="col-span-2">{selectedEnrollment.studentId || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Student Name:</div>
                <div className="col-span-2">{selectedEnrollment.studentName || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Course ID:</div>
                <div className="col-span-2">{selectedEnrollment.courseId || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Course Name:</div>
                <div className="col-span-2">{selectedEnrollment.courseName || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Batch ID:</div>
                <div className="col-span-2">{selectedEnrollment.batchId || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Batch Name:</div>
                <div className="col-span-2">{selectedEnrollment.batchName || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Enrollment Date:</div>
                <div className="col-span-2">{selectedEnrollment.enrollmentDate || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-2">{selectedEnrollment.status || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Grade:</div>
                <div className="col-span-2">{selectedEnrollment.grade || "Not graded"}</div>
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

