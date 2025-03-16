import { mockApi } from "./mock-api"
import type {
  Student,
  Lecturer,
  Course,
  Batch,
  Enrollment,
  Event,
  Message,
  Notification,
  Resource,
  User,
  Facility,
  Reservation,
  Subject,
  CollaborationGroup,
  CollaborationMessage,
  CollaborationFile,
  CollaborationTask,
  ScheduleEvent,
  ScheduleNotification,
} from "../types"

// Mock API service implementation
export const mockApiService = {
  // User methods
  getUsers: async (filters?: { role?: string }): Promise<User[]> => {
    const users = await mockApi.getUsers()

    if (filters?.role) {
      return users.filter((user) => user.role === filters.role)
    }

    return users
  },

  getUser: async (id: string): Promise<User> => {
    return mockApi.getUser(id)
  },

  updateUserProfile: async (id: string, data: Partial<User>): Promise<User> => {
    return mockApi.updateUserProfile(id, data)
  },

  updateUserRole: async (id: string, role: string): Promise<User> => {
    const user = await mockApi.getUser(id)
    return mockApi.updateUserProfile(id, { ...user, role })
  },

  // Add these methods if they don't exist
  // User management methods
  createUser: async (user: User): Promise<User> => {
    // In a real implementation, this would make an API call to create a user
    console.log("Creating user:", user)
    return user
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    // In a real implementation, this would make an API call to update a user
    console.log("Updating user:", id, userData)
    return { ...userData } as User
  },

  deleteUser: async (id: string): Promise<void> => {
    // In a real implementation, this would make an API call to delete a user
    console.log("Deleting user:", id)
  },

  // Student methods
  getStudents: async (): Promise<Student[]> => {
    return mockApi.getStudents()
  },

  getStudent: async (id: string): Promise<Student> => {
    return mockApi.getStudent(id)
  },

  createStudent: async (data: Partial<Student>): Promise<Student> => {
    return mockApi.createStudent(data)
  },

  updateStudent: async (id: string, data: Partial<Student>): Promise<Student> => {
    return mockApi.updateStudent(id, data)
  },

  deleteStudent: async (id: string): Promise<void> => {
    return mockApi.deleteStudent(id)
  },

  // Lecturer methods
  getLecturers: async (): Promise<Lecturer[]> => {
    return mockApi.getLecturers()
  },

  getLecturer: async (id: string): Promise<Lecturer> => {
    return mockApi.getLecturer(id)
  },

  createLecturer: async (data: Partial<Lecturer>): Promise<Lecturer> => {
    return mockApi.createLecturer(data)
  },

  updateLecturer: async (id: string, data: Partial<Lecturer>): Promise<Lecturer> => {
    return mockApi.updateLecturer(id, data)
  },

  deleteLecturer: async (id: string): Promise<void> => {
    return mockApi.deleteLecturer(id)
  },

  // Course methods
  getCourses: async (): Promise<Course[]> => {
    return mockApi.getCourses()
  },

  getCourse: async (id: string): Promise<Course> => {
    return mockApi.getCourse(id)
  },

  createCourse: async (data: Partial<Course>): Promise<Course> => {
    return mockApi.createCourse(data)
  },

  updateCourse: async (id: string, data: Partial<Course>): Promise<Course> => {
    return mockApi.updateCourse(id, data)
  },

  deleteCourse: async (id: string): Promise<void> => {
    return mockApi.deleteCourse(id)
  },

  // Subject methods
  getSubjects: async (): Promise<Subject[]> => {
    return mockApi.getSubjects()
  },

  getSubject: async (id: string): Promise<Subject> => {
    return mockApi.getSubject(id)
  },

  createSubject: async (data: Partial<Subject>): Promise<Subject> => {
    return mockApi.createSubject(data)
  },

  updateSubject: async (id: string, data: Partial<Subject>): Promise<Subject> => {
    return mockApi.updateSubject(id, data)
  },

  deleteSubject: async (id: string): Promise<void> => {
    return mockApi.deleteSubject(id)
  },

  // Batch methods
  getBatches: async (): Promise<Batch[]> => {
    return mockApi.getBatches()
  },

  getBatch: async (id: string): Promise<Batch> => {
    return mockApi.getBatch(id)
  },

  createBatch: async (data: Partial<Batch>): Promise<Batch> => {
    return mockApi.createBatch(data)
  },

  updateBatch: async (id: string, data: Partial<Batch>): Promise<Batch> => {
    return mockApi.updateBatch(id, data)
  },

  deleteBatch: async (id: string): Promise<void> => {
    return mockApi.deleteBatch(id)
  },

  // Enrollment methods
  getEnrollments: async (): Promise<Enrollment[]> => {
    return mockApi.getEnrollments()
  },

  getEnrollment: async (id: string): Promise<Enrollment> => {
    return mockApi.getEnrollment(id)
  },

  createEnrollment: async (data: Partial<Enrollment>): Promise<Enrollment> => {
    return mockApi.createEnrollment(data)
  },

  updateEnrollment: async (id: string, data: Partial<Enrollment>): Promise<Enrollment> => {
    return mockApi.updateEnrollment(id, data)
  },

  deleteEnrollment: async (id: string): Promise<void> => {
    return mockApi.deleteEnrollment(id)
  },

  // Event methods
  getEvents: async (): Promise<Event[]> => {
    return mockApi.getEvents()
  },

  getEvent: async (id: string): Promise<Event> => {
    return mockApi.getEvent(id)
  },

  createEvent: async (data: Partial<Event>): Promise<Event> => {
    return mockApi.createEvent(data)
  },

  updateEvent: async (id: string, data: Partial<Event>): Promise<Event> => {
    return mockApi.updateEvent(id, data)
  },

  deleteEvent: async (id: string): Promise<void> => {
    return mockApi.deleteEvent(id)
  },

  // Message methods
  getMessages: async (): Promise<Message[]> => {
    return mockApi.getMessages()
  },

  getMessage: async (id: string): Promise<Message> => {
    return mockApi.getMessage(id)
  },

  createMessage: async (data: Partial<Message>): Promise<Message> => {
    return mockApi.createMessage(data)
  },

  updateMessage: async (id: string, data: Partial<Message>): Promise<Message> => {
    return mockApi.updateMessage(id, data)
  },

  deleteMessage: async (id: string): Promise<void> => {
    return mockApi.deleteMessage(id)
  },

  // Notification methods
  getNotifications: async (): Promise<Notification[]> => {
    return mockApi.getNotifications()
  },

  getNotification: async (id: string): Promise<Notification> => {
    return mockApi.getNotification(id)
  },

  createNotification: async (data: Partial<Notification>): Promise<Notification> => {
    return mockApi.createNotification(data)
  },

  updateNotification: async (id: string, data: Partial<Notification>): Promise<Notification> => {
    return mockApi.updateNotification(id, data)
  },

  deleteNotification: async (id: string): Promise<void> => {
    return mockApi.deleteNotification(id)
  },

  // Resource methods
  getResources: async (): Promise<Resource[]> => {
    return mockApi.getResources()
  },

  getResource: async (id: string): Promise<Resource> => {
    return mockApi.getResource(id)
  },

  createResource: async (data: Partial<Resource>): Promise<Resource> => {
    return mockApi.createResource(data)
  },

  updateResource: async (id: string, data: Partial<Resource>): Promise<Resource> => {
    return mockApi.updateResource(id, data)
  },

  deleteResource: async (id: string): Promise<void> => {
    return mockApi.deleteResource(id)
  },

  // Facility methods
  getFacilities: async (): Promise<Facility[]> => {
    return mockApi.getFacilities()
  },

  getFacility: async (id: string): Promise<Facility> => {
    return mockApi.getFacility(id)
  },

  createFacility: async (data: Partial<Facility>): Promise<Facility> => {
    return mockApi.createFacility(data)
  },

  updateFacility: async (id: string, data: Partial<Facility>): Promise<Facility> => {
    return mockApi.updateFacility(id, data)
  },

  deleteFacility: async (id: string): Promise<void> => {
    return mockApi.deleteFacility(id)
  },

  // Reservation methods
  getReservations: async (): Promise<Reservation[]> => {
    return mockApi.getReservations()
  },

  getReservation: async (id: string): Promise<Reservation> => {
    return mockApi.getReservation(id)
  },

  createReservation: async (data: Partial<Reservation>): Promise<Reservation> => {
    return mockApi.createReservation(data)
  },

  updateReservation: async (id: string, data: Partial<Reservation>): Promise<Reservation> => {
    return mockApi.updateReservation(id, data)
  },

  deleteReservation: async (id: string): Promise<void> => {
    return mockApi.deleteReservation(id)
  },

  // Collaboration methods
  getCollaborationGroups: async (): Promise<CollaborationGroup[]> => {
    return mockApi.getCollaborationGroups()
  },

  getCollaborationGroup: async (id: string): Promise<CollaborationGroup> => {
    return mockApi.getCollaborationGroup(id)
  },

  createCollaborationGroup: async (data: Partial<CollaborationGroup>): Promise<CollaborationGroup> => {
    return mockApi.createCollaborationGroup(data)
  },

  updateCollaborationGroup: async (id: string, data: Partial<CollaborationGroup>): Promise<CollaborationGroup> => {
    return mockApi.updateCollaborationGroup(id, data)
  },

  deleteCollaborationGroup: async (id: string): Promise<void> => {
    return mockApi.deleteCollaborationGroup(id)
  },

  // Collaboration Message methods
  getCollaborationMessages: async (groupId: string): Promise<CollaborationMessage[]> => {
    return mockApi.getCollaborationMessages(groupId)
  },

  createCollaborationMessage: async (data: Partial<CollaborationMessage>): Promise<CollaborationMessage> => {
    return mockApi.createCollaborationMessage(data)
  },

  // Collaboration File methods
  getCollaborationFiles: async (groupId: string): Promise<CollaborationFile[]> => {
    return mockApi.getCollaborationFiles(groupId)
  },

  createCollaborationFile: async (data: Partial<CollaborationFile>): Promise<CollaborationFile> => {
    return mockApi.createCollaborationFile(data)
  },

  deleteCollaborationFile: async (id: string): Promise<void> => {
    return mockApi.deleteCollaborationFile(id)
  },

  // Collaboration Task methods
  getCollaborationTasks: async (groupId: string): Promise<CollaborationTask[]> => {
    return mockApi.getCollaborationTasks(groupId)
  },

  createCollaborationTask: async (data: Partial<CollaborationTask>): Promise<CollaborationTask> => {
    return mockApi.createCollaborationTask(data)
  },

  updateCollaborationTask: async (id: string, data: Partial<CollaborationTask>): Promise<CollaborationTask> => {
    return mockApi.updateCollaborationTask(id, data)
  },

  deleteCollaborationTask: async (id: string): Promise<void> => {
    return mockApi.deleteCollaborationTask(id)
  },

  // Schedule methods
  getScheduleEvents: async (): Promise<ScheduleEvent[]> => {
    return mockApi.getScheduleEvents()
  },

  getScheduleEvent: async (id: string): Promise<ScheduleEvent> => {
    return mockApi.getScheduleEvent(id)
  },

  createScheduleEvent: async (data: Partial<ScheduleEvent>): Promise<ScheduleEvent> => {
    return mockApi.createScheduleEvent(data)
  },

  updateScheduleEvent: async (id: string, data: Partial<ScheduleEvent>): Promise<ScheduleEvent> => {
    return mockApi.updateScheduleEvent(id, data)
  },

  deleteScheduleEvent: async (id: string): Promise<void> => {
    return mockApi.deleteScheduleEvent(id)
  },

  // Schedule notification methods
  getScheduleNotifications: async (userId: string): Promise<ScheduleNotification[]> => {
    return mockApi.getScheduleNotifications(userId)
  },

  markScheduleNotificationAsRead: async (id: string): Promise<ScheduleNotification> => {
    return mockApi.markScheduleNotificationAsRead(id)
  },

  // Schedule conflict check
  checkScheduleConflicts: async (userId: string, courseIds: string[]): Promise<boolean> => {
    return mockApi.checkScheduleConflicts(userId, courseIds)
  },

  // Course registration
  registerForCourses: async (userId: string, courseIds: string[]): Promise<boolean> => {
    return mockApi.registerForCourses(userId, courseIds)
  },

  // Student enrollments
  getStudentEnrollments: async (studentId: string): Promise<any[]> => {
    return mockApi.getStudentEnrollments(studentId)
  },
}

