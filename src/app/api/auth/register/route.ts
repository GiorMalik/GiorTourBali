import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { validatePassword, generateOTP, getClientIP } from '@/lib/auth-utils'
import { sendVerificationEmail } from '@/lib/mail'

// ... (MESSAGE_CODES remain the same)
const MESSAGE_CODES = {
  EMAIL_ALREADY_REGISTERED: 'EmailAlreadyRegistered',
  REGISTRATION_SUCCESS: 'RegistrationSuccessful',
  INVALID_PASSWORD: 'InvalidPassword',
  EMAIL_SEND_FAILED: 'EmailSendFailed',
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, password } = body

    if (!email || !name || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({ where: { email } })

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json({ message: MESSAGE_CODES.EMAIL_ALREADY_REGISTERED }, { status: 400 })
      }

      const now = new Date()
      const finalOTP = (existingUser.otpExpiry && existingUser.otpExpiry > now) ? existingUser.otp : generateOTP(6)
      const finalOTPExpiry = new Date(Date.now() + 3 * 60 * 1000)

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

      // Capture the error from the email function
      const emailError = await sendVerificationEmail(updatedUser.email, updatedUser.name, finalOTP)
      if (emailError) {
        return NextResponse.json({
          message: MESSAGE_CODES.EMAIL_SEND_FAILED,
          error: emailError
        }, { status: 500 })
      }

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

    // Capture the error from the email function
    const emailError = await sendVerificationEmail(user.email, user.name, otp)
    if (emailError) {
      return NextResponse.json({
          message: MESSAGE_CODES.EMAIL_SEND_FAILED,
          error: emailError
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: MESSAGE_CODES.REGISTRATION_SUCCESS,
      user: { id: user.id, email: user.email, name: user.name },
    })

  } catch (err) {
    console.error('[Register API Error]', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
