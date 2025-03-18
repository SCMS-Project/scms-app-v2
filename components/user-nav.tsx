"use client"

import type React from "react"
import type { Session } from "next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"

interface UserNavProps extends React.HTMLAttributes<HTMLElement> {
  session: Session | null
}

export function UserNav({ session, ...props }: UserNavProps) {
  const { toast } = useToast()
  const router = useRouter()

  async function signOut() {
    const res = await fetch("/api/auth/signout", {
      method: "POST",
    })

    if (res.ok) {
      router.push("/")
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } else {
      toast({
        title: "Error signing out",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image as string} alt={session?.user?.name as string} />
            <AvatarFallback>{session?.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuSeparator />
        <DropdownMenuItemGroup>
          <DropdownMenuItem>
            <Link href="/profile">
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard">
              Dashboard
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuItemGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItemGroup>
          <DropdownMenuItem>
            <Link href="/settings">
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/help">
              Help
              <DropdownMenuShortcut>⌘?</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuItemGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          Sign out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

