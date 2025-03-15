import { Skeleton } from "@/components/ui/skeleton"
import { mockLecturers } from "@/app/services/mock-data" // Changed from mockFaculty to mockLecturers

export default function LecturersLoading() {
  // Generate a number of skeleton rows based on the mock data length
  const skeletonCount = mockLecturers.length || 5

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="h-12 px-4 border-b flex items-center">
          <div className="grid grid-cols-7 w-full">
            <Skeleton className="h-4 w-[40px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[60px]" />
            <div className="flex justify-end">
              <Skeleton className="h-4 w-[60px]" />
            </div>
          </div>
        </div>

        <div className="divide-y">
          {Array(skeletonCount)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="h-16 px-4 flex items-center">
                <div className="grid grid-cols-7 w-full">
                  <Skeleton className="h-4 w-[40px]" />
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[30px]" />
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Skeleton className="h-10 w-[300px]" />
      </div>
    </div>
  )
}

