import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /login)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/login"]

  // Check if the current path is public
  const isPublicPath = publicPaths.includes(path)

  // Get token from cookies (in a real app, you'd validate the JWT)
  // For now, we'll let the client-side handle auth checks

  // If trying to access login while potentially authenticated,
  // let the client-side redirect handle it
  if (path === "/login") {
    return NextResponse.next()
  }

  // For protected routes, let the ProtectedRoute component handle the auth check
  if (!isPublicPath) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
