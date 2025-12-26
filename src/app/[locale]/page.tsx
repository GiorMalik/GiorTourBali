import { db } from '@/lib/db'
import ReviewForm from '@/components/ui/ReviewForm'
import LatestReviews from '@/components/ui/LatestReviews'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function HomePage({ params }: { params: { locale: string } }){
  const t = await getTranslations({ locale: params.locale })
  const featuredCars = await db.car.findMany({
    where: { 
      isAvailable: true,
      name: {
        in: ['Hiace Commuter', 'Hiace Premio', 'Toyota Alphard']
      }
    },
    orderBy: [
      { pricePerDay: 'desc' }
    ],
    take: 3
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-green/10 to-accent-yellow/10"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center fade-in">
              <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6 leading-tight">
              {t('Welcome') as string}
              <br />
              <span>GiorBaliTour</span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary mb-8 leading-relaxed">
              {t('ProfessionalDescription') as string}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="card-modern p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-accent-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 glow-green">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{t('DriverFuelIncluded') as string}</h3>
                <p className="text-secondary text-sm">{t('DriverFuelDescription') as string}</p>
              </div>
              
              <div className="card-modern p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-yellow to-accent-yellow-light rounded-2xl flex items-center justify-center mx-auto mb-4 glow-yellow">
                  <svg className="w-8 h-8 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{t('TenHoursDuration') as string}</h3>
                <p className="text-secondary text-sm">{t('TenHoursDescription') as string}</p>
              </div>
              
              <div className="card-modern p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-accent-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 glow-green">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{t('ProfessionalService') as string}</h3>
                <p className="text-secondary text-sm">{t('ProfessionalServiceDescription') as string}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${params.locale}/cars`} className="btn-modern px-8 py-4 text-lg">
                {t('ExploreOurFleet') as string}
              </Link>
              <Link href={`/${params.locale}/contact`} className="btn-accent px-8 py-4 text-lg">
                {t('ContactUs') as string}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="section-gradient py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-3">{t('FeaturedCars') as string}</h2>
            <p className="text-secondary max-w-xl mx-auto">
              {t('ChooseFromPremium') as string}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredCars.map((car, index) => (
              <Link key={car.id} href={`/${params.locale}/cars/${car.id}`} className="group">
                <div className="card-modern overflow-hidden fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative h-40 overflow-hidden rounded-t-2xl">
                    <img 
                      src={car.imageUrl} 
                      alt={car.name} 
                      className={`w-full h-full group-hover:scale-110 transition-transform duration-500 ${
                        car.name === 'Hiace Premio' 
                          ? 'object-contain object-center scale-85' 
                          : 'object-cover'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-2 transition-all duration-300 hover:scale-105 animate-bounce">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>{t('Available') as string}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-green transition-colors">
                      {car.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-secondary">{t('PricePer10Hours') as string}</p>
                        <p className="text-lg font-bold text-gradient">Rp {car.pricePerDay.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-green-light rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href={`/${params.locale}/cars`} 
              className="inline-flex items-center space-x-2 btn-modern px-6 py-3"
            >
              <span>{t('ViewAllCars') as string}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Reviews Preview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-3">{t('CustomerReviews') as string}</h2>
            <p className="text-secondary max-w-xl mx-auto">
              {t('SeeWhatCustomers') as string}
            </p>
          </div>
          
          <LatestReviews />
          
          <div className="text-center">
            <Link 
              href={`/${params.locale}/reviews`} 
              className="inline-flex items-center space-x-2 btn-accent px-6 py-3"
            >
              <span>{t('ReadAllReviews') as string}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Review Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-3">{t('QuickReview') as string}</h2>
              <p className="text-secondary">
                {t('ShareYourExperience') as string}
              </p>
            </div>
            
            <ReviewForm />
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="section-gradient py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-3">{t('ExploreMore') as string}</h2>
            <p className="text-secondary max-w-xl mx-auto">
              {t('DiscoverEverything') as string}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href={`/${params.locale}/cars`} className="group">
              <div className="card-modern p-6 text-center h-full hover:border-accent-green transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-accent-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-green transition-colors">{t('AllCars') as string}</h3>
                <p className="text-secondary text-sm mb-4">{t('BrowseOurFleet') as string}</p>
                <div className="inline-flex items-center text-accent-green font-medium text-sm">
                  <span>{t('ViewAllCars') as string}</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
            
            <Link href={`/${params.locale}/contact`} className="group">
              <div className="card-modern p-6 text-center h-full hover:border-accent-yellow transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-yellow to-accent-yellow-light rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-yellow transition-colors">{t('ContactUs') as string}</h3>
                <p className="text-secondary text-sm mb-4">{t('GetInTouch') as string}</p>
                <div className="inline-flex items-center text-accent-yellow font-medium text-sm">
                  <span>{t('ContactNow') as string}</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
            
            <Link href={`/${params.locale}/about`} className="group">
              <div className="card-modern p-6 text-center h-full hover:border-accent-green transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-accent-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-green transition-colors">{t('AboutUs') as string}</h3>
                <p className="text-secondary text-sm mb-4">{t('LearnMore') as string}</p>
                <div className="inline-flex items-center text-accent-green font-medium text-sm">
                  <span>{t('AboutUs') as string}</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}