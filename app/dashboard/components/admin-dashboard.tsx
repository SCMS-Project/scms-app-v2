"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Users, BookOpen, Activity, Calendar } from "lucide-react"
import { api } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("month")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>({
    totalStudents: 0,
    totalCourses: 0,
    totalFaculty: 0,
    resourceUtilization: 0,
  })
  const [resourceData, setResourceData] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch dashboard stats with fallback
      let statsData = {
        totalStudents: 0,
        totalLecturers: 0,
        totalCourses: 0,
        resourceUtilization: 0,
      }

      try {
        if (typeof api.getDashboardStats === "function") {
          statsData = await api.getDashboardStats()
        } else {
          // Fallback data
          statsData = {
            totalStudents: 1250,
            totalLecturers: 75,
            totalCourses: 120,
            resourceUtilization: 78,
          }
        }
      } catch (err) {
        console.warn("Error fetching dashboard stats, using fallback data")
      }

      setStats({
        ...statsData,
        totalFaculty: statsData.totalLecturers || 0, // Map totalLecturers to totalFaculty
      })

      // Fetch resource utilization data with fallback
      let resourceUtilization = []
      try {
        if (typeof api.getResourceUtilizationData === "function") {
          resourceUtilization = await api.getResourceUtilizationData()
        } else {
          // Fallback data
          resourceUtilization = [
            { resource: "Library", utilization: 80 },
            { resource: "Computer Lab", utilization: 90 },
            { resource: "Study Room", utilization: 70 },
            { resource: "Auditorium", utilization: 60 },
            { resource: "Cafeteria", utilization: 85 },
          ]
        }
      } catch (err) {
        console.warn("Error fetching resource utilization, using fallback data")
      }
      setResourceData(resourceUtilization || [])

      // Fetch events with fallback
      let events = []
      try {
        if (typeof api.getEvents === "function") {
          events = await api.getEvents()
        } else {
          // Fallback data
          const today = new Date()
          events = [
            {
              id: "event1",
              title: "Faculty Meeting",
              date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
              category: "Administrative",
            },
            {
              id: "event2",
              title: "Student Orientation",
              date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              category: "Academic",
            },
            {
              id: "event3",
              title: "Career Fair",
              date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              category: "Networking",
            },
            {
              id: "event4",
              title: "Workshop on Research Methods",
              date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
              category: "Academic",
            },
            {
              id: "event5",
              title: "Sports Day",
              date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              category: "Sports",
            },
          ]
        }
      } catch (err) {
        console.warn("Error fetching events, using fallback data")
      }

      // Filter and sort upcoming events
      if (Array.isArray(events)) {
        const now = new Date()
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        const upcoming = events
          .filter((event) => {
            if (!event.date) return false
            const eventDate = new Date(event.date)
            return eventDate >= now && eventDate <= sevenDaysFromNow
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5) // Show only next 5 events

        setUpcomingEvents(upcoming)
      } else {
        setUpcomingEvents([])
      }
    } catch (error) {
      console.error("Error in dashboard data flow:", error)
      setError("Failed to load dashboard data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-md">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive data insights for campus management</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">+5% from last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFaculty}</div>
            <p className="text-xs text-muted-foreground">+3% from last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resourceUtilization}%</div>
            <p className="text-xs text-muted-foreground">+8% from last semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
            <p className="text-sm text-muted-foreground">Campus resource usage over the past 30 days</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {resourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={resourceData}>
                    <defs>
                      <linearGradient id="colorUtilization" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="resource" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="utilization"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorUtilization)"
                      name="Utilization (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No resource utilization data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <p className="text-sm text-muted-foreground">Events scheduled for the next 7 days</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()} at{" "}
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Resource Utilization */}

            {/* Upcoming Events */}
          </div>

          {/* Recent Events */}
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
      {/* Rest of the dashboard components */}
    </div>
  )
}

