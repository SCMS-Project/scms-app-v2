import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authState = request.cookies.get("auth_state")?.value
  const path = request.nextUrl.pathname

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard"]

  // Check if the path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`))

  // If it's a protected route and no auth state, redirect to login
  if (isProtectedRoute && !authState) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If it's the login page and user is already logged in, redirect to dashboard
  if ((path === "/auth/login" || path === "/auth/register") && authState) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
}

