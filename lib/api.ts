import {
  mockStudents,
  mockLecturers, // Changed from mockFaculty to mockLecturers
  mockCourses,
  mockFacilities,
  mockReservations,
  mockBatches,
  mockEnrollments,
  mockEvents,
  mockMessages,
  mockNotifications,
  mockResources,
  mockUsers,
  mockScheduleEvents,
  mockScheduleNotifications,
  mockCollaborationGroups,
  mockCollaborationMessages,
  mockCollaborationFiles,
  mockCollaborationTasks,
  mockSubjects,
} from "@/app/services/mock-data"

import type {
  Student,
  Lecturer, // Changed from Faculty to Lecturer
  Course,
  Facility,
  Reservation,
  Batch,
  Enrollment,
  Event,
  Message,
  Notification,
  Resource,
  User,
  UserProfile,
  ScheduleEvent,
  CollaborationGroup,
  CollaborationMessage,
  CollaborationFile,
  CollaborationTask,
  Subject,
} from "@/app/types"

// Helper function to generate a unique ID
const generateId = (prefix: string) => {
  return `${prefix}${Math.floor(Math.random() * 10000)}`
}

// API service
export const api = {
  // Authentication
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user by email
    const user = mockUsers.find((u) => u.email === email)

    // Check if user exists and password is correct (in a real app, you'd hash the password)
    if (user && password === "password") {
      return { success: true, user }
    }

    throw new Error("Invalid email or password")
  },

  register: async (userData: Omit<User, "id" | "lastLogin">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Create new user
    const newUser: User = {
      id: generateId("U"),
      ...userData,
      lastLogin: new Date().toISOString(),
    }

    // In a real app, you'd add the user to the database
    // mockUsers.push(newUser)

    return { success: true, user: newUser }
  },

  getUserProfile: async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user by ID
    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      throw new Error("User not found")
    }

    // Create user profile
    const userProfile: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || "",
      lastLogin: user.lastLogin,
    }

    return userProfile
  },

  updateUserProfile: async (userId: string, profileData: Partial<UserProfile>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user by ID
    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      throw new Error("User not found")
    }

    // Update user profile
    const updatedProfile: UserProfile = {
      ...user,
      ...profileData,
      id: user.id, // Ensure ID doesn't change
    }

    return updatedProfile
  },

  // Students
  getStudents: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockStudents
  },

  getStudentById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const student = mockStudents.find((s) => s.id === id)
    if (!student) {
      throw new Error("Student not found")
    }
    return student
  },

  createStudent: async (studentData: Omit<Student, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newStudent: Student = {
      id: generateId("ST"),
      ...studentData,
    }
    return newStudent
  },

  updateStudent: async (id: string, studentData: Partial<Student>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const student = mockStudents.find((s) => s.id === id)
    if (!student) {
      throw new Error("Student not found")
    }
    const updatedStudent: Student = {
      ...student,
      ...studentData,
    }
    return updatedStudent
  },

  deleteStudent: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Lecturers (renamed from Faculty)
  getLecturers: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockLecturers // Changed from mockFaculty to mockLecturers
  },

  getLecturerById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const lecturer = mockLecturers.find((f) => f.id === id) // Changed from faculty/mockFaculty to lecturer/mockLecturers
    if (!lecturer) {
      throw new Error("Lecturer not found") // Changed from Faculty to Lecturer
    }
    return lecturer
  },

  createLecturer: async (lecturerData: Omit<Lecturer, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newLecturer: Lecturer = {
      id: generateId("F"),
      ...lecturerData,
    }
    return newLecturer
  },

  updateLecturer: async (id: string, lecturerData: Partial<Lecturer>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const lecturer = mockLecturers.find((f) => f.id === id) // Changed from faculty/mockFaculty to lecturer/mockLecturers
    if (!lecturer) {
      throw new Error("Lecturer not found") // Changed from Faculty to Lecturer
    }
    const updatedLecturer: Lecturer = {
      ...lecturer,
      ...lecturerData,
    }
    return updatedLecturer
  },

  deleteLecturer: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Courses
  getCourses: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockCourses
  },

  getCourseById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const course = mockCourses.find((c) => c.id === id)
    if (!course) {
      throw new Error("Course not found")
    }
    return course
  },

  createCourse: async (courseData: Omit<Course, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newCourse: Course = {
      id: generateId("C"),
      ...courseData,
    }
    return newCourse
  },

  updateCourse: async (id: string, courseData: Partial<Course>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const course = mockCourses.find((c) => c.id === id)
    if (!course) {
      throw new Error("Course not found")
    }
    const updatedCourse: Course = {
      ...course,
      ...courseData,
    }
    return updatedCourse
  },

  deleteCourse: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Facilities
  getFacilities: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockFacilities
  },

  getFacilityById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const facility = mockFacilities.find((f) => f.id === id)
    if (!facility) {
      throw new Error("Facility not found")
    }
    return facility
  },

  createFacility: async (facilityData: Omit<Facility, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newFacility: Facility = {
      id: generateId("FAC"),
      ...facilityData,
    }
    return newFacility
  },

  updateFacility: async (id: string, facilityData: Partial<Facility>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const facility = mockFacilities.find((f) => f.id === id)
    if (!facility) {
      throw new Error("Facility not found")
    }
    const updatedFacility: Facility = {
      ...facility,
      ...facilityData,
    }
    return updatedFacility
  },

  deleteFacility: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Reservations
  getReservations: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockReservations
  },

  getReservationById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const reservation = mockReservations.find((r) => r.id === id)
    if (!reservation) {
      throw new Error("Reservation not found")
    }
    return reservation
  },

  createReservation: async (reservationData: Omit<Reservation, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newReservation: Reservation = {
      id: generateId("R"),
      ...reservationData,
    }
    return newReservation
  },

  updateReservation: async (id: string, reservationData: Partial<Reservation>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const reservation = mockReservations.find((r) => r.id === id)
    if (!reservation) {
      throw new Error("Reservation not found")
    }
    const updatedReservation: Reservation = {
      ...reservation,
      ...reservationData,
    }
    return updatedReservation
  },

  deleteReservation: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Batches
  getBatches: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockBatches
  },

  getBatchById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const batch = mockBatches.find((b) => b.id === id)
    if (!batch) {
      throw new Error("Batch not found")
    }
    return batch
  },

  createBatch: async (batchData: Omit<Batch, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newBatch: Batch = {
      id: generateId("B"),
      ...batchData,
    }
    return newBatch
  },

  updateBatch: async (id: string, batchData: Partial<Batch>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const batch = mockBatches.find((b) => b.id === id)
    if (!batch) {
      throw new Error("Batch not found")
    }
    const updatedBatch: Batch = {
      ...batch,
      ...batchData,
    }
    return updatedBatch
  },

  deleteBatch: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Enrollments
  getEnrollments: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockEnrollments
  },

  getEnrollmentById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const enrollment = mockEnrollments.find((e) => e.id === id)
    if (!enrollment) {
      throw new Error("Enrollment not found")
    }
    return enrollment
  },

  createEnrollment: async (enrollmentData: Omit<Enrollment, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newEnrollment: Enrollment = {
      id: generateId("E"),
      ...enrollmentData,
    }
    return newEnrollment
  },

  updateEnrollment: async (id: string, enrollmentData: Partial<Enrollment>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const enrollment = mockEnrollments.find((e) => e.id === id)
    if (!enrollment) {
      throw new Error("Enrollment not found")
    }
    const updatedEnrollment: Enrollment = {
      ...enrollment,
      ...enrollmentData,
    }
    return updatedEnrollment
  },

  deleteEnrollment: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Events
  getEvents: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockEvents
  },

  getEventById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const event = mockEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error("Event not found")
    }
    return event
  },

  createEvent: async (eventData: Omit<Event, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newEvent: Event = {
      id: generateId("EV"),
      ...eventData,
    }
    return newEvent
  },

  updateEvent: async (id: string, eventData: Partial<Event>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const event = mockEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error("Event not found")
    }
    const updatedEvent: Event = {
      ...event,
      ...eventData,
    }
    return updatedEvent
  },

  deleteEvent: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Messages
  getMessages: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockMessages
  },

  getMessageById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const message = mockMessages.find((m) => m.id === id)
    if (!message) {
      throw new Error("Message not found")
    }
    return message
  },

  createMessage: async (messageData: Omit<Message, "id" | "timestamp">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newMessage: Message = {
      id: generateId("M"),
      timestamp: new Date().toISOString(),
      ...messageData,
    }
    return newMessage
  },

  updateMessage: async (id: string, messageData: Partial<Message>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const message = mockMessages.find((m) => m.id === id)
    if (!message) {
      throw new Error("Message not found")
    }
    const updatedMessage: Message = {
      ...message,
      ...messageData,
    }
    return updatedMessage
  },

  deleteMessage: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Notifications
  getNotifications: async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockNotifications.filter((n) => n.userId === userId)
  },

  getNotificationById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const notification = mockNotifications.find((n) => n.id === id)
    if (!notification) {
      throw new Error("Notification not found")
    }
    return notification
  },

  createNotification: async (notificationData: Omit<Notification, "id" | "timestamp" | "isRead">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newNotification: Notification = {
      id: generateId("N"),
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notificationData,
    }
    return newNotification
  },

  updateNotification: async (id: string, notificationData: Partial<Notification>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const notification = mockNotifications.find((n) => n.id === id)
    if (!notification) {
      throw new Error("Notification not found")
    }
    const updatedNotification: Notification = {
      ...notification,
      ...notificationData,
    }
    return updatedNotification
  },

  deleteNotification: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Resources
  getResources: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockResources
  },

  getResourceById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const resource = mockResources.find((r) => r.id === id)
    if (!resource) {
      throw new Error("Resource not found")
    }
    return resource
  },

  createResource: async (resourceData: Omit<Resource, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newResource: Resource = {
      id: generateId("RS"),
      ...resourceData,
    }
    return newResource
  },

  updateResource: async (id: string, resourceData: Partial<Resource>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const resource = mockResources.find((r) => r.id === id)
    if (!resource) {
      throw new Error("Resource not found")
    }
    const updatedResource: Resource = {
      ...resource,
      ...resourceData,
    }
    return updatedResource
  },

  deleteResource: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  // Schedule
  getScheduleEvents: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockScheduleEvents
  },

  getScheduleEventById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const event = mockScheduleEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error("Schedule event not found")
    }
    return event
  },

  createScheduleEvent: async (eventData: Omit<ScheduleEvent, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newEvent: ScheduleEvent = {
      id: generateId("SCH"),
      ...eventData,
    }
    return newEvent
  },

  updateScheduleEvent: async (id: string, eventData: Partial<ScheduleEvent>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const event = mockScheduleEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error("Schedule event not found")
    }
    const updatedEvent: ScheduleEvent = {
      ...event,
      ...eventData,
    }
    return updatedEvent
  },

  deleteScheduleEvent: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  getScheduleNotifications: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockScheduleNotifications
  },

  // Collaboration
  getCollaborationGroups: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockCollaborationGroups
  },

  getCollaborationGroupById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const group = mockCollaborationGroups.find((g) => g.id === id)
    if (!group) {
      throw new Error("Collaboration group not found")
    }
    return group
  },

  createCollaborationGroup: async (groupData: Omit<CollaborationGroup, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newGroup: CollaborationGroup = {
      id: generateId("CG"),
      ...groupData,
    }
    return newGroup
  },

  getCollaborationMessages: async (groupId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockCollaborationMessages.filter((m) => m.groupId === groupId)
  },

  createCollaborationMessage: async (messageData: Omit<CollaborationMessage, "id" | "time">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newMessage: CollaborationMessage = {
      id: generateId("CM"),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      ...messageData,
    }
    return newMessage
  },

  getCollaborationFiles: async (groupId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockCollaborationFiles.filter((f) => f.groupId === groupId)
  },

  uploadCollaborationFile: async (fileData: Omit<CollaborationFile, "id" | "date">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newFile: CollaborationFile = {
      id: generateId("CF"),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      ...fileData,
    }
    return newFile
  },

  getCollaborationTasks: async (groupId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockCollaborationTasks.filter((t) => t.groupId === groupId)
  },

  createCollaborationTask: async (taskData: Omit<CollaborationTask, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newTask: CollaborationTask = {
      id: generateId("CT"),
      ...taskData,
    }
    return newTask
  },

  updateCollaborationTask: async (id: string, taskData: Partial<CollaborationTask>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const task = mockCollaborationTasks.find((t) => t.id === id)
    if (!task) {
      throw new Error("Collaboration task not found")
    }
    const updatedTask: CollaborationTask = {
      ...task,
      ...taskData,
    }
    return updatedTask
  },

  // Subjects
  getSubjects: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockSubjects
  },

  getSubjectById: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const subject = mockSubjects.find((s) => s.id === id)
    if (!subject) {
      throw new Error("Subject not found")
    }
    return subject
  },

  createSubject: async (subjectData: Omit<Subject, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newSubject: Subject = {
      id: generateId("SUB"),
      ...subjectData,
    }
    return newSubject
  },

  updateSubject: async (id: string, subjectData: Partial<Subject>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const subject = mockSubjects.find((s) => s.id === id)
    if (!subject) {
      throw new Error("Subject not found")
    }
    const updatedSubject: Subject = {
      ...subject,
      ...subjectData,
    }
    return updatedSubject
  },

  deleteSubject: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  },

  getSubjectsByCourse: async (courseId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockSubjects.filter((s) => s.courseIds.includes(courseId))
  },
}

