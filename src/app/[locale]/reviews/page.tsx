import { db } from '@/lib/db'
import { getTranslations } from 'next-intl/server'
import ReviewCard from '@/components/ui/ReviewCard'
import ReviewStats from '@/components/ui/ReviewStats'
import ReviewFilters from '@/components/ui/ReviewFilters'
import Pagination from '@/components/ui/Pagination'

interface ReviewsPageProps {
  params: { locale: string }
  searchParams: { 
    page?: string
    rating?: string
    lang?: string
    sort?: string
  }
}

export default async function ReviewsPage({ params, searchParams }: ReviewsPageProps) {
  const t = await getTranslations({ locale: params.locale })
  
  // Parse search parameters
  const currentPage = parseInt(searchParams.page || '1')
  const ratingFilter = searchParams.rating ? parseInt(searchParams.rating) : undefined
  const languageFilter = searchParams.lang
  const sortBy = searchParams.sort || 'newest'
  
  const pageSize = 12
  const skip = (currentPage - 1) * pageSize

  // Build where clause for filtering
  const where: any = {}
  if (ratingFilter && ratingFilter >= 1 && ratingFilter <= 5) {
    where.rating = ratingFilter
  }
  
  // Language detection based on comment content
  if (languageFilter) {
    const languagePatterns: { [key: string]: string } = {
      id: /[nya|banget|yang|dan|di|ke|untuk|dari|dengan|dalam|ini|itu|yang|ada|bisa|sudah|masih|juga|saja|lagi|sangat|cukup|baik|bagus|mantap|recommended|worth|top|ga|gak|tidak|ya|dong|deh|lah|kok|sih|kan|dong|nih|nih]/.source,
      en: /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|up|about|into|through|during|before|after|above|below|between|among|is|am|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|must|can|this|that|these|those|what|which|who|when|where|why|how|all|each|every|both|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|just|now|here|there|then|way|even|back|well|good|new|old|great|little|big|small|large|right|left|real|sure|clear|easy|hard|long|high|low|best|better|much|many|more|most|less|least|very|quite|rather|pretty|fairly|enough|too|so|such|how|what|when|where|why|who|which|whom|whose|whatever|whichever|whoever|whomever|whenever|wherever|however|therefore|thus|hence|consequently|accordingly|nevertheless|nonetheless|notwithstanding|although|though|even|if|unless|until|while|because|since|as|so|that|in|order|that|lest|whether|either|or|neither|nor|both|and|but|yet|still|however|nevertheless|nonetheless|notwithstanding|although|though|even|if|unless|until|while|because|since|as|so|that|in|order|that|lest|whether)\b/.source,
      zh: /[\u4e00-\u9fff]/.source,
      ko: /[\uac00-\ud7af]/.source,
      ja: /[\u3040-\u309f\u30a0-\u30ff]/.source,
      ar: /[\u0600-\u06ff]/.source,
      ru: /[\u0400-\u04ff]/.source
    }
    
    if (languagePatterns[languageFilter]) {
      where.comment = {
        contains: languagePatterns[languageFilter]
      }
    }
  }

  // Build order by clause
  const orderBy: any = {}
  switch (sortBy) {
    case 'newest':
      orderBy.createdAt = 'desc'
      break
    case 'oldest':
      orderBy.createdAt = 'asc'
      break
    case 'highest':
      orderBy.rating = 'desc'
      break
    case 'lowest':
      orderBy.rating = 'asc'
      break
    default:
      orderBy.createdAt = 'desc'
  }

  // Get total count for pagination
  const totalReviews = await db.review.count({ where })
  
  // Get reviews with pagination
  const reviews = await db.review.findMany({
    where,
    orderBy,
    skip,
    take: pageSize
  })

  // Convert Date objects to strings for consistent serialization
  const serializedReviews = reviews.map(review => ({
    ...review,
    createdAt: review.createdAt.toISOString()
  }))

  // Calculate pagination
  const totalPages = Math.ceil(totalReviews / pageSize)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  // Get statistics
  const stats = await db.review.aggregate({
    _avg: { rating: true },
    _count: { id: true },
    where
  })

  const averageRating = stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0
  const totalReviewCount = stats._count.id

  // Rating distribution
  const ratingDistribution = await db.review.groupBy({
    by: ['rating'],
    _count: { rating: true },
    where
  })

  const distribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: ratingDistribution.find(d => d.rating === rating)?._count.rating || 0,
    percentage: totalReviewCount > 0 
      ? Math.round(((ratingDistribution.find(d => d.rating === rating)?._count.rating || 0) / totalReviewCount) * 100)
      : 0
  }))

  return (
    <div className="min-h-screen section-gradient py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
            {t('CustomerReviews') as string}
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
            {t('SeeWhatCustomers') as string}
          </p>
        </div>

        {/* Statistics Section */}
        <ReviewStats 
          averageRating={averageRating}
          totalReviews={totalReviewCount}
          distribution={distribution}
        />

        {/* Filters Section */}
        <ReviewFilters 
          currentRating={ratingFilter}
          currentLanguage={languageFilter}
          currentSort={sortBy}
          totalReviews={totalReviewCount}
        />

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {serializedReviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              animationDelay={index * 0.1}
            />
          ))}
        </div>

        {/* No Reviews Message */}
        {serializedReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">
              {t('NoReviewsFound') as string}
            </h3>
            <p className="text-secondary max-w-md mx-auto">
              {t('NoReviewsDescription') as string}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
          />
        )}
      </div>
    </div>
  )
}