'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function Footer(){
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  const t = useTranslations()

  return (
    <footer className="bg-dark-secondary border-t border-dark mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-green to-accent-green-light rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110 overflow-hidden">
                <img 
                  src="/logo.png?v=2" 
                  alt="GiorBaliTour Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gradient">GiorBaliTour</span>
            </div>
            <p className="text-secondary leading-relaxed">
              {t('FooterDescription') as string}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://wa.me/6285854965523" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-green-light rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/gior.malik" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gradient-to-br from-accent-yellow to-accent-yellow-light rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer"
              >
                <svg className="w-4 h-4 text-dark-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
              <a 
                href="mailto:giorginomalik@gmail.com" 
                className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-green-light rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gradient">{t('Contact') as string}</h3>
            <div className="space-y-3">
              <a 
                href="mailto:giorginomalik@gmail.com" 
                className="flex items-center space-x-3 text-secondary hover:text-accent-green transition-colors group"
              >
                <div className="w-10 h-10 bg-dark-tertiary rounded-lg flex items-center justify-center group-hover:bg-accent-green/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>giorginomalik@gmail.com</span>
              </a>
              
              <a 
                href="https://wa.me/6285854965523" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-3 text-secondary hover:text-accent-green transition-colors group"
              >
                <div className="w-10 h-10 bg-dark-tertiary rounded-lg flex items-center justify-center group-hover:bg-accent-green/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>+62 858 5496 5523</span>
              </a>
              
              <a 
                href="https://instagram.com/gior.malik" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-3 text-secondary hover:text-accent-yellow transition-colors group"
              >
                <div className="w-10 h-10 bg-dark-tertiary rounded-lg flex items-center justify-center group-hover:bg-accent-yellow/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>@gior.malik</span>
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gradient">{t('Navigation') as string}</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: t('Home'), href: `/${locale}` },
                { name: t('Cars'), href: `/${locale}/cars` },
                { name: t('About'), href: `/${locale}/about` },
                { name: t('Contact'), href: `/${locale}/contact` }
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-secondary hover:text-accent-green transition-colors duration-300 py-1"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="pt-4">
              <div className="p-4 bg-dark-tertiary rounded-xl border border-dark">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-accent-green rounded-full pulse"></div>
                  <span className="text-sm font-semibold text-accent-green">{t('Available247') as string}</span>
                </div>
                <p className="text-xs text-secondary">
                  {t('Available247Description') as string}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-dark pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary text-sm">
              © 2021 GiorBaliTour. {t('AllRightsReserved') as string}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-secondary text-sm">Powered by</span>
              <a 
                href="https://instagram.com/gior.malik" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent-green hover:text-accent-green/80 font-semibold text-sm transition-colors duration-300"
              >
                @GiorMalik
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}