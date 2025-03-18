import { delay } from "../utils/delay"
import { mockUsers } from "./data/users"
import { mockStudents } from "./data/students"
import { mockLecturers } from "./data/lecturers"
import { mockCourses } from "./data/courses"
import { mockBatches } from "./data/batches"
import { mockEnrollments } from "./data/enrollments"
import { mockFacilities } from "./data/facilities"
import { mockReservations } from "./data/reservations"
import { mockSubjects } from "./data/subjects"
import { mockEvents } from "./data/events"
import { mockMessages } from "./data/messages"
import { mockNotifications } from "./data/notifications"
import { mockResources } from "./data/resources"
import { mockDashboardStats } from "./data/dashboard"
import {
  mockCollaborationGroups,
  mockCollaborationMessages,
  mockCollaborationFiles,
  mockCollaborationTasks,
} from "./data/collaboration"
import { mockPermissions } from "./data/permissions"
import { mockScheduleEvents } from "./data/schedule"

// Simulate API delay
const simulateDelay = async (ms = 300) => {
  await delay(ms)
}

// Mock API implementation with comprehensive CRUD operations
export const mockApi = {
  // ===== USER METHODS =====
  getUsers: async () => {
    await simulateDelay()
    console.log("Mock API: Getting users")
    return [...mockUsers]
  },

  getUser: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting user with ID: ${id}`)
    const user = mockUsers.find((u) => u.id === id)
    if (!user) {
      throw new Error(`User with ID ${id} not found`)
    }
    return { ...user }
  },

  updateUserProfile: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating user profile with ID: ${id}`, data)
    const userIndex = mockUsers.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`)
    }
    return {
      ...mockUsers[userIndex],
      ...data,
    }
  },

  // ===== STUDENT METHODS =====
  getStudents: async () => {
    await simulateDelay()
    console.log("Mock API: Getting students")
    return [...mockStudents]
  },

  getStudent: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting student with ID: ${id}`)
    const student = mockStudents.find((s) => s.id === id)
    if (!student) {
      throw new Error(`Student with ID ${id} not found`)
    }
    return { ...student }
  },

  createStudent: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating student", data)
    const newStudent = {
      ...data,
      id: `student-${Date.now()}`,
    }
    return { ...newStudent }
  },

  updateStudent: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating student with ID: ${id}`, data)
    const studentIndex = mockStudents.findIndex((s) => s.id === id)
    if (studentIndex === -1) {
      throw new Error(`Student with ID ${id} not found`)
    }
    return {
      ...mockStudents[studentIndex],
      ...data,
    }
  },

  deleteStudent: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting student with ID: ${id}`)
    const studentIndex = mockStudents.findIndex((s) => s.id === id)
    if (studentIndex === -1) {
      throw new Error(`Student with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== LECTURER METHODS =====
  getLecturers: async () => {
    await simulateDelay()
    console.log("Mock API: Getting lecturers")
    return [...mockLecturers]
  },

  getLecturer: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting lecturer with ID: ${id}`)
    const lecturer = mockLecturers.find((l) => l.id === id)
    if (!lecturer) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    return { ...lecturer }
  },

  createLecturer: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating lecturer", data)
    const newLecturer = {
      ...data,
      id: `lecturer-${Date.now()}`,
    }
    return { ...newLecturer }
  },

  updateLecturer: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating lecturer with ID: ${id}`, data)
    const lecturerIndex = mockLecturers.findIndex((l) => l.id === id)
    if (lecturerIndex === -1) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    return {
      ...mockLecturers[lecturerIndex],
      ...data,
    }
  },

  deleteLecturer: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting lecturer with ID: ${id}`)
    const lecturerIndex = mockLecturers.findIndex((l) => l.id === id)
    if (lecturerIndex === -1) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== COURSE METHODS =====
  getCourses: async () => {
    await simulateDelay()
    console.log("Mock API: Getting courses")
    return [...mockCourses]
  },

  getCourse: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting course with ID: ${id}`)
    const course = mockCourses.find((c) => c.id === id)
    if (!course) {
      throw new Error(`Course with ID ${id} not found`)
    }
    return { ...course }
  },

  createCourse: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating course", data)
    const newCourse = {
      ...data,
      id: `course-${Date.now()}`,
    }
    return { ...newCourse }
  },

  updateCourse: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating course with ID: ${id}`, data)
    const courseIndex = mockCourses.findIndex((c) => c.id === id)
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${id} not found`)
    }
    return {
      ...mockCourses[courseIndex],
      ...data,
    }
  },

  deleteCourse: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting course with ID: ${id}`)
    const courseIndex = mockCourses.findIndex((c) => c.id === id)
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== BATCH METHODS =====
  getBatches: async () => {
    await simulateDelay()
    console.log("Mock API: Getting batches")
    return [...mockBatches]
  },

  getBatch: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting batch with ID: ${id}`)
    const batch = mockBatches.find((b) => b.id === id)
    if (!batch) {
      throw new Error(`Batch with ID ${id} not found`)
    }
    return { ...batch }
  },

  createBatch: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating batch", data)
    const newBatch = {
      ...data,
      id: `batch-${Date.now()}`,
    }
    return { ...newBatch }
  },

  updateBatch: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating batch with ID: ${id}`, data)
    const batchIndex = mockBatches.findIndex((b) => b.id === id)
    if (batchIndex === -1) {
      throw new Error(`Batch with ID ${id} not found`)
    }
    return {
      ...mockBatches[batchIndex],
      ...data,
    }
  },

  deleteBatch: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting batch with ID: ${id}`)
    const batchIndex = mockBatches.findIndex((b) => b.id === id)
    if (batchIndex === -1) {
      throw new Error(`Batch with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== ENROLLMENT METHODS =====
  getEnrollments: async () => {
    await simulateDelay()
    console.log("Mock API: Getting enrollments")
    return [...mockEnrollments]
  },

  getEnrollment: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting enrollment with ID: ${id}`)
    const enrollment = mockEnrollments.find((e) => e.id === id)
    if (!enrollment) {
      throw new Error(`Enrollment with ID ${id} not found`)
    }
    return { ...enrollment }
  },

  createEnrollment: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating enrollment", data)
    const newEnrollment = {
      ...data,
      id: `enrollment-${Date.now()}`,
    }
    return { ...newEnrollment }
  },

  updateEnrollment: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating enrollment with ID: ${id}`, data)
    const enrollmentIndex = mockEnrollments.findIndex((e) => e.id === id)
    if (enrollmentIndex === -1) {
      throw new Error(`Enrollment with ID ${id} not found`)
    }
    return {
      ...mockEnrollments[enrollmentIndex],
      ...data,
    }
  },

  deleteEnrollment: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting enrollment with ID: ${id}`)
    const enrollmentIndex = mockEnrollments.findIndex((e) => e.id === id)
    if (enrollmentIndex === -1) {
      throw new Error(`Enrollment with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== FACILITY METHODS =====
  getFacilities: async () => {
    await simulateDelay()
    console.log("Mock API: Getting facilities")
    return [...mockFacilities]
  },

  getFacility: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting facility with ID: ${id}`)
    const facility = mockFacilities.find((f) => f.id === id)
    if (!facility) {
      throw new Error(`Facility with ID ${id} not found`)
    }
    return { ...facility }
  },

  createFacility: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating facility", data)
    const newFacility = {
      ...data,
      id: `facility-${Date.now()}`,
    }
    return { ...newFacility }
  },

  updateFacility: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating facility with ID: ${id}`, data)
    const facilityIndex = mockFacilities.findIndex((f) => f.id === id)
    if (facilityIndex === -1) {
      throw new Error(`Facility with ID ${id} not found`)
    }
    return {
      ...mockFacilities[facilityIndex],
      ...data,
    }
  },

  deleteFacility: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting facility with ID: ${id}`)
    const facilityIndex = mockFacilities.findIndex((f) => f.id === id)
    if (facilityIndex === -1) {
      throw new Error(`Facility with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== RESERVATION METHODS =====
  getReservations: async () => {
    await simulateDelay()
    console.log("Mock API: Getting reservations")
    return [...mockReservations]
  },

  getReservation: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting reservation with ID: ${id}`)
    const reservation = mockReservations.find((r) => r.id === id)
    if (!reservation) {
      throw new Error(`Reservation with ID ${id} not found`)
    }
    return { ...reservation }
  },

  createReservation: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating reservation", data)
    const newReservation = {
      ...data,
      id: `reservation-${Date.now()}`,
    }
    return { ...newReservation }
  },

  updateReservation: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating reservation with ID: ${id}`, data)
    const reservationIndex = mockReservations.findIndex((r) => r.id === id)
    if (reservationIndex === -1) {
      throw new Error(`Reservation with ID ${id} not found`)
    }
    return {
      ...mockReservations[reservationIndex],
      ...data,
    }
  },

  deleteReservation: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting reservation with ID: ${id}`)
    const reservationIndex = mockReservations.findIndex((r) => r.id === id)
    if (reservationIndex === -1) {
      throw new Error(`Reservation with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== SUBJECT METHODS =====
  getSubjects: async () => {
    await simulateDelay()
    console.log("Mock API: Getting subjects")
    return [...mockSubjects]
  },

  getSubject: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting subject with ID: ${id}`)
    const subject = mockSubjects.find((s) => s.id === id)
    if (!subject) {
      throw new Error(`Subject with ID ${id} not found`)
    }
    return { ...subject }
  },

  createSubject: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating subject", data)
    const newSubject = {
      ...data,
      id: `subject-${Date.now()}`,
    }
    return { ...newSubject }
  },

  updateSubject: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating subject with ID: ${id}`, data)
    const subjectIndex = mockSubjects.findIndex((s) => s.id === id)
    if (subjectIndex === -1) {
      throw new Error(`Subject with ID ${id} not found`)
    }
    return {
      ...mockSubjects[subjectIndex],
      ...data,
    }
  },

  deleteSubject: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting subject with ID: ${id}`)
    const subjectIndex = mockSubjects.findIndex((s) => s.id === id)
    if (subjectIndex === -1) {
      throw new Error(`Subject with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== EVENT METHODS =====
  getEvents: async () => {
    await simulateDelay()
    console.log("Mock API: Getting events")
    return [...mockEvents]
  },

  getEvent: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting event with ID: ${id}`)
    const event = mockEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error(`Event with ID ${id} not found`)
    }
    return { ...event }
  },

  createEvent: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating event", data)
    const newEvent = {
      ...data,
      id: `event-${Date.now()}`,
    }
    return { ...newEvent }
  },

  updateEvent: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating event with ID: ${id}`, data)
    const eventIndex = mockEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      throw new Error(`Event with ID ${id} not found`)
    }
    return {
      ...mockEvents[eventIndex],
      ...data,
    }
  },

  deleteEvent: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting event with ID: ${id}`)
    const eventIndex = mockEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      throw new Error(`Event with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== MESSAGE METHODS =====
  getMessages: async () => {
    await simulateDelay()
    console.log("Mock API: Getting messages")
    return [...mockMessages]
  },

  getMessage: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting message with ID: ${id}`)
    const message = mockMessages.find((m) => m.id === id)
    if (!message) {
      throw new Error(`Message with ID ${id} not found`)
    }
    return { ...message }
  },

  createMessage: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating message", data)
    const newMessage = {
      ...data,
      id: `message-${Date.now()}`,
    }
    return { ...newMessage }
  },

  updateMessage: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating message with ID: ${id}`, data)
    const messageIndex = mockMessages.findIndex((m) => m.id === id)
    if (messageIndex === -1) {
      throw new Error(`Message with ID ${id} not found`)
    }
    return {
      ...mockMessages[messageIndex],
      ...data,
    }
  },

  deleteMessage: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting message with ID: ${id}`)
    const messageIndex = mockMessages.findIndex((m) => m.id === id)
    if (messageIndex === -1) {
      throw new Error(`Message with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== NOTIFICATION METHODS =====
  getNotifications: async () => {
    await simulateDelay()
    console.log("Mock API: Getting notifications")
    return [...mockNotifications]
  },

  getNotification: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting notification with ID: ${id}`)
    const notification = mockNotifications.find((n) => n.id === id)
    if (!notification) {
      throw new Error(`Notification with ID ${id} not found`)
    }
    return { ...notification }
  },

  createNotification: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating notification", data)
    const newNotification = {
      ...data,
      id: `notification-${Date.now()}`,
    }
    return { ...newNotification }
  },

  updateNotification: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating notification with ID: ${id}`, data)
    const notificationIndex = mockNotifications.findIndex((n) => n.id === id)
    if (notificationIndex === -1) {
      throw new Error(`Notification with ID ${id} not found`)
    }
    return {
      ...mockNotifications[notificationIndex],
      ...data,
    }
  },

  deleteNotification: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting notification with ID: ${id}`)
    const notificationIndex = mockNotifications.findIndex((n) => n.id === id)
    if (notificationIndex === -1) {
      throw new Error(`Notification with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== RESOURCE METHODS =====
  getResources: async () => {
    await simulateDelay()
    console.log("Mock API: Getting resources")
    return [...mockResources]
  },

  getResource: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting resource with ID: ${id}`)
    const resource = mockResources.find((r) => r.id === id)
    if (!resource) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    return { ...resource }
  },

  createResource: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating resource", data)
    const newResource = {
      ...data,
      id: `resource-${Date.now()}`,
    }
    return { ...newResource }
  },

  updateResource: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating resource with ID: ${id}`, data)
    const resourceIndex = mockResources.findIndex((r) => r.id === id)
    if (resourceIndex === -1) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    return {
      ...mockResources[resourceIndex],
      ...data,
    }
  },

  deleteResource: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting resource with ID: ${id}`)
    const resourceIndex = mockResources.findIndex((r) => r.id === id)
    if (resourceIndex === -1) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    return { success: true }
  },

  // ===== DASHBOARD METHODS =====
  getDashboardStats: async () => {
    await simulateDelay()
    console.log("Mock API: Getting dashboard stats")
    return { ...mockDashboardStats }
  },

  // ===== COLLABORATION METHODS =====
  getCollaborationGroups: async () => {
    await simulateDelay()
    console.log("Mock API: Getting collaboration groups")
    return [...mockCollaborationGroups]
  },

  getCollaborationGroup: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting collaboration group with ID: ${id}`)
    const group = mockCollaborationGroups.find((g) => g.id === id)
    if (!group) {
      throw new Error(`Collaboration group with ID ${id} not found`)
    }
    return { ...group }
  },

  createCollaborationGroup: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating collaboration group", data)
    const newGroup = {
      ...data,
      id: `CG${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, "0")}`,
      members: [],
    }
    return { ...newGroup }
  },

  updateCollaborationGroup: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating collaboration group with ID: ${id}`, data)
    const groupIndex = mockCollaborationGroups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      throw new Error(`Collaboration group with ID ${id} not found`)
    }
    return {
      ...mockCollaborationGroups[groupIndex],
      ...data,
    }
  },

  deleteCollaborationGroup: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting collaboration group with ID: ${id}`)
    const groupIndex = mockCollaborationGroups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      throw new Error(`Collaboration group with ID ${id} not found`)
    }
    return { success: true }
  },

  getCollaborationMessages: async (groupId) => {
    await simulateDelay()
    console.log(`Mock API: Getting collaboration messages for group ID: ${groupId}`)
    const messages = mockCollaborationMessages[groupId] || []
    return [...messages]
  },

  createCollaborationMessage: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating collaboration message", data)
    const newMessage = {
      ...data,
      id: `MSG${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, "0")}`,
    }
    return { ...newMessage }
  },

  getCollaborationFiles: async (groupId) => {
    await simulateDelay()
    console.log(`Mock API: Getting collaboration files for group ID: ${groupId}`)
    const files = mockCollaborationFiles[groupId] || []
    return [...files]
  },

  createCollaborationFile: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating collaboration file", data)
    const newFile = {
      ...data,
      id: `F${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, "0")}`,
    }
    return { ...newFile }
  },

  deleteCollaborationFile: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting collaboration file with ID: ${id}`)
    // In a real implementation, we would find the file and delete it
    return { success: true }
  },

  getCollaborationTasks: async (groupId) => {
    await simulateDelay()
    console.log(`Mock API: Getting collaboration tasks for group ID: ${groupId}`)
    const tasks = mockCollaborationTasks[groupId] || []
    return [...tasks]
  },

  createCollaborationTask: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating collaboration task", data)
    const newTask = {
      ...data,
      id: `T${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, "0")}`,
    }
    return { ...newTask }
  },

  updateCollaborationTask: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating collaboration task with ID: ${id}`, data)
    // In a real implementation, we would find the task and update it
    return {
      ...data,
      id,
    }
  },

  deleteCollaborationTask: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting collaboration task with ID: ${id}`)
    // In a real implementation, we would find the task and delete it
    return { success: true }
  },

  // ===== PERMISSION METHODS =====
  getPermissions: async () => {
    await simulateDelay()
    console.log("Mock API: Getting permissions")
    return [...mockPermissions]
  },

  // ===== SCHEDULE METHODS =====
  getScheduleEvents: async () => {
    await simulateDelay()
    console.log("Mock API: Getting schedule events")
    return [...mockScheduleEvents]
  },

  getScheduleEvent: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Getting schedule event with ID: ${id}`)
    const event = mockScheduleEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error(`Schedule event with ID ${id} not found`)
    }
    return { ...event }
  },

  createScheduleEvent: async (data) => {
    await simulateDelay()
    console.log("Mock API: Creating schedule event", data)
    const newEvent = {
      ...data,
      id: `schedule-${Date.now()}`,
    }
    return { ...newEvent }
  },

  updateScheduleEvent: async (id, data) => {
    await simulateDelay()
    console.log(`Mock API: Updating schedule event with ID: ${id}`, data)
    const eventIndex = mockScheduleEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      throw new Error(`Schedule event with ID ${id} not found`)
    }
    return {
      ...mockScheduleEvents[eventIndex],
      ...data,
    }
  },

  deleteScheduleEvent: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Deleting schedule event with ID: ${id}`)
    const eventIndex = mockScheduleEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      throw new Error(`Schedule event with ID ${id} not found`)
    }
    return { success: true }
  },

  getScheduleNotifications: async (userId) => {
    await simulateDelay()
    console.log(`Mock API: Getting schedule notifications for user ID: ${userId}`)
    // In a real implementation, we would filter notifications by user ID
    return []
  },

  markScheduleNotificationAsRead: async (id) => {
    await simulateDelay()
    console.log(`Mock API: Marking schedule notification as read with ID: ${id}`)
    // In a real implementation, we would find the notification and mark it as read
    return { id, read: true }
  },

  checkScheduleConflicts: async (userId, courseIds) => {
    await simulateDelay()
    console.log(`Mock API: Checking schedule conflicts for user ID: ${userId} and course IDs: ${courseIds}`)
    // In a real implementation, we would check for conflicts
    return false
  },

  registerForCourses: async (userId, courseIds) => {
    await simulateDelay()
    console.log(`Mock API: Registering user ID: ${userId} for course IDs: ${courseIds}`)
    // In a real implementation, we would register the user for the courses
    return true
  },

  getStudentEnrollments: async (studentId) => {
    await simulateDelay()
    console.log(`Mock API: Getting enrollments for student ID: ${studentId}`)
    // In a real implementation, we would filter enrollments by student ID
    return mockEnrollments.filter((e) => e.studentId === studentId)
  },
}

