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
  mockCollaborationGroups,
} from "./mock-data"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

  getScheduleNotifications: async (userId) => {
    await delay(300)
    // Generate mock schedule notifications
    const types = ["Cancellation", "Reschedule", "RoomChange", "NewClass", "Reminder", "Registration"]
    const mockScheduleNotifications = []

    // Generate 5 mock notifications
    for (let i = 0; i < 5; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const isRead = Math.random() > 0.5

      let title, message
      switch (type) {
        case "Cancellation":
          title = "Class Cancelled"
          message = `Your ${["Math", "Physics", "Computer Science", "Literature"][Math.floor(Math.random() * 4)]} class on ${["Monday", "Tuesday", "Wednesday"][Math.floor(Math.random() * 3)]} has been cancelled.`
          break
        case "Reschedule":
          title = "Class Rescheduled"
          message = `Your ${["Math", "Physics", "Computer Science", "Literature"][Math.floor(Math.random() * 4)]} class has been rescheduled to ${["Monday", "Tuesday", "Wednesday"][Math.floor(Math.random() * 3)]} at ${8 + Math.floor(Math.random() * 10)}:00.`
          break
        case "RoomChange":
          title = "Room Change"
          message = `Your ${["Math", "Physics", "Computer Science", "Literature"][Math.floor(Math.random() * 4)]} class has been moved to Room ${100 + Math.floor(Math.random() * 100)}.`
          break
        case "NewClass":
          title = "New Class Added"
          message = `A new ${["Math", "Physics", "Computer Science", "Literature"][Math.floor(Math.random() * 4)]} class has been added to your schedule on ${["Monday", "Tuesday", "Wednesday"][Math.floor(Math.random() * 3)]} at ${8 + Math.floor(Math.random() * 10)}:00.`
          break
        case "Reminder":
          title = "Class Reminder"
          message = `Reminder: You have a ${["Math", "Physics", "Computer Science", "Literature"][Math.floor(Math.random() * 4)]} class tomorrow at ${8 + Math.floor(Math.random() * 10)}:00.`
          break
        case "Registration":
          title = "Registration Successful"
          message = `You have successfully registered for ${["Math", "Physics", "Computer Science", "Literature"][Math.floor(Math.random() * 4)]} class.`
          break
        default:
          title = "Schedule Update"
          message = "Your schedule has been updated."
      }

      mockScheduleNotifications.push({
        id: `SCHNOT${(i + 1).toString().padStart(3, "0")}`,
        userId,
        title,
        message,
        date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(), // Random date within the last week
        isRead,
        type,
      })
    }

    return mockScheduleNotifications
  },

  markScheduleNotificationAsRead: async (id) => {
    await delay(300)
    // Find the notification and mark it as read
    const notificationIndex = mockNotifications.findIndex((n) => n.id === id)
    if (notificationIndex !== -1) {
      mockNotifications[notificationIndex] = {
        ...mockNotifications[notificationIndex],
        isRead: true,
      }
      return mockNotifications[notificationIndex]
    }
    throw new Error(`Notification with ID ${id} not found`)
  },

  checkScheduleConflicts: async (studentId, courseIds) => {
    await delay(300)
    // For demo purposes, return a conflict if the courseIds array has more than 3 items
    // In a real implementation, this would check for actual time conflicts
    return courseIds.length > 3
  },

  registerForCourses: async (studentId, courseIds) => {
    await delay(500)

    // Create enrollments for each course
    for (const courseId of courseIds) {
      const course = mockCourses.find((c) => c.id === courseId)
      if (course) {
        const newEnrollment = {
          id: `E${(mockEnrollments.length + 1).toString().padStart(3, "0")}`,
          studentId,
          studentName: mockStudents.find((s) => s.id === studentId)?.name || "Unknown Student",
          courseId,
          courseName: course.name,
          batchId: "B001", // Default batch
          batchName: "Batch 2023",
          enrollmentDate: new Date().toISOString(),
          status: "Active",
        }

        mockEnrollments.push(newEnrollment)
      }
    }

    return true
  },

  getStudentEnrollments: async (studentId) => {
    await delay(300)
    return mockEnrollments.filter((enrollment) => enrollment.studentId === studentId)
  },

  getCourseSubjects: async (courseId) => {
    await delay(300)
    return mockSubjects.filter((subject) => subject.courseIds && subject.courseIds.includes(courseId))
  },

  assignSubjectsToCourse: async (courseId, subjectIds) => {
    await delay(500)
    const courseIndex = mockCourses.findIndex((c) => c.id === courseId)
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${courseId} not found`)
    }

    // Update subjects to include this course
    subjectIds.forEach((subjectId) => {
      const subjectIndex = mockSubjects.findIndex((s) => s.id === subjectId)
      if (subjectIndex !== -1) {
        if (!mockSubjects[subjectIndex].courseIds) {
          mockSubjects[subjectIndex].courseIds = []
        }
        if (!mockSubjects[subjectIndex].courseIds.includes(courseId)) {
          mockSubjects[subjectIndex].courseIds.push(courseId)
        }
      }
    })

    return mockCourses[courseIndex]
  },

  removeSubjectsFromCourse: async (courseId, subjectIds) => {
    await delay(500)

    // Update subjects to remove this course
    subjectIds.forEach((subjectId) => {
      const subjectIndex = mockSubjects.findIndex((s) => s.id === subjectId)
      if (subjectIndex !== -1 && mockSubjects[subjectIndex].courseIds) {
        mockSubjects[subjectIndex].courseIds = mockSubjects[subjectIndex].courseIds.filter((id) => id !== courseId)
      }
    })
  },

  // Resource checkout/return methods
  checkoutResource: async (id, userId, userName) => {
    await delay(500)
    const resourceIndex = mockResources.findIndex((r) => r.id === id)
    if (resourceIndex === -1) {
      throw new Error(`Resource with ID ${id} not found`)
    }

    mockResources[resourceIndex] = {
      ...mockResources[resourceIndex],
      status: "checked-out",
      checkedOutBy: {
        id: userId,
        name: userName,
      },
      checkedOutDate: new Date().toISOString(),
    }

    return mockResources[resourceIndex]
  },

  returnResource: async (id) => {
    await delay(500)
    const resourceIndex = mockResources.findIndex((r) => r.id === id)
    if (resourceIndex === -1) {
      throw new Error(`Resource with ID ${id} not found`)
    }

    mockResources[resourceIndex] = {
      ...mockResources[resourceIndex],
      status: "available",
      checkedOutBy: null,
      checkedOutDate: null,
      returnDate: new Date().toISOString(),
    }

    return mockResources[resourceIndex]
  },

  // Message sending method
  sendMessage: async (data) => {
    await delay(500)
    const newId = `M${(mockMessages.length + 1).toString().padStart(3, "0")}`
    const newMessage = {
      id: newId,
      timestamp: new Date().toISOString(),
      ...data,
    }
    mockMessages.push(newMessage)
    return newMessage
  },

  // Notification read method
  markNotificationAsRead: async (id) => {
    await delay(300)
    const notificationIndex = mockNotifications.findIndex((n) => n.id === id)
    if (notificationIndex === -1) {
      throw new Error(`Notification with ID ${id} not found`)
    }

    mockNotifications[notificationIndex] = {
      ...mockNotifications[notificationIndex],
      read: true,
    }

    return mockNotifications[notificationIndex]
  },

  // Collaboration methods
  getCollaborationGroups: async () => {
    await delay(300)
    return mockCollaborationGroups
  },

  getCollaborationGroup: async (id: string) => {
    await delay(200)
    const group = mockCollaborationGroups.find((g) => g.id === id)
    if (!group) {
      throw new Error(`Collaboration Group with ID ${id} not found`)
    }
    return group
  },

  createCollaborationGroup: async (data) => {
    await delay(500)
    const newId = `CG${(mockCollaborationGroups.length + 1).toString().padStart(3, "0")}`
    const newGroup = { id: newId, ...data }
    mockCollaborationGroups.push(newGroup)
    return newGroup
  },

  updateCollaborationGroup: async (id: string, data) => {
    await delay(500)
    const groupIndex = mockCollaborationGroups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      throw new Error(`Collaboration Group with ID ${id} not found`)
    }
    mockCollaborationGroups[groupIndex] = { ...mockCollaborationGroups[groupIndex], ...data }
    return mockCollaborationGroups[groupIndex]
  },

  deleteCollaborationGroup: async (id: string) => {
    await delay(500)
    const groupIndex = mockCollaborationGroups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      throw new Error(`Collaboration Group with ID ${id} not found`)
    }
    mockCollaborationGroups.splice(groupIndex, 1)
  },

  // Collaboration Message methods
  getCollaborationMessages: async (groupId: string) => {
    await delay(300)
    // This would be implemented in a real API
    return []
  },

  createCollaborationMessage: async (data) => {
    await delay(500)
    // This would be implemented in a real API
    return { id: "CM001", ...data }
  },

  // Collaboration File methods
  getCollaborationFiles: async (groupId: string) => {
    await delay(300)
    // This would be implemented in a real API
    return []
  },

  createCollaborationFile: async (data) => {
    await delay(500)
    // This would be implemented in a real API
    return { id: "CF001", ...data }
  },

  deleteCollaborationFile: async (id: string) => {
    await delay(500)
    // This would be implemented in a real API
  },

  // Collaboration Task methods
  getCollaborationTasks: async (groupId: string) => {
    await delay(300)
    // This would be implemented in a real API
    return []
  },

  createCollaborationTask: async (data) => {
    await delay(500)
    // This would be implemented in a real API
    return { id: "CT001", ...data }
  },

  updateCollaborationTask: async (id: string, data) => {
    await delay(500)
    // This would be implemented in a real API
    return { id, ...data }
  },

  deleteCollaborationTask: async (id: string) => {
    await delay(500)
    // This would be implemented in a real API
  },
}

