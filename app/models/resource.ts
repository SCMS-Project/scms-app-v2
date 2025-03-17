export interface Resource {
  id: string
  name: string
  type: string
  location: string
  status: "Available" | "In Use" | "Maintenance"
  checkedOutBy: string | null
  checkedOutAt: string | null
}

