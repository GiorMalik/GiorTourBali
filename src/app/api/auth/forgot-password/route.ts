import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateOTP, checkRateLimit, getClientIP } from '@/lib/auth-utils'
import { sendVerificationEmail } from '@/lib/mail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    const clientIP = getClientIP(req)
    const rateLimitKey = `forgot-password:${clientIP || 'unknown'}:${email}`
    const rateLimitResult = checkRateLimit(rateLimitKey, 3, 5 * 60 * 1000) // 3 requests per 5 minutes

    if (!rateLimitResult.allowed) {
      const minutesRemaining = Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000)
      return NextResponse.json({
        message: `Too many attempts. Please try again in ${minutesRemaining} minutes.`,
        retryAfter: rateLimitResult.resetTime
      }, { status: 429 })
    }

    const user = await db.user.findUnique({ where: { email } })

    // For security, always return a generic success message to prevent email enumeration.
    const genericResponse = NextResponse.json({
      ok: true,
      message: 'If an account with that email exists, a password reset OTP has been sent.',
    });

    if (!user) {
      return genericResponse;
    }

    const otp = generateOTP(6)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await db.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry
      }
    })

    // Send the OTP email
    await sendVerificationEmail(user.email, user.name, otp)

    return genericResponse;

  } catch (err) {
    console.error('[ForgotPassword API Error]', err)
    // Avoid sending detailed error messages to the client
    return NextResponse.json({ message: 'An unexpected server error occurred.' }, { status: 500 })
  }
}
