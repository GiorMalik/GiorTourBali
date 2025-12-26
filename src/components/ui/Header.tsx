"use client"
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import { useAuth } from '@/contexts/AuthContext'

const translations: { [key: string]: { [key: string]: string } } = {
  en: { Home: 'Home', Cars: 'Cars', About: 'About', Contact: 'Contact', Reviews: 'Reviews', Login: 'Login', Register: 'Register', Logout: 'Logout' },
  id: { Home: 'Beranda', Cars: 'Mobil', About: 'Tentang', Contact: 'Kontak', Reviews: 'Ulasan', Login: 'Masuk', Register: 'Daftar', Logout: 'Keluar' },
  zh: { Home: '首页', Cars: '汽车', About: '关于', Contact: '联系', Reviews: '评论', Login: '登录', Register: '注册', Logout: '登出' },
  ko: { Home: '홈', Cars: '자동차', About: '정보', Contact: '연락처', Reviews: '리뷰', Login: '로그인', Register: '회원가입', Logout: '로그아웃' },
  ar: { Home: 'الرئيسية', Cars: 'السيارات', About: 'حول', Contact: 'اتصل', Reviews: 'المراجعات', Login: 'تسجيل الدخول', Register: 'إنشاء حساب', Logout: 'تسجيل الخروج' },
  tr: { Home: 'Anasayfa', Cars: 'Arabalar', About: 'Hakkında', Contact: 'İletişim', Reviews: 'Yorumlar', Login: 'Giriş Yap', Register: 'Kayıt Ol', Logout: 'Çıkış Yap' },
  ru: { Home: 'Главная', Cars: 'Машины', About: 'О нас', Contact: 'Контакты', Reviews: 'Отзывы', Login: 'Войти', Register: 'Регистрация', Logout: 'Выйти' },
  pt: { Home: 'Início', Cars: 'Carros', About: 'Sobre', Contact: 'Contato', Reviews: 'Avaliações', Login: 'Entrar', Register: 'Cadastrar', Logout: 'Sair' }
}

export default function Header(){
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  const { user, logout } = useAuth()
  const t = translations[locale] || translations.en
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Dynamic menu items based on auth state
  const menuItems: Array<{key: string, href: string} | {key: string, action: () => void, isButton: true}> = [
    { key: 'Home', href: `/${locale}` },
    { key: 'Cars', href: `/${locale}/cars` },
    { key: 'Reviews', href: `/${locale}/reviews` },
    { key: 'About', href: `/${locale}/about` },
    { key: 'Contact', href: `/${locale}/contact` },
    ...(user ? [] : [
      { key: 'Login', href: `/${locale}/login` },
      { key: 'Register', href: `/${locale}/register` }
    ])
  ]

  // Logout button for logged in users
  const logoutItem = user ? {
    key: 'Logout',
    action: logout,
    isButton: true
  } : null

  return (
    <header className="sticky top-0 z-50 bg-dark-primary/95 backdrop-blur-md border-b border-dark">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href={`/${locale}`}
            className="group flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent-green to-accent-green-light rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110 overflow-hidden">
              <img 
                src="/logo.png?v=2" 
                alt="GiorBaliTour Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform">
              GiorBaliTour
            </span>
          </Link>
          
          <div className="flex items-center space-x-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[...menuItems, ...(logoutItem ? [logoutItem] : [])].map((item) => (
                'isButton' in item && item.isButton ? (
                  <button
                    key={item.key}
                    onClick={item.action}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all duration-300"
                  >
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4 4m4-4H3m6 4h1a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2h1m-6 0l2 2m0-0l-2-2" />
                    </svg>
                    <span className="text-sm font-medium text-red-400">{t[item.key]}</span>
                  </button>
                ) : (
                  <Link
                    key={item.key}
                    href={(item as {href: string}).href}
                    className="relative text-secondary hover:text-primary transition-colors duration-300 group"
                  >
                    {t[item.key]}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-green to-accent-yellow transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )
              ))}
            </nav>
            
            <LanguageSwitcher />
              
            {/* Mobile Menu Button */}
            <div className="relative group md:hidden">
              <button 
                className="p-2 text-secondary hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Mobile Menu Dropdown */}
              <div ref={mobileMenuRef} className={`absolute right-0 top-full mt-2 w-64 bg-card border border-dark rounded-xl shadow-xl transition-all duration-300 transform z-50 ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <nav className="p-3">
                  <div className="space-y-2">
                    {[...menuItems, ...(logoutItem ? [logoutItem] : [])].map((item, index) => (
                      'isButton' in item && item.isButton ? (
                        <button
                          key={item.key}
                          onClick={() => { item.action(); setIsMobileMenuOpen(false); }}
                          className="group/item flex items-center px-4 py-3 rounded-xl hover:bg-dark-tertiary transition-all duration-300 relative overflow-hidden w-full"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4 4m4-4H3m6 4h1a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2h1m-6 0l2 2m0-0l-2-2" />
                            </svg>
                          </div>
                          <span className="relative z-10 ml-3 text-primary font-medium group-hover/item:text-red-400 transition-all duration-300">{t[item.key]}</span>
                        </button>
                      ) : (
                        <Link
                          key={item.key}
                          href={(item as {href: string}).href}
                          className="group/item flex items-center px-4 py-3 rounded-xl hover:bg-dark-tertiary transition-all duration-300 relative overflow-hidden"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {/* Background gradient effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-accent-green/10 to-accent-yellow/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Icon */}
                          <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green to-accent-green-light glow-green">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              {item.key === 'Home' && <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 002 2H5a2 2 0 002-2V9z" />}
                              {item.key === 'Cars' && <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />}
                              {item.key === 'Reviews' && <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                              {item.key === 'About' && <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1v4zm-2-8h-2v12h4v-12z" />}
                              {item.key === 'Contact' && <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 2.22l8.89 4.26V20L15 12V8a2 2 0 00-2-2h-8a2 2 0 00-2 2z" />}
                              {item.key === 'Login' && <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4 4m0 0l4-4m-4 4h18M11 20l-4-4m0 0l4-4m-4 4h18M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 00-2-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
                              {item.key === 'Register' && <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v-3m0 3h.01M12 9v3m0 0v-3m0 3h.01M6 9v3m0 0v-3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                            </svg>
                          </div>
                          
                          {/* Text */}
                          <span className="relative z-10 ml-3 text-primary font-medium group-hover/item:text-gradient transition-all duration-300">
                            {t[item.key]}
                          </span>
                          
                          {/* Hover effect */}
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-green to-accent-yellow transition-all duration-300 group-hover/item:w-full"></div>
                        </Link>
                      )
                    ))}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
