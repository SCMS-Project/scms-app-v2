// Mock permissions data
export const mockPermissions = [
  {
    id: "perm-1",
    userId: "U001",
    resource: "all",
    action: "all",
    granted: true,
  },
  {
    id: "perm-2",
    userId: "U002",
    resource: "courses",
    action: "read",
    granted: true,
  },
  {
    id: "perm-3",
    userId: "U003",
    resource: "courses",
    action: "read,write",
    granted: true,
  },
  {
    id: "perm-4",
    userId: "U003",
    resource: "students",
    action: "read",
    granted: true,
  },
]

