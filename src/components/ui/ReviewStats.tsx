'use client'

import { useTranslations } from 'next-intl'

interface ReviewStatsProps {
  averageRating: number
  totalReviews: number
  distribution: Array<{
    rating: number
    count: number
    percentage: number
  }>
}

export default function ReviewStats({ averageRating, totalReviews, distribution }: ReviewStatsProps) {
  const t = useTranslations()

  return (
    <div className="card-modern p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="mb-4">
            <div className="text-6xl font-bold text-gradient mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl ${
                    star <= Math.round(averageRating)
                      ? 'text-accent-yellow drop-shadow-glow'
                      : 'text-muted'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-secondary">
              {t('BasedOn') as string} {totalReviews} {t('Reviews') as string}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          <h3 className="font-semibold text-primary mb-4">
            {t('RatingDistribution') as string}
          </h3>
          {distribution.map((item) => (
            <div key={item.rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-16">
                <span className="text-sm text-secondary">{item.rating}</span>
                <span className="text-accent-yellow">★</span>
              </div>
              <div className="flex-1 relative">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-accent-green to-accent-green-light h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 w-16 justify-end">
                <span className="text-sm text-secondary">{item.count}</span>
                <span className="text-xs text-muted">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-dark/20">
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-green mb-1">
            {distribution.filter(d => d.rating === 5).reduce((sum, d) => sum + d.count, 0)}
          </div>
          <p className="text-xs text-secondary">{t('FiveStarReviews') as string}</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-green mb-1">
            {distribution.filter(d => d.rating >= 4).reduce((sum, d) => sum + d.count, 0)}
          </div>
          <p className="text-xs text-secondary">{t('FourPlusStarReviews') as string}</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-green mb-1">
            {Math.round((distribution.filter(d => d.rating >= 4).reduce((sum, d) => sum + d.count, 0) / totalReviews) * 100)}%
          </div>
          <p className="text-xs text-secondary">{t('SatisfactionRate') as string}</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-green mb-1">
            {totalReviews}
          </div>
          <p className="text-xs text-secondary">{t('TotalReviews') as string}</p>
        </div>
      </div>
    </div>
  )
}