"use client"
import { delay } from "../utils/delay"

// Simulate API delay
const simulateDelay = async (ms = 300) => {
  await delay(ms)
}

// Mock API implementation
export const mockApi = {
  // User methods
  getUsers: async () => {
    await simulateDelay()
    return []
  },

  // Lecturer methods
  getLecturers: async () => {
    await simulateDelay()
    return []
  },

  // Course methods
  getCourses: async () => {
    await simulateDelay()
    return []
  },

  // Student methods
  getStudents: async () => {
    await simulateDelay()
    return []
  },

  // Facility methods
  getFacilities: async () => {
    await simulateDelay()
    return []
  },

  // Reservation methods
  getReservations: async () => {
    await simulateDelay()
    return []
  },

  // Resource methods
  getResources: async () => {
    await simulateDelay()
    return []
  },

  // Schedule methods
  getScheduleEvents: async () => {
    await simulateDelay()
    return []
  },

  getScheduleNotifications: async () => {
    await simulateDelay()
    return []
  },
}

