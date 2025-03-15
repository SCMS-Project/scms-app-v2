"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Users, BookOpen, Activity } from "lucide-react"
import {
  mockDashboardStats,
  mockAttendanceData,
  mockDepartmentData,
  mockEventAttendanceData,
  mockResourceUtilizationData,
} from "@/app/services/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("month")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState(mockDashboardStats)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  // Attendance data for line chart
  const attendanceData = mockAttendanceData

  // Department distribution data for pie chart
  const departmentData = mockDepartmentData

  // Event attendance data for bar chart
  const eventAttendanceData = mockEventAttendanceData

  // Resource utilization data for bar chart
  const resourceUtilizationData = mockResourceUtilizationData

  // Course enrollment trend data
  const courseEnrollmentData = [
    { name: "Jan", Computer_Science: 120, Business: 98, Engineering: 86, Medicine: 99, Arts: 85 },
    { name: "Feb", Computer_Science: 132, Business: 103, Engineering: 94, Medicine: 108, Arts: 87 },
    { name: "Mar", Computer_Science: 141, Business: 110, Engineering: 102, Medicine: 115, Arts: 90 },
    { name: "Apr", Computer_Science: 154, Business: 123, Engineering: 110, Medicine: 120, Arts: 95 },
    { name: "May", Computer_Science: 162, Business: 132, Engineering: 123, Medicine: 124, Arts: 100 },
    { name: "Jun", Computer_Science: 170, Business: 142, Engineering: 130, Medicine: 132, Arts: 105 },
  ]

  // Faculty performance data
  const facultyPerformanceData = [
    { name: "Dr. Chen", rating: 4.8, students: 120, publications: 15 },
    { name: "Dr. Johnson", rating: 4.6, students: 95, publications: 12 },
    { name: "Dr. Lee", rating: 4.9, students: 110, publications: 20 },
    { name: "Dr. Davis", rating: 4.5, students: 85, publications: 10 },
    { name: "Dr. Wilson", rating: 4.7, students: 100, publications: 18 },
  ]

  // Student performance data
  const studentPerformanceData = [
    { name: "CS", excellent: 35, good: 45, average: 15, poor: 5 },
    { name: "Business", excellent: 30, good: 40, average: 20, poor: 10 },
    { name: "Engineering", excellent: 40, good: 35, average: 20, poor: 5 },
    { name: "Medicine", excellent: 45, good: 40, average: 10, poor: 5 },
    { name: "Arts", excellent: 25, good: 45, average: 25, poor: 5 },
  ]

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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Grid */}
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
                <div className="text-2xl font-bold">{stats.activeCourses}</div>
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

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Attendance */}
            <Card>
              <CardHeader>
                <CardTitle>Student Attendance</CardTitle>
                <p className="text-sm text-muted-foreground">Daily attendance rate over the past week</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Attendance %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Student distribution by department</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Event Attendance</CardTitle>
              <p className="text-sm text-muted-foreground">Attendance by event type over the past 6 months</p>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="academic" fill="#8884d8" name="Academic Events" />
                    <Bar dataKey="social" fill="#82ca9d" name="Social Events" />
                    <Bar dataKey="workshop" fill="#ffc658" name="Workshops" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Performance by Department */}
            <Card>
              <CardHeader>
                <CardTitle>Student Performance by Department</CardTitle>
                <p className="text-sm text-muted-foreground">Performance distribution across departments</p>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="excellent" stackId="a" fill="#8884d8" name="Excellent" />
                      <Bar dataKey="good" stackId="a" fill="#82ca9d" name="Good" />
                      <Bar dataKey="average" stackId="a" fill="#ffc658" name="Average" />
                      <Bar dataKey="poor" stackId="a" fill="#ff8042" name="Poor" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Student Enrollment Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Student Enrollment Trend</CardTitle>
                <p className="text-sm text-muted-foreground">Enrollment trends over time</p>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={courseEnrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Computer_Science" stroke="#8884d8" name="Computer Science" />
                      <Line type="monotone" dataKey="Business" stroke="#82ca9d" name="Business" />
                      <Line type="monotone" dataKey="Engineering" stroke="#ffc658" name="Engineering" />
                      <Line type="monotone" dataKey="Medicine" stroke="#ff8042" name="Medicine" />
                      <Line type="monotone" dataKey="Arts" stroke="#0088FE" name="Arts" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Student Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Student Demographics</CardTitle>
              <p className="text-sm text-muted-foreground">Demographic breakdown of student population</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Domestic", value: 3500 },
                        { name: "International", value: 1734 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#8884d8" />
                      <Cell fill="#82ca9d" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Course Popularity */}
            <Card>
              <CardHeader>
                <CardTitle>Course Popularity</CardTitle>
                <p className="text-sm text-muted-foreground">Most popular courses by enrollment</p>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "CS101", students: 145 },
                        { name: "BUS202", students: 138 },
                        { name: "ENG301", students: 130 },
                        { name: "MED101", students: 125 },
                        { name: "ART205", students: 115 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" fill="#8884d8" name="Enrolled Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Course Completion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Course Completion Rates</CardTitle>
                <p className="text-sm text-muted-foreground">Completion rates by department</p>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Computer Science", completion: 92 },
                        { name: "Business", completion: 88 },
                        { name: "Engineering", completion: 94 },
                        { name: "Medicine", completion: 96 },
                        { name: "Arts", completion: 90 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completion" fill="#82ca9d" name="Completion Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">Distribution of grades across all courses</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "A", value: 1250 },
                        { name: "B", value: 1800 },
                        { name: "C", value: 1400 },
                        { name: "D", value: 580 },
                        { name: "F", value: 204 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#00C49F" />
                      <Cell fill="#0088FE" />
                      <Cell fill="#FFBB28" />
                      <Cell fill="#FF8042" />
                      <Cell fill="#FF0000" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Faculty Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Faculty Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Performance metrics for top faculty members</p>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facultyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="rating" fill="#8884d8" name="Rating (out of 5)" />
                      <Bar yAxisId="right" dataKey="publications" fill="#82ca9d" name="Publications" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Faculty by Department */}
            <Card>
              <CardHeader>
                <CardTitle>Faculty by Department</CardTitle>
                <p className="text-sm text-muted-foreground">Distribution of faculty across departments</p>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Computer Science", value: 45 },
                          { name: "Business", value: 65 },
                          { name: "Engineering", value: 85 },
                          { name: "Medicine", value: 75 },
                          { name: "Arts", value: 50 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Faculty Workload */}
          <Card>
            <CardHeader>
              <CardTitle>Faculty Workload</CardTitle>
              <p className="text-sm text-muted-foreground">Average teaching hours and student load by department</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Computer Science", teachingHours: 18, studentLoad: 120 },
                      { name: "Business", teachingHours: 15, studentLoad: 150 },
                      { name: "Engineering", teachingHours: 20, studentLoad: 110 },
                      { name: "Medicine", teachingHours: 16, studentLoad: 90 },
                      { name: "Arts", teachingHours: 14, studentLoad: 100 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="teachingHours" fill="#8884d8" name="Teaching Hours/Week" />
                    <Bar yAxisId="right" dataKey="studentLoad" fill="#82ca9d" name="Student Load" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Resource Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <p className="text-sm text-muted-foreground">Utilization rates vs. targets</p>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resourceUtilizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Current Utilization (%)" />
                      <Bar dataKey="target" fill="#82ca9d" name="Target Utilization (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Facility Booking Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Facility Booking Trends</CardTitle>
                <p className="text-sm text-muted-foreground">Booking trends over the past 6 months</p>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { name: "Jan", classrooms: 85, labs: 70, conferenceRooms: 60 },
                        { name: "Feb", classrooms: 88, labs: 72, conferenceRooms: 65 },
                        { name: "Mar", classrooms: 90, labs: 75, conferenceRooms: 70 },
                        { name: "Apr", classrooms: 92, labs: 78, conferenceRooms: 72 },
                        { name: "May", classrooms: 95, labs: 80, conferenceRooms: 75 },
                        { name: "Jun", classrooms: 98, labs: 85, conferenceRooms: 80 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="classrooms" stroke="#8884d8" name="Classrooms (%)" />
                      <Line type="monotone" dataKey="labs" stroke="#82ca9d" name="Labs (%)" />
                      <Line type="monotone" dataKey="conferenceRooms" stroke="#ffc658" name="Conference Rooms (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
              <p className="text-sm text-muted-foreground">Current status of campus equipment</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Available", value: 120 },
                        { name: "In Use", value: 210 },
                        { name: "Maintenance", value: 30 },
                        { name: "Out of Order", value: 15 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#82ca9d" />
                      <Cell fill="#8884d8" />
                      <Cell fill="#ffc658" />
                      <Cell fill="#ff8042" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

