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
  Library,
  MessageSquare,
  Settings,
  Users,
  UserSquare,
  FileText,
  BookOpenCheck,
  UsersRound,
  ChevronDown,
  ChevronRight,
  Bookmark,
  CalendarDays,
  LockIcon,
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

interface NavItem {
  title: string
  href?: string
  icon: React.ReactNode
  items?: NavItem[]
}

export default function Sidebar({ className, isOpen, onOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Handle mobile sidebar state
  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    onOpenChange?.(open)
  }

  // Close the mobile sidebar when the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Toggle category expansion
  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  // Check if a path is active (exact match or child route)
  const isActive = (href: string) => {
    if (!href) return false
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Check if a category should be highlighted (when any of its children are active)
  const isCategoryActive = (items: NavItem[]) => {
    return items.some((item) => isActive(item.href || ""))
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    const academicsItems = [
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
    ]

    const usersItems = [
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
    ]

    // Admin-specific items
    if (user?.role === ROLES.ADMIN) {
      return [
        {
          title: "Analytics",
          href: "/dashboard/analytics",
          icon: <BarChart3 className="h-5 w-5" />,
        },
        {
          title: "Users",
          icon: <Users className="h-5 w-5" />,
          items: usersItems,
        },
        {
          title: "Academics",
          icon: <Bookmark className="h-5 w-5" />,
          items: academicsItems,
        },
        {
          title: "Enrollments",
          href: "/dashboard/enrollments",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Events",
          href: "/dashboard/events",
          icon: <CalendarDays className="h-5 w-5" />,
        },
        {
          title: "Academic Schedule",
          href: "/dashboard/schedule",
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          title: "Resources",
          href: "/dashboard/resources",
          icon: <Library className="h-5 w-5" />,
        },
        {
          title: "Batches",
          href: "/dashboard/batches",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Facilities",
          href: "/dashboard/facilities",
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          title: "Communication",
          icon: <MessageSquare className="h-5 w-5" />,
          items: [
            {
              title: "Messaging",
              href: "/dashboard/communications",
              icon: <MessageSquare className="h-5 w-5" />,
            },
            {
              title: "Collaboration",
              href: "/dashboard/collaboration",
              icon: <UsersRound className="h-5 w-5" />,
            },
          ],
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
      return [
        {
          title: "Analytics",
          href: "/dashboard/analytics",
          icon: <BarChart3 className="h-5 w-5" />,
        },
        {
          title: "Academics",
          icon: <Bookmark className="h-5 w-5" />,
          items: academicsItems,
        },
        {
          title: "Events",
          href: "/dashboard/events",
          icon: <CalendarDays className="h-5 w-5" />,
        },
        {
          title: "Academic Schedule",
          href: "/dashboard/schedule",
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          title: "Resources",
          href: "/dashboard/resources",
          icon: <Library className="h-5 w-5" />,
        },
        {
          title: "Facilities",
          href: "/dashboard/facilities",
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          title: "Communication",
          icon: <MessageSquare className="h-5 w-5" />,
          items: [
            {
              title: "Messaging",
              href: "/dashboard/communications",
              icon: <MessageSquare className="h-5 w-5" />,
            },
            {
              title: "Collaboration",
              href: "/dashboard/collaboration",
              icon: <UsersRound className="h-5 w-5" />,
            },
          ],
        },
      ]
    }

    // Lecturer-specific items
    if (user?.role === ROLES.LECTURER) {
      return [
        {
          title: "Analytics",
          href: "/dashboard/analytics",
          icon: <BarChart3 className="h-5 w-5" />,
        },
        {
          title: "Academics",
          icon: <Bookmark className="h-5 w-5" />,
          items: academicsItems,
        },
        {
          title: "Events",
          href: "/dashboard/events",
          icon: <CalendarDays className="h-5 w-5" />,
        },
        {
          title: "Academic Schedule",
          href: "/dashboard/schedule",
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          title: "Resources",
          href: "/dashboard/resources",
          icon: <Library className="h-5 w-5" />,
        },
        {
          title: "Facilities",
          href: "/dashboard/facilities",
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          title: "Communication",
          icon: <MessageSquare className="h-5 w-5" />,
          items: [
            {
              title: "Messaging",
              href: "/dashboard/communications",
              icon: <MessageSquare className="h-5 w-5" />,
            },
            {
              title: "Collaboration",
              href: "/dashboard/collaboration",
              icon: <UsersRound className="h-5 w-5" />,
            },
          ],
        },
      ]
    }

    // Default items if role is not determined
    return [
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        title: "Events",
        href: "/dashboard/events",
        icon: <CalendarDays className="h-5 w-5" />,
      },
      {
        title: "Academics",
        icon: <Bookmark className="h-5 w-5" />,
        items: academicsItems,
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
        title: "Communication",
        icon: <MessageSquare className="h-5 w-5" />,
        items: [
          {
            title: "Messaging",
            href: "/dashboard/communications",
            icon: <MessageSquare className="h-5 w-5" />,
          },
          {
            title: "Collaboration",
            href: "/dashboard/collaboration",
            icon: <UsersRound className="h-5 w-5" />,
          },
        ],
      },
      {
        title: "Academic Schedule",
        href: "/dashboard/schedule",
        icon: <Calendar className="h-5 w-5" />,
      },
    ]
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="left" className="w-[280px] p-0 sm:max-w-xs">
          <MobileSidebar
            navItems={navItems}
            pathname={pathname}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            isActive={isActive}
            isCategoryActive={isCategoryActive}
            user={user}
          />
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
        <DesktopSidebar
          navItems={navItems}
          pathname={pathname}
          isCollapsed={!isOpen}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
          isActive={isActive}
          isCategoryActive={isCategoryActive}
          user={user}
        />
      </div>
    </>
  )
}

interface SidebarNavProps {
  navItems: NavItem[]
  pathname: string
  isCollapsed?: boolean
  expandedItems: string[]
  toggleExpand: (title: string) => void
  isActive: (href: string) => boolean
  isCategoryActive: (items: NavItem[]) => boolean
  user?: any
}

function MobileSidebar({
  navItems,
  pathname,
  expandedItems,
  toggleExpand,
  isActive,
  isCategoryActive,
  user,
}: SidebarNavProps) {
  return (
    <div className="flex h-full flex-col gap-2">
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 p-4">
          {navItems.map((item, index) =>
            item.items ? (
              <div key={index} className="space-y-1">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleExpand(item.title)
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isCategoryActive(item.items) ? "bg-accent/50 text-accent-foreground" : "transparent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.title}
                  </div>
                  {expandedItems.includes(item.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedItems.includes(item.title) && (
                  <div className="pl-6 space-y-1">
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href || "#"}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          isActive(subItem.href || "") ? "bg-accent text-accent-foreground" : "transparent",
                        )}
                      >
                        {subItem.icon}
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={index}
                href={item.href || "#"}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive(item.href || "") ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ),
          )}
        </nav>
      </ScrollArea>
    </div>
  )
}

function DesktopSidebar({
  navItems,
  pathname,
  isCollapsed,
  expandedItems,
  toggleExpand,
  isActive,
  isCategoryActive,
  user,
}: SidebarNavProps) {
  return (
    <div className="h-full overflow-hidden">
      <ScrollArea className="h-full">
        <nav className="grid gap-1 p-2">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item, index) =>
              item.items ? (
                <div key={index}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleExpand(item.title)
                          }}
                          className={cn(
                            "flex w-full items-center justify-center rounded-lg px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            isCategoryActive(item.items) ? "bg-accent text-accent-foreground" : "transparent",
                          )}
                        >
                          {item.icon}
                          <span className="sr-only">{item.title}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="space-y-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // Allow both admin and lecturer users to toggle categories
                          if (
                            user?.role === ROLES.ADMIN ||
                            user?.role === ROLES.STUDENT ||
                            user?.role === ROLES.LECTURER
                          ) {
                            toggleExpand(item.title)
                          }
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium",
                          user?.role === ROLES.ADMIN || user?.role === ROLES.STUDENT || user?.role === ROLES.LECTURER
                            ? "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            : "cursor-default",
                          isCategoryActive(item.items) ? "bg-accent/50 text-accent-foreground" : "transparent",
                        )}
                        disabled={
                          !(user?.role === ROLES.ADMIN || user?.role === ROLES.STUDENT || user?.role === ROLES.LECTURER)
                        }
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          {item.title}
                        </div>
                        {expandedItems.includes(item.title) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      {expandedItems.includes(item.title) && (
                        <div className="pl-6 space-y-1">
                          {item.items.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href || "#"}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                isActive(subItem.href || "") ? "bg-accent text-accent-foreground" : "transparent",
                              )}
                            >
                              {subItem.icon}
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    {user?.role === ROLES.ADMIN || user?.role === ROLES.STUDENT || user?.role === ROLES.LECTURER ? (
                      <Link
                        href={item.href || "#"}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          isActive(item.href || "") ? "bg-accent text-accent-foreground" : "transparent",
                          isCollapsed && "justify-center px-2",
                        )}
                      >
                        {item.icon}
                        {!isCollapsed && <span>{item.title}</span>}
                        {isCollapsed && <span className="sr-only">{item.title}</span>}
                      </Link>
                    ) : (
                      <div
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground",
                          isCollapsed && "justify-center px-2",
                        )}
                      >
                        <LockIcon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.title}</span>}
                        {isCollapsed && <span className="sr-only">{item.title}</span>}
                      </div>
                    )}
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      {item.title}{" "}
                      {!(user?.role === ROLES.ADMIN || user?.role === ROLES.STUDENT || user?.role === ROLES.LECTURER) &&
                        "(Restricted Access)"}
                    </TooltipContent>
                  )}
                </Tooltip>
              ),
            )}
          </TooltipProvider>
        </nav>
      </ScrollArea>
    </div>
  )
}

