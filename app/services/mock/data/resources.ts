import type { Resource } from "@/app/types"

// Mock Resource Data
export const mockResources: Resource[] = [
  { id: "RS001", name: "Projector A", type: "Equipment", location: "Main Building", status: "Available" },
  {
    id: "RS002",
    name: "Laptop Cart 1",
    type: "Equipment",
    location: "Science Center",
    status: "In Use",
    lastCheckedOut: "2023-09-12",
    checkedOutBy: "Dr. Lisa Brown",
  },
  { id: "RS003", name: "Conference Room Kit", type: "Equipment", location: "Student Union", status: "Available" },
  {
    id: "RS004",
    name: "Digital Camera",
    type: "Equipment",
    location: "Arts Building",
    status: "In Use",
    lastCheckedOut: "2023-09-14",
    checkedOutBy: "James Davis",
  },
  { id: "RS005", name: "Portable Whiteboard", type: "Equipment", location: "Library", status: "Available" },
  { id: "RS006", name: "Audio System", type: "Equipment", location: "Sports Complex", status: "Under Maintenance" },
]

