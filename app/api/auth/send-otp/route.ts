import { NextResponse } from 'next/server'

import { sendOtpEmail } from '@/lib/email/send-otp'
import { prisma } from '@/lib/prisma'

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { email: normalizedEmail }
      })
    }

    // Invalidate previous unused OTPs
    await prisma.otpCode.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true }
    })

    // Generate new OTP
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.otpCode.create({
      data: {
        code: otp,
        userId: user.id,
        expiresAt
      }
    })

    // Send OTP email
    await sendOtpEmail(normalizedEmail, otp)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email'
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}
