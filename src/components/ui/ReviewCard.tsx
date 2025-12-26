'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

interface ReviewCardProps {
  review: {
    id: string
    userName: string
    comment: string
    rating: number
    createdAt: string | Date
  }
  animationDelay?: number
}

export default function ReviewCard({ review, animationDelay = 0 }: ReviewCardProps) {
  const t = useTranslations()
  const locale = useLocale()
  const [isExpanded, setIsExpanded] = useState(false)

  const commentPreview = review.comment.length > 150
    ? review.comment.substring(0, 150) + '...'
    : review.comment

  const detectLanguage = (comment: string) => {
    if (/[\u4e00-\u9fff]/.test(comment)) return 'zh'
    if (/[\uac00-\ud7af]/.test(comment)) return 'ko'
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(comment)) return 'ja'
    if (/[\u0600-\u06ff]/.test(comment)) return 'ar'
    if (/[\u0400-\u04ff]/.test(comment)) return 'ru'
    if (/[nya|banget|yang|dan|di|ke|untuk|dari|dengan|dalam|ini|itu|ada|bisa|sudah|masih|juga|saja|lagi|sangat|cukup|baik|bagus|mantap|recommended|worth|top|ga|gak|tidak|ya|dong|deh|lah|kok|sih|kan|dong|nih]/.test(comment)) return 'id'
    return 'en'
  }

  const language = detectLanguage(review.comment)
  const languageNames = {
    id: '🇮🇩 Indonesian',
    en: '🇺🇸 English',
    zh: '🇨🇳 Chinese',
    ko: '🇰🇷 Korean',
    ja: '🇯🇵 Japanese',
    ar: '🇸🇦 Arabic',
    ru: '🇷🇺 Russian'
  }

  const formatDate = (date: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
    // Convert to Date if it's a string, then use locale from next-intl to ensure consistency
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString(locale, options)
  }

  return (
    <div 
      className="card-modern p-6 fade-in h-full flex flex-col" 
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-green to-accent-green-light rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {review.userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary text-sm truncate">
              {review.userName}
            </h3>
            <p className="text-xs text-muted-foreground">
              {languageNames[language as keyof typeof languageNames]}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${
                  star <= review.rating 
                    ? 'text-accent-yellow drop-shadow-glow' 
                    : 'text-muted'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      {/* Comment */}
      <div className="flex-1">
        <p className="text-secondary text-sm leading-relaxed">
          {isExpanded ? review.comment : commentPreview}
        </p>
        
        {review.comment.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent-green hover:text-accent-green/80 text-xs font-medium mt-2 transition-colors"
          >
            {isExpanded ? t('ShowLess') : t('ReadMore')}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-dark/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{review.rating} {t('outOf5')}</span>
          <span>{formatDate(review.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}