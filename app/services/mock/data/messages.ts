import type { Message } from "@/app/types"

// Mock Message Data
export const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "U001",
    senderName: "Admin User",
    recipientId: "U002",
    recipientName: "Dr. Robert Chen",
    subject: "Course Schedule Update",
    content: "Please review the updated course schedule for next semester.",
    timestamp: new Date("2024-03-14T10:30:00").toISOString(),
    isRead: false,
  },
  {
    id: "2",
    senderId: "U002",
    senderName: "Dr. Robert Chen",
    recipientId: "U001",
    recipientName: "Admin User",
    subject: "Re: Course Schedule Update",
    content: "Thank you for the update. I'll review it shortly.",
    timestamp: new Date("2024-03-14T11:00:00").toISOString(),
    isRead: true,
  },
]

