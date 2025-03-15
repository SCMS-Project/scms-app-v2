import type {
  Student,
  Faculty as Lecturer,
  Course,
  Facility,
  Reservation,
  Batch,
  Enrollment,
  Event,
  Message,
  Resource,
  Subject,
  User,
} from "../types"
import {
  mockStudents,
  mockLecturers,
  mockCourses,
  mockFacilities,
  mockReservations,
  mockBatches,
  mockEnrollments,
  mockEvents,
  mockMessages,
  mockResources,
  mockSubjects,
  mockUsers,
  mockScheduleEvents, // Added mockScheduleEvents import
  mockCollaborationGroups,
  mockCollaborationMessages,
  mockCollaborationFiles,
  mockCollaborationTasks,
} from "./mock-data"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock schedule notifications (since it's not imported)
const mockScheduleNotifications = [
  {
    id: "SCHNOT001",
    userId: "U001",
    message: "Your class in room A101 is starting in 15 minutes.",
    isRead: false,
  },
  {
    id: "SCHNOT002",
    userId: "U001",
    message: "Reminder: Submit your assignment by tomorrow.",
    isRead: false,
  },
]

export const api = {
  // Student API methods
  getStudents: async (): Promise<Student[]> => {
    await delay(800)
    return [...mockStudents]
  },

  getStudentById: async (id: string): Promise<Student | undefined> => {
    await delay(500)
    return mockStudents.find((student) => student.id === id)
  },

  createStudent: async (student: Omit<Student, "id">): Promise<Student> => {
    await delay(1000)
    const newStudent = {
      id: `ST${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...student,
    }
    mockStudents.push(newStudent)
    return newStudent
  },

  updateStudent: async (id: string, student: Partial<Student>): Promise<Student | undefined> => {
    await delay(1000)
    const index = mockStudents.findIndex((s) => s.id === id)
    if (index !== -1) {
      mockStudents[index] = { ...mockStudents[index], ...student }
      return mockStudents[index]
    }
    return undefined
  },

  deleteStudent: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockStudents.findIndex((s) => s.id === id)
    if (index !== -1) {
      mockStudents.splice(index, 1)
      return true
    }
    return false
  },

  // Lecturer API methods (renamed from Faculty)
  getLecturers: async (): Promise<Lecturer[]> => {
    await delay(800)
    return [...mockLecturers]
  },

  getLecturerById: async (id: string): Promise<Lecturer | undefined> => {
    await delay(500)
    return mockLecturers.find((lecturer) => lecturer.id === id)
  },

  createLecturer: async (lecturer: Omit<Lecturer, "id">): Promise<Lecturer> => {
    await delay(1000)
    const newLecturer = {
      id: `F${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...lecturer,
    }
    mockLecturers.push(newLecturer)
    return newLecturer
  },

  updateLecturer: async (id: string, lecturer: Partial<Lecturer>): Promise<Lecturer | undefined> => {
    await delay(1000)
    const index = mockLecturers.findIndex((f) => f.id === id)
    if (index !== -1) {
      mockLecturers[index] = { ...mockLecturers[index], ...lecturer }
      return mockLecturers[index]
    }
    return undefined
  },

  deleteLecturer: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockLecturers.findIndex((f) => f.id === id)
    if (index !== -1) {
      mockLecturers.splice(index, 1)
      return true
    }
    return false
  },

  // Course API methods
  getCourses: async (): Promise<Course[]> => {
    await delay(800)
    return [...mockCourses]
  },

  getCourseById: async (id: string): Promise<Course | undefined> => {
    await delay(500)
    return mockCourses.find((course) => course.id === id)
  },

  createCourse: async (course: Omit<Course, "id">): Promise<Course> => {
    await delay(1000)
    const newCourse = {
      id: `C${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...course,
    }
    mockCourses.push(newCourse)
    return newCourse
  },

  updateCourse: async (id: string, course: Partial<Course>): Promise<Course | undefined> => {
    await delay(1000)
    const index = mockCourses.findIndex((c) => c.id === id)
    if (index !== -1) {
      mockCourses[index] = { ...mockCourses[index], ...course }
      return mockCourses[index]
    }
    return undefined
  },

  deleteCourse: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockCourses.findIndex((c) => c.id === id)
    if (index !== -1) {
      mockCourses.splice(index, 1)
      return true
    }
    return false
  },

  // Facility API methods
  getFacilities: async (): Promise<Facility[]> => {
    await delay(800)
    return [...mockFacilities]
  },

  getFacilityById: async (id: string): Promise<Facility | undefined> => {
    await delay(500)
    return mockFacilities.find((facility) => facility.id === id)
  },

  createFacility: async (facility: Omit<Facility, "id">): Promise<Facility> => {
    await delay(1000)
    const newFacility = {
      id: `FAC${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...facility,
    }
    mockFacilities.push(newFacility)
    return newFacility
  },

  updateFacility: async (id: string, facility: Partial<Facility>): Promise<Facility | undefined> => {
    await delay(1000)
    const index = mockFacilities.findIndex((f) => f.id === id)
    if (index !== -1) {
      mockFacilities[index] = { ...mockFacilities[index], ...facility }
      return mockFacilities[index]
    }
    return undefined
  },

  deleteFacility: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockFacilities.findIndex((f) => f.id === id)
    if (index !== -1) {
      mockFacilities.splice(index, 1)
      return true
    }
    return false
  },

  // Reservation API methods
  getReservations: async (): Promise<Reservation[]> => {
    await delay(800)
    return [...mockReservations]
  },

  getReservationById: async (id: string): Promise<Reservation | undefined> => {
    await delay(500)
    return mockReservations.find((reservation) => reservation.id === id)
  },

  createReservation: async (reservation: Omit<Reservation, "id">): Promise<Reservation> => {
    await delay(1000)
    const newReservation = {
      id: `R${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...reservation,
    }
    mockReservations.push(newReservation)
    return newReservation
  },

  updateReservation: async (id: string, reservation: Partial<Reservation>): Promise<Reservation | undefined> => {
    await delay(1000)
    const index = mockReservations.findIndex((r) => r.id === id)
    if (index !== -1) {
      mockReservations[index] = { ...mockReservations[index], ...reservation }
      return mockReservations[index]
    }
    return undefined
  },

  deleteReservation: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockReservations.findIndex((r) => r.id === id)
    if (index !== -1) {
      mockReservations.splice(index, 1)
      return true
    }
    return false
  },

  // Batch API methods
  getBatches: async (): Promise<Batch[]> => {
    await delay(800)
    return [...mockBatches]
  },

  getBatchById: async (id: string): Promise<Batch | undefined> => {
    await delay(500)
    return mockBatches.find((batch) => batch.id === id)
  },

  createBatch: async (batch: Omit<Batch, "id">): Promise<Batch> => {
    await delay(1000)
    const newBatch = {
      id: `B${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...batch,
    }
    mockBatches.push(newBatch)
    return newBatch
  },

  updateBatch: async (id: string, batch: Partial<Batch>): Promise<Batch | undefined> => {
    await delay(1000)
    const index = mockBatches.findIndex((b) => b.id === id)
    if (index !== -1) {
      mockBatches[index] = { ...mockBatches[index], ...batch }
      return mockBatches[index]
    }
    return undefined
  },

  deleteBatch: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockBatches.findIndex((b) => b.id === id)
    if (index !== -1) {
      mockBatches.splice(index, 1)
      return true
    }
    return false
  },

  // Enrollment API methods
  getEnrollments: async (): Promise<Enrollment[]> => {
    await delay(800)
    return [...mockEnrollments]
  },

  getEnrollmentById: async (id: string): Promise<Enrollment | undefined> => {
    await delay(500)
    return mockEnrollments.find((enrollment) => enrollment.id === id)
  },

  createEnrollment: async (enrollment: Omit<Enrollment, "id">): Promise<Enrollment> => {
    await delay(1000)
    const newEnrollment = {
      id: `E${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...enrollment,
    }
    mockEnrollments.push(newEnrollment)
    return newEnrollment
  },

  updateEnrollment: async (id: string, enrollment: Partial<Enrollment>): Promise<Enrollment | undefined> => {
    await delay(1000)
    const index = mockEnrollments.findIndex((e) => e.id === id)
    if (index !== -1) {
      mockEnrollments[index] = { ...mockEnrollments[index], ...enrollment }
      return mockEnrollments[index]
    }
    return undefined
  },

  deleteEnrollment: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockEnrollments.findIndex((e) => e.id === id)
    if (index !== -1) {
      mockEnrollments.splice(index, 1)
      return true
    }
    return false
  },

  // Event API methods
  getEvents: async (): Promise<Event[]> => {
    await delay(800)
    return [...mockEvents]
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    await delay(500)
    return mockEvents.find((event) => event.id === id)
  },

  createEvent: async (event: Omit<Event, "id">): Promise<Event> => {
    await delay(1000)
    const newEvent = {
      id: `EV${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...event,
    }
    mockEvents.push(newEvent)
    return newEvent
  },

  updateEvent: async (id: string, event: Partial<Event>): Promise<Event | undefined> => {
    await delay(1000)
    const index = mockEvents.findIndex((e) => e.id === id)
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...event }
      return mockEvents[index]
    }
    return undefined
  },

  deleteEvent: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockEvents.findIndex((e) => e.id === id)
    if (index !== -1) {
      mockEvents.splice(index, 1)
      return true
    }
    return false
  },

  // Message API methods
  getMessages: async (): Promise<Message[]> => {
    await delay(800)
    return [...mockMessages]
  },

  getMessageById: async (id: string): Promise<Message | undefined> => {
    await delay(500)
    return mockMessages.find((message) => message.id === id)
  },

  createMessage: async (message: Omit<Message, "id" | "timestamp">): Promise<Message> => {
    await delay(1000)
    const newMessage = {
      id: `M${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      timestamp: new Date().toISOString(),
      ...message,
    }
    mockMessages.push(newMessage)
    return newMessage
  },

  updateMessage: async (id: string, message: Partial<Message>): Promise<Message | undefined> => {
    await delay(1000)
    const index = mockMessages.findIndex((m) => m.id === id)
    if (index !== -1) {
      mockMessages[index] = { ...mockMessages[index], ...message }
      return mockMessages[index]
    }
    return undefined
  },

  deleteMessage: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockMessages.findIndex((m) => m.id === id)
    if (index !== -1) {
      mockMessages.splice(index, 1)
      return true
    }
    return false
  },

  // Resource API methods
  getResources: async (): Promise<Resource[]> => {
    await delay(800)
    return [...mockResources]
  },

  getResourceById: async (id: string): Promise<Resource | undefined> => {
    await delay(500)
    return mockResources.find((resource) => resource.id === id)
  },

  createResource: async (resource: Omit<Resource, "id">): Promise<Resource> => {
    await delay(1000)
    const newResource = {
      id: `RS${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...resource,
    }
    mockResources.push(newResource)
    return newResource
  },

  updateResource: async (id: string, resource: Partial<Resource>): Promise<Resource | undefined> => {
    await delay(1000)
    const index = mockResources.findIndex((r) => r.id === id)
    if (index !== -1) {
      mockResources[index] = { ...mockResources[index], ...resource }
      return mockResources[index]
    }
    return undefined
  },

  deleteResource: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockResources.findIndex((r) => r.id === id)
    if (index !== -1) {
      mockResources.splice(index, 1)
      return true
    }
    return false
  },

  // Subject API methods
  getSubjects: async (): Promise<Subject[]> => {
    await delay(800)
    return [...mockSubjects]
  },

  getSubjectById: async (id: string): Promise<Subject | undefined> => {
    await delay(500)
    return mockSubjects.find((subject) => subject.id === id)
  },

  getSubjectsByCourseId: async (courseId: string): Promise<Subject[]> => {
    await delay(800)
    return mockSubjects.filter((subject) => subject.courseIds.includes(courseId))
  },

  createSubject: async (subject: Omit<Subject, "id">): Promise<Subject> => {
    await delay(1000)
    const newSubject = {
      id: `SUB${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...subject,
    }
    mockSubjects.push(newSubject)
    return newSubject
  },

  updateSubject: async (id: string, subject: Partial<Subject>): Promise<Subject | undefined> => {
    await delay(1000)
    const index = mockSubjects.findIndex((s) => s.id === id)
    if (index !== -1) {
      mockSubjects[index] = { ...mockSubjects[index], ...subject }
      return mockSubjects[index]
    }
    return undefined
  },

  deleteSubject: async (id: string): Promise<boolean> => {
    await delay(1000)
    const index = mockSubjects.findIndex((s) => s.id === id)
    if (index !== -1) {
      mockSubjects.splice(index, 1)
      return true
    }
    return false
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    await delay(800)
    console.log("API: Getting users, count:", mockUsers.length)
    console.log("API: Sample user:", mockUsers[0])
    return [...mockUsers]
  },

  getUser: async (id: string): Promise<User> => {
    await delay(500)
    console.log("API: Getting user by ID:", id)
    const user = mockUsers.find((u) => u.id === id)
    if (!user) {
      console.error("API: User not found")
      throw new Error("User not found")
    }
    return { ...user }
  },

  // Add the missing updateUserProfile method
  updateUserProfile: async (id: string, data: Partial<User>): Promise<User> => {
    await delay(500)
    console.log("API: Updating user profile for ID:", id)
    const index = mockUsers.findIndex((u) => u.id === id)

    if (index === -1) {
      // If user doesn't exist and we're creating a new one
      if (data.id === id) {
        const newUser = { ...data } as User
        mockUsers.push(newUser)
        console.log("API: Created new user:", newUser)
        return { ...newUser }
      }
      console.error("API: User not found for update")
      throw new Error("User not found")
    }

    // Update existing user
    mockUsers[index] = { ...mockUsers[index], ...data }
    console.log("API: Updated user:", mockUsers[index])
    return { ...mockUsers[index] }
  },

  // Get schedule events with better error handling
  getScheduleEvents: async () => {
    try {
      await delay(800)
      if (!mockScheduleEvents || mockScheduleEvents.length === 0) {
        throw new Error("No schedule events found")
      }
      return [...mockScheduleEvents]
    } catch (error) {
      console.error("Error fetching schedule events:", error)
      throw error
    }
  },

  // Get student enrollments
  getStudentEnrollments: async (studentId: string) => {
    try {
      await delay(800)
      return mockEnrollments.filter((enrollment) => enrollment.studentId === studentId)
    } catch (error) {
      console.error("Error fetching student enrollments:", error)
      throw error
    }
  },

  // Get course details
  getCourse: async (courseId: string) => {
    try {
      await delay(500)
      const course = mockCourses.find((course) => course.id === courseId)
      if (!course) {
        throw new Error(`Course not found: ${courseId}`)
      }
      return course
    } catch (error) {
      console.error("Error fetching course:", error)
      throw error
    }
  },

  // Register for courses
  registerForCourses: async (studentId: string, courseIds: string[]): Promise<boolean> => {
    try {
      await delay(1000)
      // In a real app, this would create actual enrollments
      // For now, just simulate success
      return true
    } catch (error) {
      console.error("Error registering for courses:", error)
      throw error
    }
  },

  // Check schedule conflicts with better error handling
  checkScheduleConflicts: async (userId: string, courseIds: string[]): Promise<boolean> => {
    try {
      await delay(500)
      // In a real app, this would check for actual conflicts
      return false
    } catch (error) {
      console.error("Error checking schedule conflicts:", error)
      throw error
    }
  },

  // Get schedule notifications with better error handling
  getScheduleNotifications: async (userId: string) => {
    try {
      await delay(800)
      return mockScheduleNotifications.filter(
        (notification) => notification.id.startsWith("SCHNOT") && !notification.isRead,
      )
    } catch (error) {
      console.error("Error fetching schedule notifications:", error)
      throw error
    }
  },

  // Mark notification as read with better error handling
  markScheduleNotificationAsRead: async (notificationId: string) => {
    try {
      await delay(500)
      const notification = mockScheduleNotifications.find((n) => n.id === notificationId)
      if (notification) {
        notification.isRead = true
      }
      return true
    } catch (error) {
      console.error("Error marking notification as read:", error)
      throw error
    }
  },

  // Add the getEventResources method to the api object
  getEventResources: async (): Promise<string[]> => {
    await delay(500)
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

  // Also add the getEventAnnouncements method which is used in the events page
  getEventAnnouncements: async () => {
    await delay(800)
    return [] // Return empty array for now, can be populated with mock data later
  },

  // Collaboration Group methods
  getCollaborationGroups: async () => {
    await delay(800)
    return [...mockCollaborationGroups]
  },

  getCollaborationGroup: async (id: string) => {
    await delay(500)
    return mockCollaborationGroups.find((group) => group.id === id)
  },

  createCollaborationGroup: async (groupData: Omit<(typeof mockCollaborationGroups)[0], "id">) => {
    await delay(1000)
    const newGroup = {
      id: `CG${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...groupData,
      members: [], // Initialize with empty members array
    }
    mockCollaborationGroups.push(newGroup)
    return newGroup
  },

  // Collaboration Messages methods
  getCollaborationMessages: async (groupId: string) => {
    await delay(800)
    return mockCollaborationMessages.filter((message) => message.groupId === groupId)
  },

  createCollaborationMessage: async (messageData: Omit<(typeof mockCollaborationMessages)[0], "id" | "time">) => {
    await delay(500)
    const newMessage = {
      id: `M${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      time: new Date().toISOString(),
      ...messageData,
    }
    mockCollaborationMessages.push(newMessage)
    return newMessage
  },

  // Collaboration Files methods
  getCollaborationFiles: async (groupId: string) => {
    await delay(800)
    return mockCollaborationFiles.filter((file) => file.groupId === groupId)
  },

  uploadCollaborationFile: async (fileData: Omit<(typeof mockCollaborationFiles)[0], "id" | "date">) => {
    await delay(1000)
    const newFile = {
      id: `F${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      ...fileData,
    }
    mockCollaborationFiles.push(newFile)
    return newFile
  },

  // Collaboration Tasks methods
  getCollaborationTasks: async (groupId: string) => {
    await delay(800)
    return mockCollaborationTasks.filter((task) => task.groupId === groupId)
  },

  createCollaborationTask: async (taskData: Omit<(typeof mockCollaborationTasks)[0], "id">) => {
    await delay(1000)
    const newTask = {
      id: `T${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...taskData,
    }
    mockCollaborationTasks.push(newTask)
    return newTask
  },

  updateCollaborationTask: async (taskId: string, updates: Partial<(typeof mockCollaborationTasks)[0]>) => {
    await delay(800)
    const taskIndex = mockCollaborationTasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) throw new Error("Task not found")

    mockCollaborationTasks[taskIndex] = {
      ...mockCollaborationTasks[taskIndex],
      ...updates,
    }
    return mockCollaborationTasks[taskIndex]
  },
}

