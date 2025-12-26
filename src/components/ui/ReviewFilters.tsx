'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

interface ReviewFiltersProps {
  currentRating?: number
  currentLanguage?: string
  currentSort: string
  totalReviews: number
}

export default function ReviewFilters({ 
  currentRating, 
  currentLanguage, 
  currentSort, 
  totalReviews 
}: ReviewFiltersProps) {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (newFilters: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Reset to page 1 when filters change
    params.delete('page')
    
    router.push(`?${params.toString()}`)
  }

  const ratingOptions = [
    { value: 5, label: '5 ⭐' },
    { value: 4, label: '4 ⭐' },
    { value: 3, label: '3 ⭐' },
    { value: 2, label: '2 ⭐' },
    { value: 1, label: '1 ⭐' }
  ]

  const languageOptions = [
    { value: 'id', label: '🇮🇩 Indonesian' },
    { value: 'en', label: '🇺🇸 English' },
    { value: 'zh', label: '🇨🇳 Chinese' },
    { value: 'ko', label: '🇰🇷 Korean' },
    { value: 'ja', label: '🇯🇵 Japanese' },
    { value: 'ar', label: '🇸🇦 Arabic' },
    { value: 'ru', label: '🇷🇺 Russian' }
  ]

  const sortOptions = [
    { value: 'newest', label: t('NewestFirst') },
    { value: 'oldest', label: t('OldestFirst') },
    { value: 'highest', label: t('HighestRating') },
    { value: 'lowest', label: t('LowestRating') }
  ]

  return (
    <div className="card-modern p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-sm text-secondary">
          <span>{t('Showing') as string}</span>
          <span className="font-semibold text-primary">{totalReviews}</span>
          <span>{t('Reviews') as string}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Rating Filter */}
          <select
            value={currentRating || ''}
            onChange={(e) => updateFilters({ rating: e.target.value || null })}
            className="input-modern text-sm"
          >
            <option value="">{t('AllRatings') as string}</option>
            {ratingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Language Filter */}
          <select
            value={currentLanguage || ''}
            onChange={(e) => updateFilters({ lang: e.target.value || null })}
            className="input-modern text-sm"
          >
            <option value="">{t('AllLanguages') as string}</option>
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="input-modern text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {(currentRating || currentLanguage) && (
            <button
              onClick={() => updateFilters({ rating: null, lang: null })}
              className="text-accent-green hover:text-accent-green/80 text-sm font-medium transition-colors"
            >
              {t('ClearFilters') as string}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}