import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Bypass authentication for API routes (dla Apple Shortcuts)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Bypass authentication for login page
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('ntkr-session')

  if (!sessionCookie) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Validate session (simple validation - in production use JWT)
  try {
    const sessionData = Buffer.from(sessionCookie.value, 'base64').toString()
    const [username, timestamp] = sessionData.split(':')
    
    // Check if session is not older than 24 hours
    const sessionAge = Date.now() - parseInt(timestamp)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    
    if (sessionAge > maxAge) {
      // Session expired, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('ntkr-session')
      return response
    }

    // Session is valid
    return NextResponse.next()
    
  } catch (error) {
    // Invalid session, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('ntkr-session')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}