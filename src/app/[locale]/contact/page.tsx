import { getTranslations } from 'next-intl/server'

export default async function ContactPage({ params }: { params: { locale: string } }){
  const t = await getTranslations({ locale: params.locale })

  return (
    <section id="contact" className="py-20 bg-dark-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">{t('ContactUs') as string}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-all duration-300 group">
              <div className="p-3 bg-accent-green rounded-full group-hover:bg-accent-green/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-6 h-6 text-white" aria-hidden="true">
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                </svg>
              </div>
              <span className="text-lg text-primary font-medium">+6285854965523</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-all duration-300 group">
              <div className="p-3 bg-accent-green rounded-full group-hover:bg-accent-green/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram w-6 h-6 text-white" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </div>
              <span className="text-lg text-primary font-medium">@Gior.Malik</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-all duration-300 group">
              <div className="p-3 bg-accent-green rounded-full group-hover:bg-accent-green/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-6 h-6 text-white" aria-hidden="true">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                </svg>
              </div>
              <span className="text-lg text-primary font-medium">@GiorMalik</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-all duration-300 group">
              <div className="p-3 bg-accent-green rounded-full group-hover:bg-accent-green/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-6 h-6 text-white" aria-hidden="true">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <span className="text-lg text-primary font-medium">Bali, Indonesia</span>
            </div>
            <div className="mt-8 p-6 bg-dark-secondary rounded-lg border border-accent-green">
              <h4 className="text-lg font-semibold text-primary mb-3">{t('BusinessHours') as string}</h4>
              <div className="space-y-2 text-secondary">
                <div className="flex justify-between">
                  <span>{t('MondayFriday') as string}</span>
                  <span className="text-accent-green">{t('TwentyFourHours') as string}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('Saturday') as string}</span>
                  <span className="text-accent-green">{t('TwentyFourHours') as string}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('Sunday') as string}</span>
                  <span className="text-accent-green">{t('TwentyFourHours') as string}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-accent-green/10 rounded-lg border border-accent-green/30">
                <p className="text-accent-green text-sm font-medium">🌴 {t('BaliTimeZone') as string}</p>
                <p className="text-secondary text-xs mt-1">UTC+8:00</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-dark-secondary rounded-lg overflow-hidden shadow-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d492.9141009999743!2d115.17750430713947!3d-8.756610604233083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2451b862fc66f%3A0x84db67cd9ab7ae96!2sGarasi%20Unit%20Kecil%20Adhi%20Trans!5e0!3m2!1sid!2sid!4v1761064808936!5m2!1sid!2sid" 
                width="100%" 
                height="450" 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
                className="w-full h-96 lg:h-full min-h-[450px]" 
                style={{ border: "0px" }}
              />
            </div>
            <div className="bg-dark-secondary p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-primary mb-3">{t('ServiceAreas') as string}</h4>
              <ul className="space-y-2 text-secondary">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent-green rounded-full mr-3"></div>
                  {t('DenpasarBadung') as string}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent-green rounded-full mr-3"></div>
                  {t('NgurahRaiAirport') as string}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent-green rounded-full mr-3"></div>
                  {t('KutaSeminyakLegian') as string}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent-green rounded-full mr-3"></div>
                  {t('UbudCangguNusaDua') as string}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent-green rounded-full mr-3"></div>
                  {t('AllBaliAreas') as string}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 bg-dark-secondary rounded-lg p-8 border border-accent-green">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-primary mb-4">{t('QuickBookingInquiry') as string}</h3>
            <p className="text-secondary">{t('QuickBookingDescription') as string}</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <a 
              href={`https://wa.me/6285854965523?text=${encodeURIComponent(t('WhatsAppMessage'))}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full bg-accent-green hover:bg-accent-green/80 text-primary text-center font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-5 h-5 inline mr-2" aria-hidden="true">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
              </svg>
              {t('StartWhatsAppConversation') as string}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}