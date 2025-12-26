'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPrevPage 
}: PaginationProps) {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          hasPrevPage
            ? 'bg-accent-green text-white hover:bg-accent-green/80'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        ← {t('Previous') as string}
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          <span key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-muted-foreground">...</span>
            ) : (
              <button
                onClick={() => goToPage(page as number)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-accent-green text-white'
                    : 'bg-muted text-muted-foreground hover:bg-accent-green/20 hover:text-primary'
                }`}
              >
                {page}
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasNextPage}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          hasNextPage
            ? 'bg-accent-green text-white hover:bg-accent-green/80'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        {t('Next') as string} →
      </button>
    </div>
  )
}