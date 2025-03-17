// Import necessary types and mock data
import type { User } from "@/app/types"
import { mockStudents } from "./mock/data/students"
import { mockLecturers } from "./mock/data/lecturers"
import { mockCourses } from "./mock/data/courses"
import { mockSubjects } from "./mock/data/subjects"
import { mockFacilities } from "./mock/data/facilities"
import { mockEvents } from "./mock/data/events"
import { mockReservations } from "./mock/data/reservations"
import { mockResources } from "./mock/data/resources"
import { mockCollaborationGroups } from "./mock/data/collaboration"
import { mockBatches } from "./mock/data/batches"
import { mockEnrollments } from "./mock/data/enrollments"
import { mockUsers } from "./mock/data/users"
import { mockScheduleEvents } from "./mock/data/schedule"
import { mockPermissions } from "./mock/data/permissions"
import { delay } from "./utils/delay"

// Simulate API delay
const simulateDelay = async (ms = 300) => {
  await delay(ms)
}

// Mock API implementation with comprehensive CRUD operations
export const mockApi = {
  // ===== USER METHODS =====
  getUsers: async (): Promise<User[]> => {
    await simulateDelay()
    console.log("Mock API: Getting users")
    return [...mockUsers]
  },

  getUser: async (id: string): Promise<User> => {
    await simulateDelay()
    console.log(`Mock API: Getting user with ID: ${id}`)
    const user = mockUsers.find((u) => u.id === id)
    if (!user) {
      throw new Error("User not found")
    }
    return { ...user }
  },

  createUser: async (userData: any): Promise<User> => {
    await simulateDelay()
    console.log("Mock API: Creating user", userData)
    const newUser = {
      ...userData,
      id: `U${String(mockUsers.length + 1).padStart(3, "0")}`,
      profileImage: userData.profileImage || "/placeholder.svg?height=40&width=40",
      lastLogin: new Date().toISOString(),
    }
    return { ...newUser }
  },

  updateUser: async (id: string, userData: any): Promise<User> => {
    await simulateDelay()
    console.log(`Mock API: Updating user with ID: ${id}`, userData)
    const userIndex = mockUsers.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      throw new Error("User not found")
    }
    return {
      ...userData,
      id,
    }
  },

  deleteUser: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting user with ID: ${id}`)
    const userIndex = mockUsers.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      throw new Error("User not found")
    }
    return { success: true }
  },

  login: async (email: string, password: string): Promise<User | null> => {
    await simulateDelay(500)
    console.log("Mock API login attempt with:", email)

    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || password === "password123"),
    )

    if (!user) {
      console.log("Mock API: User not found or password incorrect")
      return null
    }

    console.log("Mock API: Login successful for", user.name)
    return { ...user, lastLogin: new Date().toISOString() }
  },

  register: async (userData: any): Promise<User> => {
    await simulateDelay(500)
    console.log("Mock API: Registering new user", userData)
    const newUser = {
      ...userData,
      id: `U${String(mockUsers.length + 1).padStart(3, "0")}`,
      profileImage: userData.profileImage || "/placeholder.svg?height=40&width=40",
      lastLogin: new Date().toISOString(),
    }
    return { ...newUser }
  },

  // ===== COURSE METHODS =====
  getCourses: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting courses")
    return [...mockCourses]
  },

  getCourseById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting course with ID: ${id}`)
    const course = mockCourses.find((c) => c.id === id)
    if (!course) {
      throw new Error(`Course with ID ${id} not found`)
    }
    return { ...course }
  },

  createCourse: async (courseData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating course", courseData)
    const newCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      name: courseData.name || "Untitled Course",
      code: courseData.code || `CS${Math.floor(Math.random() * 1000)}`,
      department: courseData.department || "General",
      credits: courseData.credits || 30,
      students: courseData.students || 0,
      status: courseData.status || "Active",
    }
    return { ...newCourse }
  },

  updateCourse: async (id: string, courseData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating course with ID: ${id}`, courseData)
    const courseIndex = mockCourses.findIndex((c) => c.id === id)
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${id} not found`)
    }
    return {
      ...courseData,
      id,
    }
  },

  deleteCourse: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting course with ID: ${id}`)
    const courseIndex = mockCourses.findIndex((c) => c.id === id)
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== SUBJECT METHODS =====
  getSubjects: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting subjects")
    return [...mockSubjects]
  },

  getSubjectById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting subject with ID: ${id}`)
    const subject = mockSubjects.find((s) => s.id === id)
    if (!subject) {
      throw new Error(`Subject with ID ${id} not found`)
    }
    return { ...subject }
  },

  createSubject: async (subjectData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating subject", subjectData)
    const newSubject = {
      ...subjectData,
      id: `subj-${Date.now()}`,
      name: subjectData.name || "Untitled Subject",
      code: subjectData.code || `S${Math.floor(Math.random() * 1000)}`,
      department: subjectData.department || "General",
      credits: subjectData.credits || 15,
      courseIds: Array.isArray(subjectData.courseIds) ? subjectData.courseIds : [],
    }
    return { ...newSubject }
  },

  updateSubject: async (id: string, subjectData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating subject with ID: ${id}`, subjectData)
    const subjectIndex = mockSubjects.findIndex((s) => s.id === id)
    if (subjectIndex === -1) {
      throw new Error(`Subject with ID ${id} not found`)
    }
    return {
      ...subjectData,
      id,
    }
  },

  deleteSubject: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting subject with ID: ${id}`)
    const subjectIndex = mockSubjects.findIndex((s) => s.id === id)
    if (subjectIndex === -1) {
      throw new Error(`Subject with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== SCHEDULE METHODS =====
  getScheduleEvents: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting schedule events")
    return [...mockScheduleEvents]
  },

  getScheduleEventById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting schedule event with ID: ${id}`)
    const event = mockScheduleEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error(`Schedule event with ID ${id} not found`)
    }
    return { ...event }
  },

  createScheduleEvent: async (eventData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating schedule event", eventData)
    const newEvent = {
      ...eventData,
      id: `sched-${Date.now()}`,
    }
    return { ...newEvent }
  },

  updateScheduleEvent: async (id: string, eventData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating schedule event with ID: ${id}`, eventData)
    const eventIndex = mockScheduleEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      throw new Error(`Schedule event with ID ${id} not found`)
    }
    return {
      ...eventData,
      id,
    }
  },

  deleteScheduleEvent: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting schedule event with ID: ${id}`)
    const eventIndex = mockScheduleEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      throw new Error(`Schedule event with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== STUDENT METHODS =====
  getStudents: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting students")
    return [...mockStudents]
  },

  getStudentById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting student with ID: ${id}`)
    const student = mockStudents.find((s) => s.id === id)
    if (!student) {
      throw new Error(`Student with ID ${id} not found`)
    }
    return { ...student }
  },

  createStudent: async (studentData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating student", studentData)
    const newStudent = {
      ...studentData,
      id: `student-${Date.now()}`,
    }
    return { ...newStudent }
  },

  updateStudent: async (id: string, studentData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating student with ID: ${id}`, studentData)
    const studentIndex = mockStudents.findIndex((s) => s.id === id)
    if (studentIndex === -1) {
      throw new Error(`Student with ID ${id} not found`)
    }
    return {
      ...studentData,
      id,
    }
  },

  deleteStudent: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting student with ID: ${id}`)
    const studentIndex = mockStudents.findIndex((s) => s.id === id)
    if (studentIndex === -1) {
      throw new Error(`Student with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== LECTURER METHODS =====
  getLecturers: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting lecturers")
    return [...mockLecturers]
  },

  getLecturerById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting lecturer with ID: ${id}`)
    const lecturer = mockLecturers.find((l) => l.id === id)
    if (!lecturer) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    return { ...lecturer }
  },

  createLecturer: async (lecturerData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating lecturer", lecturerData)
    const newLecturer = {
      ...lecturerData,
      id: `lecturer-${Date.now()}`,
    }
    return { ...newLecturer }
  },

  updateLecturer: async (id: string, lecturerData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating lecturer with ID: ${id}`, lecturerData)
    const lecturerIndex = mockLecturers.findIndex((l) => l.id === id)
    if (lecturerIndex === -1) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    return {
      ...lecturerData,
      id,
    }
  },

  deleteLecturer: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting lecturer with ID: ${id}`)
    const lecturerIndex = mockLecturers.findIndex((l) => l.id === id)
    if (lecturerIndex === -1) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== BATCH METHODS =====
  getBatches: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting batches")
    return [...mockBatches]
  },

  getBatchById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting batch with ID: ${id}`)
    const batch = mockBatches.find((b) => b.id === id)
    if (!batch) {
      throw new Error(`Batch with ID ${id} not found`)
    }
    return { ...batch }
  },

  createBatch: async (batchData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating batch", batchData)
    const newBatch = {
      ...batchData,
      id: `batch-${Date.now()}`,
    }
    return { ...newBatch }
  },

  updateBatch: async (id: string, batchData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating batch with ID: ${id}`, batchData)
    const batchIndex = mockBatches.findIndex((b) => b.id === id)
    if (batchIndex === -1) {
      throw new Error(`Batch with ID ${id} not found`)
    }
    return {
      ...batchData,
      id,
    }
  },

  deleteBatch: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting batch with ID: ${id}`)
    const batchIndex = mockBatches.findIndex((b) => b.id === id)
    if (batchIndex === -1) {
      throw new Error(`Batch with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== ENROLLMENT METHODS =====
  getEnrollments: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting enrollments")
    return [...mockEnrollments]
  },

  getEnrollmentById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting enrollment with ID: ${id}`)
    const enrollment = mockEnrollments.find((e) => e.id === id)
    if (!enrollment) {
      throw new Error(`Enrollment with ID ${id} not found`)
    }
    return { ...enrollment }
  },

  createEnrollment: async (enrollmentData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating enrollment", enrollmentData)
    const newEnrollment = {
      ...enrollmentData,
      id: `enroll-${Date.now()}`,
      enrollmentDate: enrollmentData.enrollmentDate || new Date().toISOString().split("T")[0],
      status: enrollmentData.status || "Active",
      grade: enrollmentData.grade || null,
    }
    return { ...newEnrollment }
  },

  updateEnrollment: async (id: string, enrollmentData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating enrollment with ID: ${id}`, enrollmentData)
    const enrollmentIndex = mockEnrollments.findIndex((e) => e.id === id)
    if (enrollmentIndex === -1) {
      throw new Error(`Enrollment with ID ${id} not found`)
    }
    return {
      ...enrollmentData,
      id,
    }
  },

  deleteEnrollment: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting enrollment with ID: ${id}`)
    const enrollmentIndex = mockEnrollments.findIndex((e) => e.id === id)
    if (enrollmentIndex === -1) {
      throw new Error(`Enrollment with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== FACILITY METHODS =====
  getFacilities: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting facilities")
    return [...mockFacilities]
  },

  getFacilityById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting facility with ID: ${id}`)
    const facility = mockFacilities.find((f) => f.id === id)
    if (!facility) {
      throw new Error(`Facility with ID ${id} not found`)
    }
    return { ...facility }
  },

  createFacility: async (facilityData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating facility", facilityData)
    const newFacility = {
      ...facilityData,
      id: `fac-${Date.now()}`,
    }
    return { ...newFacility }
  },

  updateFacility: async (id: string, facilityData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating facility with ID: ${id}`, facilityData)
    const facilityIndex = mockFacilities.findIndex((f) => f.id === id)
    if (facilityIndex === -1) {
      throw new Error(`Facility with ID ${id} not found`)
    }
    return {
      ...facilityData,
      id,
    }
  },

  deleteFacility: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting facility with ID: ${id}`)
    const facilityIndex = mockFacilities.findIndex((f) => f.id === id)
    if (facilityIndex === -1) {
      throw new Error(`Facility with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== RESERVATION METHODS =====
  getReservations: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting reservations")
    return [...mockReservations]
  },

  getReservationById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting reservation with ID: ${id}`)
    const reservation = mockReservations.find((r) => r.id === id)
    if (!reservation) {
      throw new Error(`Reservation with ID ${id} not found`)
    }
    return { ...reservation }
  },

  createReservation: async (reservationData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating reservation", reservationData)
    const newReservation = {
      ...reservationData,
      id: `reservation-${Date.now()}`,
      status: reservationData.status || "Pending",
    }
    return { ...newReservation }
  },

  updateReservation: async (id: string, reservationData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating reservation with ID: ${id}`, reservationData)
    const reservationIndex = mockReservations.findIndex((r) => r.id === id)
    if (reservationIndex === -1) {
      throw new Error(`Reservation with ID ${id} not found`)
    }
    return {
      ...reservationData,
      id,
    }
  },

  deleteReservation: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting reservation with ID: ${id}`)
    const reservationIndex = mockReservations.findIndex((r) => r.id === id)
    if (reservationIndex === -1) {
      throw new Error(`Reservation with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== RESOURCE METHODS =====
  getResources: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting resources")
    return [...mockResources]
  },

  getResource: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting resource with ID: ${id}`)
    const resource = mockResources.find((r) => r.id === id)
    if (!resource) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    return { ...resource }
  },

  createResource: async (resourceData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating resource", resourceData)
    const newResource = {
      ...resourceData,
      id: `RS${String(mockResources.length + 1).padStart(3, "0")}`,
      status: "Available",
      checkedOutBy: null,
      checkedOutAt: null,
    }
    return { ...newResource }
  },

  updateResource: async (id: string, resourceData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating resource with ID: ${id}`, resourceData)
    const resourceIndex = mockResources.findIndex((r) => r.id === id)
    if (resourceIndex === -1) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    return {
      ...resourceData,
      id,
    }
  },

  deleteResource: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting resource with ID: ${id}`)
    const resourceIndex = mockResources.findIndex((r) => r.id === id)
    if (resourceIndex === -1) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    return { success: true }
  },

  checkoutResource: async (id: string, userId: string, userName: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Checking out resource with ID: ${id} to user: ${userName}`)
    const resourceIndex = mockResources.findIndex((r) => r.id === id)
    if (resourceIndex === -1) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    return {
      id,
      name: "Resource " + id,
      type: "Equipment",
      location: "Main Building",
      status: "In Use",
      checkedOutBy: userName,
      checkedOutAt: new Date().toISOString(),
    }
  },

  returnResource: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Returning resource with ID: ${id}`)
    const resourceIndex = mockResources.findIndex((r) => r.id === id)
    if (resourceIndex === -1) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    return {
      id,
      name: "Resource " + id,
      type: "Equipment",
      location: "Main Building",
      status: "Available",
      checkedOutBy: null,
      checkedOutAt: null,
    }
  },

  // ===== EVENT METHODS =====
  getEvents: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting events")
    return [...mockEvents]
  },

  getEventById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting event with ID: ${id}`)
    const event = mockEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error(`Event with ID ${id} not found`)
    }
    return { ...event }
  },

  getEventAnnouncements: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting event announcements")
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
  },

  getEventResources: async (): Promise<string[]> => {
    await simulateDelay()
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
  },

  createEvent: async (eventData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating event", eventData)
    const newEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
    }
    return { ...newEvent }
  },

  updateEvent: async (id: string, eventData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating event with ID: ${id}`, eventData)
    const eventIndex = mockEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      throw new Error(`Event with ID ${id} not found`)
    }
    return {
      ...eventData,
      id,
    }
  },

  deleteEvent: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting event with ID: ${id}`)
    const eventIndex = mockEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      throw new Error(`Event with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== COLLABORATION METHODS =====
  getCollaborationGroups: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting collaboration groups")
    return [...mockCollaborationGroups]
  },

  getCollaborationGroupById: async (id: string): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Getting collaboration group with ID: ${id}`)
    const group = mockCollaborationGroups.find((g) => g.id === id)
    if (!group) {
      throw new Error(`Collaboration group with ID ${id} not found`)
    }
    return { ...group }
  },

  createCollaborationGroup: async (groupData: any): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Creating collaboration group", groupData)
    const newGroup = {
      ...groupData,
      id: `collab-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    return { ...newGroup }
  },

  updateCollaborationGroup: async (id: string, groupData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating collaboration group with ID: ${id}`, groupData)
    const groupIndex = mockCollaborationGroups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      throw new Error(`Collaboration group with ID ${id} not found`)
    }
    return {
      ...groupData,
      id,
    }
  },

  deleteCollaborationGroup: async (id: string): Promise<{ success: boolean }> => {
    await simulateDelay()
    console.log(`Mock API: Deleting collaboration group with ID: ${id}`)
    const groupIndex = mockCollaborationGroups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      throw new Error(`Collaboration group with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== PERMISSION METHODS =====
  getUserPermissions: async (userId: string): Promise<any[]> => {
    await simulateDelay()
    console.log(`Mock API: Getting permissions for user with ID: ${userId}`)
    const permissions = mockPermissions.filter((p) => p.userId === userId)
    return [...permissions]
  },

  updateUserPermission: async (id: string, permissionData: any): Promise<any> => {
    await simulateDelay()
    console.log(`Mock API: Updating permission with ID: ${id}`, permissionData)
    const permissionIndex = mockPermissions.findIndex((p) => p.id === id)
    if (permissionIndex === -1) {
      throw new Error(`Permission with ID ${id} not found`)
    }
    return {
      ...permissionData,
      id,
    }
  },

  // ===== DASHBOARD METHODS =====
  getDashboardStats: async (): Promise<any> => {
    await simulateDelay()
    console.log("Mock API: Getting dashboard stats")
    return {
      totalStudents: mockStudents?.length || 0,
      totalLecturers: mockLecturers?.length || 0,
      totalCourses: mockCourses?.length || 0,
      totalFacilities: mockFacilities?.length || 0,
      activeEvents: mockEvents?.filter((event) => new Date(event.date) > new Date())?.length || 0,
      activeEnrollments: mockEnrollments?.filter((e) => e.status === "Active")?.length || 0,
      resourceUtilization: 75, // Mock value
      upcomingEvents: mockEvents?.filter((event) => new Date(event.date) > new Date())?.length || 0,
    }
  },

  getResourceUtilizationData: async (): Promise<any[]> => {
    await simulateDelay()
    console.log("Mock API: Getting resource utilization data")
    return [
      { resource: "Library", utilization: 80 },
      { resource: "Computer Lab", utilization: 90 },
      { resource: "Study Room", utilization: 70 },
      { resource: "Auditorium", utilization: 60 },
      { resource: "Cafeteria", utilization: 85 },
    ]
  },

  getEvents: async (): Promise<Event[]> => {
    await delay(500)
    return [...mockEvents]
  },

  getEvent: async (id: string): Promise<Event> => {
    await delay(300)
    const event = mockEvents.find((event) => event.id === id)
    if (!event) {
      throw new Error(`Event with ID ${id} not found`)
    }
    return { ...event }
  },

  getEventAnnouncements: async (): Promise<any[]> => {
    await delay(300)
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
  },

  getEventResources: async (): Promise<string[]> => {
    await delay(200)
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
  },

  createEvent: async (data: Partial<Event>): Promise<Event> => {
    await delay(600)
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: data.title || "New Event",
      description: data.description || "",
      type: data.type || "Other",
      organizer: data.organizer || "Campus Administration",
      location: data.location || "TBD",
      startDate: data.startDate || new Date().toISOString().split("T")[0],
      startTime: data.startTime || "09:00",
      endDate: data.endDate || new Date().toISOString().split("T")[0],
      endTime: data.endTime || "10:00",
      attendees: data.attendees || 0,
      status: data.status || "Planning",
    }
    mockEvents.push(newEvent)
    return { ...newEvent }
  },

  updateEvent: async (id: string, data: Partial<Event>): Promise<Event> => {
    await delay(500)
    const index = mockEvents.findIndex((event) => event.id === id)
    if (index === -1) {
      throw new Error(`Event with ID ${id} not found`)
    }

    mockEvents[index] = {
      ...mockEvents[index],
      ...data,
    }

    return { ...mockEvents[index] }
  },

  deleteEvent: async (id: string): Promise<void> => {
    await delay(400)
    const index = mockEvents.findIndex((event) => event.id === id)
    if (index === -1) {
      throw new Error(`Event with ID ${id} not found`)
    }

    mockEvents.splice(index, 1)
  },
}

