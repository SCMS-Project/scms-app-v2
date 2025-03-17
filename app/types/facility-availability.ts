import type { User } from "./index"

export interface FacilityBooking {
  id: string
  facilityId: string
  roomId?: string
  startTime: string
  endTime: string
  date: string
  purpose: string
  bookedBy: User | string
  bookingType: "academic" | "event" | "other"
  reference?: {
    type: "schedule" | "event"
    id: string
    title: string
  }
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
}

export interface FacilityAvailability {
  facilityId: string
  facilityName: string
  rooms?: {
    id: string
    name: string
    capacity: number
    bookings: FacilityBooking[]
    isAvailable: boolean
  }[]
  bookings: FacilityBooking[]
  availableTimeSlots: {
    date: string
    slots: {
      startTime: string
      endTime: string
      isAvailable: boolean
    }[]
  }[]
}

