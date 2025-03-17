import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CreditInfo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <InfoIcon className="h-4 w-4" />
          <span className="sr-only">Credit System Information</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">UK Credit System</h4>
          <div className="text-sm">
            <ul className="list-disc pl-4 space-y-1">
              <li>15 credits = 150 hours of learning time</li>
              <li>30 credits = 300 hours of learning time</li>
              <li>A full-time year is typically 120 credits</li>
              <li>A 3-year Bachelor's degree is 360 credits</li>
              <li>A Master's degree is typically 180 credits</li>
            </ul>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

