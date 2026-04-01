import { NextResponse } from 'next/server'

import { createSessionToken, setSessionCookie } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or OTP' },
        { status: 401 }
      )
    }

    // Find valid OTP
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: otp,
        used: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      )
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true }
    })

    // Mark user as verified
    if (!user.verified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { verified: true }
      })
    }

    // Create session
    const token = await createSessionToken(user.id, user.email)
    await setSessionCookie(token)

    // Store session in DB
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
