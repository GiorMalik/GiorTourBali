"use client"
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ReviewForm(){
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [userName, setUserName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Update userName when user changes
  React.useEffect(() => {
    if (user) {
      setUserName(user.name)
    }
  }, [user])

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    
    // Check if user is logged in
    if (!user) {
      router.push(`/${locale}/login`)
      return
    }

    setLoading(true)
    setError(null)
    try{
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, comment, rating: parseInt(rating.toString()) })
      })
      if (!res.ok) throw new Error('Failed to submit review')
      setSuccess(true)
      setComment('')
      setRating(5)
      
      // Emit custom event to notify other components
      window.dispatchEvent(new CustomEvent('reviewSubmitted'))
      
      setTimeout(() => setSuccess(false), 3000)
    }catch(err: any){
      setError(err.message || 'An error occurred')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!user && (
        <div className="mb-6 p-4 bg-gradient-to-r from-accent-yellow/20 to-accent-yellow/10 border border-accent-yellow/30 rounded-xl glow-yellow">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-accent-yellow font-medium">{t('LoginRequired') as string}</p>
              <p className="text-accent-yellow/80 text-sm">{t('LoginToSubmitReview') as string}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-gradient-to-r from-accent-green/20 to-accent-green/10 border border-accent-green/30 rounded-xl glow-green">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-accent-green font-medium">{t('ReviewSubmitted') as string}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary">{t('Name') as string}</label>
            <input 
              type="text" 
              value={userName} 
              onChange={e => setUserName(e.target.value)} 
              placeholder={t('YourNamePlaceholder') as string}
              className="input-modern w-full"
              disabled={!!user} // Disable if user is logged in
              {...(user && { title: t('NameAutoFilled') })}
            />
            {user && (
              <p className="text-xs text-accent-green flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('AutoFilledFromAccount') as string}</span>
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary">{t('Rating') as string}</label>
            <div className="flex items-center space-x-2">
              {[1,2,3,4,5].map(star => (
                <button 
                  key={star} 
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-all duration-200 transform hover:scale-110 ${
                    star <= rating 
                      ? 'text-yellow-400 drop-shadow-lg' 
                      : 'text-gray-400 hover:text-yellow-200'
                  }`}
                  style={{
                    filter: star <= rating ? 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.5))' : 'none'
                  }}
                >
                  ★
                </button>
              ))}
              <span className="ml-3 text-sm text-secondary">
                {rating} of 5
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary">{t('Comment') as string}</label>
          <textarea 
            value={comment} 
            onChange={e => setComment(e.target.value)} 
            placeholder={t('ShareExperiencePlaceholder') as string}
            className="input-modern w-full h-32 resize-none"
            required
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-secondary">
              {comment.length}/500 {t('Characters') as string}
            </p>
            {comment.length > 500 && (
              <p className="text-xs text-accent-yellow">{t('MaxCharacters') as string}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
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

        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">
            {t('YourReviewHelps') as string}
          </p>
          <button 
            type="submit" 
            className={`px-8 py-3 flex items-center space-x-2 font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
              loading || comment.length === 0 || comment.length > 500
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-accent-green to-accent-green-light text-white hover:from-accent-green/90 hover:to-accent-green-light/90 shadow-lg hover:shadow-xl'
            }`}
            disabled={loading || comment.length === 0 || comment.length > 500}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{t('Submitting') as string}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>{t('SubmitReview') as string}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
