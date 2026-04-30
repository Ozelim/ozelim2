'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  User,
  Menu,
  X,
  Mountain,
  LayoutGrid,
  Plane,
  FileCheck,
  ShieldCheck,
  HandCoins,
  UsersRound,
  Scale,
  Waves,
  Ticket,
  Users,
  MessageCircleQuestion,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import Image from 'next/image'

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/trips', label: 'Поездки' },
]

const serviceLinks = [
  { label: 'Поездки',                        icon: Plane,                   href: '/trips' },
  { label: 'Визы',                           icon: FileCheck,               href: '/visas' },
  { label: 'Страхование',                    icon: ShieldCheck,             href: '/insurance' },
  { label: 'Фонд',                           icon: HandCoins,               href: '/foundation' },
  { label: 'Ассоциация туристов',            icon: UsersRound,              href: '/association' },
  { label: 'Правовая защита',                icon: Scale,                   href: '/legal' },
  { label: 'Санатории',                      icon: Waves,                   href: '/sanatoriums' },
  { label: 'АВИА / ЖД билеты',              icon: Ticket,                  href: '/tickets' },
  { label: 'О нас',                          icon: Users,                   href: '/about' },
  { label: 'Вопрос-ответ',                   icon: MessageCircleQuestion,   href: '/faq' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const servicesRef = useRef(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user) setCurrentUser(d.user)
    }).catch(() => {})
  }, [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close both menus on navigation
  useEffect(() => {
    setTimeout(() => {
      setMobileOpen(false)
      setServicesOpen(false)
    }, 0)
  }, [pathname])

  // Close services dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (pathname === '/profile') return <></>  

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-1000 transition-all duration-500 px-4 ${
          scrolled
            ? 'backdrop-blur-xl bg-app-header-scrolled border-b border-(--site-accent)/10 shadow-[0_4px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_40px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-xl bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) flex items-center justify-center shadow-[0_0_20px_var(--site-shadow-glow)]"
            >
              <Image
                src="/logo-light.svg"
                alt="Ozelim Logo"
                width={36}
                height={36}
                className="w-9 h-9 block dark:hidden"
                priority
              />
              <Image
                src="/logo.svg"
                alt="Ozelim Logo"
                width={36}
                height={36}
                className="w-9 h-9 hidden dark:block"
                priority
              />
              {/* <Mountain className="w-5 h-5 text-(--site-on-accent)" strokeWidth={2.5} /> */}
            </motion.div>
            <div className="leading-tight">
              <div
                className={`text-xl font-bold tracking-wide ${scrolled ? 'text-app-fg' : 'text-white'}`}
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Oz<span className="text-(--site-accent-bright)">Elim</span>
              </div>
              <div
                className={`text-[10px] uppercase tracking-[0.2em] font-medium ${
                  scrolled ? 'text-app-tagline' : 'text-[#86c986]'
                }`}
              >
                Туризм & Отдых
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className={`relative px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-colors duration-300 ${
                      active
                        ? 'text-(--site-on-accent)'
                        : scrolled
                          ? 'text-app-nav-inactive hover:text-app-nav-hover'
                          : 'text-white/70 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) shadow-[0_0_20px_var(--site-shadow-glow)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </motion.div>
                </Link>
              )
            })}

            {/* Services dropdown */}
            <div ref={servicesRef} className="relative">
              <motion.button
                onClick={() => setServicesOpen((o) => !o)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-colors duration-300 ${
                  servicesOpen
                    ? 'bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent)'
                    : scrolled
                      ? 'text-app-nav-inactive hover:text-app-nav-hover'
                      : 'text-white/70 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Все услуги
              </motion.button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 rounded-2xl overflow-hidden shadow-2xl z-50"
                    style={{
                      background: 'var(--app-mobile-menu-bg)',
                      backdropFilter: 'blur(30px)',
                      border: '1px solid var(--app-mobile-menu-border)',
                    }}
                  >
                    <div className="p-3 grid grid-cols-2 gap-1">
                      {serviceLinks.map((s) => {
                        const Icon = s.icon
                        const active = pathname === s.href
                        return (
                          <Link
                            key={s.href}
                            href={s.href}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                              active
                                ? 'bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent)'
                                : 'text-app-nav-inactive hover:text-app-nav-hover hover:bg-app-fg/5'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0 text-(--site-accent)" strokeWidth={1.5} />
                            <span className="leading-tight">{s.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div> 
          </nav>
          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle
              className={
                scrolled
                  ? ''
                  : 'border-white/30! text-white! hover:bg-white/10! dark:border-(--site-accent)/30! dark:text-(--site-accent)! dark:hover:bg-(--site-accent)/10!'
              }
            /> 
            {currentUser ? (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/profile')}
                className="w-10 h-10 rounded-full bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) flex items-center justify-center text-(--site-on-accent) font-semibold text-sm shadow-[0_0_12px_var(--site-shadow-soft)] transition-all"
                title={currentUser.name}
              >
                {currentUser.name?.charAt(0).toUpperCase()}
              </motion.button>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full border border-(--site-accent)/30 flex items-center justify-center text-(--site-accent) hover:bg-(--site-accent)/10 transition-colors duration-300"
                >
                  <User className="w-4.5 h-4.5" />
                </motion.button>
              </Link>
            )}

            {/* Mobile menu btn */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-full border border-app-border flex items-center justify-center text-app-fg hover:border-(--site-accent)/50 transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-0 right-0 z-40 mx-4 rounded-2xl overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto"
            style={{
              background: 'var(--app-mobile-menu-bg)',
              backdropFilter: 'blur(30px)',
              border: '1px solid var(--app-mobile-menu-border)',
            }}
          >
            <nav className="p-4 flex flex-col gap-1">
              {/* Main nav links */}
              {navLinks.map((link, i) => {
                const active = pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        active
                          ? 'bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent)'
                          : 'text-app-nav-inactive hover:text-app-nav-hover hover:bg-app-fg/5'
                      }`}
                    >
                      <Compass className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12 }}
                className="mx-2 my-2 h-px bg-app-fg/10"
              />

              {/* Service links grid */}
              <div className="grid grid-cols-2 gap-1">
                {serviceLinks.map((s, i) => {
                  const Icon = s.icon
                  const active = pathname === s.href
                  return (
                    <motion.div
                      key={s.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.14 + i * 0.04 }}
                    >
                      <Link
                        href={s.href}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          active
                            ? 'bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent)'
                            : 'text-app-nav-inactive hover:text-app-nav-hover hover:bg-app-fg/5'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-(--site-accent)" strokeWidth={1.5} />
                        <span className="leading-tight">{s.label}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
