"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockApi } from "@/app/services/mock-api"
import type { Message, Notification } from "@/app/types"
import { useAuth } from "@/app/contexts/auth-context"

export default function Communications() {
  const [messages, setMessages] = useState<Message[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState({
    recipientId: "",
    recipientName: "",
    subject: "",
    content: "",
  })

  const { user } = useAuth()
  const { toast } = useToast()

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
    const recipient = mockUsers.find((user) => user.id === value)
    setNewMessage((prev) => ({
      ...prev,
      recipientId: value,
      recipientName: recipient?.name || "",
    }))
  }

  // Handle message sending
  const handleSendMessage = async () => {
    if (!user?.id || !newMessage.recipientId) return

    try {
      setLoading(true)
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
      // Reset form
      setNewMessage({
        recipientId: "",
        recipientName: "",
        subject: "",
        content: "",
      })
    } catch (err) {
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
      await mockApi.deleteMessage(id)
      setMessages((prev) => prev.filter((message) => message.id !== id))
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

  // Mock users for the recipient select
  const mockUsers = [
    { id: "U001", name: "Admin User" },
    { id: "U002", name: "Dr. Robert Chen" },
    { id: "U003", name: "Dr. Sarah Johnson" },
    { id: "U004", name: "John Smith" },
    { id: "U005", name: "Emma Johnson" },
  ]

  return (
    <Tabs defaultValue="messages" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="announcements">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="messages">
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
                  <Select onValueChange={handleSelectChange} value={newMessage.recipientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="Enter subject"
                    value={newMessage.subject}
                    onChange={handleInputChange}
                  />
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !newMessage.recipientId || !newMessage.subject || !newMessage.content}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Message
                </Button>
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
                      className={`flex items-start space-x-4 rounded-md border p-4 ${
                        !message.isRead ? "bg-muted/50" : ""
                      }`}
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
                          <p className="text-sm text-muted-foreground">
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
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
      </TabsContent>

      <TabsContent value="announcements">
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>View and manage your notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin mr-2" />
                  <p>Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-64 text-red-500">
                  <p>{error}</p>
                </div>
              ) : notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-md border p-4 ${!notification.isRead ? "bg-muted/50" : ""}`}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{notification.type}</Badge>
                          <p className="text-sm text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2">{notification.message}</p>
                      <div className="mt-4 flex items-center space-x-2">
                        {notification.link && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={notification.link}>View</a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  <p>No notifications found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
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

