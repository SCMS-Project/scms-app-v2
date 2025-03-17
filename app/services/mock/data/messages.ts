import type { Message } from "../../../types"

// Create a set of mock messages for the system
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "user-1",
    senderName: "Admin User",
    recipientId: "user-2",
    recipientName: "John Smith",
    subject: "Welcome to the Campus Management System",
    content:
      "Hello John, welcome to our Smart Campus Management System. Let me know if you need any assistance getting started.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    isRead: true,
  },
  {
    id: "msg-2",
    senderId: "user-2",
    senderName: "John Smith",
    recipientId: "user-1",
    recipientName: "Admin User",
    subject: "Re: Welcome to the Campus Management System",
    content:
      "Thank you for the welcome! I'm excited to start using the system. I do have a question about accessing course materials.",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    isRead: true,
  },
  {
    id: "msg-3",
    senderId: "user-3",
    senderName: "Sarah Johnson",
    recipientId: "user-1",
    recipientName: "Admin User",
    subject: "Question about facility booking",
    content:
      "Hi Admin, I'm trying to book the main auditorium for next Friday but I'm getting an error. Can you help me with this?",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: false,
  },
  {
    id: "msg-4",
    senderId: "user-1",
    senderName: "Admin User",
    recipientId: "user-3",
    recipientName: "Sarah Johnson",
    subject: "Re: Question about facility booking",
    content:
      "Hi Sarah, I'll look into the booking issue right away. Can you provide me with the specific error message you're seeing?",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRead: true,
  },
  {
    id: "msg-5",
    senderId: "user-4",
    senderName: "Michael Chen",
    recipientId: "user-1",
    recipientName: "Admin User",
    subject: "Course registration deadline",
    content:
      "Hello Admin, I wanted to confirm if the course registration deadline is still next Monday? Some students are asking for an extension.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: false,
  },
  {
    id: "msg-6",
    senderId: "user-5",
    senderName: "Emily Davis",
    recipientId: "user-2",
    recipientName: "John Smith",
    subject: "Study group for Advanced Programming",
    content:
      "Hi John, I'm organizing a study group for the Advanced Programming course. Would you be interested in joining us?",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    isRead: false,
  },
  {
    id: "msg-7",
    senderId: "user-6",
    senderName: "David Wilson",
    recipientId: "user-1",
    recipientName: "Admin User",
    subject: "Technical issue with the system",
    content:
      "Hello Admin, I'm experiencing some technical issues with the system. The dashboard isn't loading properly. Can you assist?",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    isRead: false,
  },
  {
    id: "msg-8",
    senderId: "user-7",
    senderName: "Lisa Brown",
    recipientId: "user-1",
    recipientName: "Admin User",
    subject: "Request for new equipment",
    content:
      "Hi Admin, our department needs some new equipment for the upcoming semester. How do I submit a formal request through the system?",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    isRead: false,
  },
  {
    id: "msg-9",
    senderId: "user-1",
    senderName: "Admin User",
    recipientId: "user-all",
    recipientName: "All Users",
    subject: "System maintenance notification",
    content:
      "Dear all, please be informed that the system will undergo maintenance this Saturday from 10 PM to 2 AM. Some features may be unavailable during this time.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    isRead: false,
  },
  {
    id: "msg-10",
    senderId: "user-8",
    senderName: "Robert Taylor",
    recipientId: "user-1",
    recipientName: "Admin User",
    subject: "Password reset request",
    content: "Hello Admin, I forgot my password and the reset link isn't working. Can you help me reset it manually?",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isRead: false,
  },
]

