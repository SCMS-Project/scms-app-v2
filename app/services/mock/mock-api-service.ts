import type { ApiService } from "../interfaces/api-service"
import { mockUsers } from "./data/users"
import { mockCourses } from "./data/courses"
import { mockScheduleEvents } from "./data/schedule"
// Replace the incorrect import line:
// import { mockLecturers, mockStudents, mockFacilities, mockEvents, mockReservations, mockResources } from "../mock-data" // Import mock data

// With these correct imports from their respective files:
import { mockStudents } from "./data/students"
import { mockLecturers } from "./data/lecturers"
import { mockFacilities } from "./data/facilities"
import { mockEvents } from "./data/events"
import { mockReservations } from "./data/reservations"
import { mockResources } from "./data/resources"
// Import the mock subjects data
import { mockSubjects } from "./data/subjects"
import { mockMessages } from "./data/messages"
// Add these imports at the top of the file
import {
  mockCollaborationGroups,
  mockCollaborationMessages,
  mockCollaborationFiles,
  mockCollaborationTasks,
} from "./data/collaboration"

// Add these imports at the top of the file
import {
  mockResourceUtilizationData,
  mockEquipmentBorrowingTrends,
  mockResourceConflicts,
  mockPeakUsageHours,
  mockEventAttendanceData,
  mockPopularEventsData,
  mockEventTypeEngagement,
  mockDropoffRates,
  mockStudentParticipationData,
  mockFacultyInvolvementData,
  mockCollaborationMetricsData,
  mockSchedulingEffectivenessData,
  mockCancellationPatternsData,
  mockTimeSlotPopularityData,
} from "./data/analytics"

// Update the mockSubjects array to reference valid course IDs
// Assuming mockCourses has entries with IDs like "course-1", "course-2", etc.
const mockSubjectsOriginal = [
  {
    id: "subj-1",
    name: "Introduction to Computer Science",
    code: "CS101",
    description: "An introductory course to computer science principles",
    credits: 15,
    department: "Computer Science",
    courseIds: ["course-1", "course-2"],
  },
  {
    id: "subj-2",
    name: "Advanced Programming",
    code: "CS201",
    description: "Advanced programming concepts and techniques",
    credits: 30,
    department: "Computer Science",
    courseIds: ["course-3"],
  },
  {
    id: "subj-3",
    name: "Database Systems",
    code: "CS301",
    description: "Introduction to database design and management",
    credits: 30,
    department: "Computer Science",
    courseIds: ["course-4", "course-5"],
  },
  {
    id: "subj-4",
    name: "Business Ethics",
    code: "BUS101",
    description: "Ethical considerations in business practices",
    credits: 15,
    department: "Business",
    courseIds: ["course-6"],
  },
  {
    id: "subj-5",
    name: "Marketing Principles",
    code: "MKT101",
    description: "Introduction to marketing concepts and strategies",
    credits: 15,
    department: "Business",
    courseIds: ["course-7", "course-8"],
  },
]

export class MockApiService implements ApiService {
  // Auth
  async login(credentials: { email: string; password: string }) {
    console.log("Mock login attempt with:", credentials.email)
    const user = mockUsers.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase())
    if (!user) {
      console.error("User not found with email:", credentials.email)
      throw new Error("User not found")
    }
    console.log("User found:", user)
    return user
  }

  async register(userData: any) {
    return { ...userData, id: Date.now().toString() }
  }

  // Users
  async getUsers() {
    return mockUsers
  }

  async getUserById(id: string) {
    const user = mockUsers.find((u) => u.id === id)
    if (!user) throw new Error(`User with ID ${id} not found`)
    return user
  }

  // Courses
  async getCourses() {
    console.log("Mock API: Getting courses")
    return mockCourses
  }

  async getCourseById(id: string) {
    const course = mockCourses.find((c) => c.id === id)
    if (!course) throw new Error(`Course with ID ${id} not found`)
    return course
  }

  async createCourse(courseData: any) {
    console.log("Mock API: Creating course", courseData)
    const newCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      // Ensure all required fields have default values
      name: courseData.name || "Untitled Course",
      code: courseData.code || `CS${Math.floor(Math.random() * 1000)}`, // Improved code format
      department: courseData.department || "General",
      credits: courseData.credits || 30,
      students: courseData.students || 0,
      status: courseData.status || "Active",
    }
    return newCourse
  }

  async updateCourse(id: string, courseData: any) {
    console.log(`Mock API: Updating course with ID: ${id}`, courseData)
    // In a real implementation, this would update the course in the database
    // For mock purposes, we'll just return the updated course
    return {
      ...courseData,
      id,
    }
  }

  async deleteCourse(id: string) {
    // In a real implementation, this would remove the course from the database
    // For mock purposes, we'll just return success
    console.log(`Mock API: Deleting course with ID: ${id}`)
    return { success: true }
  }

  // Subjects
  async getSubjects() {
    console.log("Mock API: Getting subjects")
    try {
      // Return a copy of the array to avoid mutation issues
      if (Array.isArray(mockSubjects) && mockSubjects.length > 0) {
        return [...mockSubjects]
      } else {
        console.warn("mockSubjects is empty or not an array, returning fallback data")
        // Return fallback data
        return [
          {
            id: "SUB001",
            name: "Introduction to Programming",
            code: "CS101-A",
            description: "Fundamentals of programming using Python",
            credits: 2,
            department: "Computer Science",
            courseIds: ["CS101"],
          },
          {
            id: "SUB002",
            name: "Data Structures",
            code: "CS101-B",
            description: "Basic data structures and algorithms",
            credits: 2,
            department: "Computer Science",
            courseIds: ["CS101"],
          },
          {
            id: "SUB003",
            name: "Financial Accounting",
            code: "BUS202-A",
            description: "Principles of financial accounting",
            credits: 2,
            department: "Business",
            courseIds: ["BUS202"],
          },
        ]
      }
    } catch (error) {
      console.error("Error retrieving subjects:", error)
      // Return a fallback array if there's an error
      return [
        {
          id: "SUB001",
          name: "Introduction to Programming",
          code: "CS101-A",
          description: "Fundamentals of programming using Python",
          credits: 2,
          department: "Computer Science",
          courseIds: ["CS101"],
        },
        {
          id: "SUB002",
          name: "Data Structures",
          code: "CS101-B",
          description: "Basic data structures and algorithms",
          credits: 2,
          department: "Computer Science",
          courseIds: ["CS101"],
        },
      ]
    }
  }

  async getSubjectById(id: string) {
    console.log(`Mock API: Getting subject with ID: ${id}`)
    const subject = mockSubjects.find((s) => s.id === id)
    if (!subject) throw new Error(`Subject with ID ${id} not found`)
    return subject
  }

  async createSubject(subjectData: any) {
    console.log("Mock API: Creating subject", subjectData)
    const newSubject = {
      ...subjectData,
      id: `subj-${Date.now()}`,
      // Ensure all required fields have default values
      name: subjectData.name || "Untitled Subject",
      code: subjectData.code || `S${Math.floor(Math.random() * 1000)}`,
      department: subjectData.department || "General",
      credits: subjectData.credits || 15,
      courseIds: Array.isArray(subjectData.courseIds) ? subjectData.courseIds : [],
    }
    return newSubject
  }

  async deleteSubject(id: string) {
    console.log(`Mock API: Deleting subject with ID: ${id}`)
    return { success: true }
  }

  async updateSubject(id: string, subjectData: any) {
    console.log(`Mock API: Updating subject with ID: ${id}`, subjectData)
    // In a real implementation, this would update the subject in the database
    // For mock purposes, we'll just return the updated subject
    return {
      ...subjectData,
      id,
    }
  }

  // Schedule
  async getScheduleEvents() {
    return mockScheduleEvents
  }

  async createScheduleEvent(eventData: any) {
    return { ...eventData, id: Date.now().toString() }
  }

  // Students
  async getStudents() {
    console.log("Mock API: Getting students")
    return mockStudents || []
  }

  async createStudent(studentData: any) {
    console.log("Mock API: Creating student", studentData)
    const newStudent = {
      ...studentData,
      id: `student-${Date.now()}`,
    }
    return newStudent
  }

  async updateStudent(id: string, studentData: any) {
    console.log(`Mock API: Updating student with ID: ${id}`, studentData)
    // In a real implementation, this would update the student in the database
    // For mock purposes, we'll just return the updated student
    return {
      ...studentData,
      id,
    }
  }

  async deleteStudent(id: string) {
    console.log(`Mock API: Deleting student with ID: ${id}`)
    return { success: true }
  }

  // Lecturers
  async getLecturers() {
    console.log("Mock API: Getting lecturers")
    try {
      // Return a copy of the array to avoid mutation issues
      return [...mockLecturers]
    } catch (error) {
      console.error("Error retrieving lecturers:", error)
      // Return a fallback array if there's an error
      return [
        {
          id: "F001",
          name: "Dr. Robert Chen",
          email: "r.chen@example.edu",
          department: "Computer Science",
          position: "Professor",
          courses: 3,
        },
        {
          id: "F002",
          name: "Dr. Sarah Johnson",
          email: "s.johnson@example.edu",
          department: "Business",
          position: "Associate Professor",
          courses: 2,
        },
      ]
    }
  }

  async createLecturer(lecturerData: any) {
    console.log("Mock API: Creating lecturer", lecturerData)
    const newLecturer = {
      ...lecturerData,
      id: `lecturer-${Date.now()}`,
    }
    return newLecturer
  }

  async updateLecturer(id: string, lecturerData: any) {
    console.log(`Mock API: Updating lecturer with ID: ${id}`, lecturerData)
    // In a real implementation, this would update the lecturer in the database
    // For mock purposes, we'll just return the updated lecturer
    return {
      ...lecturerData,
      id,
    }
  }

  async deleteLecturer(id: string) {
    console.log(`Mock API: Deleting lecturer with ID: ${id}`)
    return { success: true }
  }

  // Facilities
  async getFacilities() {
    return mockFacilities || []
  }

  async createFacility(facilityData: any) {
    console.log("Mock API: Creating facility", facilityData)
    const newFacility = {
      ...facilityData,
      id: `facility-${Date.now()}`,
      code: facilityData.code || `F${Math.floor(Math.random() * 1000)}`,
      status: facilityData.status || "Available",
    }
    return newFacility
  }

  async updateFacility(id: string, facilityData: any) {
    console.log(`Mock API: Updating facility with ID: ${id}`, facilityData)
    return {
      ...facilityData,
      id,
    }
  }

  async deleteFacility(id: string) {
    console.log(`Mock API: Deleting facility with ID: ${id}`)
    return { success: true }
  }

  // Events
  async getEvents() {
    console.log("Mock API: Getting events")
    return mockEvents || []
  }

  async getEventAnnouncements() {
    console.log("Mock API: Getting event announcements")
    // Generate mock announcements
    return [
      {
        id: "ann1",
        eventId: "event1",
        title: "Important Update for Academic Conference",
        message: "The venue has been changed to the Main Auditorium.",
        sentTo: ["All"],
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        sentBy: "Admin User",
      },
      {
        id: "ann2",
        eventId: "event2",
        title: "Reminder: Workshop Registration",
        message: "Registration closes tomorrow. Please register if you haven't already.",
        sentTo: ["Students", "Faculty"],
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        sentBy: "Event Coordinator",
      },
      {
        id: "ann3",
        eventId: "event3",
        title: "Guest Speaker Announcement",
        message: "We're pleased to announce that Dr. Smith will be our keynote speaker.",
        sentTo: ["All"],
        sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        sentBy: "Department Head",
      },
    ]
  }

  async getEventResources() {
    console.log("Mock API: Getting event resources")
    return [
      "Projector",
      "Microphone",
      "Whiteboard",
      "Laptop",
      "Video Conference Equipment",
      "Chairs",
      "Tables",
      "Refreshments",
    ]
  }

  async createEvent(eventData: any) {
    console.log("Mock API: Creating event", eventData)
    return {
      ...eventData,
      id: `event-${Date.now()}`,
    }
  }

  async updateEvent(id: string, eventData: any) {
    console.log(`Mock API: Updating event with ID: ${id}`, eventData)
    return {
      ...eventData,
      id,
    }
  }

  async deleteEvent(id: string) {
    console.log(`Mock API: Deleting event with ID: ${id}`)
    return { success: true }
  }

  // Dashboard Stats
  async getDashboardStats() {
    console.log("Mock API: Getting dashboard stats")
    return {
      totalStudents: mockStudents?.length || 0,
      totalLecturers: mockLecturers?.length || 0,
      totalCourses: mockCourses?.length || 0,
      totalFacilities: mockFacilities?.length || 0,
      activeEvents: mockEvents?.filter((event) => new Date(event.date) > new Date())?.length || 0,
      activeEnrollments: 0, // Mock value
      resourceUtilization: 75, // Mock value
      upcomingEvents: mockEvents?.filter((event) => new Date(event.date) > new Date())?.length || 0,
    }
  }

  // Resource Utilization Data
  async getResourceUtilizationData() {
    console.log("Mock API: Getting resource utilization data")
    return mockResourceUtilizationData
  }

  // Collaboration
  async getCollaborationGroups() {
    console.log("Mock API: Getting collaboration groups")
    return mockCollaborationGroups
  }

  async getCollaborationGroup(id: string) {
    console.log(`Mock API: Getting collaboration group with ID: ${id}`)
    const group = mockCollaborationGroups.find((g) => g.id === id)
    if (!group) throw new Error(`Collaboration group with ID ${id} not found`)
    return group
  }

  async getCollaborationMessages(groupId: string) {
    console.log(`Mock API: Getting collaboration messages for group: ${groupId}`)

    // Filter messages by groupId from the flat array structure
    const messages = mockCollaborationMessages.filter((message) => message.groupId === groupId)

    if (messages.length === 0) {
      console.warn(`No messages found for group ${groupId}, returning empty array`)
    }

    return messages
  }

  async getCollaborationFiles(groupId: string) {
    console.log(`Mock API: Getting collaboration files for group: ${groupId}`)

    // Filter files by groupId from the flat array structure
    const files = mockCollaborationFiles.filter((file) => file.groupId === groupId)

    if (files.length === 0) {
      console.warn(`No files found for group ${groupId}, returning empty array`)
    }

    return files
  }

  async getCollaborationTasks(groupId: string) {
    console.log(`Mock API: Getting collaboration tasks for group: ${groupId}`)

    // Filter tasks by groupId from the flat array structure
    const tasks = mockCollaborationTasks.filter((task) => task.groupId === groupId)

    if (tasks.length === 0) {
      console.warn(`No tasks found for group ${groupId}, returning empty array`)
    }

    return tasks
  }

  async createCollaborationGroup(groupData: any) {
    console.log("Mock API: Creating collaboration group", groupData)
    const newGroup = {
      ...groupData,
      id: `CG${String(mockCollaborationGroups.length + 1).padStart(3, "0")}`,
      members: [],
    }
    return newGroup
  }

  async addCollaborationMember(groupId: string, memberData: any) {
    console.log(`Mock API: Adding member to collaboration group ${groupId}`, memberData)
    const newMember = {
      ...memberData,
      id: `M${Date.now()}`,
    }
    return newMember
  }

  async createCollaborationMessage(groupId: string, messageData: any) {
    console.log(`Mock API: Creating message in collaboration group ${groupId}`, messageData)
    const newMessage = {
      ...messageData,
      id: `MSG${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    return newMessage
  }

  async getReservations() {
    console.log("Mock API: Getting reservations")
    return mockReservations || []
  }

  async createReservation(reservationData: any) {
    console.log("Mock API: Creating reservation", reservationData)
    const newReservation = {
      ...reservationData,
      id: `reservation-${Date.now()}`,
    }
    return newReservation
  }

  // Resources
  async getResources() {
    console.log("Mock API: Getting resources")
    return mockResources || []
  }

  async getResource(id: string) {
    console.log(`Mock API: Getting resource with ID: ${id}`)
    const resource = mockResources.find((r) => r.id === id)
    if (!resource) throw new Error(`Resource with ID ${id} not found`)
    return resource
  }

  async createResource(resourceData: any) {
    console.log("Mock API: Creating resource", resourceData)
    const newResource = {
      ...resourceData,
      id: `RS${String(mockResources.length + 1).padStart(3, "0")}`,
      status: "Available",
      checkedOutBy: null,
      checkedOutAt: null,
    }
    return newResource
  }

  async updateResource(id: string, resourceData: any) {
    console.log(`Mock API: Updating resource with ID: ${id}`, resourceData)
    return {
      ...resourceData,
      id,
    }
  }

  async deleteResource(id: string) {
    console.log(`Mock API: Deleting resource with ID: ${id}`)
    return { success: true }
  }

  async checkoutResource(id: string, userId: string, userName: string) {
    console.log(`Mock API: Checking out resource with ID: ${id} to user: ${userName}`)
    return {
      id,
      name: "Resource " + id,
      type: "Equipment",
      location: "Main Building",
      status: "In Use",
      checkedOutBy: userName,
      checkedOutAt: new Date().toISOString(),
    }
  }

  async returnResource(id: string) {
    console.log(`Mock API: Returning resource with ID: ${id}`)
    return {
      id,
      name: "Resource " + id,
      type: "Equipment",
      location: "Main Building",
      status: "Available",
      checkedOutBy: null,
      checkedOutAt: null,
    }
  }

  // Communications
  async getMessages(userId: string) {
    console.log(`Mock API: Getting messages for user with ID: ${userId}`)

    // Filter messages where the user is either the sender or recipient
    const userMessages = mockMessages.filter((message) => message.senderId === userId || message.recipientId === userId)

    return userMessages
  }

  async sendMessage(messageData: any) {
    console.log("Mock API: Sending message", messageData)

    // Create a new message with the provided data
    const newMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    // In a real implementation, we would add this to the database
    // For mock purposes, we'll just return the new message
    return newMessage
  }

  async deleteMessage(id: string) {
    console.log(`Mock API: Deleting message with ID: ${id}`)

    // In a real implementation, this would remove the message from the database
    // For mock purposes, we'll just return success
    return { success: true, id }
  }

  // Analytics methods
  async getEnrollmentTrendsData() {
    console.log("Mock API: Getting enrollment trends data")
    return [
      { year: "2018", students: 1200 },
      { year: "2019", students: 1400 },
      { year: "2020", students: 1300 },
      { year: "2021", students: 1500 },
      { year: "2022", students: 1700 },
      { year: "2023", students: 1900 },
    ]
  }

  async getCoursePopularityData() {
    console.log("Mock API: Getting course popularity data")
    return [
      { name: "Computer Science", value: 35 },
      { name: "Business", value: 25 },
      { name: "Engineering", value: 20 },
      { name: "Arts", value: 15 },
      { name: "Others", value: 5 },
    ]
  }

  // Resource Utilization Analytics
  async getEquipmentBorrowingTrends() {
    console.log("Mock API: Getting equipment borrowing trends")
    return mockEquipmentBorrowingTrends
  }

  async getResourceConflicts() {
    console.log("Mock API: Getting resource conflicts")
    return mockResourceConflicts
  }

  async getPeakUsageHours() {
    console.log("Mock API: Getting peak usage hours")
    return mockPeakUsageHours
  }

  // Event Attendance Analytics
  async getEventAttendanceData() {
    console.log("Mock API: Getting event attendance data")
    return mockEventAttendanceData
  }

  async getPopularEventsData() {
    console.log("Mock API: Getting popular events data")
    return mockPopularEventsData
  }

  async getEventTypeEngagement() {
    console.log("Mock API: Getting event type engagement")
    return mockEventTypeEngagement
  }

  async getDropoffRates() {
    console.log("Mock API: Getting dropoff rates")
    return mockDropoffRates
  }

  // Campus Involvement Analytics
  async getStudentParticipationData() {
    console.log("Mock API: Getting student participation data")
    return mockStudentParticipationData
  }

  async getFacultyInvolvementData() {
    console.log("Mock API: Getting faculty involvement data")
    return mockFacultyInvolvementData
  }

  async getCollaborationMetricsData() {
    console.log("Mock API: Getting collaboration metrics data")
    return mockCollaborationMetricsData
  }

  // Scheduling Efficiency Analytics
  async getSchedulingEffectivenessData() {
    console.log("Mock API: Getting scheduling effectiveness data")
    return mockSchedulingEffectivenessData
  }

  async getCancellationPatternsData() {
    console.log("Mock API: Getting cancellation patterns data")
    return mockCancellationPatternsData
  }

  async getTimeSlotPopularityData() {
    console.log("Mock API: Getting time slot popularity data")
    return mockTimeSlotPopularityData
  }
}

// Create and export an instance of the MockApiService
export const mockApiService = new MockApiService()

