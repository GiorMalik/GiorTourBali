'''"use client"
import { useState } from 'react'
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

export default function ResetPasswordForm(){
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

  // Get email from URL params
  const emailFromParam = searchParams.get('email')
  if (emailFromParam && !email) {
    setEmail(emailFromParam)
  }

  // Validate password on change
  const handlePasswordChange = (value: string) => {
    setNewPassword(value)
    const validation = validatePassword(value)
    setPasswordValidation(validation)
  }

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('[ResetPassword] Attempting password reset for:', email)

    try{
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await response.json()

      if (response.ok && data.ok) {
        console.log('[ResetPassword] Password reset successful')

        setSuccess(true)

        // Auto login after successful password reset
        setTimeout(async () => {
          const loginResult = await login(email, newPassword)
          if (loginResult.success) {
            console.log('[ResetPassword] Auto login successful')

            // Redirect to home page after successful login
            router.push(`/${locale}`)
          } else {
            console.log('[ResetPassword] Auto login failed:', loginResult.message)
            setError(t('PasswordChangedButLoginFailed'))
          }
        }, 1000)
      } else {
        console.log('[ResetPassword] Password reset failed:', data.message)
        setError(data.message || t('FailedToResetPassword'))
      }
    }catch(err: any){
      console.error('[ResetPassword] Error:', err)
      setError(err.message || t('AnErrorOccurred'))
    }finally{
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
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-green to-accent-green-light rounded-2xl mb-4 glow-green">
          <img
            src="/logo.png?v=2"
            alt="GiorBaliTour Logo"
            className="w-12 h-12 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">GiorBaliTour</h1>
        <p className="text-secondary">{t('ResetYourPassword') as string}</p>
      </div>

      {/* Reset Password Card */}
      <div className="card-modern p-8 border-gradient">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t('ResetYourPassword') as string}</h2>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-green-400 font-medium">{t('PasswordSuccessfullyChanged') as string}</p>
                <p className="text-green-300 text-sm">{t('LoggingInAutomatically') as string}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">{t('EmailLabel') as string}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-dark-secondary border border-dark rounded-xl text-primary placeholder-secondary transition-all duration-300 focus:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/20"
                  placeholder={t('EmailPlaceholder') as string}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">{t('OTPCodeLabel') as string}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 3.04-8.17-2.21l-3.66-2.22c-.504-.092-.682-.217-.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34.547 1.332 1.087 2.53 1.06 2.91.832.092.647.35-1.088.636-1.338-2.21-3.016A12.02 12.02 0 0012 2.944z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full pl-12 pr-4 py-3 bg-dark-secondary border border-dark rounded-xl text-primary placeholder-secondary transition-all duration-300 focus:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/20 text-center text-2xl font-mono tracking-wider"
                  placeholder="------"
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-secondary">Enter the 6-digit code sent to your email</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">{t('NewPassword') as string}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={e => handlePasswordChange(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-dark-secondary border border-dark rounded-xl text-primary placeholder-secondary transition-all duration-300 focus:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/20"
                  placeholder={t('Minimum8Characters') as string}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-secondary hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112.06 0c-3.21 0-6.103-1.754-8.425-4.38l2.411-2.412a1 1 0 011.414-1.414l5.051 5.051c-3.12 3.12-8.193 3.12-11.314 0l-5.05-5.051a1 1 0 01-1.414-1.414L4.586 13.75c-2.32-2.32-5.214-4.38-8.425-4.38a10.045 10.045 0 010.06 1.556c3.21 0 6.103 1.754 8.425 4.38l2.412 2.412a1 1 0 01-1.414-1.414l-5.05-5.051c3.12 3.12 8.193 3.12 11.314 0l5.05-5.051a1 1 0 01-1.414-1.414l4.586-4.586c2.32 2.32 5.214 4.38 8.425 4.38a10.045 10.045 0 01-10.061-1.556z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm4 8a3 3 0 01-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.045 10.045 0 00-4.081-3.747l-2.017-2.017A1 1 0 013.975 3.925l3.593-3.593a1 1 0 01-1.414-1.414l2.017-2.017C18.542 10.774 17.535 12 12 12s-1.323 4.685-4.081 6.747l-2.017 2.017a1 1 0 01-1.414-1.414l3.593 3.593a1 1 0 01-3.975-3.925l-2.017-2.017A10.045 10.045 0 002.458 12z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-secondary">{t('PasswordStrength') as string}:</span>
                    <span className={`text-xs font-medium ${
                      passwordValidation.strength === 'weak' ? 'text-red-400' :
                      passwordValidation.strength === 'medium' ? 'text-yellow-400' :
                      passwordValidation.strength === 'strong' ? 'text-green-400' :
                      'text-blue-400'
                    }`}>
                      {getStrengthText(passwordValidation.strength)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-dark-tertiary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor(passwordValidation.strength)} transition-all duration-300`}
                      style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-secondary space-y-1">
                    <div className={`flex items-center space-x-2 ${newPassword.length >= 8 ? 'text-green-400' : 'text-red-400'}`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{t('Minimum8Characters') as string}</span>
                    </div>
                    <div className={`flex items-center space-x-2 /[A-Z]/.test(newPassword) ? 'text-green-400' : 'text-secondary'}`}>
                      <svg className={`w-3 h-3 ${/[A-Z]/.test(newPassword) ? 'text-green-400' : 'text-secondary'}`} fill="currentColor" viewBox="0 0 20 20">
                        {/[A-Z]/.test(newPassword) ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0z" clipRule="evenodd" />
                        )}
                      </svg>
                      <span>{t('UppercaseLetter') as string}</span>
                    </div>
                    <div className={`flex items-center space-x-2 /[a-z]/.test(newPassword) ? 'text-green-400' : 'text-secondary'}`}>
                      <svg className={`w-3 h-3 ${/[a-z]/.test(newPassword) ? 'text-green-400' : 'text-secondary'}`} fill="currentColor" viewBox="0 0 20 20">
                        {/[a-z]/.test(newPassword) ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0z" clipRule="evenodd" />
                        )}
                      </svg>
                      <span>{t('LowercaseLetter') as string}</span>
                    </div>
                    <div className={`flex items-center space-x-2 /[0-9]/.test(newPassword) ? 'text-green-400' : 'text-secondary'}`}>
                      <svg className={`w-3 h-3 ${/[0-9]/.test(newPassword) ? 'text-green-400' : 'text-secondary'}`} fill="currentColor" viewBox="0 0 20 20">
                        {/[0-9]/.test(newPassword) ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0z" clipRule="evenodd" />
                        )}
                      </svg>
                      <span>{t('PasswordNumber') as string}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-modern w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !email || !otp || !newPassword || !passwordValidation.isValid}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </button>

            <div className="text-center pt-4 border-t border-dark">
              <p className="text-secondary text-sm">
                {' '}
                <Link
                  href={`/${locale}/forgot-password`}
                  className="inline-flex items-center text-accent-green hover:text-accent-green-light font-medium transition-all duration-300 hover:underline group"
                >
                  Resend OTP
                  <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </p>
            </div>
          </form>
        )}

        <div className="text-center pt-4 border-t border-dark">
          <p className="text-secondary text-sm">
            {' '}
            <Link
              href={`/${locale}/`}
              className="inline-flex items-center text-accent-green hover:text-accent-green-light font-medium transition-all duration-300 hover:underline group"
            >
              Back to Home
              <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9 9" />
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// Client-side password validation
function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  let score = 0

  // Minimum 8 characters (wajib)
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  } else {
    score += 1
  }

  // Check uppercase
  if (/[A-Z]/.test(password)) {
    score += 1
  }

  // Check lowercase
  if (/[a-z]/.test(password)) {
    score += 1
  }

  // Check number
  if (/[0-9]/.test(password)) {
    score += 1
  }

  // Check special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak'
  if (score >= 4) {
    strength = 'very-strong'
  } else if (score === 3) {
    strength = 'strong'
  } else if (score === 2) {
    strength = 'medium'
  } else {
    strength = 'weak'
  }

  // Password is valid if minimum 8 characters (special characters not required)
  const isValid = password.length >= 8

  return {
    isValid,
    strength,
    score,
    errors
  }
}
'''