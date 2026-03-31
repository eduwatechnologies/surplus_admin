import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Exclude API routes, auth error page, and static assets from middleware
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/auth/error" ||
    pathname.startsWith("/auth/error")
  ) {
    return NextResponse.next()
  }

  // Public routes
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    const token = request.cookies.get("admin_token")?.value
    if (token && (pathname === "/login" || pathname === "/signup")) {
      const url = new URL("/", request.url)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Protect all other routes
  const token = request.cookies.get("admin_token")?.value

  if (!token) {
    // Redirect to login page if not authenticated
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
