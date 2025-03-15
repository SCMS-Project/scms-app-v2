import type {
  Student,
  Lecturer, // Changed from Faculty to Lecturer
  Course,
  Facility,
  Reservation,
  DashboardStats,
  AttendanceData,
  DepartmentData,
  Batch,
  Enrollment,
  Event,
  Message,
  Notification,
  Resource,
  User,
  EventAttendanceData,
  ResourceUtilizationData,
  ScheduleEvent,
  ScheduleNotification,
  CollaborationGroup,
  CollaborationMessage,
  CollaborationFile,
  CollaborationTask,
  Subject,
} from "../types"

// Mock Students Data
export const mockStudents: Student[] = [
  {
    id: "ST001",
    name: "John Smith",
    email: "john.smith@example.com",
    department: "Computer Science",
    year: "3rd",
    gpa: "3.8",
  },
  { id: "ST002", name: "Emma Johnson", email: "emma.j@example.com", department: "Business", year: "2nd", gpa: "3.5" },
  {
    id: "ST003",
    name: "Michael Brown",
    email: "m.brown@example.com",
    department: "Engineering",
    year: "4th",
    gpa: "3.9",
  },
  {
    id: "ST004",
    name: "Sophia Williams",
    email: "sophia.w@example.com",
    department: "Medicine",
    year: "1st",
    gpa: "3.7",
  },
  { id: "ST005", name: "James Davis", email: "j.davis@example.com", department: "Arts", year: "3rd", gpa: "3.4" },
  {
    id: "ST006",
    name: "Olivia Miller",
    email: "o.miller@example.com",
    department: "Sciences",
    year: "2nd",
    gpa: "3.6",
  },
  {
    id: "ST007",
    name: "William Wilson",
    email: "w.wilson@example.com",
    department: "Engineering",
    year: "4th",
    gpa: "3.2",
  },
  {
    id: "ST008",
    name: "Ava Moore",
    email: "ava.m@example.com",
    department: "Computer Science",
    year: "1st",
    gpa: "3.9",
  },
]

// Mock Lecturers Data (renamed from Faculty)
export const mockLecturers: Lecturer[] = [
  {
    id: "F001",
    name: "Dr. Robert Chen",
    email: "r.chen@example.edu",
    department: "Computer Science",
    position: "Professor",
    courses: 3,
  },
  {
    id: "F002",
    name: "Dr. Sarah Johnson",
    email: "s.johnson@example.edu",
    department: "Business",
    position: "Associate Professor",
    courses: 2,
  },
  {
    id: "F003",
    name: "Dr. Michael Lee",
    email: "m.lee@example.edu",
    department: "Engineering",
    position: "Professor",
    courses: 4,
  },
  {
    id: "F004",
    name: "Dr. Emily Davis",
    email: "e.davis@example.edu",
    department: "Medicine",
    position: "Assistant Professor",
    courses: 2,
  },
  {
    id: "F005",
    name: "Dr. James Wilson",
    email: "j.wilson@example.edu",
    department: "Arts",
    position: "Professor",
    courses: 3,
  },
  {
    id: "F006",
    name: "Dr. Lisa Brown",
    email: "l.brown@example.edu",
    department: "Sciences",
    position: "Associate Professor",
    courses: 3,
  },
]

// Add this after the mockCourses array

// Mock Subjects Data
export const mockSubjects: Subject[] = [
  {
    id: "SUB001",
    name: "Introduction to Programming",
    code: "CS101-A",
    description: "Fundamentals of programming using Python",
    credits: 2,
    department: "Computer Science",
    courseIds: ["CS101"],
  },
  {
    id: "SUB002",
    name: "Data Structures",
    code: "CS101-B",
    description: "Basic data structures and algorithms",
    credits: 2,
    department: "Computer Science",
    courseIds: ["CS101"],
  },
  {
    id: "SUB003",
    name: "Financial Accounting",
    code: "BUS202-A",
    description: "Principles of financial accounting",
    credits: 2,
    department: "Business",
    courseIds: ["BUS202"],
  },
  {
    id: "SUB004",
    name: "Marketing Management",
    code: "BUS202-B",
    description: "Introduction to marketing principles and strategies",
    credits: 2,
    department: "Business",
    courseIds: ["BUS202"],
  },
  {
    id: "SUB005",
    name: "Mechanics",
    code: "ENG301-A",
    description: "Engineering mechanics and statics",
    credits: 2,
    department: "Engineering",
    courseIds: ["ENG301"],
  },
  {
    id: "SUB006",
    name: "Thermodynamics",
    code: "ENG301-B",
    description: "Principles of thermodynamics and energy transfer",
    credits: 2,
    department: "Engineering",
    courseIds: ["ENG301"],
  },
  {
    id: "SUB007",
    name: "Anatomy",
    code: "MED101-A",
    description: "Human anatomy and physiology",
    credits: 2,
    department: "Medicine",
    courseIds: ["MED101"],
  },
  {
    id: "SUB008",
    name: "Medical Ethics",
    code: "MED101-B",
    description: "Ethical considerations in medical practice",
    credits: 1,
    department: "Medicine",
    courseIds: ["MED101"],
  },
]

// Update mockCourses to include subjectIds
export const mockCourses: Course[] = [
  {
    id: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    credits: 3,
    instructor: "Dr. Robert Chen",
    students: 45,
    status: "Active",
    subjectIds: ["SUB001", "SUB002"],
  },
  {
    id: "BUS202",
    name: "Business Management",
    department: "Business",
    credits: 4,
    instructor: "Dr. Sarah Johnson",
    students: 38,
    status: "Active",
    subjectIds: ["SUB003", "SUB004"],
  },
  {
    id: "ENG301",
    name: "Advanced Engineering Principles",
    department: "Engineering",
    credits: 4,
    instructor: "Dr. Michael Lee",
    students: 30,
    status: "Active",
    subjectIds: ["SUB005", "SUB006"],
  },
  {
    id: "MED101",
    name: "Introduction to Medicine",
    department: "Medicine",
    credits: 3,
    instructor: "Dr. Emily Davis",
    students: 25,
    status: "Active",
    subjectIds: ["SUB007", "SUB008"],
  },
  {
    id: "ART205",
    name: "Modern Art History",
    department: "Arts",
    credits: 3,
    instructor: "Dr. James Wilson",
    students: 35,
    status: "Inactive",
    subjectIds: [],
  },
  {
    id: "SCI302",
    name: "Advanced Physics",
    department: "Sciences",
    credits: 4,
    instructor: "Dr. Lisa Brown",
    students: 28,
    status: "Active",
    subjectIds: [],
  },
]

// Update the Facility interface to include type
// export interface Facility {
//   id: string
//   name: string
//   type: string
//   capacity: number
//   rooms: number
//   status: string
// }

// Update mockFacilities with type information
export const mockFacilities: Facility[] = [
  {
    id: "FAC001",
    name: "Main Auditorium",
    type: "Auditorium",
    capacity: 1200,
    rooms: 1,
    status: "Operational",
  },
  {
    id: "FAC002",
    name: "Conference Hall A",
    type: "Conference Hall",
    capacity: 300,
    rooms: 1,
    status: "Operational",
  },
  {
    id: "FAC003",
    name: "Gymnasium",
    type: "Sports Facility",
    capacity: 500,
    rooms: 3,
    status: "Operational",
  },
  {
    id: "FAC004",
    name: "Library",
    type: "Study Area",
    capacity: 600,
    rooms: 10,
    status: "Operational",
  },
]

// Mock Reservations Data
export const mockReservations: Reservation[] = [
  {
    id: "R001",
    facility: "Main Building",
    room: "Auditorium",
    purpose: "Orientation",
    date: "2023-09-15",
    time: "10:00 - 12:00",
    requestedBy: "Dr. Robert Chen",
    status: "Approved",
  },
  {
    id: "R002",
    facility: "Science Center",
    room: "Lab 101",
    purpose: "Chemistry Class",
    date: "2023-09-16",
    time: "14:00 - 16:00",
    requestedBy: "Dr. Lisa Brown",
    status: "Approved",
  },
  {
    id: "R003",
    facility: "Student Union",
    room: "Conference Room",
    purpose: "Student Council Meeting",
    date: "2023-09-17",
    time: "15:00 - 17:00",
    requestedBy: "John Smith",
    status: "Pending",
  },
  {
    id: "R004",
    facility: "Library",
    room: "Study Room 3",
    purpose: "Group Study",
    date: "2023-09-18",
    time: "13:00 - 15:00",
    requestedBy: "Emma Johnson",
    status: "Approved",
  },
  {
    id: "R005",
    facility: "Sports Complex",
    room: "Basketball Court",
    purpose: "Basketball Practice",
    date: "2023-09-19",
    time: "16:00 - 18:00",
    requestedBy: "Michael Brown",
    status: "Denied",
  },
  {
    id: "R006",
    facility: "Main Building",
    room: "Room 101",
    purpose: "Guest Lecture",
    date: "2023-09-20",
    time: "11:00 - 13:00",
    requestedBy: "Dr. Sarah Johnson",
    status: "Approved",
  },
]

// Mock Batch Data
export const mockBatches: Batch[] = [
  {
    id: "B2023-CS",
    name: "CS Batch 2023",
    startDate: "2023-09-01",
    endDate: "2027-06-30",
    department: "Computer Science",
    coordinator: "Dr. Robert Chen",
    students: 120,
    status: "Active",
  },
  {
    id: "B2023-BUS",
    name: "Business Batch 2023",
    startDate: "2023-09-01",
    endDate: "2027-06-30",
    department: "Business",
    coordinator: "Dr. Sarah Johnson",
    students: 85,
    status: "Active",
  },
  {
    id: "B2023-ENG",
    name: "Engineering Batch 2023",
    startDate: "2023-09-01",
    endDate: "2027-06-30",
    department: "Engineering",
    coordinator: "Dr. Michael Lee",
    students: 95,
    status: "Active",
  },
  {
    id: "B2022-CS",
    name: "CS Batch 2022",
    startDate: "2022-09-01",
    endDate: "2026-06-30",
    department: "Computer Science",
    coordinator: "Dr. Robert Chen",
    students: 110,
    status: "Active",
  },
  {
    id: "B2022-MED",
    name: "Medicine Batch 2022",
    startDate: "2022-09-01",
    endDate: "2026-06-30",
    department: "Medicine",
    coordinator: "Dr. Emily Davis",
    students: 75,
    status: "Active",
  },
  {
    id: "B2021-ART",
    name: "Arts Batch 2021",
    startDate: "2021-09-01",
    endDate: "2025-06-30",
    department: "Arts",
    coordinator: "Dr. James Wilson",
    students: 65,
    status: "Active",
  },
]

// Mock Enrollment Data
export const mockEnrollments: Enrollment[] = [
  {
    id: "E001",
    studentId: "ST001",
    studentName: "John Smith",
    courseId: "CS101",
    courseName: "Introduction to Computer Science",
    batchId: "B2023-CS",
    batchName: "CS Batch 2023",
    enrollmentDate: "2023-09-05",
    status: "Active",
    grade: "A",
  },
  {
    id: "E002",
    studentId: "ST001",
    studentName: "John Smith",
    courseId: "ENG301",
    courseName: "Advanced Engineering Principles",
    batchId: "B2023-CS",
    batchName: "CS Batch 2023",
    enrollmentDate: "2023-09-05",
    status: "Active",
  },
  {
    id: "E003",
    studentId: "ST002",
    studentName: "Emma Johnson",
    courseId: "BUS202",
    courseName: "Business Management",
    batchId: "B2023-BUS",
    batchName: "Business Batch 2023",
    enrollmentDate: "2023-09-06",
    status: "Active",
    grade: "B+",
  },
  {
    id: "E004",
    studentId: "ST003",
    studentName: "Michael Brown",
    courseId: "ENG301",
    courseName: "Advanced Engineering Principles",
    batchId: "B2023-ENG",
    batchName: "Engineering Batch 2023",
    enrollmentDate: "2023-09-07",
    status: "Active",
    grade: "A-",
  },
  {
    id: "E005",
    studentId: "ST004",
    studentName: "Sophia Williams",
    courseId: "MED101",
    courseName: "Introduction to Medicine",
    batchId: "B2022-MED",
    batchName: "Medicine Batch 2022",
    enrollmentDate: "2022-09-10",
    status: "Active",
    grade: "A",
  },
  {
    id: "E006",
    studentId: "ST005",
    studentName: "James Davis",
    courseId: "ART205",
    courseName: "Modern Art History",
    batchId: "B2021-ART",
    batchName: "Arts Batch 2021",
    enrollmentDate: "2021-09-12",
    status: "Completed",
    grade: "B",
  },
  {
    id: "E007",
    studentId: "ST006",
    studentName: "Olivia Miller",
    courseId: "SCI302",
    courseName: "Advanced Physics",
    batchId: "B2022-CS",
    batchName: "CS Batch 2022",
    enrollmentDate: "2022-09-15",
    status: "Active",
  },
  {
    id: "E008",
    studentId: "ST007",
    studentName: "William Wilson",
    courseId: "ENG301",
    courseName: "Advanced Engineering Principles",
    batchId: "B2023-ENG",
    batchName: "Engineering Batch 2023",
    enrollmentDate: "2023-09-08",
    status: "Active",
  },
  {
    id: "E009",
    studentId: "ST008",
    studentName: "Ava Moore",
    courseId: "CS101",
    courseName: "Introduction to Computer Science",
    batchId: "B2023-CS",
    batchName: "CS Batch 2023",
    enrollmentDate: "2023-09-09",
    status: "Active",
  },
]

// Mock Event Data
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Lecturers Development Workshop",
    date: "Mar 10, 2025",
    location: "Conference Hall",
    attendees: 45,
    organizer: "Dr. Anderson",
    category: "Training",
  },
  {
    id: "2",
    title: "Annual Science Fair",
    date: "Mar 8, 2025",
    location: "Main Campus",
    attendees: 320,
    organizer: "Science Department",
    category: "Academic",
  },
  {
    id: "3",
    title: "Alumni Networking Event",
    date: "Mar 5, 2025",
    location: "Alumni Center",
    attendees: 120,
    organizer: "Alumni Association",
    category: "Networking",
  },
  {
    id: "4",
    title: "Campus Sustainability Meeting",
    date: "Mar 3, 2025",
    location: "Green Building, Room 202",
    attendees: 35,
    organizer: "Sustainability Committee",
    category: "Administrative",
  },
]

// Mock Message Data
export const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "U001",
    senderName: "Admin User",
    recipientId: "U002",
    recipientName: "Dr. Robert Chen",
    subject: "Course Schedule Update",
    content: "Please review the updated course schedule for next semester.",
    timestamp: new Date("2024-03-14T10:30:00").toISOString(),
    isRead: false,
  },
  {
    id: "2",
    senderId: "U002",
    senderName: "Dr. Robert Chen",
    recipientId: "U001",
    recipientName: "Admin User",
    subject: "Re: Course Schedule Update",
    content: "Thank you for the update. I'll review it shortly.",
    timestamp: new Date("2024-03-14T11:00:00").toISOString(),
    isRead: true,
  },
  // Add more mock messages as needed
]

// Mock Notification Data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "U001",
    title: "New Course Assignment",
    message: "You have been assigned to teach Advanced Mathematics.",
    type: "Assignment",
    timestamp: new Date("2024-03-14T09:00:00").toISOString(),
    isRead: false,
    link: "/dashboard/courses",
  },
  {
    id: "2",
    userId: "U001",
    title: "Meeting Reminder",
    message: "Faculty meeting tomorrow at 10 AM.",
    type: "Reminder",
    timestamp: new Date("2024-03-14T08:30:00").toISOString(),
    isRead: true,
    link: "/dashboard/schedule",
  },
  // Add more mock notifications as needed
]

// Mock Resource Data
export const mockResources: Resource[] = [
  { id: "RS001", name: "Projector A", type: "Equipment", location: "Main Building", status: "Available" },
  {
    id: "RS002",
    name: "Laptop Cart 1",
    type: "Equipment",
    location: "Science Center",
    status: "In Use",
    lastCheckedOut: "2023-09-12",
    checkedOutBy: "Dr. Lisa Brown",
  },
  { id: "RS003", name: "Conference Room Kit", type: "Equipment", location: "Student Union", status: "Available" },
  {
    id: "RS004",
    name: "Digital Camera",
    type: "Equipment",
    location: "Arts Building",
    status: "In Use",
    lastCheckedOut: "2023-09-14",
    checkedOutBy: "James Davis",
  },
  { id: "RS005", name: "Portable Whiteboard", type: "Equipment", location: "Library", status: "Available" },
  { id: "RS006", name: "Audio System", type: "Equipment", location: "Sports Complex", status: "Under Maintenance" },
]

// Mock User Data
export const mockUsers: User[] = [
  { id: "U001", name: "Admin User", email: "admin@campus.edu", role: "admin", lastLogin: "2023-09-14T08:30:00" },
  {
    id: "U002",
    name: "Dr. Robert Chen",
    email: "r.chen@example.edu",
    role: "faculty",
    department: "Computer Science",
    lastLogin: "2023-09-14T09:15:00",
  },
  {
    id: "U003",
    name: "Dr. Sarah Johnson",
    email: "s.johnson@example.edu",
    role: "faculty",
    department: "Business",
    lastLogin: "2023-09-13T14:20:00",
  },
  {
    id: "U004",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "student",
    department: "Computer Science",
    lastLogin: "2023-09-14T10:45:00",
  },
  {
    id: "U005",
    name: "Emma Johnson",
    email: "emma.j@example.com",
    role: "student",
    department: "Business",
    lastLogin: "2023-09-14T11:30:00",
  },
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalStudents: 5234,
  totalFaculty: 320,
  activeCourses: 189,
  facilities: 42,
  activeEvents: 24,
  resourceUtilization: 78,
}

// Mock Attendance Data
export const mockAttendanceData: AttendanceData[] = [
  { name: "Mon", value: 85 },
  { name: "Tue", value: 90 },
  { name: "Wed", value: 88 },
  { name: "Thu", value: 92 },
  { name: "Fri", value: 78 },
]

// Mock Department Data
export const mockDepartmentData: DepartmentData[] = [
  { name: "Engineering", value: 400 },
  { name: "Business", value: 300 },
  { name: "Arts", value: 200 },
  { name: "Sciences", value: 250 },
  { name: "Medicine", value: 150 },
]

// Mock Event Attendance Data
export const mockEventAttendanceData: EventAttendanceData[] = [
  { name: "Sep", academic: 350, social: 280, workshop: 120 },
  { name: "Oct", academic: 400, social: 320, workshop: 180 },
  { name: "Nov", academic: 300, social: 250, workshop: 150 },
  { name: "Dec", academic: 200, social: 350, workshop: 100 },
  { name: "Jan", academic: 450, social: 400, workshop: 220 },
  { name: "Feb", academic: 500, social: 450, workshop: 250 },
]

// Add or update the ResourceUtilizationData array to include the right format for our chart
export const mockResourceUtilizationData: ResourceUtilizationData[] = [
  { name: "Classrooms", value: 85, target: 90 },
  { name: "Labs", value: 72, target: 80 },
  { name: "Equipment", value: 65, target: 75 },
  { name: "Study Spaces", value: 90, target: 85 },
  { name: "Conference Rooms", value: 60, target: 70 },
]

// Add resources data
export const eventResources = [
  "Projector",
  "Microphone",
  "Whiteboard",
  "Laptop",
  "Video Conference Equipment",
  "Chairs",
  "Tables",
  "Refreshments",
]

// Add these mock data arrays after the existing mock data

// Mock Schedule Data
export const mockScheduleEvents: ScheduleEvent[] = [
  {
    id: "SCH001",
    title: "Introduction to Computer Science",
    courseCode: "CS101",
    instructor: "Dr. Robert Chen",
    location: "Science Building, Room 101",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    type: "Lecture",
  },
  {
    id: "SCH002",
    title: "Introduction to Computer Science",
    courseCode: "CS101",
    instructor: "Dr. Robert Chen",
    location: "Science Building, Lab 3",
    day: "Wednesday",
    startTime: "14:00",
    endTime: "16:00",
    type: "Lab",
  },
  {
    id: "SCH003",
    title: "Calculus I",
    courseCode: "MATH201",
    instructor: "Dr. Sarah Johnson",
    location: "Math Building, Room 205",
    day: "Tuesday",
    startTime: "11:00",
    endTime: "12:30",
    type: "Lecture",
  },
  {
    id: "SCH004",
    title: "Calculus I",
    courseCode: "MATH201",
    instructor: "Dr. Sarah Johnson",
    location: "Math Building, Room 205",
    day: "Thursday",
    startTime: "11:00",
    endTime: "12:30",
    type: "Lecture",
  },
  {
    id: "SCH005",
    title: "Physics I",
    courseCode: "PHYS101",
    instructor: "Dr. Michael Lee",
    location: "Science Building, Room 305",
    day: "Monday",
    startTime: "13:00",
    endTime: "14:30",
    type: "Lecture",
  },
  {
    id: "SCH006",
    title: "Physics I Lab",
    courseCode: "PHYS101",
    instructor: "Dr. Michael Lee",
    location: "Science Building, Lab 5",
    day: "Friday",
    startTime: "10:00",
    endTime: "12:00",
    type: "Lab",
  },
  {
    id: "SCH007",
    title: "Data Structures and Algorithms",
    courseCode: "CS201",
    instructor: "Dr. Robert Chen",
    location: "Science Building, Room 102",
    day: "Monday",
    startTime: "11:00",
    endTime: "12:30",
    type: "Lecture",
  },
  {
    id: "SCH008",
    title: "Data Structures and Algorithms",
    courseCode: "CS201",
    instructor: "Dr. Robert Chen",
    location: "Science Building, Room 102",
    day: "Wednesday",
    startTime: "11:00",
    endTime: "12:30",
    type: "Lecture",
  },
  {
    id: "SCH009",
    title: "Data Structures Lab",
    courseCode: "CS201",
    instructor: "Dr. Robert Chen",
    location: "Science Building, Lab 2",
    day: "Friday",
    startTime: "14:00",
    endTime: "16:00",
    type: "Lab",
  },
  {
    id: "SCH010",
    title: "Database Systems",
    courseCode: "CS301",
    instructor: "Dr. Emily Davis",
    location: "Science Building, Room 103",
    day: "Tuesday",
    startTime: "09:00",
    endTime: "10:30",
    type: "Lecture",
  },
  {
    id: "SCH011",
    title: "Database Systems",
    courseCode: "CS301",
    instructor: "Dr. Emily Davis",
    location: "Science Building, Room 103",
    day: "Thursday",
    startTime: "09:00",
    endTime: "10:30",
    type: "Lecture",
  },
  {
    id: "SCH012",
    title: "Linear Algebra",
    courseCode: "MATH301",
    instructor: "Dr. James Wilson",
    location: "Math Building, Room 201",
    day: "Monday",
    startTime: "15:00",
    endTime: "16:30",
    type: "Lecture",
  },
  {
    id: "SCH013",
    title: "Linear Algebra",
    courseCode: "MATH301",
    instructor: "Dr. James Wilson",
    location: "Math Building, Room 201",
    day: "Wednesday",
    startTime: "15:00",
    endTime: "16:30",
    type: "Lecture",
  },
  {
    id: "SCH014",
    title: "English Composition",
    courseCode: "ENG101",
    instructor: "Dr. Lisa Brown",
    location: "Arts Building, Room 105",
    day: "Tuesday",
    startTime: "13:00",
    endTime: "14:30",
    type: "Lecture",
  },
  {
    id: "SCH015",
    title: "English Composition",
    courseCode: "ENG101",
    instructor: "Dr. Lisa Brown",
    location: "Arts Building, Room 105",
    day: "Thursday",
    startTime: "13:00",
    endTime: "14:30",
    type: "Lecture",
  },
  {
    id: "SCH001",
    title: "Computer Science 101",
    courseCode: "CS101",
    instructor: "Dr. Smith",
    location: "Room 201",
    day: "Monday",
    startTime: "09:00",
    endTime: "09:50",
    type: "Lecture",
  },
  {
    id: "SCH002",
    title: "Database Lab",
    courseCode: "CS202",
    instructor: "Prof. Johnson",
    location: "Lab 101",
    day: "Wednesday",
    startTime: "14:00",
    endTime: "14:50",
    type: "Lab",
  },
  // Add more mock schedule events as needed
]

export const mockScheduleNotifications: ScheduleNotification[] = [
  {
    id: "SCHNOT002",
    title: "Room Change",
    message: "MATH201 lecture on Thursday has been moved to Math Building, Room 210.",
    date: "2025-03-14T14:15:00",
    isRead: true,
    type: "RoomChange",
  },
  {
    id: "SCHNOT003",
    title: "Schedule Change",
    message: "PHYS101 lab on Friday will now start at 10:30 AM instead of 10:00 AM.",
    date: "2025-03-13T11:45:00",
    isRead: false,
    type: "Reschedule",
  },
  {
    id: "SCHNOT004",
    title: "Registration Reminder",
    message: "Course registration for the Fall 2025 semester semester opens on April 1st.",
    date: "2025-03-10T08:00:00",
    isRead: true,
    type: "Reminder",
  },
  {
    id: "SCHNOT005",
    title: "New Tutorial Added",
    message: "A new tutorial session for CS201 has been added on Thursdays at 4:00 PM.",
    date: "2025-03-09T10:15:00",
    isRead: false,
    type: "NewClass",
  },
  {
    id: "SCHNOT006",
    title: "Registration Successful",
    message: "You have successfully registered for MATH301: Linear Algebra.",
    date: "2025-03-08T15:30:00",
    isRead: true,
    type: "Registration",
  },
  {
    id: "SCHNOT007",
    title: "Exam Schedule Posted",
    message: "The final exam schedule for this semester has been posted. Check your student portal.",
    date: "2025-03-07T09:00:00",
    isRead: false,
    type: "Reminder",
  },
  {
    id: "SCHNOT008",
    title: "Class Cancelled",
    message: "ENG101 class on Tuesday, March 25 has been cancelled.",
    date: "2025-03-06T13:45:00",
    isRead: false,
    type: "Cancellation",
  },
]

// Mock Collaboration Data
export const mockCollaborationGroups: CollaborationGroup[] = [
  {
    id: "CG001",
    name: "CS 101 - Project Group",
    description: "Group for the final project in Introduction to Computer Science",
    department: "Computer Science",
    members: [
      {
        id: "CM001",
        name: "John Doe",
        role: "Group Leader",
        email: "john.doe@university.edu",
        department: "Computer Science",
      },
      {
        id: "CM002",
        name: "Jane Smith",
        role: "Member",
        email: "jane.smith@university.edu",
        department: "Computer Science",
      },
      {
        id: "CM003",
        name: "Michael Brown",
        role: "Member",
        email: "m.brown@university.edu",
        department: "Computer Science",
      },
    ],
  },
  {
    id: "CG002",
    name: "AI Research Team",
    description: "Research group focused on artificial intelligence applications",
    department: "Computer Science",
    members: [
      {
        id: "CM004",
        name: "Emma Johnson",
        role: "Group Leader",
        email: "emma.j@university.edu",
        department: "Computer Science",
      },
      {
        id: "CM005",
        name: "William Wilson",
        role: "Member",
        email: "w.wilson@university.edu",
        department: "Engineering",
      },
    ],
  },
  {
    id: "CG003",
    name: "Database Study Group",
    description: "Study group for Database Systems course",
    department: "Computer Science",
    members: [
      {
        id: "CM006",
        name: "Sophia Williams",
        role: "Group Leader",
        email: "sophia.w@university.edu",
        department: "Computer Science",
      },
      {
        id: "CM007",
        name: "James Davis",
        email: "j.davis@university.edu",
        department: "Computer Science",
      },
      {
        id: "CM008",
        name: "Olivia Miller",
        role: "Member",
        email: "o.miller@university.edu",
        department: "Business",
      },
    ],
  },
]

export const mockCollaborationMessages: CollaborationMessage[] = [
  {
    id: "CM001",
    groupId: "CG001",
    sender: "John Doe",
    time: "10:15 AM",
    content:
      "Hey everyone, I've started working on the project proposal. Does anyone have any specific topics they'd like to focus on?",
  },
  {
    id: "CM002",
    groupId: "CG001",
    sender: "Jane Smith",
    time: "10:18 AM",
    content: "I was thinking we could focus on machine learning applications in healthcare. What do you all think?",
  },
  {
    id: "CM003",
    groupId: "CG001",
    sender: "Michael Brown",
    time: "10:25 AM",
    content:
      "That sounds interesting. I've been reading about some recent advancements in that area. I can share some papers I found.",
  },
]

export const mockCollaborationFiles: CollaborationFile[] = [
  {
    id: "CF001",
    groupId: "CG001",
    name: "Project Proposal.docx",
    size: "2.4 MB",
    date: "Mar 10, 2025",
    uploadedBy: "John Doe",
  },
  {
    id: "CF002",
    groupId: "CG001",
    name: "Research Data.xlsx",
    size: "4.1 MB",
    date: "Mar 12, 2025",
    uploadedBy: "Jane Smith",
  },
  {
    id: "CF003",
    groupId: "CG001",
    name: "Presentation Slides.pptx",
    size: "8.7 MB",
    date: "Mar 14, 2025",
    uploadedBy: "Michael Brown",
  },
  {
    id: "CF004",
    groupId: "CG001",
    name: "Meeting Notes.pdf",
    size: "1.2 MB",
    date: "Mar 15, 2025",
    uploadedBy: "John Doe",
  },
]

export const mockCollaborationTasks: CollaborationTask[] = [
  {
    id: "CT001",
    groupId: "CG001",
    title: "Research relevant papers",
    description: "Find and summarize at least 5 research papers related to our topic",
    priority: "High",
    dueDate: "Mar 20, 2025",
    status: "To Do",
    assignee: "Jane Smith",
  },
  {
    id: "CT002",
    groupId: "CG001",
    title: "Data collection",
    description: "Gather sample data sets for preliminary analysis",
    priority: "High",
    dueDate: "Mar 18, 2025",
    status: "In Progress",
    assignee: "Michael Brown",
  },
  {
    id: "CT003",
    groupId: "CG001",
    title: "Draft project outline",
    description: "Create a detailed outline for the project report",
    priority: "Medium",
    dueDate: "Mar 22, 2025",
    status: "To Do",
    assignee: "John Doe",
  },
  {
    id: "CT004",
    groupId: "CG001",
    title: "Prepare presentation",
    description: "Create slides for the project presentation",
    priority: "Low",
    dueDate: "Mar 30, 2025",
    status: "To Do",
  },
]

