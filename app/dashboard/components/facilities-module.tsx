"use client"

export default function FacilitiesModule() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Facilities Management</h2>
      <p>
        A facility in a university refers to any physical or digital infrastructure, resource, or service that is
        provided to support academic, administrative, recreational, or residential needs of students, faculty, and
        staff. These facilities include classrooms, libraries, laboratories, student centers, dormitories, sports
        complexes, and technology services, ensuring a conducive environment for learning, research, and personal
        development.
      </p>

      <div className="mt-4">
        <h3 className="text-lg font-medium">Online Reservation System</h3>
        <p className="text-muted-foreground">Our new online reservation system allows users to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
          <li>Reserve equipment, classrooms, and other facilities online</li>
          <li>Check real-time availability of resources</li>
          <li>Avoid scheduling conflicts with automatic conflict detection</li>
          <li>Track and manage your reservations in one place</li>
          <li>Receive notifications about reservation status changes</li>
        </ul>
      </div>
    </div>
  )
}

