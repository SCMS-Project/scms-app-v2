// Mock data for dashboard analytics

// Resource utilization data
export const mockResourceUtilizationData = [
  { month: "Jan", classrooms: 65, labs: 40, library: 80 },
  { month: "Feb", classrooms: 70, labs: 45, library: 75 },
  { month: "Mar", classrooms: 75, labs: 50, library: 85 },
  { month: "Apr", classrooms: 80, labs: 55, library: 80 },
  { month: "May", classrooms: 85, labs: 60, library: 90 },
  { month: "Jun", classrooms: 90, labs: 65, library: 85 },
]

// Enrollment trends data
export const mockEnrollmentTrendsData = [
  { year: "2018", students: 1200 },
  { year: "2019", students: 1400 },
  { year: "2020", students: 1300 },
  { year: "2021", students: 1500 },
  { year: "2022", students: 1700 },
  { year: "2023", students: 1900 },
]

// Course popularity data
export const mockCoursePopularityData = [
  { name: "Computer Science", value: 35 },
  { name: "Business", value: 25 },
  { name: "Engineering", value: 20 },
  { name: "Arts", value: 15 },
  { name: "Others", value: 5 },
]

// Dashboard stats
export const mockDashboardStats = {
  totalStudents: 5234,
  totalCourses: 187,
  totalLecturers: 120,
  totalFacilities: 45,
  activeEvents: 12,
  activeEnrollments: 4500,
  resourceUtilization: 78,
  upcomingEvents: 8,
  recentActivity: [
    { id: "act1", description: "New course added: Advanced Web Development", timestamp: "2023-09-10T10:30:00" },
    { id: "act2", description: "Student enrollment: John Doe in CS101", timestamp: "2023-09-09T14:15:00" },
    { id: "act3", description: "Facility reservation: Main Hall for Orientation", timestamp: "2023-09-08T09:45:00" },
    { id: "act4", description: "New lecturer joined: Dr. Sarah Johnson", timestamp: "2023-09-07T11:20:00" },
    { id: "act5", description: "Course schedule updated: Database Systems", timestamp: "2023-09-06T16:10:00" },
  ],
}

