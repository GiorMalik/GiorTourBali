import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { validatePassword, checkRateLimit, getClientIP } from '@/lib/auth-utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, otp, newPassword } = body

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: 'Email, OTP, and new password are required' }, { status: 400 })
    }

    const clientIP = getClientIP(req)
    const rateLimitKey = `reset-password:${clientIP || 'unknown'}:${email}`
    const rateLimitResult = checkRateLimit(rateLimitKey, 5, 10 * 60 * 1000) // 5 requests per 10 minutes

    if (!rateLimitResult.allowed) {
      const minutesRemaining = Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000)
      return NextResponse.json({
        message: `Too many attempts. Please try again in ${minutesRemaining} minutes.`,
        retryAfter: rateLimitResult.resetTime
      }, { status: 429 })
    }

    const user = await db.user.findUnique({ where: { email } })

    if (!user || !user.otp || !user.otpExpiry) {
      return NextResponse.json({ message: 'Invalid OTP, email, or request.' }, { status: 400 })
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ message: 'OTP has expired. Please request a new one.' }, { status: 400 })
    }

    if (user.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP, email, or request.' }, { status: 400 })
    }

    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json({
        message: passwordValidation.errors[0] || 'Invalid password format.',
        validation: passwordValidation
      }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const updatedUser = await db.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiry: null,
        failedAttempts: 0,
        lockUntil: null,
        isVerified: true // Also ensure the user is marked as verified
      }
    })

    return NextResponse.json({
      ok: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
      user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name }
    })
  } catch (err) {
    console.error('[ResetPassword API Error]', err)
    return NextResponse.json({ message: 'An unexpected server error occurred.' }, { status: 500 })
  }
}
