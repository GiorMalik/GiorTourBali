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
    const rateLimitKey = `register:${clientIP}:${email}`
    const rateLimitResult = checkRateLimit(rateLimitKey, 3, 5 * 60 * 1000)

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
      let finalOTP: string
      let finalOTPExpiry: Date

      if (existingUser.otpExpiry && existingUser.otpExpiry > now) {
        finalOTP = existingUser.otp
        finalOTPExpiry = existingUser.otpExpiry
      } else {
        finalOTP = generateOTP(6)
        finalOTPExpiry = new Date(Date.now() + 3 * 60 * 1000) 
      }

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

      // Send email for re-registration attempt
      await sendVerificationEmail(updatedUser.email, updatedUser.name, finalOTP)

      return NextResponse.json({
        ok: true,
        message: 'Please verify your email with the new OTP sent.',
        user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name },
        ...(process.env.NODE_ENV !== 'production' && { otp: finalOTP }),
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
    const otpExpiry = new Date(Date.now() + 3 * 60 * 1000)

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

    // Send verification email
    await sendVerificationEmail(user.email, user.name, otp)

    return NextResponse.json({
      ok: true,
      message: MESSAGE_CODES.REGISTRATION_SUCCESS,
      user: { id: user.id, email: user.email, name: user.name },
      ...(process.env.NODE_ENV !== 'production' && { otp: otp }),
    })

  } catch (err) {
    console.error('[Register API Error]', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
