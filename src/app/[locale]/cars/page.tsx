import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { db } from '@/lib/db'

export default async function CarsPage({ params }: { params: { locale: string } }){
  const t = await getTranslations({ locale: params.locale })
  const cars = await db.car.findMany({
    where: { isAvailable: true },
    orderBy: [
      { pricePerDay: 'asc' }
    ]
  })

  return (
    <div className="min-h-screen section-gradient py-20">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">{t('OurFleet') as string}</h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
            {t('CarsDescription') as string}
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <div key={car.id} className="group">
              <div className="card-modern overflow-hidden fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Car Image */}
                <div className="relative h-56 overflow-hidden rounded-t-2xl">
                  <img 
                    src={car.imageUrl} 
                    alt={car.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-2 transition-all duration-300 hover:scale-105 animate-bounce">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>{t('Available') as string}</span>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <Link href={`/${params.locale}/cars/${car.id}`} className="block">
                      <button className="w-full max-w-xs mx-auto block bg-dark-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-green transition-all duration-300 border border-accent-green/50 hover:border-accent-green hover:shadow-lg hover:shadow-accent-green/25 hover:scale-105">
                        {t('QuickView') as string}
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Car Detail */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-2">
                        {car.name}
                      </h3>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-dark-tertiary rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-secondary">{t('Capacity') as string}</p>
                        <p className="text-sm font-semibold text-primary">{car.capacity} {t('People') as string}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-dark-tertiary rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-secondary">{t('Transmission') as string}</p>
                        <p className="text-sm font-semibold text-primary">{car.transmission}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="border-t border-dark pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-secondary mb-1">{t('PricePer10Hours') as string}</p>
                        <p className="text-3xl font-bold text-gradient">
                          Rp {car.pricePerDay.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-accent-green mt-1">{t('IncludesDriverFuel') as string}</p>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Link href={`/${params.locale}/cars/${car.id}`} className="block">
                          <button className="btn-modern w-full px-6 py-3 text-sm">
                            {t('ViewDetails') as string}
                          </button>
                        </Link>
                        <button className="btn-accent w-full px-6 py-3 text-sm">
                          {t('BookNow') as string}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Cars Message */}
        {cars.length === 0 && (
          <div className="text-center py-20">
            <div className="card-modern p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-yellow to-accent-yellow-light rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">{t('NoCarsAvailable') as string}</h3>
              <p className="text-secondary mb-6">
                {t('NoCarsDescription') as string}
              </p>
              <Link href={`/${params.locale}/contact`} className="btn-modern px-8 py-3">
                {t('ContactUs') as string}
              </Link>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-20">
          <div className="card-modern p-8 bg-gradient-to-r from-accent-green/5 to-accent-yellow/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-accent-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 glow-green">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{t('NeedHelp') as string}</h3>
                <p className="text-secondary text-sm">{t('NeedHelpDescription') as string}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-yellow to-accent-yellow-light rounded-2xl flex items-center justify-center mx-auto mb-4 glow-yellow">
                  <svg className="w-8 h-8 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{t('BestPriceGuarantee') as string}</h3>
                <p className="text-secondary text-sm">{t('BestPriceDescription') as string}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-accent-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 glow-green">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{t('EasyBooking') as string}</h3>
                <p className="text-secondary text-sm">{t('EasyBookingDescription') as string}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}