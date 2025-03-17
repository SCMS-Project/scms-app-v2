"use client"

import type { FacilityBooking } from "@/app/types"

// Mock Facility Bookings Data
export const mockFacilityBookings: FacilityBooking[] = [
  {
    id: "FB001",
    facilityId: "FAC001",
    purpose: "Lecture",
    date: "2024-07-15",
    startTime: "09:00",
    endTime: "10:00",
    bookedBy: "Dr. Smith",
    bookingType: "academic",
    status: "confirmed",
    createdAt: "2024-07-01T09:00:00Z",
  },
  {
    id: "FB002",
    facilityId: "FAC002",
    purpose: "Workshop",
    date: "2024-07-16",
    startTime: "14:00",
    endTime: "16:00",
    bookedBy: "Student Union",
    bookingType: "event",
    status: "pending",
    createdAt: "2024-07-02T14:00:00Z",
  },
  {
    id: "FB003",
    facilityId: "FAC001",
    purpose: "Meeting",
    date: "2024-07-17",
    startTime: "11:00",
    endTime: "12:00",
    bookedBy: "Admin",
    bookingType: "other",
    status: "confirmed",
    createdAt: "2024-07-03T11:00:00Z",
  },
]

// Basic mock data
export const mockFacilityAvailability = []

// Simple function
export const generateMockAvailabilityData = () => {
  return []
}

