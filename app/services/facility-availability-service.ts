import type { FacilityAvailability, FacilityBooking } from "../types/facility-availability"
import { mockFacilityAvailability, mockFacilityBookings } from "./mock/data/facility-availability"
import { delay, DEFAULT_DELAY } from "./utils/delay"

// Simulate API delay with 0ms delay for immediate response
const simulateDelay = async (ms = DEFAULT_DELAY) => {
  await delay(ms)
}

export const facilityAvailabilityService = {
  // Get all facility availability data
  getFacilityAvailability: async (): Promise<FacilityAvailability[]> => {
    await simulateDelay()
    console.log("API: Getting facility availability")
    return [...mockFacilityAvailability]
  },

  // Get availability for a specific facility
  getFacilityAvailabilityById: async (facilityId: string): Promise<FacilityAvailability | null> => {
    await simulateDelay()
    console.log(`API: Getting availability for facility ID: ${facilityId}`)
    const availability = mockFacilityAvailability.find((a) => a.facilityId === facilityId)
    return availability ? { ...availability } : null
  },

  // Get all bookings
  getAllBookings: async (): Promise<FacilityBooking[]> => {
    await simulateDelay()
    console.log("API: Getting all facility bookings")
    return [...mockFacilityBookings]
  },

  // Get bookings for a specific facility
  getBookingsByFacilityId: async (facilityId: string): Promise<FacilityBooking[]> => {
    await simulateDelay()
    console.log(`API: Getting bookings for facility ID: ${facilityId}`)
    return mockFacilityBookings.filter((b) => b.facilityId === facilityId)
  },

  // Get bookings for a specific date range
  getBookingsByDateRange: async (startDate: string, endDate: string): Promise<FacilityBooking[]> => {
    await simulateDelay()
    console.log(`API: Getting bookings from ${startDate} to ${endDate}`)
    return mockFacilityBookings.filter((b) => b.date >= startDate && b.date <= endDate)
  },

  // Create a new booking
  createBooking: async (bookingData: Omit<FacilityBooking, "id" | "createdAt">): Promise<FacilityBooking> => {
    await simulateDelay()
    console.log("API: Creating new booking", bookingData)
    const newBooking: FacilityBooking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    return { ...newBooking }
  },

  // Update a booking
  updateBooking: async (id: string, bookingData: Partial<FacilityBooking>): Promise<FacilityBooking> => {
    await simulateDelay()
    console.log(`API: Updating booking with ID: ${id}`, bookingData)
    const bookingIndex = mockFacilityBookings.findIndex((b) => b.id === id)
    if (bookingIndex === -1) {
      throw new Error(`Booking with ID ${id} not found`)
    }
    const updatedBooking = {
      ...mockFacilityBookings[bookingIndex],
      ...bookingData,
    }
    return { ...updatedBooking }
  },

  // Cancel a booking
  cancelBooking: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`API: Cancelling booking with ID: ${id}`)
    const bookingIndex = mockFacilityBookings.findIndex((b) => b.id === id)
    if (bookingIndex === -1) {
      throw new Error(`Booking with ID ${id} not found`)
    }
    return { success: true }
  },

  // Check availability for a specific time slot
  checkAvailability: async (
    facilityId: string,
    date: string,
    startTime: string,
    endTime: string,
    roomId?: string,
  ): Promise<{ isAvailable: boolean; conflictingBookings?: FacilityBooking[] }> => {
    await simulateDelay()
    console.log(`API: Checking availability for facility ${facilityId} on ${date} from ${startTime} to ${endTime}`)

    // Filter bookings for the specified facility and date
    let bookings = mockFacilityBookings.filter(
      (b) => b.facilityId === facilityId && b.date === date && b.status === "confirmed",
    )

    // If roomId is specified, filter for that room
    if (roomId) {
      bookings = bookings.filter((b) => b.roomId === roomId)
    }

    // Check for time conflicts
    const conflictingBookings = bookings.filter(
      (b) =>
        (startTime >= b.startTime && startTime < b.endTime) ||
        (endTime > b.startTime && endTime <= b.endTime) ||
        (startTime <= b.startTime && endTime >= b.endTime),
    )

    return {
      isAvailable: conflictingBookings.length === 0,
      conflictingBookings: conflictingBookings.length > 0 ? conflictingBookings : undefined,
    }
  },
}

