import type { Notification } from "@/app/types"

// Mock Notification Data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "U001",
    title: "New Course Assignment",
    message: "You have been assigned to teach Advanced Mathematics.",
    type: "Assignment",
    timestamp: new Date("2024-03-14T09:00:00").toISOString(),
    isRead: false,
    link: "/dashboard/courses",
  },
  {
    id: "2",
    userId: "U001",
    title: "Meeting Reminder",
    message: "Faculty meeting tomorrow at 10 AM.",
    type: "Reminder",
    timestamp: new Date("2024-03-14T08:30:00").toISOString(),
    isRead: true,
    link: "/dashboard/schedule",
  },
]

