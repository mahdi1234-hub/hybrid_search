import { NextResponse } from 'next/server'

// Legacy OAuth route - replaced by email OTP auth
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/auth/login`)
}
