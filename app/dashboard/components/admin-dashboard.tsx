"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, BarChart3, Bell, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for metrics
  const metrics = {
    totalEvents: { value: 245, change: "+12% from last month" },
    activeUsers: { value: "1,892", change: "+5% from last month" },
    resourceUtilization: { value: "78%", change: "+18% from last month" },
    announcements: { value: 32, change: "+2 from yesterday" },
  }

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Computer Science Seminar",
      time: "Today, 2:00 PM",
      location: "Building A, Room 101",
      organizer: "Dr. Smith",
      category: "Academic",
    },
    {
      id: 2,
      title: "Student Council Meeting",
      time: "Tomorrow, 10:00 AM",
      location: "Student Center",
      organizer: "Jane Doe",
      category: "Administrative",
    },
    {
      id: 3,
      title: "Campus Art Exhibition",
      time: "Mar 16, 3:00 PM",
      location: "Art Gallery",
      organizer: "Prof. Johnson",
      category: "Cultural",
    },
    {
      id: 4,
      title: "Basketball Tournament",
      time: "Mar 17, 5:00 PM",
      location: "Sports Complex",
      organizer: "Coach Williams",
      category: "Sports",
    },
  ]

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "Academic":
        return "bg-blue-500/10 text-blue-500"
      case "Administrative":
        return "bg-gray-500/10 text-gray-500"
      case "Cultural":
        return "bg-purple-500/10 text-purple-500"
      case "Sports":
      case "Networking":
        return "bg-red-500/10 text-red-500"
      case "Training":
        return "bg-gray-500/10 text-gray-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Campus management overview</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalEvents.value}</div>
                <p className="text-xs text-muted-foreground">{metrics.totalEvents.change}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeUsers.value}</div>
                <p className="text-xs text-muted-foreground">{metrics.activeUsers.change}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.resourceUtilization.value}</div>
                <p className="text-xs text-muted-foreground">{metrics.resourceUtilization.change}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.announcements.value}</div>
                <p className="text-xs text-muted-foreground">{metrics.announcements.change}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Resource Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <p className="text-sm text-muted-foreground">Campus resource usage over the past 30 days</p>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Resource utilization graph will be implemented here
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <p className="text-sm text-muted-foreground">Events scheduled for the next 7 days</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <Avatar className="mt-1">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback>EV</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{event.title}</p>
                          <Badge className={`${getCategoryStyle(event.category)}`} variant="secondary">
                            {event.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> {event.time} • {event.location}
                        </p>
                        <p className="text-sm text-muted-foreground">Organized by: {event.organizer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <p className="text-sm text-muted-foreground">Recently completed campus events</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: "Lecturers Development Workshop",
                    date: "Mar 10, 2025",
                    location: "Conference Hall",
                    attendees: 45,
                    organizer: "Dr. Anderson",
                    category: "Training",
                  },
                  {
                    id: 2,
                    title: "Annual Science Fair",
                    date: "Mar 8, 2025",
                    location: "Main Campus",
                    attendees: 320,
                    organizer: "Science Department",
                    category: "Academic",
                  },
                  {
                    id: 3,
                    title: "Alumni Networking Event",
                    date: "Mar 5, 2025",
                    location: "Alumni Center",
                    attendees: 120,
                    organizer: "Alumni Association",
                    category: "Networking",
                  },
                  {
                    id: 4,
                    title: "Campus Sustainability Meeting",
                    date: "Mar 3, 2025",
                    location: "Green Building, Room 202",
                    attendees: 35,
                    organizer: "Sustainability Committee",
                    category: "Administrative",
                  },
                ].map((event) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <Avatar className="mt-1">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                      <AvatarFallback>EV</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">{event.title}</p>
                        <Badge
                          className={`${getCategoryStyle(
                            event.category === "Training"
                              ? "Administrative"
                              : event.category === "Networking"
                                ? "Sports"
                                : event.category,
                          )}`}
                          variant="secondary"
                        >
                          {event.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.date} • {event.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Attendees: {event.attendees} • Organized by: {event.organizer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Events Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Events management content will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resources Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Resources management content will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">View comprehensive analytics and insights about campus operations.</p>
              <a
                href="/dashboard/analytics"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                View Full Analytics Dashboard
              </a>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

