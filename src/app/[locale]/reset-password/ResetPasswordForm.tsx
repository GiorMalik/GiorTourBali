"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'

interface PasswordValidationResult {
  isValid: boolean
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  score: number
  errors: string[]
}

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>({
    isValid: false,
    strength: 'weak',
    score: 0,
    errors: []
  })

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = pathname.split('/')[1] || 'en'
  const t = useTranslations()
  const { login } = useAuth()

  const emailFromParam = searchParams.get('email')

  useEffect(() => {
    if (emailFromParam) {
      setEmail(emailFromParam)
    }
  }, [emailFromParam])

  const handlePasswordChange = (value: string) => {
    setNewPassword(value)
    const validation = validatePassword(value)
    setPasswordValidation(validation)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await response.json()

      if (response.ok && data.ok) {
        setSuccess(true)
        setTimeout(async () => {
          const loginResult = await login(email, newPassword)
          if (loginResult.success) {
            router.push(`/${locale}`)
          } else {
            setError(t('PasswordChangedButLoginFailed'))
            setTimeout(() => router.push(`/${locale}/login`), 3000)
          }
        }, 1500)
      } else {
        setError(data.message || t('FailedToResetPassword'))
      }
    } catch (err: any) {
      console.error('[ResetPassword] Error:', err)
      setError(err.message || t('AnErrorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  function getStrengthColor(strength: string): string {
    switch(strength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      case 'very-strong': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  function getStrengthText(strength: string): string {
    switch(strength) {
      case 'weak': return t('PasswordWeak')
      case 'medium': return t('PasswordMedium')
      case 'strong': return t('PasswordStrong')
      case 'very-strong': return t('PasswordVeryStrong')
      default: return '-'
    }
  }

  return (
    <div className="max-w-md w-full fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-green to-accent-green-light rounded-2xl mb-4 glow-green">
          <img src="/logo.png?v=2" alt="GiorBaliTour Logo" className="w-12 h-12 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">GiorBaliTour</h1>
        <p className="text-secondary">{t('ResetYourPassword') as string}</p>
      </div>
      <div className="card-modern p-8 border-gradient">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t('ResetYourPassword') as string}</h2>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-green-400 font-medium">{t('PasswordSuccessfullyChanged') as string}</p>
                <p className="text-green-300 text-sm">{t('LoggingInAutomatically') as string}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3.04l-6.928-12.124a2 2 0 00-3.464 0L3.268 16.96C2.516 18.333 3.478 20 5.018 20z" /></svg>
              </div>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">{t('EmailLabel') as string}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder={t('EmailPlaceholder') as string} required disabled={loading || !!emailFromParam} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">{t('OTPCodeLabel') as string}</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="input-field text-center text-2xl font-mono tracking-widest" placeholder="------" maxLength={6} required disabled={loading} />
              <p className="text-xs text-secondary">{t('Enter6DigitCode') as string}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">{t('NewPassword') as string}</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => handlePasswordChange(e.target.value)} className="input-field pr-12" placeholder={t('Minimum8Characters') as string} required disabled={loading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-secondary hover:text-primary">
                  {/* ... eye icons ... */}
                </button>
              </div>

              {newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between"><span className="text-xs text-secondary">{t('PasswordStrength') as string}:</span><span className={`text-xs font-medium`}>{getStrengthText(passwordValidation.strength)}</span></div>
                  <div className="w-full h-2 bg-dark-tertiary rounded-full overflow-hidden"><div className={`h-full ${getStrengthColor(passwordValidation.strength)}`} style={{ width: `${(passwordValidation.score / 5) * 100}%` }} /></div>
                  <div className="text-xs text-secondary space-y-1 mt-1">
                      {/* ... password validation checks ... */}
                  </div>
                </div>
              )}
            </div>
            <button type="submit" className="btn-modern w-full" disabled={loading || !email || !otp || !newPassword || !passwordValidation.isValid}>
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
            <div className="text-center pt-4 border-t border-dark">
                <Link href={`/${locale}/forgot-password`} className="text-sm text-accent-green hover:underline">
                  {t('ResendOTP') as string}
                </Link>
            </div>
          </form>
        )}

        <div className="text-center pt-4 mt-4 border-t border-dark">
            <Link href={`/${locale}/login`} className="text-sm text-secondary hover:text-primary">
              {t('BackToLogin') as string}
            </Link>
        </div>
      </div>
    </div>
  )
}

function validatePassword(password: string): PasswordValidationResult {
    // ... same validation logic as before
  const errors: string[] = []
  let score = 0
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (password.length < 8) errors.push('Password must be at least 8 characters');

  let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak'
  if (score >= 4) strength = 'very-strong'
  else if (score === 3) strength = 'strong'
  else if (score === 2) strength = 'medium'

  return { isValid: password.length >= 8, strength, score, errors }
}
