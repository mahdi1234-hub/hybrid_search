import { NextResponse } from 'next/server'

import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true, verified: true }
    })

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
