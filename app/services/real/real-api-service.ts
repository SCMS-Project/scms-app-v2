import type { ApiService } from "../interfaces/api-service"

export class RealApiService implements ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Helper method for making API requests
  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Auth
  async login(credentials: { email: string; password: string }) {
    return this.fetchApi("auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: any) {
    return this.fetchApi("auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Users
  async getUsers() {
    return this.fetchApi("users")
  }

  async getUserById(id: string) {
    return this.fetchApi(`users/${id}`)
  }

  // Courses
  async getCourses() {
    return this.fetchApi("courses")
  }

  async getCourseById(id: string) {
    return this.fetchApi(`courses/${id}`)
  }

  async createCourse(courseData: any) {
    return this.fetchApi("courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    })
  }

  async updateCourse(id: string, courseData: any) {
    return this.fetchApi(`courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    })
  }

  async deleteCourse(id: string) {
    return this.fetchApi(`courses/${id}`, {
      method: "DELETE",
    })
  }

  // Subjects
  async getSubjects() {
    return this.fetchApi("subjects")
  }

  async getSubjectById(id: string) {
    return this.fetchApi(`subjects/${id}`)
  }

  async createSubject(subjectData: any) {
    return this.fetchApi("subjects", {
      method: "POST",
      body: JSON.stringify(subjectData),
    })
  }

  async deleteSubject(id: string) {
    return this.fetchApi(`subjects/${id}`, {
      method: "DELETE",
    })
  }

  async updateSubject(id: string, subjectData: any) {
    return this.fetchApi(`subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(subjectData),
    })
  }

  // Schedule
  async getScheduleEvents() {
    return this.fetchApi("schedule")
  }

  async createScheduleEvent(eventData: any) {
    return this.fetchApi("schedule", {
      method: "POST",
      body: JSON.stringify(eventData),
    })
  }

  // Students
  async getStudents() {
    return this.fetchApi("students")
  }

  async createStudent(studentData: any) {
    return this.fetchApi("students", {
      method: "POST",
      body: JSON.stringify(studentData),
    })
  }

  async updateStudent(id: string, studentData: any) {
    return this.fetchApi(`students/${id}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    })
  }

  async deleteStudent(id: string) {
    return this.fetchApi(`students/${id}`, {
      method: "DELETE",
    })
  }

  // Lecturers
  async getLecturers() {
    return this.fetchApi("lecturers")
  }

  async createLecturer(lecturerData: any) {
    return this.fetchApi("lecturers", {
      method: "POST",
      body: JSON.stringify(lecturerData),
    })
  }

  async updateLecturer(id: string, lecturerData: any) {
    return this.fetchApi(`lecturers/${id}`, {
      method: "PUT",
      body: JSON.stringify(lecturerData),
    })
  }

  async deleteLecturer(id: string) {
    return this.fetchApi(`lecturers/${id}`, {
      method: "DELETE",
    })
  }

  // Batches
  async getBatches() {
    return this.fetchApi("batches")
  }

  async getBatchById(id: string) {
    return this.fetchApi(`batches/${id}`)
  }

  async createBatch(batchData: any) {
    return this.fetchApi("batches", {
      method: "POST",
      body: JSON.stringify(batchData),
    })
  }

  async updateBatch(id: string, batchData: any) {
    return this.fetchApi(`batches/${id}`, {
      method: "PUT",
      body: JSON.stringify(batchData),
    })
  }

  async deleteBatch(id: string) {
    return this.fetchApi(`batches/${id}`, {
      method: "DELETE",
    })
  }

  // Enrollments
  async getEnrollments() {
    return this.fetchApi("enrollments")
  }

  async getEnrollmentById(id: string) {
    return this.fetchApi(`enrollments/${id}`)
  }

  async createEnrollment(enrollmentData: any) {
    return this.fetchApi("enrollments", {
      method: "POST",
      body: JSON.stringify(enrollmentData),
    })
  }

  async updateEnrollment(id: string, enrollmentData: any) {
    return this.fetchApi(`enrollments/${id}`, {
      method: "PUT",
      body: JSON.stringify(enrollmentData),
    })
  }

  async deleteEnrollment(id: string) {
    return this.fetchApi(`enrollments/${id}`, {
      method: "DELETE",
    })
  }

  // Facilities
  async getFacilities() {
    return this.fetchApi("facilities")
  }

  async createFacility(facilityData: any) {
    return this.fetchApi("facilities", {
      method: "POST",
      body: JSON.stringify(facilityData),
    })
  }

  async updateFacility(id: string, facilityData: any) {
    return this.fetchApi(`facilities/${id}`, {
      method: "PUT",
      body: JSON.stringify(facilityData),
    })
  }

  async deleteFacility(id: string) {
    return this.fetchApi(`facilities/${id}`, {
      method: "DELETE",
    })
  }

  // Events
  async getEvents() {
    return this.fetchApi("events")
  }

  async getEventAnnouncements() {
    return this.fetchApi("events/announcements")
  }

  async getEventResources() {
    return this.fetchApi("events/resources")
  }

  async createEvent(eventData: any) {
    return this.fetchApi("events", {
      method: "POST",
      body: JSON.stringify(eventData),
    })
  }

  async updateEvent(id: string, eventData: any) {
    return this.fetchApi(`events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    })
  }

  async deleteEvent(id: string) {
    return this.fetchApi(`events/${id}`, {
      method: "DELETE",
    })
  }

  // Dashboard
  async getDashboardStats() {
    return this.fetchApi("dashboard/stats")
  }

  async getResourceUtilizationData() {
    return this.fetchApi("dashboard/resource-utilization")
  }

  // Collaboration
  async getCollaborationGroups() {
    return this.fetchApi("collaboration/groups")
  }

  // Add these methods to the RealApiService class
  async getReservations() {
    return this.fetchApi("reservations")
  }

  async createReservation(reservationData: any) {
    return this.fetchApi("reservations", {
      method: "POST",
      body: JSON.stringify(reservationData),
    })
  }

  // Resources
  async getResources() {
    return this.fetchApi("resources")
  }

  async getResource(id: string) {
    return this.fetchApi(`resources/${id}`)
  }

  async createResource(resourceData: any) {
    return this.fetchApi("resources", {
      method: "POST",
      body: JSON.stringify(resourceData),
    })
  }

  async updateResource(id: string, resourceData: any) {
    return this.fetchApi(`resources/${id}`, {
      method: "PUT",
      body: JSON.stringify(resourceData),
    })
  }

  async deleteResource(id: string) {
    return this.fetchApi(`resources/${id}`, {
      method: "DELETE",
    })
  }

  async checkoutResource(id: string, userId: string, userName: string) {
    return this.fetchApi(`resources/${id}/checkout`, {
      method: "POST",
      body: JSON.stringify({ userId, userName }),
    })
  }

  async returnResource(id: string) {
    return this.fetchApi(`resources/${id}/return`, {
      method: "POST",
    })
  }
}

// Create and export an instance of the RealApiService
export const realApiService = new RealApiService(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api")

