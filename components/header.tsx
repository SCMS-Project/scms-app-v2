"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/app/contexts/auth-context"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Campus Management System</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/students"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/dashboard/students") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Students
            </Link>
            <Link
              href="/dashboard/courses"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/dashboard/courses") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Courses
            </Link>
            <Link
              href="/dashboard/enrollment"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/dashboard/enrollment") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Enrollment
            </Link>
            <Link
              href="/dashboard/events"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/dashboard/events") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Events
            </Link>
            <Link
              href="/dashboard/collaboration"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/dashboard/collaboration") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Collaboration
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center">
              <span className="font-bold">Campus Management System</span>
            </Link>
            <div className="my-4 w-full border-t"></div>
            <nav className="flex flex-col gap-4">
              <Link href="/dashboard" className="text-foreground/60 hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/dashboard/students" className="text-foreground/60 hover:text-foreground">
                Students
              </Link>
              <Link href="/dashboard/courses" className="text-foreground/60 hover:text-foreground">
                Courses
              </Link>
              <Link href="/dashboard/enrollment" className="text-foreground/60 hover:text-foreground">
                Enrollment
              </Link>
              <Link href="/dashboard/events" className="text-foreground/60 hover:text-foreground">
                Events
              </Link>
              <Link href="/dashboard/collaboration" className="text-foreground/60 hover:text-foreground">
                Collaboration
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {Math.floor(Math.random() * 5) + 1}
              </span>
            </Button>
          </div>
          <ThemeToggle />
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  <div className="mt-1">
                    <Badge variant="outline">{user?.role}</Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

