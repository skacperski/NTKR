import { NextRequest, NextResponse } from 'next/server'

// SIMPLE AUTH CREDENTIALS - Set in .env.local file only!
const AUTH_USERNAME = process.env.AUTH_USERNAME
const AUTH_PASSWORD = process.env.AUTH_PASSWORD

export function middleware(request: NextRequest) {
  // Bypass authentication for API routes (dla Apple Shortcuts)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Check if auth is configured
  if (!AUTH_USERNAME || !AUTH_PASSWORD) {
    return new NextResponse(`
      <html>
        <head><title>NTKR - Configuration Required</title></head>
        <body style="font-family: monospace; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1>🔐 Authentication Not Configured</h1>
          <p>Please set AUTH_USERNAME and AUTH_PASSWORD in your <code>.env.local</code> file:</p>
          <pre style="background: #f5f5f5; padding: 20px; border: 1px solid #ddd;">
# Add to .env.local:
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password</pre>
          <p>Then restart the application.</p>
          <p><strong>⚠️ Never commit credentials to code!</strong></p>
        </body>
      </html>
    `, {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    })
  }
  
  // Check for basic auth
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="NTKR - Personal Voice Journal"'
      }
    })
  }
  
  if (!authHeader!.startsWith('Basic ')) {
    
    return new NextResponse('Invalid authentication method', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="NTKR - Personal Voice Journal"'
      }
    })
  }
  
  // Decode credentials (authHeader is guaranteed to be non-null and valid here)
  const base64Credentials = authHeader!.split(' ')[1]
  if (!base64Credentials) {
    return new NextResponse('Invalid authorization header format', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="NTKR - Personal Voice Journal"'
      }
    })
  }
  try {
    const credentials = atob(base64Credentials) // Use atob instead of Buffer in Edge Runtime
    const [username, password] = credentials.split(':')
  
    // Verify credentials
    if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="NTKR - Personal Voice Journal"'
        }
      })
    }
    
    return NextResponse.next()
  } catch (error) {
    return new NextResponse('Invalid authorization header', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="NTKR - Personal Voice Journal"'
      }
    })
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
