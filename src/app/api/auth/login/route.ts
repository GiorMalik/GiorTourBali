import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { checkRateLimit, getClientIP, isAccountLocked, getTimeUntilUnlock, getLoginDelayMs, shouldDelayLogin } from '@/lib/auth-utils'

const MAX_FAILED_ATTEMPTS = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    const clientIP = getClientIP(req)
    const rateLimitKey = `login:${clientIP || 'unknown'}:${email}`
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
      return NextResponse.json({ message: 'Email or password incorrect' }, { status: 401 })
    }

    if (!user.isVerified) {
      return NextResponse.json({
        message: 'Email belum diverifikasi. Silakan verifikasi email Anda terlebih dahulu.',
        requiresVerification: true
      }, { status: 403 })
    }

    if (isAccountLocked(user.failedAttempts, user.lockUntil)) {
      const timeRemaining = getTimeUntilUnlock(user.lockUntil)
      const minutesRemaining = Math.ceil(timeRemaining / 60000)
      return NextResponse.json({
        message: `Account locked due to too many failed attempts. Please try again in ${minutesRemaining} minutes.`,
        locked: true,
        timeRemaining
      }, { status: 423 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      const newFailedAttempts = user.failedAttempts + 1
      let lockUntil = user.lockUntil

      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockoutDuration = newFailedAttempts === MAX_FAILED_ATTEMPTS ? 5 * 60 * 1000 : 15 * 60 * 1000
        lockUntil = new Date(Date.now() + lockoutDuration)
      }

      await db.user.update({
        where: { email },
        data: {
          failedAttempts: newFailedAttempts,
          lockUntil
        }
      })

      if (shouldDelayLogin(newFailedAttempts)) {
        const delayMs = getLoginDelayMs(newFailedAttempts)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }

      const remainingAttempts = MAX_FAILED_ATTEMPTS - newFailedAttempts
      return NextResponse.json({
        message: `Email or password incorrect. ${remainingAttempts > 0 ? `Remaining attempts: ${remainingAttempts}` : 'Account locked.'}`,
        remainingAttempts
      }, { status: 401 })
    }

    const updatedUser = await db.user.update({
      where: { email },
      data: {
        failedAttempts: 0,
        lockUntil: null
      }
    })

    return NextResponse.json({
      ok: true,
      message: 'Login successful',
      user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role }
    })
  } catch (err) {
    console.error('[Login API Error]', err)
    return NextResponse.json({ message: 'An unexpected server error occurred.' }, { status: 500 })
  }
}
