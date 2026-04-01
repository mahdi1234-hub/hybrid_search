import { type NextRequest, NextResponse } from 'next/server'

import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'slayma-default-secret-change-in-production'
)

export async function proxy(request: NextRequest) {
  // Get the protocol from X-Forwarded-Proto header or request protocol
  const protocol =
    request.headers.get('x-forwarded-proto') || request.nextUrl.protocol

  // Get the host from X-Forwarded-Host header or request host
  const host =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || ''

  // Construct the base URL
  const baseUrl = `${protocol}${protocol.endsWith(':') ? '//' : '://'}${host}`

  // Check JWT session cookie
  const sessionToken = request.cookies.get('slayma-session')?.value
  let isAuthenticated = false

  if (sessionToken) {
    try {
      await jwtVerify(sessionToken, JWT_SECRET)
      isAuthenticated = true
    } catch {
      // Invalid token
    }
  }

  // Auth disabled mode
  if (process.env.ENABLE_AUTH === 'false') {
    isAuthenticated = true
  }

  const response = NextResponse.next({ request })

  // Define public paths
  const publicPaths = ['/', '/auth', '/share', '/api']
  const pathname = request.nextUrl.pathname

  // Redirect to login if not authenticated and path is not public
  if (!isAuthenticated && !publicPaths.some(path => pathname.startsWith(path))) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Set headers
  response.headers.set('x-base-url', baseUrl)

  return response
}
