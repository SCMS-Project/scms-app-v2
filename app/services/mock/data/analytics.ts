// Mock data for enhanced analytics dashboard

// 1. Resource Utilization Analytics
export const mockResourceUtilizationData = [
  { month: "Jan", classrooms: 65, labs: 40, library: 80 },
  { month: "Feb", classrooms: 70, labs: 45, library: 75 },
  { month: "Mar", classrooms: 75, labs: 50, library: 85 },
  { month: "Apr", classrooms: 80, labs: 55, library: 80 },
  { month: "May", classrooms: 85, labs: 60, library: 90 },
  { month: "Jun", classrooms: 90, labs: 65, library: 85 },
]

export const mockEquipmentBorrowingTrends = [
  { name: "Projectors", count: 120 },
  { name: "Laptops", count: 95 },
  { name: "Audio Systems", count: 65 },
  { name: "Cameras", count: 45 },
  { name: "Whiteboards", count: 30 },
]

export const mockResourceConflicts = [
  { resource: "Main Auditorium", conflicts: 12, utilization: 85 },
  { resource: "Computer Lab A", conflicts: 8, utilization: 92 },
  { resource: "Conference Room", conflicts: 15, utilization: 78 },
  { resource: "Science Lab", conflicts: 5, utilization: 65 },
  { resource: "Library Study Rooms", conflicts: 20, utilization: 95 },
]

export const mockPeakUsageHours = [
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

// 2. Event Attendance Analytics
export const mockEventAttendanceData = [
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

export const mockPopularEventsData = [
  { name: "Career Fair", attendees: 420, satisfaction: 4.5 },
  { name: "Student Orientation", attendees: 220, satisfaction: 4.2 },
  { name: "Research Symposium", attendees: 180, satisfaction: 4.7 },
  { name: "Alumni Networking", attendees: 110, satisfaction: 3.9 },
  { name: "Tech Workshop", attendees: 65, satisfaction: 4.8 },
]

export const mockEventTypeEngagement = [
  { type: "Academic Seminars", avgAttendance: 75, totalEvents: 12 },
  { type: "Workshops", avgAttendance: 85, totalEvents: 8 },
  { type: "Student Activities", avgAttendance: 90, totalEvents: 15 },
  { type: "Career Events", avgAttendance: 82, totalEvents: 5 },
  { type: "Cultural Events", avgAttendance: 88, totalEvents: 7 },
]

export const mockDropoffRates = [
  { event: "Student Orientation", registeredOnly: 30, percentage: 12 },
  { event: "Career Fair", registeredOnly: 80, percentage: 16 },
  { event: "Tech Workshop", registeredOnly: 15, percentage: 19 },
  { event: "Alumni Networking", registeredOnly: 40, percentage: 27 },
  { event: "Research Symposium", registeredOnly: 20, percentage: 10 },
]

// 3. Campus Involvement Analytics
export const mockStudentParticipationData = [
  { level: "High (5+ events)", students: 120, percentage: 15 },
  { level: "Medium (3-4 events)", students: 250, percentage: 31 },
  { level: "Low (1-2 events)", students: 320, percentage: 40 },
  { level: "None", students: 110, percentage: 14 },
]

export const mockFacultyInvolvementData = [
  { department: "Computer Science", involvement: 85 },
  { department: "Business", involvement: 70 },
  { department: "Engineering", involvement: 75 },
  { department: "Arts", involvement: 60 },
  { department: "Sciences", involvement: 80 },
]

export const mockCollaborationMetricsData = [
  { metric: "Group Discussions", count: 450, growth: 15 },
  { metric: "File Sharing", count: 820, growth: 25 },
  { metric: "Messaging", count: 1250, growth: 30 },
  { metric: "Video Conferences", count: 180, growth: 40 },
  { metric: "Collaborative Documents", count: 320, growth: 20 },
]

// 4. Scheduling Efficiency Analytics
export const mockSchedulingEffectivenessData = [
  { week: "Week 1", conflicts: 12, utilization: 75 },
  { week: "Week 2", conflicts: 8, utilization: 80 },
  { week: "Week 3", conflicts: 15, utilization: 70 },
  { week: "Week 4", conflicts: 10, utilization: 85 },
  { week: "Week 5", conflicts: 5, utilization: 90 },
]

export const mockCancellationPatternsData = [
  { reason: "Lecturer Unavailable", count: 25, percentage: 35 },
  { reason: "Low Registration", count: 15, percentage: 21 },
  { reason: "Facility Issues", count: 10, percentage: 14 },
  { reason: "Weather Conditions", count: 8, percentage: 11 },
  { reason: "Scheduling Conflict", count: 12, percentage: 17 },
  { reason: "Other", count: 2, percentage: 2 },
]

export const mockTimeSlotPopularityData = [
  { slot: "8:00 - 10:00", popularity: 65 },
  { slot: "10:00 - 12:00", popularity: 90 },
  { slot: "12:00 - 14:00", popularity: 75 },
  { slot: "14:00 - 16:00", popularity: 85 },
  { slot: "16:00 - 18:00", popularity: 70 },
  { slot: "18:00 - 20:00", popularity: 40 },
]

