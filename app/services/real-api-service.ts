import { apiConfig } from "../config/api-config"
import { handleApiError } from "../utils/api-error-handler"
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
  DashboardStats,
  ScheduleEvent,
  CollaborationGroup,
  CollaborationMessage,
  CollaborationFile,
  CollaborationTask,
} from "../types"

// Helper function to make API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${apiConfig.apiUrl}${endpoint}`
  const headers = {
    ...apiConfig.headers,
    ...(options.headers || {}),
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

// Real API service implementation
export const realApiService = {
  // User methods
  getUsers: async (filters?: { role?: string }): Promise<User[]> => {
    const queryParams = filters?.role ? `?role=${filters.role}` : ""
    return apiRequest<User[]>(`/users${queryParams}`)
  },

  getUser: async (id: string): Promise<User> => {
    return apiRequest<User>(`/users/${id}`)
  },

  createUser: async (user: User): Promise<User> => {
    return apiRequest<User>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    })
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    return apiRequest<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    })
  },

  deleteUser: async (id: string): Promise<void> => {
    return apiRequest<void>(`/users/${id}`, {
      method: "DELETE",
    })
  },

  updateUserProfile: async (id: string, data: Partial<User>): Promise<User> => {
    return apiRequest<User>(`/users/${id}/profile`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  updateUserRole: async (id: string, role: string): Promise<User> => {
    return apiRequest<User>(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    })
  },

  // Student methods
  getStudents: async (): Promise<Student[]> => {
    return apiRequest<Student[]>("/students")
  },

  getStudent: async (id: string): Promise<Student> => {
    return apiRequest<Student>(`/students/${id}`)
  },

  createStudent: async (data: Partial<Student>): Promise<Student> => {
    return apiRequest<Student>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateStudent: async (id: string, data: Partial<Student>): Promise<Student> => {
    return apiRequest<Student>(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteStudent: async (id: string): Promise<void> => {
    return apiRequest<void>(`/students/${id}`, {
      method: "DELETE",
    })
  },

  // Lecturer methods
  getLecturers: async (): Promise<Lecturer[]> => {
    return apiRequest<Lecturer[]>("/lecturers")
  },

  getLecturer: async (id: string): Promise<Lecturer> => {
    return apiRequest<Lecturer>(`/lecturers/${id}`)
  },

  createLecturer: async (data: Partial<Lecturer>): Promise<Lecturer> => {
    return apiRequest<Lecturer>("/lecturers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateLecturer: async (id: string, data: Partial<Lecturer>): Promise<Lecturer> => {
    return apiRequest<Lecturer>(`/lecturers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteLecturer: async (id: string): Promise<void> => {
    return apiRequest<void>(`/lecturers/${id}`, {
      method: "DELETE",
    })
  },

  // Course methods
  getCourses: async (): Promise<Course[]> => {
    return apiRequest<Course[]>("/courses")
  },

  getCourse: async (id: string): Promise<Course> => {
    return apiRequest<Course>(`/courses/${id}`)
  },

  createCourse: async (data: Partial<Course>): Promise<Course> => {
    return apiRequest<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateCourse: async (id: string, data: Partial<Course>): Promise<Course> => {
    return apiRequest<Course>(`/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteCourse: async (id: string): Promise<void> => {
    return apiRequest<void>(`/courses/${id}`, {
      method: "DELETE",
    })
  },

  // Subject methods
  getSubjects: async (): Promise<Subject[]> => {
    return apiRequest<Subject[]>("/subjects")
  },

  getSubject: async (id: string): Promise<Subject> => {
    return apiRequest<Subject>(`/subjects/${id}`)
  },

  createSubject: async (data: Partial<Subject>): Promise<Subject> => {
    return apiRequest<Subject>("/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateSubject: async (id: string, data: Partial<Subject>): Promise<Subject> => {
    return apiRequest<Subject>(`/subjects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteSubject: async (id: string): Promise<void> => {
    return apiRequest<void>(`/subjects/${id}`, {
      method: "DELETE",
    })
  },

  // Batch methods
  getBatches: async (): Promise<Batch[]> => {
    return apiRequest<Batch[]>("/batches")
  },

  getBatch: async (id: string): Promise<Batch> => {
    return apiRequest<Batch>(`/batches/${id}`)
  },

  createBatch: async (data: Partial<Batch>): Promise<Batch> => {
    return apiRequest<Batch>("/batches", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateBatch: async (id: string, data: Partial<Batch>): Promise<Batch> => {
    return apiRequest<Batch>(`/batches/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteBatch: async (id: string): Promise<void> => {
    return apiRequest<void>(`/batches/${id}`, {
      method: "DELETE",
    })
  },

  // Enrollment methods
  getEnrollments: async (): Promise<Enrollment[]> => {
    return apiRequest<Enrollment[]>("/enrollments")
  },

  getEnrollment: async (id: string): Promise<Enrollment> => {
    return apiRequest<Enrollment>(`/enrollments/${id}`)
  },

  createEnrollment: async (data: Partial<Enrollment>): Promise<Enrollment> => {
    return apiRequest<Enrollment>("/enrollments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateEnrollment: async (id: string, data: Partial<Enrollment>): Promise<Enrollment> => {
    return apiRequest<Enrollment>(`/enrollments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteEnrollment: async (id: string): Promise<void> => {
    return apiRequest<void>(`/enrollments/${id}`, {
      method: "DELETE",
    })
  },

  // Event methods
  getEvents: async (): Promise<Event[]> => {
    return apiRequest<Event[]>("/events")
  },

  getEvent: async (id: string): Promise<Event> => {
    return apiRequest<Event>(`/events/${id}`)
  },

  createEvent: async (data: Partial<Event>): Promise<Event> => {
    return apiRequest<Event>("/events", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateEvent: async (id: string, data: Partial<Event>): Promise<Event> => {
    return apiRequest<Event>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteEvent: async (id: string): Promise<void> => {
    return apiRequest<void>(`/events/${id}`, {
      method: "DELETE",
    })
  },

  // Message methods
  getMessages: async (): Promise<Message[]> => {
    return apiRequest<Message[]>("/messages")
  },

  getMessage: async (id: string): Promise<Message> => {
    return apiRequest<Message>(`/messages/${id}`)
  },

  createMessage: async (data: Partial<Message>): Promise<Message> => {
    return apiRequest<Message>("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateMessage: async (id: string, data: Partial<Message>): Promise<Message> => {
    return apiRequest<Message>(`/messages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteMessage: async (id: string): Promise<void> => {
    return apiRequest<void>(`/messages/${id}`, {
      method: "DELETE",
    })
  },

  // Notification methods
  getNotifications: async (): Promise<Notification[]> => {
    return apiRequest<Notification[]>("/notifications")
  },

  getNotification: async (id: string): Promise<Notification> => {
    return apiRequest<Notification>(`/notifications/${id}`)
  },

  createNotification: async (data: Partial<Notification>): Promise<Notification> => {
    return apiRequest<Notification>("/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateNotification: async (id: string, data: Partial<Notification>): Promise<Notification> => {
    return apiRequest<Notification>(`/notifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteNotification: async (id: string): Promise<void> => {
    return apiRequest<void>(`/notifications/${id}`, {
      method: "DELETE",
    })
  },

  // Resource methods
  getResources: async (): Promise<Resource[]> => {
    return apiRequest<Resource[]>("/resources")
  },

  getResource: async (id: string): Promise<Resource> => {
    return apiRequest<Resource>(`/resources/${id}`)
  },

  createResource: async (data: Partial<Resource>): Promise<Resource> => {
    return apiRequest<Resource>("/resources", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateResource: async (id: string, data: Partial<Resource>): Promise<Resource> => {
    return apiRequest<Resource>(`/resources/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteResource: async (id: string): Promise<void> => {
    return apiRequest<void>(`/resources/${id}`, {
      method: "DELETE",
    })
  },

  // Facility methods
  getFacilities: async (): Promise<Facility[]> => {
    return apiRequest<Facility[]>("/facilities")
  },

  getFacility: async (id: string): Promise<Facility> => {
    return apiRequest<Facility>(`/facilities/${id}`)
  },

  createFacility: async (data: Partial<Facility>): Promise<Facility> => {
    return apiRequest<Facility>("/facilities", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateFacility: async (id: string, data: Partial<Facility>): Promise<Facility> => {
    return apiRequest<Facility>(`/facilities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteFacility: async (id: string): Promise<void> => {
    return apiRequest<void>(`/facilities/${id}`, {
      method: "DELETE",
    })
  },

  // Reservation methods
  getReservations: async (): Promise<Reservation[]> => {
    return apiRequest<Reservation[]>("/reservations")
  },

  getReservation: async (id: string): Promise<Reservation> => {
    return apiRequest<Reservation>(`/reservations/${id}`)
  },

  createReservation: async (data: Partial<Reservation>): Promise<Reservation> => {
    return apiRequest<Reservation>("/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateReservation: async (id: string, data: Partial<Reservation>): Promise<Reservation> => {
    return apiRequest<Reservation>(`/reservations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteReservation: async (id: string): Promise<void> => {
    return apiRequest<void>(`/reservations/${id}`, {
      method: "DELETE",
    })
  },

  // Dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>("/dashboard/stats")
  },

  // Schedule events
  getScheduleEvents: async (): Promise<ScheduleEvent[]> => {
    return apiRequest<ScheduleEvent[]>("/schedule/events")
  },

  // Collaboration methods
  getCollaborationGroups: async (): Promise<CollaborationGroup[]> => {
    return apiRequest<CollaborationGroup[]>("/collaboration/groups")
  },

  getCollaborationGroup: async (id: string): Promise<CollaborationGroup> => {
    return apiRequest<CollaborationGroup>(`/collaboration/groups/${id}`)
  },

  createCollaborationGroup: async (data: Partial<CollaborationGroup>): Promise<CollaborationGroup> => {
    return apiRequest<CollaborationGroup>("/collaboration/groups", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateCollaborationGroup: async (id: string, data: Partial<CollaborationGroup>): Promise<CollaborationGroup> => {
    return apiRequest<CollaborationGroup>(`/collaboration/groups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteCollaborationGroup: async (id: string): Promise<void> => {
    return apiRequest<void>(`/collaboration/groups/${id}`, {
      method: "DELETE",
    })
  },

  // Collaboration Message methods
  getCollaborationMessages: async (groupId: string): Promise<CollaborationMessage[]> => {
    return apiRequest<CollaborationMessage[]>(`/collaboration/groups/${groupId}/messages`)
  },

  createCollaborationMessage: async (data: Partial<CollaborationMessage>): Promise<CollaborationMessage> => {
    return apiRequest<CollaborationMessage>("/collaboration/messages", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Collaboration File methods
  getCollaborationFiles: async (groupId: string): Promise<CollaborationFile[]> => {
    return apiRequest<CollaborationFile[]>(`/collaboration/groups/${groupId}/files`)
  },

  createCollaborationFile: async (data: Partial<CollaborationFile>): Promise<CollaborationFile> => {
    return apiRequest<CollaborationFile>("/collaboration/files", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  deleteCollaborationFile: async (id: string): Promise<void> => {
    return apiRequest<void>(`/collaboration/files/${id}`, {
      method: "DELETE",
    })
  },

  // Collaboration Task methods
  getCollaborationTasks: async (groupId: string): Promise<CollaborationTask[]> => {
    return apiRequest<CollaborationTask[]>(`/collaboration/groups/${groupId}/tasks`)
  },

  createCollaborationTask: async (data: Partial<CollaborationTask>): Promise<CollaborationTask> => {
    return apiRequest<CollaborationTask>("/collaboration/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateCollaborationTask: async (id: string, data: Partial<CollaborationTask>): Promise<CollaborationTask> => {
    return apiRequest<CollaborationTask>(`/collaboration/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  deleteCollaborationTask: async (id: string): Promise<void> => {
    return apiRequest<void>(`/collaboration/tasks/${id}`, {
      method: "DELETE",
    })
  },
}

