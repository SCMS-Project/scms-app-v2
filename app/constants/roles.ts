// Role constants
export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  LECTURER: "lecturer", // Changed from FACULTY to LECTURER
}

// For backward compatibility
export const USER_ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  LECTURER: "lecturer",
  STAFF: "staff",
}

export type UserRole = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_OPTIONS = [
  { value: ROLES.STUDENT, label: "Student" },
  { value: ROLES.LECTURER, label: "Lecturer" },
  { value: ROLES.ADMIN, label: "Administrator" },
]

// Department constants
export const DEPARTMENTS = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Engineering", label: "Engineering" },
  { value: "Business", label: "Business" },
  { value: "Medicine", label: "Medicine" },
  { value: "Arts", label: "Arts" },
  { value: "Sciences", label: "Sciences" },
]

// Faculty positions
export const FACULTY_POSITIONS = [
  { value: "Professor", label: "Professor" },
  { value: "Associate Professor", label: "Associate Professor" },
  { value: "Assistant Professor", label: "Assistant Professor" },
  { value: "Lecturer", label: "Lecturer" },
]

// Student years
export const STUDENT_YEARS = [
  { value: "1st", label: "1st Year" },
  { value: "2nd", label: "2nd Year" },
  { value: "3rd", label: "3rd Year" },
  { value: "4th", label: "4th Year" },
]

// Course status
export const COURSE_STATUS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Upcoming", label: "Upcoming" },
  { value: "Completed", label: "Completed" },
]

// Facility status
export const FACILITY_STATUS = [
  { value: "Operational", label: "Operational" },
  { value: "Under Maintenance", label: "Under Maintenance" },
  { value: "Closed", label: "Closed" },
]

// Batch status
export const BATCH_STATUS = [
  { value: "Active", label: "Active" },
  { value: "Completed", label: "Completed" },
  { value: "Upcoming", label: "Upcoming" },
]

// Enrollment status
export const ENROLLMENT_STATUS = [
  { value: "Active", label: "Active" },
  { value: "Completed", label: "Completed" },
  { value: "Withdrawn", label: "Withdrawn" },
  { value: "On Hold", label: "On Hold" },
]

// Event status
export const EVENT_STATUS = [
  { value: "Upcoming", label: "Upcoming" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Postponed", label: "Postponed" },
]

// Event types
export const EVENT_TYPES = [
  { value: "Academic", label: "Academic" },
  { value: "Social", label: "Social" },
  { value: "Workshop", label: "Workshop" },
  { value: "Career", label: "Career" },
  { value: "Cultural", label: "Cultural" },
  { value: "Sports", label: "Sports" },
]

// Resource status
export const RESOURCE_STATUS = [
  { value: "Available", label: "Available" },
  { value: "In Use", label: "In Use" },
  { value: "Under Maintenance", label: "Under Maintenance" },
  { value: "Reserved", label: "Reserved" },
]

// Resource types
export const RESOURCE_TYPES = [
  { value: "Equipment", label: "Equipment" },
  { value: "Book", label: "Book" },
  { value: "Software", label: "Software" },
  { value: "Room", label: "Room" },
  { value: "Vehicle", label: "Vehicle" },
]

// Facility types
export const FACILITY_TYPES = [
  { value: "Classroom", label: "Classroom" },
  { value: "Laboratory", label: "Laboratory" },
  { value: "Auditorium", label: "Auditorium" },
  { value: "Conference Hall", label: "Conference Hall" },
  { value: "Sports Facility", label: "Sports Facility" },
  { value: "Library", label: "Library" },
  { value: "Study Area", label: "Study Area" },
  { value: "Cafeteria", label: "Cafeteria" },
]

// Reservation status
export const RESERVATION_STATUS = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Denied", label: "Denied" },
  { value: "Cancelled", label: "Cancelled" },
]

// Subject credits
export const SUBJECT_CREDITS = [
  { value: 15, label: "15 Credits" },
  { value: 30, label: "30 Credits" },
  { value: 45, label: "45 Credits" },
  { value: 60, label: "60 Credits" },
]

// For backward compatibility with EVENT_STATUS_OPTIONS
export const EVENT_STATUS_OPTIONS = [
  { value: "Upcoming", label: "Upcoming" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
]

// For backward compatibility with FACILITY_STATUS_OPTIONS
export const FACILITY_STATUS_OPTIONS = FACILITY_STATUS

// For backward compatibility with ENROLLMENT_STATUS_OPTIONS
export const ENROLLMENT_STATUS_OPTIONS = ENROLLMENT_STATUS

// For backward compatibility with EVENT_RESOURCES
export const EVENT_RESOURCES = [
  "Projector",
  "Microphone",
  "Whiteboard",
  "Laptop",
  "Video Conference",
  "Chairs",
  "Tables",
  "Refreshments",
]

// Define event resources, status options, and types

export const EVENT_TYPES_EXTENDED = [
  { value: "Academic", label: "Academic" },
  { value: "Social", label: "Social" },
  { value: "Career", label: "Career" },
  { value: "Workshop", label: "Workshop" },
  { value: "Seminar", label: "Seminar" },
  { value: "Guest Lecture", label: "Guest Lecture" },
  { value: "Student Council", label: "Student Council" },
]

// Permission levels
export const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  MANAGE: "manage",
}

