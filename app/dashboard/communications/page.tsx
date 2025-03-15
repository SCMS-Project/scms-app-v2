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

// Import the API service
import { api } from "@/app/services/api"
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
      if (!user) return

      try {
        setLoading(true)
        const [messagesData, notificationsData] = await Promise.all([
          api.getMessages(user.id),
          api.getNotifications(user.id),
        ])
        setMessages(messagesData)
        setNotifications(notificationsData)
        setError(null)
      } catch (err) {
        setError("Failed to fetch communications data")
        toast({
          title: "Error",
          description: "Failed to load communications data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewMessage((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setNewMessage((prev) => ({ ...prev, [id]: value }))
  }

  // Handle message sending
  const handleSendMessage = async () => {
    if (!user) return

    try {
      setLoading(true)
      const sentMessage = await api.sendMessage({
        senderId: user.id,
        senderName: user.name,
        ...newMessage,
      })
      setMessages((prev) => [...prev, sentMessage])
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
      await api.deleteMessage(id)
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
      await api.deleteNotification(id)
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
      setLoading(true)
      const updatedNotification = await api.markNotificationAsRead(id)
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? updatedNotification : notification)),
      )
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    To
                  </label>
                  <Select onValueChange={(value) => handleSelectChange("recipientId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="U001">Admin User</SelectItem>
                      <SelectItem value="U002">Dr. Robert Chen</SelectItem>
                      <SelectItem value="U003">Dr. Sarah Johnson</SelectItem>
                      <SelectItem value="U004">John Smith</SelectItem>
                      <SelectItem value="U005">Emma Johnson</SelectItem>
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
                  className="w-full"
                  onClick={handleSendMessage}
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
                <div className="flex justify-center items-center h-64 text-red-500">
                  <p>{error}</p>
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

function Badge({ className, variant, ...props }) {
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

