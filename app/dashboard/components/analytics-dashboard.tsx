"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { api } from "@/app/services/api"
import { useToast } from "@/hooks/use-toast"

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658"]

// Default mock data for fallbacks
const defaultResourceUtilizationData = [
  { month: "Jan", classrooms: 65, labs: 40, library: 80 },
  { month: "Feb", classrooms: 70, labs: 45, library: 75 },
  { month: "Mar", classrooms: 75, labs: 50, library: 85 },
  { month: "Apr", classrooms: 80, labs: 55, library: 80 },
  { month: "May", classrooms: 85, labs: 60, library: 90 },
  { month: "Jun", classrooms: 90, labs: 65, library: 85 },
]

const defaultEquipmentBorrowingTrends = [
  { name: "Projectors", count: 120 },
  { name: "Laptops", count: 95 },
  { name: "Audio Systems", count: 65 },
  { name: "Cameras", count: 45 },
  { name: "Whiteboards", count: 30 },
]

const defaultPeakUsageHours = [
  { hour: "8-9", usage: 45 },
  { hour: "9-10", usage: 65 },
  { hour: "10-11", usage: 85 },
  { hour: "11-12", usage: 90 },
  { hour: "12-13", usage: 75 },
  { hour: "13-14", usage: 70 },
  { hour: "14-15", usage: 80 },
  { hour: "15-16", usage: 85 },
  { hour: "16-17", usage: 70 },
  { hour: "17-18", usage: 50 },
  { hour: "18-19", usage: 30 },
]

const defaultEventAttendanceData = [
  {
    event: "Student Orientation",
    registered: 250,
    attended: 220,
    capacity: 300,
  },
  {
    event: "Career Fair",
    registered: 500,
    attended: 420,
    capacity: 600,
  },
  {
    event: "Tech Workshop",
    registered: 80,
    attended: 65,
    capacity: 100,
  },
  {
    event: "Alumni Networking",
    registered: 150,
    attended: 110,
    capacity: 200,
  },
  {
    event: "Research Symposium",
    registered: 200,
    attended: 180,
    capacity: 250,
  },
]

const defaultStudentParticipationData = [
  { level: "High (5+ events)", students: 120, percentage: 15 },
  { level: "Medium (3-4 events)", students: 250, percentage: 31 },
  { level: "Low (1-2 events)", students: 320, percentage: 40 },
  { level: "None", students: 110, percentage: 14 },
]

const defaultSchedulingEffectivenessData = [
  { week: "Week 1", conflicts: 12, utilization: 75 },
  { week: "Week 2", conflicts: 8, utilization: 80 },
  { week: "Week 3", conflicts: 15, utilization: 70 },
  { week: "Week 4", conflicts: 10, utilization: 85 },
  { week: "Week 5", conflicts: 5, utilization: 90 },
]

const defaultDashboardStats = {
  totalStudents: 250,
  totalCourses: 45,
  totalLecturers: 30,
  activeEnrollments: 1200,
  recentActivity: [
    { id: "act1", description: "New course added: Advanced Web Development", timestamp: "2023-09-10T10:30:00" },
    { id: "act2", description: "Student enrollment: John Doe in CS101", timestamp: "2023-09-09T14:15:00" },
  ],
}

export function AnalyticsDashboard() {
  // State for our data
  const [dashboardStats, setDashboardStats] = useState(defaultDashboardStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  // Resource Utilization Analytics
  const [resourceUtilizationData, setResourceUtilizationData] = useState(defaultResourceUtilizationData)
  const [equipmentBorrowingTrends, setEquipmentBorrowingTrends] = useState(defaultEquipmentBorrowingTrends)
  const [resourceConflicts, setResourceConflicts] = useState([])
  const [peakUsageHours, setPeakUsageHours] = useState(defaultPeakUsageHours)

  // Event Attendance Analytics
  const [eventAttendanceData, setEventAttendanceData] = useState(defaultEventAttendanceData)
  const [popularEventsData, setPopularEventsData] = useState([])
  const [eventTypeEngagement, setEventTypeEngagement] = useState([])
  const [dropoffRates, setDropoffRates] = useState([])

  // Campus Involvement Analytics
  const [studentParticipationData, setStudentParticipationData] = useState(defaultStudentParticipationData)
  const [facultyInvolvementData, setFacultyInvolvementData] = useState([])
  const [collaborationMetricsData, setCollaborationMetricsData] = useState([])

  // Scheduling Efficiency Analytics
  const [schedulingEffectivenessData, setSchedulingEffectivenessData] = useState(defaultSchedulingEffectivenessData)
  const [cancellationPatternsData, setCancellationPatternsData] = useState([])
  const [timeSlotPopularityData, setTimeSlotPopularityData] = useState([])

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch dashboard stats
        try {
          if (typeof api.getDashboardStats === "function") {
            const stats = await api.getDashboardStats()
            if (stats && typeof stats === "object") {
              // Ensure recentActivity exists and is an array
              if (!stats.recentActivity || !Array.isArray(stats.recentActivity)) {
                stats.recentActivity = defaultDashboardStats.recentActivity
              }
              setDashboardStats(stats)
            } else {
              console.warn("Invalid dashboard stats returned from API, using default data")
              setDashboardStats(defaultDashboardStats)
            }
          } else {
            console.warn("API method getDashboardStats not available, using default data")
            setDashboardStats(defaultDashboardStats)
          }
        } catch (err) {
          console.warn("Error fetching dashboard stats:", err)
          setDashboardStats(defaultDashboardStats)
        }

        // Resource Utilization Analytics
        try {
          if (typeof api.getResourceUtilizationData === "function") {
            const data = await api.getResourceUtilizationData()
            if (data && Array.isArray(data) && data.length > 0) {
              setResourceUtilizationData(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching resource utilization data:", err)
        }

        try {
          if (typeof api.getEquipmentBorrowingTrends === "function") {
            const data = await api.getEquipmentBorrowingTrends()
            if (data && Array.isArray(data) && data.length > 0) {
              setEquipmentBorrowingTrends(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching equipment borrowing trends:", err)
        }

        try {
          if (typeof api.getResourceConflicts === "function") {
            const data = await api.getResourceConflicts()
            if (data && Array.isArray(data) && data.length > 0) {
              setResourceConflicts(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching resource conflicts:", err)
        }

        try {
          if (typeof api.getPeakUsageHours === "function") {
            const data = await api.getPeakUsageHours()
            if (data && Array.isArray(data) && data.length > 0) {
              setPeakUsageHours(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching peak usage hours:", err)
        }

        // Event Attendance Analytics
        try {
          if (typeof api.getEventAttendanceData === "function") {
            const data = await api.getEventAttendanceData()
            if (data && Array.isArray(data) && data.length > 0) {
              setEventAttendanceData(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching event attendance data:", err)
        }

        try {
          if (typeof api.getPopularEventsData === "function") {
            const data = await api.getPopularEventsData()
            if (data && Array.isArray(data) && data.length > 0) {
              setPopularEventsData(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching popular events data:", err)
        }

        try {
          if (typeof api.getEventTypeEngagement === "function") {
            const data = await api.getEventTypeEngagement()
            if (data && Array.isArray(data) && data.length > 0) {
              setEventTypeEngagement(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching event type engagement:", err)
        }

        try {
          if (typeof api.getDropoffRates === "function") {
            const data = await api.getDropoffRates()
            if (data && Array.isArray(data) && data.length > 0) {
              setDropoffRates(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching dropoff rates:", err)
        }

        // Campus Involvement Analytics
        try {
          if (typeof api.getStudentParticipationData === "function") {
            const data = await api.getStudentParticipationData()
            if (data && Array.isArray(data) && data.length > 0) {
              setStudentParticipationData(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching student participation data:", err)
        }

        try {
          if (typeof api.getFacultyInvolvementData === "function") {
            const data = await api.getFacultyInvolvementData()
            if (data && Array.isArray(data) && data.length > 0) {
              setFacultyInvolvementData(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching faculty involvement data:", err)
        }

        try {
          if (typeof api.getCollaborationMetricsData === "function") {
            const data = await api.getCollaborationMetricsData()
            if (data && Array.isArray(data) && data.length > 0) {
              setCollaborationMetricsData(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching collaboration metrics data:", err)
        }

        // Scheduling Efficiency Analytics
        try {
          if (typeof api.getSchedulingEffectivenessData === "function") {
            const data = await api.getSchedulingEffectivenessData()
            if (data && Array.isArray(data) && data.length > 0) {
              setSchedulingEffectivenessData(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching scheduling effectiveness data:", err)
        }

        try {
          if (typeof api.getCancellationPatternsData === "function") {
            const data = await api.getCancellationPatternsData()
            if (data && Array.isArray(data) && data.length > 0) {
              setCancellationPatternsData(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching cancellation patterns data:", err)
        }

        try {
          if (typeof api.getTimeSlotPopularityData === "function") {
            const data = await api.getTimeSlotPopularityData()
            if (data && Array.isArray(data) && data.length > 0) {
              setTimeSlotPopularityData(data)
            }
          }
        } catch (err) {
          console.warn("Error fetching time slot popularity data:", err)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching analytics data:", err)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Using default data instead.",
          variant: "destructive",
        })

        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Loading state
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading analytics data...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the latest information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="resource-utilization" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="resource-utilization">Resource Utilization</TabsTrigger>
          <TabsTrigger value="event-attendance">Event Attendance</TabsTrigger>
          <TabsTrigger value="campus-involvement">Campus Involvement</TabsTrigger>
          <TabsTrigger value="scheduling-efficiency">Scheduling Efficiency</TabsTrigger>
        </TabsList>

        {/* 1. Resource Utilization Analytics */}
        <TabsContent value="resource-utilization" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Classroom & Facility Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Classroom & Facility Usage</CardTitle>
                <CardDescription>Monthly utilization percentage of campus resources</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={resourceUtilizationData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="classrooms" fill="#8884d8" name="Classrooms" />
                      <Bar dataKey="labs" fill="#82ca9d" name="Labs" />
                      <Bar dataKey="library" fill="#ffc658" name="Library" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Equipment Borrowing Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Borrowing Trends</CardTitle>
                <CardDescription>Most frequently borrowed resources</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={equipmentBorrowingTrends}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 60,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Borrow Count" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Peak Usage Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Hours</CardTitle>
                <CardDescription>Busiest times for resource reservations</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={peakUsageHours}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="usage" stroke="#8884d8" fill="#8884d8" name="Usage %" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Resource Conflicts */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Availability & Conflicts</CardTitle>
                <CardDescription>Double-booking and underutilized resources</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="utilization" name="Utilization %" type="number" />
                      <YAxis dataKey="conflicts" name="Conflicts" type="number" />
                      <ZAxis dataKey="resource" name="Resource" />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Legend />
                      <Scatter name="Resources" data={resourceConflicts} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. Event Attendance Analytics */}
        <TabsContent value="event-attendance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Event Registration & Check-In Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Event Registration & Check-In Rates</CardTitle>
                <CardDescription>Comparison of registered vs. actual attendees</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={eventAttendanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 70,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="event" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="registered" fill="#8884d8" name="Registered" />
                      <Bar dataKey="attended" fill="#82ca9d" name="Attended" />
                      <Bar dataKey="capacity" fill="#ffc658" name="Capacity" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Most Popular Events */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Events</CardTitle>
                <CardDescription>Events with highest participation and satisfaction</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={popularEventsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 70,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="attendees" fill="#8884d8" name="Attendees" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="satisfaction"
                        stroke="#82ca9d"
                        name="Satisfaction (1-5)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Engagement by Event Type */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement by Event Type</CardTitle>
                <CardDescription>Comparison across different event categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius={90} data={eventTypeEngagement}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="type" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Avg. Attendance"
                        dataKey="avgAttendance"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Total Events"
                        dataKey="totalEvents"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Drop-off Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Drop-off Rates</CardTitle>
                <CardDescription>Registered attendees who didn't show up</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={dropoffRates}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 70,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="event" angle={-45} textAnchor="end" height={70} />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="registeredOnly" fill="#8884d8" name="No-shows" />
                      <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#82ca9d" name="Drop-off %" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. Campus Involvement Analytics */}
        <TabsContent value="campus-involvement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Student Participation Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Student Participation Levels</CardTitle>
                <CardDescription>Student engagement in campus activities</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={studentParticipationData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="students"
                        nameKey="level"
                      >
                        {studentParticipationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} students`, props.payload.level]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Lecturer & Staff Involvement */}
            <Card>
              <CardHeader>
                <CardTitle>Faculty Involvement</CardTitle>
                <CardDescription>Faculty participation in campus activities</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={facultyInvolvementData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="involvement" fill="#8884d8" name="Involvement %" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Collaboration Metrics */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Collaboration Metrics</CardTitle>
                <CardDescription>Student-teacher interaction via various tools</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={collaborationMetricsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Total Count" />
                      <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#82ca9d" name="Growth %" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 4. Scheduling Efficiency Analytics */}
        <TabsContent value="scheduling-efficiency" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Class & Exam Scheduling Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduling Effectiveness</CardTitle>
                <CardDescription>Conflicts and room utilization efficiency</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={schedulingEffectivenessData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="conflicts" stroke="#8884d8" name="Conflicts" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="utilization"
                        stroke="#82ca9d"
                        name="Utilization %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Cancellation & Reschedule Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Cancellation Patterns</CardTitle>
                <CardDescription>Reasons for schedule changes</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={cancellationPatternsData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="reason"
                      >
                        {cancellationPatternsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} cancellations`, props.payload.reason]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Time Slot Popularity */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Time Slot Popularity</CardTitle>
                <CardDescription>Preferred time slots for classes and events</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={timeSlotPopularityData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="slot" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="popularity" fill="#8884d8" name="Popularity %" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions and events in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardStats && dashboardStats.recentActivity && Array.isArray(dashboardStats.recentActivity) ? (
              dashboardStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent activity to display</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

