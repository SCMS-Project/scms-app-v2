"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  Library,
  MessageSquare,
  Settings,
  Users,
  UserSquare,
  FileText,
  BookOpenCheck,
  Clock,
  UsersRound,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useAuth } from "@/app/contexts/auth-context"
import { ROLES } from "@/app/constants/roles"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function Sidebar({ className, isOpen, onOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  // Handle mobile sidebar state
  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    onOpenChange?.(open)
  }

  // Close the mobile sidebar when the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        title: "Schedule",
        href: "/dashboard/schedule",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: "Courses",
        href: "/dashboard/courses",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        title: "Subjects",
        href: "/dashboard/subjects",
        icon: <BookOpenCheck className="h-5 w-5" />,
      },
      {
        title: "Facilities",
        href: "/dashboard/facilities",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        title: "Resources",
        href: "/dashboard/resources",
        icon: <Library className="h-5 w-5" />,
      },
      {
        title: "Communications",
        href: "/dashboard/communications",
        icon: <MessageSquare className="h-5 w-5" />,
      },
      {
        title: "Collaboration",
        href: "/dashboard/collaboration",
        icon: <UsersRound className="h-5 w-5" />,
      },
      {
        title: "Events",
        href: "/dashboard/events",
        icon: <Clock className="h-5 w-5" />,
      },
    ]

    // Admin-specific items
    if (user?.role === ROLES.ADMIN) {
      return [
        ...commonItems,
        {
          title: "Students",
          href: "/dashboard/students",
          icon: <GraduationCap className="h-5 w-5" />,
        },
        {
          title: "Lecturers",
          href: "/dashboard/lecturers",
          icon: <UserSquare className="h-5 w-5" />,
        },
        {
          title: "Batches",
          href: "/dashboard/batches",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Enrollments",
          href: "/dashboard/enrollments",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Analytics",
          href: "/dashboard/analytics",
          icon: <BarChart3 className="h-5 w-5" />,
        },
        {
          title: "Settings",
          href: "/dashboard/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ]
    }

    // Student-specific items
    if (user?.role === ROLES.STUDENT) {
      return commonItems
    }

    // Lecturer-specific items
    if (user?.role === ROLES.LECTURER) {
      return commonItems
    }

    // Default items if role is not determined
    return commonItems
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="left" className="w-[280px] p-0 sm:max-w-xs">
          <MobileSidebar navItems={navItems} pathname={pathname} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden fixed top-16 bottom-0 lg:block border-r bg-background transition-all duration-300 z-20",
          className,
          isOpen ? "w-64" : "w-[60px]",
        )}
      >
        <DesktopSidebar navItems={navItems} pathname={pathname} isCollapsed={!isOpen} />
      </div>
    </>
  )
}

interface SidebarNavProps {
  navItems: {
    title: string
    href: string
    icon: React.ReactNode
  }[]
  pathname: string
  isCollapsed?: boolean
}

function MobileSidebar({ navItems, pathname }: SidebarNavProps) {
  return (
    <div className="flex h-full flex-col gap-2">
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 p-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}

function DesktopSidebar({ navItems, pathname, isCollapsed }: SidebarNavProps) {
  return (
    <div className="h-full overflow-hidden">
      <ScrollArea className="h-full">
        <nav className="grid gap-1 p-2">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                      isCollapsed && "justify-center px-2",
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.title}</span>}
                    {isCollapsed && <span className="sr-only">{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </ScrollArea>
    </div>
  )
}

