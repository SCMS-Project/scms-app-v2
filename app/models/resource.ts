export interface Resource {
  id: string
  code: string
  name: string
  type: string
  status: string
  lastCheckedOut?: string
  checkedOutBy?: string
}

