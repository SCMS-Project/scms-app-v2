import type { Facility } from "@/app/types"

// Mock Facilities Data
export const mockFacilities: Facility[] = [
  {
    id: "FAC001",
    code: "MB-AUD",
    name: "Main Auditorium",
    type: "Auditorium",
    capacity: 1200,
    status: "Operational",
  },
  {
    id: "FAC002",
    code: "CH-A",
    name: "Conference Hall A",
    type: "Conference Hall",
    capacity: 300,
    status: "Operational",
  },
  {
    id: "FAC003",
    code: "GYM-01",
    name: "Gymnasium",
    type: "Sports Facility",
    capacity: 500,
    status: "Operational",
  },
  {
    id: "FAC004",
    code: "LIB-01",
    name: "Library",
    type: "Study Area",
    capacity: 600,
    status: "Operational",
  },
]

