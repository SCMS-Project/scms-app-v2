"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Menu, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "../contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import type { Notification } from "../types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/app/components/theme-toggle"

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void
  isSidebarOpen: boolean
}

export default function Header({ setIsSidebarOpen, isSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [scheduleNotifications, setScheduleNotifications] = useState<any[]>([])
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prefetch the home page for faster navigation
  useEffect(() => {
    router.prefetch("/")
  }, [router])

  // Fetch all notifications when user changes, component mounts, or dialog opens
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return

      try {
        // Only show loading indicator when dialog is open
        if (isNotificationsOpen) {
          setLoading(true)
        }

        // Check if the API methods exist before calling them
        let generalData = []
        let scheduleData = []

        // Use the correct API methods based on what's available
        if (typeof api.getNotifications === "function") {
          generalData = await api.getNotifications(user.id)
        } else if (typeof api.getMessages === "function") {
          // Fallback to getMessages if getNotifications doesn't exist
          generalData = await api.getMessages(user.id)
        } else {
          console.warn("No notification API method available")
        }

        // For schedule notifications
        if (typeof api.getScheduleNotifications === "function") {
          scheduleData = await api.getScheduleNotifications(user.id)
        } else if (typeof api.getScheduleEvents === "function") {
          // Fallback to schedule events if schedule notifications don't exist
          const events = await api.getScheduleEvents()
          // Convert events to notification format if needed
          scheduleData = events.map((event) => ({
            id: event.id,
            title: event.title || "Schedule Update",
            message: event.description || "Your schedule has been updated",
            date: event.date || new Date().toISOString(),
            type: "Reminder",
            isRead: false,
          }))
        } else {
          console.warn("No schedule notification API method available")
        }

        setNotifications(generalData || [])
        setScheduleNotifications(scheduleData || [])
      } catch (error) {
        console.error("Error fetching notifications:", error)
        if (isNotificationsOpen) {
          toast({
            title: "Error",
            description: "Failed to load notifications. Please try again later.",
            variant: "destructive",
          })
        }
        // Set empty arrays as fallback
        setNotifications([])
        setScheduleNotifications([])
      } finally {
        if (isNotificationsOpen) {
          setLoading(false)
        }
      }
    }

    fetchNotifications()

    // Set up periodic refresh of notifications (every 2 minutes)
    const intervalId = setInterval(fetchNotifications, 120000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [user, isNotificationsOpen, toast])

  const handleLogout = () => {
    // First navigate to home page, then logout
    router.push("/")

    // Small delay to ensure navigation starts before state changes
    setTimeout(() => {
      logout()
    }, 50)
  }

  const handleMarkAsRead = async (id: string, isSchedule = false) => {
    try {
      if (isSchedule) {
        // Check if the API method exists
        if (typeof api.markScheduleNotificationAsRead === "function") {
          await api.markScheduleNotificationAsRead(id)
        } else {
          console.warn("markScheduleNotificationAsRead method not available")
        }
        // Update UI state regardless of API availability
        setScheduleNotifications((prev) =>
          prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
        )
      } else {
        // Check if the API method exists
        if (typeof api.markNotificationAsRead === "function") {
          await api.markNotificationAsRead(id)
        } else {
          console.warn("markNotificationAsRead method not available")
        }
        // Update UI state regardless of API availability
        setNotifications((prev) =>
          prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
        )
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all notifications as read based on active tab
      if (activeTab === "all" || activeTab === "general") {
        if (typeof api.markNotificationAsRead === "function") {
          await Promise.all(notifications.filter((n) => !n.isRead).map((n) => api.markNotificationAsRead(n.id)))
        }
        // Update UI state regardless of API availability
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      }

      if (activeTab === "all" || activeTab === "schedule") {
        if (typeof api.markScheduleNotificationAsRead === "function") {
          await Promise.all(
            scheduleNotifications.filter((n) => !n.isRead).map((n) => api.markScheduleNotificationAsRead(n.id)),
          )
        }
        // Update UI state regardless of API availability
        setScheduleNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      }

      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "Cancellation":
        return <XCircle className="h-4 w-4" />
      case "Reschedule":
        return <Clock className="h-4 w-4" />
      case "RoomChange":
        return <MapPin className="h-4 w-4" />
      case "NewClass":
        return <BookOpen className="h-4 w-4" />
      case "Reminder":
        return <Bell className="h-4 w-4" />
      case "Registration":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // Get notification icon color based on type
  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case "Cancellation":
        return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
      case "Reschedule":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
      case "RoomChange":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
      case "NewClass":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
      case "Reminder":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
      case "Registration":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  // Count unread notifications with defensive checks
  const unreadGeneralCount = notifications?.filter((n) => !n?.isRead)?.length || 0
  const unreadScheduleCount = scheduleNotifications?.filter((n) => !n?.isRead)?.length || 0
  const totalUnreadCount = unreadGeneralCount + unreadScheduleCount

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="mr-2 flex-shrink-0"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="flex items-center gap-2 font-bold text-xl">Smart Campus Management System</div>

      <div className="ml-auto flex items-center gap-4">
        <ThemeToggle />

        {user && (
          <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {totalUnreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
                  >
                    {totalUnreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
                <DialogDescription>Stay updated with important campus information</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All
                    {totalUnreadCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {totalUnreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="general">
                    General
                    {unreadGeneralCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {unreadGeneralCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="schedule">
                    Schedule
                    {unreadScheduleCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {unreadScheduleCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <ScrollArea className="h-[350px] pr-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : [...notifications, ...scheduleNotifications].length > 0 ? (
                      <div className="space-y-4 mt-2">
                        {[...notifications, ...scheduleNotifications]
                          .sort(
                            (a, b) =>
                              new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime(),
                          )
                          .map((notification) => {
                            const isScheduleNotification = "type" in notification
                            return (
                              <div
                                key={notification.id}
                                className={`p-4 border rounded-lg ${notification.isRead ? "bg-background" : "bg-muted"}`}
                                onClick={() =>
                                  !notification.isRead && handleMarkAsRead(notification.id, isScheduleNotification)
                                }
                              >
                                <div className="flex items-start gap-4">
                                  {isScheduleNotification && (
                                    <div className={`p-2 rounded-full ${getNotificationIconColor(notification.type)}`}>
                                      {getNotificationIcon(notification.type)}
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-semibold">{notification.title}</h4>
                                      <span className="text-xs text-muted-foreground">
                                        {formatDate(notification.timestamp || notification.date)}
                                      </span>
                                    </div>
                                    <p className="text-sm mt-1">{notification.message}</p>
                                    {notification.link && (
                                      <Link
                                        href={notification.link}
                                        className="text-sm text-primary hover:underline mt-2 inline-block"
                                      >
                                        View details
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-40 text-muted-foreground">
                        No notifications
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="general">
                  <ScrollArea className="h-[350px] pr-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : notifications.length > 0 ? (
                      <div className="space-y-4 mt-2">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border rounded-lg ${notification.isRead ? "bg-background" : "bg-muted"}`}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">{notification.title}</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(notification.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm mt-1">{notification.message}</p>
                                {notification.link && (
                                  <Link
                                    href={notification.link}
                                    className="text-sm text-primary hover:underline mt-2 inline-block"
                                  >
                                    View details
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-40 text-muted-foreground">
                        No general notifications
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="schedule">
                  <ScrollArea className="h-[350px] pr-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : scheduleNotifications.length > 0 ? (
                      <div className="space-y-4 mt-2">
                        {scheduleNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border rounded-lg ${notification.isRead ? "bg-background" : "bg-muted"}`}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification.id, true)}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-full ${getNotificationIconColor(notification.type)}`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">{notification.title}</h4>
                                  <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                                </div>
                                <p className="text-sm mt-1">{notification.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-40 text-muted-foreground">
                        No schedule notifications
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={
                    (activeTab === "all" && totalUnreadCount === 0) ||
                    (activeTab === "general" && unreadGeneralCount === 0) ||
                    (activeTab === "schedule" && unreadScheduleCount === 0)
                  }
                >
                  Mark all as read
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <p className="text-xs font-medium text-muted-foreground">{user.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

// Missing imports
function XCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

