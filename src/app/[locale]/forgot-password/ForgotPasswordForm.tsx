'''"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function ForgotPasswordForm(){
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [generatedOTP, setGeneratedOTP] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations()

  // Get email from URL params if redirected from forgot password
  const emailFromParam = searchParams.get('email')
  if (emailFromParam) {
    setEmail(emailFromParam)
  }

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('[ForgotPassword] Requesting OTP for:', email)

    try{
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.ok) {
        console.log('[ForgotPassword] OTP sent successfully')
        console.log('[ForgotPassword] OTP:', data.otp)

        setGeneratedOTP(data.otp)
        setSuccess(true)
      } else {
        console.log('[ForgotPassword] Request failed:', data.message)
        setError(data.message || t('AnErrorOccurred'))
      }
    }catch(err: any){
      console.error('[ForgotPassword] Error:', err)
      setError(err.message || t('AnErrorOccurred'))
    }finally{
      setLoading(false)
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
        <p className="text-secondary">{t('ForgotPasswordDontWorry') as string}</p>
      </div>

      {/* Forgot Password Card */}
      <div className="card-modern p-8 border-gradient">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t('ForgotPassword') as string}</h2>

        {success && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707M9 12l2 2 4-4m-5.618-4.016A11.955 11.955 0 0117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-blue-400 font-medium mb-1">{t('PasswordSuccessfullyChanged') as string}</p>
                <p className="text-blue-300 text-sm mb-2">{t('OTPCodeSentTo').replace('{email}', email)}</p>
                {generatedOTP && (
                  <div className="bg-dark-tertiary p-3 rounded-lg">
                    <p className="text-xs text-secondary mb-1">{t('YourOTPCodeDevelopmentMode') as string}</p>
                    <p className="text-2xl font-mono font-bold text-primary tracking-wider">{generatedOTP}</p>
                  </div>
                )}
                <p className="text-blue-300 text-xs">{t('EnterOTPCodeAndNewPassword') as string}</p>
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

            <button
              type="submit"
              className="btn-modern w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !email}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('SendingOTP') as string}</span>
                </div>
              ) : (
                t('SendOTP')
              )}
            </button>

            <div className="text-center pt-4 border-t border-dark">
              <p className="text-secondary text-sm">
                {t('RememberPassword') as string}{' '}
                <Link
                  href={`/${pathname.split('/')[1] || 'en'}/login`}
                  className="inline-flex items-center text-accent-green hover:text-accent-green-light font-semibold transition-all duration-300 hover:underline group"
                >
                  {t('LoginHere') as string}
                  <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </p>
            </div>
          </form>
        )}

        {success && (
          <button
            type="button"
            onClick={() => router.push(`/${pathname.split('/')[1] || 'en'}/reset-password?email=${encodeURIComponent(email)}`)}
            className="btn-modern w-full py-3 text-base font-semibold"
          >
            {t('ContinueToResetPassword') as string}
          </button>
        )}
      </div>

      <div className="text-center pt-4 border-t border-dark">
        <p className="text-secondary text-sm">
          {t('DontHaveAnAccount') as string}{' '}
          <Link
            href={`/${pathname.split('/')[1] || 'en'}/register`}
            className="inline-flex items-center text-accent-green hover:text-accent-green-light font-semibold transition-all duration-300 hover:underline group"
          >
            {t('SignUpHere') as string}
            <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </p>
      </div>
    </div>
  )
}
'''