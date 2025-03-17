"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {} from "@/components/ui/tabs" // Remove this line entirely if not needed elsewhere
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockApi } from "@/app/services/mock-api"
import type { Message, Notification, User } from "@/app/types"
import { useAuth } from "@/app/contexts/auth-context"

export default function Communications() {
  const [messages, setMessages] = useState<Message[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiAvailable, setApiAvailable] = useState(true)
  const [newMessage, setNewMessage] = useState({
    recipientId: "",
    recipientName: "",
    subject: "",
    content: "",
  })

  const { user } = useAuth()
  const { toast } = useToast()

  // Check if the API is properly implemented
  useEffect(() => {
    const checkApiAvailability = () => {
      // For debugging - log the mockApi object to see what methods are available
      console.log("mockApi methods:", Object.keys(mockApi))

      const requiredMethods = ["sendMessage", "getMessages", "deleteMessage"]
      const missingMethods = requiredMethods.filter((method) => typeof mockApi[method] !== "function")

      if (missingMethods.length > 0) {
        console.warn(`API missing required methods: ${missingMethods.join(", ")}`)
        setApiAvailable(false)
        toast({
          title: "API Warning",
          description: "Some messaging features may not work properly. API implementation is incomplete.",
          variant: "destructive",
        })
      } else {
        console.log("All required API methods are available")
        setApiAvailable(true)
      }
    }

    checkApiAvailability()
  }, [toast])

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true)
        let usersData

        if (typeof mockApi.getUsers === "function") {
          usersData = await mockApi.getUsers()
        } else {
          console.warn("mockApi.getUsers is not available, using fallback data")
          usersData = [
            { id: "U001", name: "Admin User", email: "admin@example.com", role: "admin" },
            { id: "U002", name: "Dr. Robert Chen", email: "r.chen@example.edu", role: "lecturer" },
            { id: "U003", name: "Dr. Sarah Johnson", email: "s.johnson@example.edu", role: "lecturer" },
            { id: "U004", name: "John Smith", email: "j.smith@example.edu", role: "student" },
            { id: "U005", name: "Emma Johnson", email: "e.johnson@example.edu", role: "student" },
          ]
        }

        if (Array.isArray(usersData)) {
          // Filter out the current user
          const filteredUsers = usersData.filter((u) => u.id !== user?.id)
          setUsers(filteredUsers)
        } else {
          console.warn("Invalid users data format", usersData)
          setUsers([])
        }
      } catch (err) {
        console.error("Error fetching users:", err)
        toast({
          title: "Error",
          description: "Failed to fetch users. Using sample data instead.",
          variant: "destructive",
        })

        // Fallback data
        setUsers([
          { id: "U001", name: "Admin User", email: "admin@example.com", role: "admin" },
          { id: "U002", name: "Dr. Robert Chen", email: "r.chen@example.edu", role: "lecturer" },
          { id: "U003", name: "Dr. Sarah Johnson", email: "s.johnson@example.edu", role: "lecturer" },
        ])
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [user?.id, toast])

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Fetch messages and notifications data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        setError(null)

        // Check if we can use the API methods or need to use fallback data
        let messagesData
        let notificationsData

        if (typeof mockApi.getMessages === "function" && typeof mockApi.getNotifications === "function") {
          // If API methods exist, call them
          ;[messagesData, notificationsData] = await Promise.all([
            mockApi.getMessages(user.id),
            mockApi.getNotifications(user.id),
          ])
        } else {
          // Use fallback data
          console.log("Using fallback data for messages and notifications")

          messagesData = [
            {
              id: "msg1",
              senderId: "U001",
              senderName: "Admin User",
              recipientId: user.id,
              recipientName: user.name || "User",
              subject: "Welcome to the Campus Management System",
              content: "Welcome to our platform! Let us know if you have any questions.",
              timestamp: new Date().toISOString(),
              isRead: false,
            },
          ]

          notificationsData = [
            {
              id: "notif1",
              title: "System Update",
              message: "The system has been updated with new features.",
              type: "System",
              timestamp: new Date().toISOString(),
              isRead: false,
            },
          ]
        }

        // Check if the returned data is valid
        if (Array.isArray(messagesData)) {
          setMessages(messagesData)
        } else {
          console.warn("Invalid messages data format", messagesData)
          setMessages([])
        }

        if (Array.isArray(notificationsData)) {
          setNotifications(notificationsData)
        } else {
          console.warn("Invalid notifications data format", notificationsData)
          setNotifications([])
        }
      } catch (err) {
        console.error("Error fetching communications data:", err)
        setError("Failed to fetch communications data. Using fallback data.")

        // Provide fallback data on error
        setMessages([
          {
            id: "msg1",
            senderId: "U001",
            senderName: "Admin User",
            recipientId: user.id,
            recipientName: user.name || "User",
            subject: "Welcome to the Campus Management System",
            content: "Welcome to our platform! Let us know if you have any questions.",
            timestamp: new Date().toISOString(),
            isRead: false,
          },
        ])

        setNotifications([
          {
            id: "notif1",
            title: "System Update",
            message: "The system has been updated with new features.",
            type: "System",
            timestamp: new Date().toISOString(),
            isRead: false,
          },
        ])

        toast({
          title: "Notice",
          description: "Using sample data. Real-time communication features will be available soon.",
          variant: "default",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id, toast])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewMessage((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (value: string) => {
    // Find the recipient name based on the selected ID
    const recipient = users.find((u) => u.id === value)
    setNewMessage((prev) => ({
      ...prev,
      recipientId: value,
      recipientName: recipient?.name || "",
    }))
  }

  // Handle message sending
  const handleSendMessage = async () => {
    if (!user?.id || !newMessage.recipientId) return

    // For debugging - log the message data
    console.log("Attempting to send message:", {
      senderId: user.id,
      senderName: user.name || "Unknown User",
      ...newMessage,
    })

    try {
      setLoading(true)

      // Create a fallback implementation if the API method is missing
      if (typeof mockApi.sendMessage !== "function") {
        console.warn("mockApi.sendMessage is not available, using fallback implementation")

        // Create a new message with the provided data
        const sentMessage = {
          id: `msg-${Date.now()}`,
          senderId: user.id,
          senderName: user.name || "Unknown User",
          ...newMessage,
          timestamp: new Date().toISOString(),
          isRead: false,
        }

        setMessages((prev) => [sentMessage, ...prev])
        toast({
          title: "Success",
          description: "Message sent successfully (using fallback implementation)",
        })
      } else {
        // Use the actual API method
        const sentMessage = await mockApi.sendMessage({
          senderId: user.id,
          senderName: user.name || "Unknown User",
          ...newMessage,
        })

        setMessages((prev) => [sentMessage, ...prev])
        toast({
          title: "Success",
          description: "Message sent successfully",
        })
      }

      // Reset form
      setNewMessage({
        recipientId: "",
        recipientName: "",
        subject: "",
        content: "",
      })
    } catch (err) {
      console.error("Error sending message:", err)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle message deletion
  const handleDeleteMessage = async (id: string) => {
    try {
      setLoading(true)

      // Create a fallback implementation if the API method is missing
      if (typeof mockApi.deleteMessage !== "function") {
        console.warn("mockApi.deleteMessage is not available, using fallback implementation")
        setMessages((prev) => prev.filter((message) => message.id !== id))
      } else {
        await mockApi.deleteMessage(id)
        setMessages((prev) => prev.filter((message) => message.id !== id))
      }

      toast({
        title: "Success",
        description: "Message deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle notification deletion
  const handleDeleteNotification = async (id: string) => {
    try {
      setLoading(true)
      await mockApi.deleteNotification(id)
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete notification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle marking notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      const updatedNotification = await mockApi.markNotificationAsRead(id)
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? updatedNotification : notification)),
      )
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>New Message</CardTitle>
          <CardDescription>Send a message to students, faculty, or staff</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                To
              </label>
              <Select onValueChange={handleSelectChange} value={newMessage.recipientId} disabled={loadingUsers}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select recipient"} />
                </SelectTrigger>
                <SelectContent>
                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {loadingUsers ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading users...</span>
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center">
                            <span>{user.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">({user.role})</span>
                          </div>
                          <span className="block text-xs text-muted-foreground">{user.email}</span>
                        </SelectItem>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="py-2 text-center text-muted-foreground">
                      No users found matching "{searchQuery}"
                    </div>
                  ) : (
                    <div className="py-2 text-center text-muted-foreground">No users found</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Subject
              </label>
              <Input id="subject" placeholder="Enter subject" value={newMessage.subject} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Message
              </label>
              <Textarea
                id="content"
                placeholder="Type your message here"
                className="min-h-[150px]"
                value={newMessage.content}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  loading || loadingUsers || !newMessage.recipientId || !newMessage.subject || !newMessage.content
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>View and manage your messages</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <p>Loading messages...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-64 text-amber-600">
              <p>{error}</p>
              <p className="text-sm mt-2">Using sample data instead.</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 rounded-md border p-4 ${!message.isRead ? "bg-muted/50" : ""}`}
                >
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={message.senderName} />
                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{message.senderName}</p>
                        <p className="text-sm text-muted-foreground">From: {message.senderName}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(message.timestamp).toLocaleString()}</p>
                    </div>
                    <p className="font-medium">{message.subject}</p>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center pt-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        Reply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-muted-foreground">
              <p>No messages found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Badge({ className, variant, ...props }: { className?: string; variant?: "outline" }) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        variant === "outline"
          ? "border-border text-foreground"
          : "border-transparent bg-primary text-primary-foreground"
      } ${className}`}
      {...props}
    />
  )
}

