import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { validatePassword, generateOTP, checkRateLimit, getClientIP } from '@/lib/auth-utils'
import { sendVerificationEmail } from '@/lib/mail'

const MESSAGE_CODES = {
  EMAIL_ALREADY_REGISTERED: 'EmailAlreadyRegistered',
  REGISTRATION_SUCCESS: 'RegistrationSuccessful',
  INVALID_PASSWORD: 'InvalidPassword',
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, password } = body

    if (!email || !name || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    const clientIP = getClientIP(req)
    const rateLimitKey = `register:${clientIP || 'unknown'}:${email}`
    const rateLimitResult = checkRateLimit(rateLimitKey, 5, 10 * 60 * 1000) // 5 requests per 10 minutes

    if (!rateLimitResult.allowed) {
      const minutesRemaining = Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000)
      return NextResponse.json({
        message: `Too many attempts. Please try again in ${minutesRemaining} minutes.`,
        retryAfter: rateLimitResult.resetTime
      }, { status: 429 })
    }

    const existingUser = await db.user.findUnique({ where: { email } })

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json({ message: MESSAGE_CODES.EMAIL_ALREADY_REGISTERED }, { status: 400 })
      }

      const now = new Date()
      const finalOTP = (existingUser.otpExpiry && existingUser.otpExpiry > now) ? existingUser.otp : generateOTP(6)
      const finalOTPExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

      const hashedPassword = await bcrypt.hash(password, 10)
      const updatedUser = await db.user.update({
        where: { email },
        data: {
          name,
          password: hashedPassword,
          otp: finalOTP,
          otpExpiry: finalOTPExpiry,
        }
      })

      await sendVerificationEmail(updatedUser.email, updatedUser.name, finalOTP)

      return NextResponse.json({
        ok: true,
        message: 'Please verify your email with the new OTP sent.',
        user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name },
      })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({
        message: MESSAGE_CODES.INVALID_PASSWORD,
        validation: passwordValidation
      }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOTP(6)
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'USER',
        otp,
        otpExpiry,
        isVerified: false
      }
    })

    await sendVerificationEmail(user.email, user.name, otp)

    return NextResponse.json({
      ok: true,
      message: MESSAGE_CODES.REGISTRATION_SUCCESS,
      user: { id: user.id, email: user.email, name: user.name },
    })

  } catch (err) {
    console.error('[Register API Error]', err)
    // Avoid sending detailed error messages to the client in production
    return NextResponse.json({ message: 'An unexpected server error occurred.' }, { status: 500 })
  }
}
