import {
  mockStudents,
  mockLecturers,
  mockCourses,
  mockSubjects,
  mockFacilities,
  mockReservations,
  mockBatches,
  mockEnrollments,
  mockEvents,
  mockMessages,
  mockNotifications,
  mockResources,
  mockUsers,
} from "./mock-data"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock schedule events and notifications
const mockScheduleEvents = []
const mockScheduleNotifications = []

// Mock API implementation
export const mockApi = {
  // User methods
  getUsers: async () => {
    await delay(300)
    return mockUsers
  },

  getUser: async (id: string) => {
    await delay(200)
    const user = mockUsers.find((user) => user.id === id)
    if (!user) {
      throw new Error(`User with ID ${id} not found`)
    }
    return user
  },

  updateUser: async (id: string, data) => {
    await delay(500)
    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`)
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...data }
    return mockUsers[userIndex]
  },

  createUser: async (data) => {
    await delay(500)
    const newId = data.id || `U${String(mockUsers.length + 1).padStart(3, "0")}`
    const newUser = { ...data, id: newId }
    mockUsers.push(newUser)
    return newUser
  },

  updateUserProfile: async (id: string, data) => {
    await delay(500)
    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`)
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...data }
    return mockUsers[userIndex]
  },

  // Student methods
  getStudents: async () => {
    await delay(300)
    return mockStudents
  },

  getStudent: async (id: string) => {
    await delay(200)
    const student = mockStudents.find((student) => student.id === id)
    if (!student) {
      throw new Error(`Student with ID ${id} not found`)
    }
    return student
  },

  createStudent: async (data) => {
    await delay(500)
    const newId = `S${(mockStudents.length + 1).toString().padStart(3, "0")}`
    const newStudent = { id: newId, ...data }
    mockStudents.push(newStudent)
    return newStudent
  },

  updateStudent: async (id: string, data) => {
    await delay(500)
    const studentIndex = mockStudents.findIndex((s) => s.id === id)
    if (studentIndex === -1) {
      throw new Error(`Student with ID ${id} not found`)
    }
    mockStudents[studentIndex] = { ...mockStudents[studentIndex], ...data }
    return mockStudents[studentIndex]
  },

  deleteStudent: async (id: string) => {
    await delay(500)
    const studentIndex = mockStudents.findIndex((s) => s.id === id)
    if (studentIndex === -1) {
      throw new Error(`Student with ID ${id} not found`)
    }
    mockStudents.splice(studentIndex, 1)
  },

  // Lecturer methods
  getLecturers: async () => {
    await delay(300)
    return mockLecturers
  },

  getLecturer: async (id: string) => {
    await delay(200)
    const lecturer = mockLecturers.find((lecturer) => lecturer.id === id)
    if (!lecturer) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    return lecturer
  },

  createLecturer: async (data) => {
    await delay(500)
    const newId = `L${(mockLecturers.length + 1).toString().padStart(3, "0")}`
    const newLecturer = { id: newId, ...data }
    mockLecturers.push(newLecturer)
    return newLecturer
  },

  updateLecturer: async (id: string, data) => {
    await delay(500)
    const lecturerIndex = mockLecturers.findIndex((l) => l.id === id)
    if (lecturerIndex === -1) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    mockLecturers[lecturerIndex] = { ...mockLecturers[lecturerIndex], ...data }
    return mockLecturers[lecturerIndex]
  },

  deleteLecturer: async (id: string) => {
    await delay(500)
    const lecturerIndex = mockLecturers.findIndex((l) => l.id === id)
    if (lecturerIndex === -1) {
      throw new Error(`Lecturer with ID ${id} not found`)
    }
    mockLecturers.splice(lecturerIndex, 1)
  },

  // Course methods
  getCourses: async () => {
    await delay(300)
    return mockCourses
  },

  getCourse: async (id: string) => {
    await delay(200)
    const course = mockCourses.find((course) => course.id === id)
    if (!course) {
      throw new Error(`Course with ID ${id} not found`)
    }
    return course
  },

  createCourse: async (data) => {
    await delay(500)
    const newId = `C${(mockCourses.length + 1).toString().padStart(3, "0")}`
    const newCourse = { id: newId, ...data }
    mockCourses.push(newCourse)
    return newCourse
  },

  updateCourse: async (id: string, data) => {
    await delay(500)
    const courseIndex = mockCourses.findIndex((c) => c.id === id)
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${id} not found`)
    }
    mockCourses[courseIndex] = { ...mockCourses[courseIndex], ...data }
    return mockCourses[courseIndex]
  },

  deleteCourse: async (id: string) => {
    await delay(500)
    const courseIndex = mockCourses.findIndex((c) => c.id === id)
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${id} not found`)
    }
    mockCourses.splice(courseIndex, 1)
  },

  // Subject methods
  getSubjects: async () => {
    await delay(300)
    return mockSubjects
  },

  getSubject: async (id: string) => {
    await delay(200)
    const subject = mockSubjects.find((subject) => subject.id === id)
    if (!subject) {
      throw new Error(`Subject with ID ${id} not found`)
    }
    return subject
  },

  createSubject: async (data) => {
    await delay(500)
    const newId = `SB${(mockSubjects.length + 1).toString().padStart(3, "0")}`
    const newSubject = { id: newId, ...data }
    mockSubjects.push(newSubject)
    return newSubject
  },

  updateSubject: async (id: string, data) => {
    await delay(500)
    const subjectIndex = mockSubjects.findIndex((s) => s.id === id)
    if (subjectIndex === -1) {
      throw new Error(`Subject with ID ${id} not found`)
    }
    mockSubjects[subjectIndex] = { ...mockSubjects[subjectIndex], ...data }
    return mockSubjects[subjectIndex]
  },

  deleteSubject: async (id: string) => {
    await delay(500)
    const subjectIndex = mockSubjects.findIndex((s) => s.id === id)
    if (subjectIndex === -1) {
      throw new Error(`Subject with ID ${id} not found`)
    }
    mockSubjects.splice(subjectIndex, 1)
  },

  // Facility methods
  getFacilities: async () => {
    await delay(300)
    return mockFacilities
  },

  getFacility: async (id: string) => {
    await delay(200)
    const facility = mockFacilities.find((facility) => facility.id === id)
    if (!facility) {
      throw new Error(`Facility with ID ${id} not found`)
    }
    return facility
  },

  createFacility: async (data) => {
    await delay(500)
    const newId = `F${(mockFacilities.length + 1).toString().padStart(3, "0")}`
    const newFacility = { id: newId, ...data }
    mockFacilities.push(newFacility)
    return newFacility
  },

  updateFacility: async (id: string, data) => {
    await delay(500)
    const facilityIndex = mockFacilities.findIndex((f) => f.id === id)
    if (facilityIndex === -1) {
      throw new Error(`Facility with ID ${id} not found`)
    }
    mockFacilities[facilityIndex] = { ...mockFacilities[facilityIndex], ...data }
    return mockFacilities[facilityIndex]
  },

  deleteFacility: async (id: string) => {
    await delay(500)
    const facilityIndex = mockFacilities.findIndex((f) => f.id === id)
    if (facilityIndex === -1) {
      throw new Error(`Facility with ID ${id} not found`)
    }
    mockFacilities.splice(facilityIndex, 1)
  },

  // Reservation methods
  getReservations: async () => {
    await delay(300)
    return mockReservations
  },

  getReservation: async (id: string) => {
    await delay(200)
    const reservation = mockReservations.find((r) => r.id === id)
    if (!reservation) {
      throw new Error(`Reservation with ID ${id} not found`)
    }
    return reservation
  },

  createReservation: async (data) => {
    await delay(500)
    const newId = `R${(mockReservations.length + 1).toString().padStart(3, "0")}`
    const newReservation = { id: newId, ...data }
    mockReservations.push(newReservation)
    return newReservation
  },

  updateReservation: async (id: string, data) => {
    await delay(500)
    const reservationIndex = mockReservations.findIndex((r) => r.id === id)
    if (reservationIndex === -1) {
      throw new Error(`Reservation with ID ${id} not found`)
    }
    mockReservations[reservationIndex] = { ...mockReservations[reservationIndex], ...data }
    return mockReservations[reservationIndex]
  },

  deleteReservation: async (id: string) => {
    await delay(500)
    const reservationIndex = mockReservations.findIndex((r) => r.id === id)
    if (reservationIndex === -1) {
      throw new Error(`Reservation with ID ${id} not found`)
    }
    mockReservations.splice(reservationIndex, 1)
  },

  // Batch methods
  getBatches: async () => {
    await delay(300)
    return mockBatches
  },

  getBatch: async (id: string) => {
    await delay(200)
    const batch = mockBatches.find((b) => b.id === id)
    if (!batch) {
      throw new Error(`Batch with ID ${id} not found`)
    }
    return batch
  },

  createBatch: async (data) => {
    await delay(500)
    const newId = `B${(mockBatches.length + 1).toString().padStart(3, "0")}`
    const newBatch = { id: newId, ...data }
    mockBatches.push(newBatch)
    return newBatch
  },

  updateBatch: async (id: string, data) => {
    await delay(500)
    const batchIndex = mockBatches.findIndex((b) => b.id === id)
    if (batchIndex === -1) {
      throw new Error(`Batch with ID ${id} not found`)
    }
    mockBatches[batchIndex] = { ...mockBatches[batchIndex], ...data }
    return mockBatches[batchIndex]
  },

  deleteBatch: async (id: string) => {
    await delay(500)
    const batchIndex = mockBatches.findIndex((b) => b.id === id)
    if (batchIndex === -1) {
      throw new Error(`Batch with ID ${id} not found`)
    }
    mockBatches.splice(batchIndex, 1)
  },

  // Enrollment methods
  getEnrollments: async () => {
    await delay(300)
    return mockEnrollments
  },

  getEnrollment: async (id: string) => {
    await delay(200)
    const enrollment = mockEnrollments.find((e) => e.id === id)
    if (!enrollment) {
      throw new Error(`Enrollment with ID ${id} not found`)
    }
    return enrollment
  },

  createEnrollment: async (data) => {
    await delay(500)
    const newId = `E${(mockEnrollments.length + 1).toString().padStart(3, "0")}`
    const newEnrollment = { id: newId, ...data }
    mockEnrollments.push(newEnrollment)
    return newEnrollment
  },

  updateEnrollment: async (id: string, data) => {
    await delay(500)
    const enrollmentIndex = mockEnrollments.findIndex((e) => e.id === id)
    if (enrollmentIndex === -1) {
      throw new Error(`Enrollment with ID ${id} not found`)
    }
    mockEnrollments[enrollmentIndex] = { ...mockEnrollments[enrollmentIndex], ...data }
    return mockEnrollments[enrollmentIndex]
  },

  deleteEnrollment: async (id: string) => {
    await delay(500)
    const enrollmentIndex = mockEnrollments.findIndex((e) => e.id === id)
    if (enrollmentIndex === -1) {
      throw new Error(`Enrollment with ID ${id} not found`)
    }
    mockEnrollments.splice(enrollmentIndex, 1)
  },

  // Event methods
  getEvents: async () => {
    await delay(300)
    return mockEvents
  },

  getEvent: async (id: string) => {
    await delay(200)
    const event = mockEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error(`Event with ID ${id} not found`)
    }
    return event
  },

  createEvent: async (data) => {
    await delay(500)
    const newId = `EV${(mockEvents.length + 1).toString().padStart(3, "0")}`
    const newEvent = { id: newId, ...data }
    mockEvents.push(newEvent)
    return newEvent
  },

  updateEvent: async (id: string, data) => {
    await delay(500)
    const eventIndex = mockEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      throw new Error(`Event with ID ${id} not found`)
    }
    mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...data }
    return mockEvents[eventIndex]
  },

  deleteEvent: async (id: string) => {
    await delay(500)
    const eventIndex = mockEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      throw new Error(`Event with ID ${id} not found`)
    }
    mockEvents.splice(eventIndex, 1)
  },

  // Message methods
  getMessages: async () => {
    await delay(300)
    return mockMessages
  },

  getMessage: async (id: string) => {
    await delay(200)
    const message = mockMessages.find((m) => m.id === id)
    if (!message) {
      throw new Error(`Message with ID ${id} not found`)
    }
    return message
  },

  createMessage: async (data) => {
    await delay(500)
    const newId = `M${(mockMessages.length + 1).toString().padStart(3, "0")}`
    const newMessage = { id: newId, ...data }
    mockMessages.push(newMessage)
    return newMessage
  },

  updateMessage: async (id: string, data) => {
    await delay(500)
    const messageIndex = mockMessages.findIndex((m) => m.id === id)
    if (messageIndex === -1) {
      throw new Error(`Message with ID ${id} not found`)
    }
    mockMessages[messageIndex] = { ...mockMessages[messageIndex], ...data }
    return mockMessages[messageIndex]
  },

  deleteMessage: async (id: string) => {
    await delay(500)
    const messageIndex = mockMessages.findIndex((m) => m.id === id)
    if (messageIndex === -1) {
      throw new Error(`Message with ID ${id} not found`)
    }
    mockMessages.splice(messageIndex, 1)
  },

  // Notification methods
  getNotifications: async () => {
    await delay(300)
    return mockNotifications
  },

  getNotification: async (id: string) => {
    await delay(200)
    const notification = mockNotifications.find((n) => n.id === id)
    if (!notification) {
      throw new Error(`Notification with ID ${id} not found`)
    }
    return notification
  },

  createNotification: async (data) => {
    await delay(500)
    const newId = `N${(mockNotifications.length + 1).toString().padStart(3, "0")}`
    const newNotification = { id: newId, ...data }
    mockNotifications.push(newNotification)
    return newNotification
  },

  updateNotification: async (id: string, data) => {
    await delay(500)
    const notificationIndex = mockNotifications.findIndex((n) => n.id === id)
    if (notificationIndex === -1) {
      throw new Error(`Notification with ID ${id} not found`)
    }
    mockNotifications[notificationIndex] = { ...mockNotifications[notificationIndex], ...data }
    return mockNotifications[notificationIndex]
  },

  deleteNotification: async (id: string) => {
    await delay(500)
    const notificationIndex = mockNotifications.findIndex((n) => n.id === id)
    if (notificationIndex === -1) {
      throw new Error(`Notification with ID ${id} not found`)
    }
    mockNotifications.splice(notificationIndex, 1)
  },

  // Resource methods
  getResources: async () => {
    await delay(300)
    return mockResources
  },

  getResource: async (id: string) => {
    await delay(200)
    const resource = mockResources.find((r) => r.id === id)
    if (!resource) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    return resource
  },

  createResource: async (data) => {
    await delay(500)
    const newId = `RS${(mockResources.length + 1).toString().padStart(3, "0")}`
    const newResource = { id: newId, ...data }
    mockResources.push(newResource)
    return newResource
  },

  updateResource: async (id: string, data) => {
    await delay(500)
    const resourceIndex = mockResources.findIndex((r) => r.id === id)
    if (resourceIndex === -1) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    mockResources[resourceIndex] = { ...mockResources[resourceIndex], ...data }
    return mockResources[resourceIndex]
  },

  deleteResource: async (id: string) => {
    await delay(500)
    const resourceIndex = mockResources.findIndex((r) => r.id === id)
    if (resourceIndex === -1) {
      throw new Error(`Resource with ID ${id} not found`)
    }
    mockResources.splice(resourceIndex, 1)
  },

  getDashboardStats: async () => {
    await delay(300)
    return {
      totalStudents: mockStudents.length,
      totalLecturers: mockLecturers.length,
      totalCourses: mockCourses.length,
      totalFacilities: mockFacilities.length,
      activeEvents: mockEvents.filter((event) => new Date(event.date) > new Date()).length,
      activeEnrollments: mockEnrollments.length,
      resourceUtilization: 75, // Mock value
      upcomingEvents: mockEvents.filter((event) => new Date(event.date) > new Date()).length,
    }
  },

  // Add other missing methods that might be used in the dashboard
  getAttendanceData: async () => {
    await delay(300)
    return [
      { month: "Jan", attendance: 85 },
      { month: "Feb", attendance: 88 },
      { month: "Mar", attendance: 90 },
      { month: "Apr", attendance: 92 },
      { month: "May", attendance: 89 },
      { month: "Jun", attendance: 87 },
    ]
  },

  getDepartmentData: async () => {
    await delay(300)
    return [
      { department: "Computer Science", students: 120 },
      { department: "Engineering", students: 150 },
      { department: "Business", students: 100 },
      { department: "Arts", students: 80 },
      { department: "Medicine", students: 90 },
    ]
  },

  getEventAttendanceData: async () => {
    await delay(300)
    return [
      { event: "Orientation", attendance: 95 },
      { event: "Career Fair", attendance: 85 },
      { event: "Workshop", attendance: 75 },
      { event: "Seminar", attendance: 65 },
      { event: "Conference", attendance: 90 },
    ]
  },

  getResourceUtilizationData: async () => {
    await delay(300)
    return [
      { resource: "Library", utilization: 80 },
      { resource: "Computer Lab", utilization: 90 },
      { resource: "Study Room", utilization: 70 },
      { resource: "Auditorium", utilization: 60 },
      { resource: "Cafeteria", utilization: 85 },
    ]
  },

  getEventAnnouncements: async () => {
    await delay(300)
    return []
  },

  getEventResources: async () => {
    await delay(300)
    return ["Projector", "Microphone", "Chairs", "Tables"]
  },

  // Schedule events
  getScheduleEvents: async () => {
    await delay(300)
    // Generate mock schedule events
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const types = ["Lecture", "Lab", "Tutorial", "Exam", "Other"]
    const locations = [
      "Science Building, Room 101",
      "Science Building, Room 102",
      "Math Building, Room 201",
      "Arts Building, Room 105",
    ]

    const mockScheduleEvents = []

    // Generate 15 mock schedule events
    for (let i = 0; i < 15; i++) {
      const day = days[Math.floor(Math.random() * days.length)]
      const type = types[Math.floor(Math.random() * types.length)]
      const location = locations[Math.floor(Math.random() * locations.length)]
      const hour = 8 + Math.floor(Math.random() * 10) // 8 AM to 6 PM
      const startTime = `${hour.toString().padStart(2, "0")}:00`
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:30`

      // Use course data if available
      const course = mockCourses[Math.floor(Math.random() * mockCourses.length)]

      mockScheduleEvents.push({
        id: `SCH${(i + 1).toString().padStart(3, "0")}`,
        title: course ? course.name : `Class ${i + 1}`,
        courseCode: course ? course.id : `C${(i + 1).toString().padStart(3, "0")}`,
        instructor: course ? course.instructor : `Instructor ${i + 1}`,
        location,
        day,
        startTime,
        endTime,
        type,
      })
    }

    return mockScheduleEvents
  },

  getScheduleEvent: async (id: string) => {
    const event = mockScheduleEvents.find((event) => event.id === id)
    if (!event) {
      throw new Error(`Schedule event with ID ${id} not found`)
    }
    return event
  },

  createScheduleEvent: async (data) => {
    // Create a new schedule event
    const newEvent = {
      id: data.id || `SCH${Date.now().toString().slice(-6)}`,
      title: data.title || "Untitled Event",
      courseCode: data.courseCode || "",
      instructor: data.instructor || "",
      location: data.location || "",
      day: data.day || "Monday",
      startTime: data.startTime || "09:00",
      endTime: data.endTime || "10:00",
      type: data.type || "Lecture",
      facilityId: data.facilityId,
      facilityName: data.facilityName,
      facilityCode: data.facilityCode,
    }

    // Add to mock data
    mockScheduleEvents.push(newEvent)

    return newEvent
  },

  updateScheduleEvent: async (id: string, data) => {
    const eventIndex = mockScheduleEvents.findIndex((event) => event.id === id)
    if (eventIndex === -1) {
      throw new Error(`Schedule event with ID ${id} not found`)
    }

    // Update the event
    mockScheduleEvents[eventIndex] = {
      ...mockScheduleEvents[eventIndex],
      ...data,
    }

    return mockScheduleEvents[eventIndex]
  },

  deleteScheduleEvent: async (id: string) => {
    const eventIndex = mockScheduleEvents.findIndex((event) => event.id === id)
    if (eventIndex === -1) {
      throw new Error(`Schedule event with ID ${id} not found`)
    }

    // Remove the event
    mockScheduleEvents.splice(eventIndex, 1)
  },

  // Schedule notifications
  getScheduleNotifications: async (userId) => {
    // Return mock notifications for the user
    return mockScheduleNotifications.filter((notification) => notification.userId === userId || !notification.userId)
  },

  markScheduleNotificationAsRead: async (id) => {
    const notificationIndex = mockScheduleNotifications.findIndex((notification) => notification.id === id)
    if (notificationIndex === -1) {
      throw new Error(`Notification with ID ${id} not found`)
    }

    // Mark as read
    mockScheduleNotifications[notificationIndex].isRead = true

    return mockScheduleNotifications[notificationIndex]
  },

  // Schedule conflict check
  checkScheduleConflicts: async (userId, courseIds) => {
    // Simulate checking for conflicts
    // In a real implementation, this would check the user's existing schedule against the courses they want to register for
    return false // No conflicts for demo purposes
  },

  // Course registration
  registerForCourses: async (userId, courseIds) => {
    // Simulate registering for courses
    // In a real implementation, this would create enrollment records
    return true // Success for demo purposes
  },

  // Student enrollments
  getStudentEnrollments: async (studentId) => {
    // Return mock enrollments for the student
    return mockEnrollments.filter((enrollment) => enrollment.studentId === studentId)
  },
}

