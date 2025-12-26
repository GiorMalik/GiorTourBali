"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [lockTimeRemaining, setLockTimeRemaining] = useState<number>(0)
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()
  const { login } = useAuth()

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    setError(null)
    setRemainingAttempts(null)
    setLocked(false)

    console.log('[Login] Attempting login for:', email)

    try{
      const result = await login(email, password)

      if (result.success) {
        console.log('[Login] Login successful')

        // Redirect to home page after successful login
        setTimeout(() => {
          router.push(`/${pathname.split('/')[1] || 'en'}`)
        }, 500)
      } else {
        console.log('[Login] Login failed:', result.message)

        // Check if account is locked
        if (result.message.includes('locked')) {
          setLocked(true)

          // Extract time remaining from message (e.g., "5 minutes")
          const minutesMatch = result.message.match(/(\d+)\s+minutes?/)
          if (minutesMatch) {
            const minutes = parseInt(minutesMatch[1])
            setLockTimeRemaining(minutes * 60 * 1000)

            // Start countdown
            startLockoutCountdown(minutes * 60 * 1000)
          }
        } else if (result.message.includes('Remaining attempts')) {
          // Extract remaining attempts
          const attemptsMatch = result.message.match(/Remaining attempts:\s*(\d+)/)
          if (attemptsMatch) {
            setRemainingAttempts(parseInt(attemptsMatch[1]))
          }
        }

        setError(result.message)
      }
    }catch(err: any){
      console.error('[Login] Error:', err)
      setError(err.message || t('AnErrorOccurred'))
    }finally{
      setLoading(false)
    }
  }

  function startLockoutCountdown(durationMs: number) {
    const endTime = Date.now() + durationMs

    const interval = setInterval(() => {
      const remaining = endTime - Date.now()

      if (remaining <= 0) {
        clearInterval(interval)
        setLocked(false)
        setLockTimeRemaining(0)
      } else {
        setLockTimeRemaining(remaining)
      }
    }, 1000)
  }

  function formatTimeRemaining(ms: number): string {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
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
          <p className="text-secondary">{t('WelcomeBackSignIn') as string}</p>
        </div>

        {/* Login Card */}
        <div className="card-modern p-8 border-gradient">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t('SignIn') as string}</h2>

          {/* Locked Account Message */}
          {locked && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-red-400 font-medium mb-1">{t('AccountLocked') as string}</p>
                  <p className="text-red-300 text-sm mb-2">{t('YourAccountHasBeenLocked') as string}</p>
                  <div className="bg-dark-tertiary p-2 rounded-lg">
                    <p className="text-xs text-secondary mb-1">{t('PleaseWait') as string}</p>
                    <p className="text-xl font-mono font-bold text-red-400">{formatTimeRemaining(lockTimeRemaining)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* General Error Message */}
          {error && !locked && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-red-400 text-sm">{error}</p>
                  {remainingAttempts !== null && remainingAttempts > 0 && (
                    <p className="text-red-300 text-xs mt-1">{t('RemainingAttempts') as string} {remainingAttempts}</p>
                  )}
                </div>
              </div>
            </div>
          )}

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
                  disabled={locked || loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">{t('Password') as string}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-dark-secondary border border-dark rounded-xl text-primary placeholder-secondary transition-all duration-300 focus:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/20"
                  placeholder={t('EnterYourPassword') as string}
                  required
                  disabled={locked || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-secondary hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112.06 0c-3.21 0-6.103-1.754-8.425-4.38l2.411-2.412a1 1 0 011.414-1.414l5.051 5.051c-3.12 3.12-8.193 3.12-11.314 0l-5.05-5.051a1 1 0 01-1.414-1.414L4.586 13.75c-2.32-2.32-5.214-4.38-8.425-4.38a10.045 10.045 0 010.06 1.556c3.21 0 6.103 1.754 8.425 4.38l2.412 2.412a1 1 0 01-1.414-1.414l4.586-4.586c2.32 2.32 5.214 4.38 8.425 4.38a10.045 10.045 0 01-10.061-1.556z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm4 8a3 3 0 01-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.045 10.045 0 00-4.081-3.747l-2.017-2.017A1 1 0 013.975 3.925l3.593-3.593a1 1 0 01-1.414-1.414l2.017-2.017C18.542 10.774 17.535 12 12s-1.323 4.685-4.081 6.747l-2.017 2.017a1 1 0 01-1.414-1.414l3.593 3.593a1 1 0 01-3.975-3.925l-2.017-2.017A10.045 10.045 0 002.458 12z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Attempt Warning */}
            {remainingAttempts !== null && remainingAttempts <= 2 && remainingAttempts > 0 && !locked && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.754-8.425-4.38l-.707-.707M9 12l2 2 4-4m-5.618-4.016A11.955 11.955 0 0117.072 0l-.548-.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-yellow-400 text-sm">
                    {t('OnlyAttemptsLeft').replace('{attempts}', remainingAttempts.toString())}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-modern w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || locked}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('Processing') as string}</span>
                </div>
              ) : (
                t('SignInNow')
              )}
            </button>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-accent-green bg-dark-secondary border-dark rounded focus:ring-accent-green focus:ring-2 focus:ring-offset-0"
                />
                <span>{t('RememberMe') as string}</span>
              </label>
              <Link href={`/${pathname.split('/')[1] || 'en'}/forgot-password`} className="text-sm text-accent-green hover:text-accent-green-light font-medium transition-all duration-300 hover:underline inline-flex items-center group">
                {t('ForgotPassword') as string}
                <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 018 0z" />
                </svg>
              </Link>
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
          </form>
        </div>

        {/* Quick Access */}
        <div className="mt-6 text-center">
          <p className="text-muted text-xs mb-3">{t('OrSignInWith') as string}</p>
          <div className="flex justify-center space-x-3">
            <button className="p-3 bg-dark-secondary border border-dark rounded-xl hover:bg-dark-tertiary transition-all duration-300 group">
              <svg className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.865 0 8.17 2.21l.908-.62.908-2.647 0 4.42 2.865 0 6.03 3.3 9-6.16-4.53H2.18v2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button className="p-3 bg-dark-secondary border border-dark rounded-xl hover:bg-dark-tertiary transition-all duration-300 group">
              <svg className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.548.908-.62.908-2.647 0 4.42 2.865 0 6.03 3.3 9-6.16-4.53H2.18v2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
