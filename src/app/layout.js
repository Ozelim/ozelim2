'use client'
import './globals.css'
import Header from '@/components/layout/Header'
import SupportChat from '@/components/sections/SupportChat'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-display',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export default function RootLayout({
  children,
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-app-bg text-app-fg font-body antialiased">
        <ThemeProvider>
          <Header />
          <PageWrapper>{children}</PageWrapper>
          <SupportChat />
        </ThemeProvider>
      </body>
    </html>
  )
}

function PageWrapper({ children }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
