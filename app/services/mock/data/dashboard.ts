import type {
  DashboardStats,
  AttendanceData,
  DepartmentData,
  EventAttendanceData,
  ResourceUtilizationData,
} from "@/app/types"

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalStudents: 5234,
  totalFaculty: 320,
  activeCourses: 189,
  facilities: 42,
  activeEvents: 24,
  resourceUtilization: 78,
}

// Mock Attendance Data
export const mockAttendanceData: AttendanceData[] = [
  { name: "Mon", value: 85 },
  { name: "Tue", value: 90 },
  { name: "Wed", value: 88 },
  { name: "Thu", value: 92 },
  { name: "Fri", value: 78 },
]

// Mock Department Data
export const mockDepartmentData: DepartmentData[] = [
  { name: "Engineering", value: 400 },
  { name: "Business", value: 300 },
  { name: "Arts", value: 200 },
  { name: "Sciences", value: 250 },
  { name: "Medicine", value: 150 },
]

// Mock Event Attendance Data
export const mockEventAttendanceData: EventAttendanceData[] = [
  { name: "Sep", academic: 350, social: 280, workshop: 120 },
  { name: "Oct", academic: 400, social: 320, workshop: 180 },
  { name: "Nov", academic: 300, social: 250, workshop: 150 },
  { name: "Dec", academic: 200, social: 350, workshop: 100 },
  { name: "Jan", academic: 450, social: 400, workshop: 220 },
  { name: "Feb", academic: 500, social: 450, workshop: 250 },
]

// Resource Utilization Data
export const mockResourceUtilizationData: ResourceUtilizationData[] = [
  { name: "Classrooms", value: 85, target: 90 },
  { name: "Labs", value: 72, target: 80 },
  { name: "Equipment", value: 65, target: 75 },
  { name: "Study Spaces", value: 90, target: 85 },
  { name: "Conference Rooms", value: 60, target: 70 },
]

