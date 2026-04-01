import { type NextRequest, NextResponse } from 'next/server'

// Legacy Supabase middleware - replaced by JWT auth in proxy.ts
export async function updateSession(request: NextRequest) {
  return NextResponse.next({ request })
}
