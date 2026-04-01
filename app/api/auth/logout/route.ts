import { NextResponse } from 'next/server'

import { clearSession, getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getSession()

    if (session) {
      // Clean up DB sessions for this user
      await prisma.session.deleteMany({
        where: { userId: session.userId }
      })
    }

    await clearSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    await clearSession()
    return NextResponse.json({ success: true })
  }
}
