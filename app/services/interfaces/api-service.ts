// Define the interface that all API implementations must follow
export interface ApiService {
  // Auth
  login(credentials: { email: string; password: string }): Promise<any>
  register(userData: any): Promise<any>

  // Users
  getUsers(): Promise<any[]>
  getUserById(id: string): Promise<any>

  // Courses
  getCourses(): Promise<any[]>
  getCourseById(id: string): Promise<any>
  createCourse(courseData: any): Promise<any>
  updateCourse(id: string, courseData: any): Promise<any>
  deleteCourse(id: string): Promise<any>

  // Subjects
  getSubjects(): Promise<any[]>
  getSubjectById(id: string): Promise<any>
  createSubject(subjectData: any): Promise<any>
  updateSubject(id: string, subjectData: any): Promise<any>
  deleteSubject(id: string): Promise<any>

  // Schedule
  getScheduleEvents(): Promise<any[]>
  createScheduleEvent(eventData: any): Promise<any>

  // Students
  getStudents(): Promise<any[]>
  createStudent(studentData: any): Promise<any>
  updateStudent(id: string, studentData: any): Promise<any>
  deleteStudent(id: string): Promise<any>

  // Lecturers
  getLecturers(): Promise<any[]>
  createLecturer(lecturerData: any): Promise<any>
  updateLecturer(id: string, lecturerData: any): Promise<any>
  deleteLecturer(id: string): Promise<any>

  // Facilities
  getFacilities(): Promise<any[]>
  createFacility?(facilityData: any): Promise<any>
  updateFacility?(id: string, facilityData: any): Promise<any>
  deleteFacility?(id: string): Promise<any>

  // Reservations
  getReservations(): Promise<any[]>
  createReservation(reservationData: any): Promise<any>

  // Resources
  getResources(): Promise<any[]>
  getResource(id: string): Promise<any>
  createResource(resourceData: any): Promise<any>
  updateResource(id: string, resourceData: any): Promise<any>
  deleteResource(id: string): Promise<any>
  checkoutResource(id: string, userId: string, userName: string): Promise<any>
  returnResource(id: string): Promise<any>

  // Events
  getEvents(): Promise<any[]>
  getEventAnnouncements(): Promise<any[]>
  getEventResources(): Promise<string[]>
  createEvent(eventData: any): Promise<any>
  updateEvent(id: string, eventData: any): Promise<any>
  deleteEvent(id: string): Promise<any>

  // Dashboard
  getDashboardStats(): Promise<any>
  getResourceUtilizationData(): Promise<any[]>

  // Collaboration
  getCollaborationGroups(): Promise<any[]>

  // Communications
  getMessages?(userId: string): Promise<any[]>
  sendMessage?(messageData: any): Promise<any>
  deleteMessage?(id: string): Promise<any>

  // Other endpoints...
}

