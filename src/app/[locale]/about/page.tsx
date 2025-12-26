import { getTranslations } from 'next-intl/server'

export default async function AboutPage({ params }: { params: { locale: string } }){
  const t = await getTranslations({ locale: params.locale })

  return (
    <div className="min-h-screen section-gradient py-20">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">{t('AboutGiorBaliTour') as string}</h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
            {t('AboutDescription') as string}
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">{t('OurStory') as string}</h2>
              <div className="space-y-4 text-secondary leading-relaxed">
                <p>
                  {t('OurStoryText1') as string}
                </p>
                <p>
                  {t('OurStoryText2') as string}
                </p>
              </div>
            </div>
            
            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="card-modern p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-green/20 to-accent-yellow/20 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center" suppressHydrationWarning>
                      <div className="text-4xl font-bold text-gradient mb-2">{t('FiveHundredPlusClients') as string}</div>
                      <p className="text-secondary text-sm">{t('HappyClients') as string}</p>
                    </div>
                    <div className="text-center" suppressHydrationWarning>
                      <div className="text-4xl font-bold text-gradient mb-2">{t('TenPlusExperience') as string}</div>
                      <p className="text-secondary text-sm">{t('YearsExperience') as string}</p>
                    </div>
                    <div className="text-center" suppressHydrationWarning>
                      <div className="text-4xl font-bold text-gradient mb-2">{t('FiftyPlusDestinations') as string}</div>
                      <p className="text-secondary text-sm">{t('TouristDestinations') as string}</p>
                    </div>
                    <div className="text-center" suppressHydrationWarning>
                      <div className="text-4xl font-bold text-gradient mb-2">{t('TwentyFourSeven') as string}</div>
                      <p className="text-secondary text-sm">{t('SupportAvailable') as string}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">{t('WhyChooseGiorBaliTour') as string}</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              {t('WhyChooseDescription') as string}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: t('ProfessionalDriversTitle'),
                description: t('ProfessionalDriversDescription')
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: t('FlexibleDurationTitle'),
                description: t('FlexibleDurationDescription')
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: t('AllInclusivePricingTitle'),
                description: t('AllInclusivePricingDescription')
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: t('PremiumFleetTitle'),
                description: t('PremiumFleetDescription')
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364-6.364z" />
                  </svg>
                ),
                title: t('PersonalizedServiceTitle'),
                description: t('PersonalizedServiceDescription')
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: t('Support247Title'),
                description: t('Support247TitleDescription')
              }
            ].map((feature, index) => (
              <div key={index} className="card-modern p-6 text-center fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-accent-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 glow-green">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="card-modern p-12 bg-gradient-to-r from-accent-green/5 to-accent-yellow/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">{t('OurMission') as string}</h2>
                <p className="text-secondary leading-relaxed mb-6">
                  {t('OurMissionText') as string}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-secondary">{t('SafetyFirst') as string}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-secondary">{t('AuthenticExperiences') as string}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-secondary">{t('SustainableTourism') as string}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-accent-yellow to-accent-yellow-light rounded-full flex items-center justify-center mx-auto mb-6 glow-yellow">
                  <svg className="w-16 h-16 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2v2.945M8 3.935V5.5A2.5 2.5 0 012-2.945 0-2 2.5 0 002 2H5a2 2 0 00-2 2V7a2 2 0 002 2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01.948.684l1.498 4.493A1 1 0 011.21-2.577L12 2.577A1 1 0 01.21-2.577L8.423 3.846a1 1 0 00-1.21-2.577L8.423 3.846A1 1 0 00-1.21-2.577z" />
                  </svg>
                </div>
                <p className="text-secondary italic">
                  "{t('QuoteText' as string}"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">{t('MeetOurTeam') as string}</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              {t('TeamDescription') as string}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: t('GiorginoMalik'),
                role: t('FounderLeadDriver'),
                experience: t('TenPlusExperience'),
                description: t('GiorMalikDescription'),
                languages: [t('Indonesian'), t('English'), t('Malay')],
                specialties: [t('Tourism'), t('CustomerService'), t('RoutePlanning'), t('CulturalGuide')],
                achievements: [t('FoundedGiorBaliTour'), t('BuiltStrongClientBase'), t('ExpertInBaliDestinations')],
                image: "/images/gior-malik-profile.jpg"
              }
            ].map((member, index) => (
              <div key={index} className="card-modern p-6 text-center fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-24 h-24 bg-gradient-to-br from-accent-green to-accent-green-light rounded-full flex items-center justify-center mx-auto mb-4 glow-green overflow-hidden" suppressHydrationWarning>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{member.name}</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <a 
                    href="https://instagram.com/gior.malik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    @gior.malik
                  </a>
                </div>
                <p className="text-accent-green font-medium mb-2">{member.role}</p>
                <p className="text-secondary leading-relaxed mb-4">{member.description}</p>
                
                {/* Additional Details */}
                <div className="border-t border-dark pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-secondary mb-1">{t('Languages') as string}: {member.languages.join(', ')}</p>
                      <p className="text-secondary mb-1">{t('Specialties') as string}: {member.specialties.join(', ')}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-dark pt-4 mt-4">
                    <h4 className="text-lg font-semibold text-primary mb-3">{t('KeyAchievements') as string}</h4>
                    <div className="space-y-2">
                      {member.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent-green rounded-full flex-shrink-0 mt-1">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-secondary text-sm">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-dark pt-4 mt-4">
                    <div className="space-y-2">
                      <a 
                        href="https://wa.me/6285854965523"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 w-full bg-green-600 hover:bg-green-700 text-primary text-center font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                      <a 
                        href="https://instagram.com/gior.malik"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-center font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584.012-4.849.07-3.252.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.281.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                        </svg>
                        <span>Instagram</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}