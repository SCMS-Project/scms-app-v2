import { Skeleton } from "@/components/ui/skeleton"

export default function SubjectsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="h-10 border-b px-4 flex items-center">
          <Skeleton className="h-4 w-full" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 border-b px-4 flex items-center">
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  )
}

