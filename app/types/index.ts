export interface Student {
  id: string
  name: string
  email: string
  department: string
  year: string
  gpa: string
}

// Lecturer interface (renamed from Faculty)
// Define the Lecturer type (previously Faculty)
export type Lecturer = {
  id: string
  name: string
  email: string
  department: string
  position: string
  courses: number
}

// For backward compatibility
export type Faculty = Lecturer

// Course interface
export interface Course {
  id: string
  name: string
  department: string
  credits: number
  instructor: string
  students: number
  status: string
  subjectIds: string[]
}

// Subject interface
export interface Subject {
  id: string
  name: string
  code: string
  description: string
  credits: number
  department: string
  courseIds: string[]
}

// Facility interface
export interface Facility {
  id: string
  name: string
  type: string
  capacity: number
  rooms: number
  status: string
}

// Reservation interface
export interface Reservation {
  id: string
  facility: string
  room: string
  purpose: string
  date: string
  time: string
  requestedBy: string
  status: string
}

// Batch interface
export interface Batch {
  id: string
  name: string
  startDate: string
  endDate: string
  department: string
  coordinator: string
  students: number
  status: string
  courses?: string[] // Add courses field
}

// Enrollment interface
export interface Enrollment {
  id: string
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  batchId: string
  batchName: string
  enrollmentDate: string
  status: string
  grade?: string
}

// Event interface
export interface Event {
  id: string
  title: string
  description: string
  type: string
  organizer: string
  location: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  attendees: number
  status: string
}

// Message interface
export interface Message {
  id: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  subject: string
  content: string
  timestamp: string
  isRead: boolean
}

// Notification interface
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: string
  timestamp: string
  isRead: boolean
  link?: string
}

// Resource interface
export interface Resource {
  id: string
  name: string
  type: string
  location: string
  status: string
  lastCheckedOut?: string
  checkedOutBy?: string
}

// User interface
export interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
  profileImage?: string
  lastLogin: string
}

// Dashboard Stats interface
export interface DashboardStats {
  totalStudents: number
  totalFaculty: number
  activeCourses: number
  facilities: number
  activeEvents: number
  resourceUtilization: number
}

// Attendance Data interface
export interface AttendanceData {
  name: string
  value: number
}

// Department Data interface
export interface DepartmentData {
  name: string
  value: number
}

// Event Attendance Data interface
export interface EventAttendanceData {
  name: string
  academic: number
  social: number
  workshop: number
}

// Resource Utilization Data interface
export interface ResourceUtilizationData {
  name: string
  value: number
  target: number
}

// Schedule Event interface
export interface ScheduleEvent {
  id: string
  title: string
  courseCode: string
  instructor: string
  location: string
  day: string
  startTime: string
  endTime: string
  type: string
}

// Schedule Notification interface
export interface ScheduleNotification {
  id: string
  title: string
  message: string
  date: string
  isRead: boolean
  type: string
}

// Collaboration Group interface
export interface CollaborationGroup {
  id: string
  name: string
  description: string
  department: string
  members: CollaborationMember[]
}

// Collaboration Member interface
export interface CollaborationMember {
  id: string
  name: string
  role?: string
  email: string
  department: string
}

// Collaboration Message interface
export interface CollaborationMessage {
  id: string
  groupId: string
  sender: string
  time: string
  content: string
}

// Collaboration File interface
export interface CollaborationFile {
  id: string
  groupId: string
  name: string
  size: string
  date: string
  uploadedBy: string
}

// Collaboration Task interface
export interface CollaborationTask {
  id: string
  groupId: string
  title: string
  description: string
  priority: string
  dueDate: string
  status: string
  assignee?: string
}

