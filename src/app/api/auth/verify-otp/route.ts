import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkRateLimit, getClientIP } from '@/lib/auth-utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 })
    }

    const clientIP = getClientIP(req)
    const rateLimitKey = `verify-otp:${clientIP || 'unknown'}:${email}`
    const rateLimitResult = checkRateLimit(rateLimitKey, 5, 5 * 60 * 1000) // 5 requests per 5 minutes

    if (!rateLimitResult.allowed) {
      const minutesRemaining = Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000)
      return NextResponse.json({
        message: `Too many attempts. Please try again in ${minutesRemaining} minutes.`,
        retryAfter: rateLimitResult.resetTime
      }, { status: 429 })
    }

    const user = await db.user.findUnique({ where: { email } })

    if (!user) {
      // Return a generic message to avoid user enumeration
      return NextResponse.json({ message: 'Invalid OTP or email' }, { status: 400 })
    }

    if (user.isVerified) {
      return NextResponse.json({
        ok: true,
        message: 'Email is already verified.',
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      })
    }

    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json({ message: 'OTP is invalid or has expired. Please request a new one.' }, { status: 400 })
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ message: 'OTP has expired (10 minutes). Please request a new one.' }, { status: 400 })
    }

    if (user.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP or email' }, { status: 400 })
    }

    // OTP is correct - verify user and clear OTP
    const updatedUser = await db.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
        failedAttempts: 0,
        lockUntil: null
      }
    })

    return NextResponse.json({
      ok: true,
      message: 'Verification successful. You can now log in.',
      user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role }
    })
  } catch (err) {
    console.error('[VerifyOTP API Error]', err)
    return NextResponse.json({ message: 'An unexpected server error occurred.' }, { status: 500 })
  }
}
