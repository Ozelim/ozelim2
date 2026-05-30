import './globals.css'
import PageWrapper from './PageWrapper'
import Header from '@/components/layout/Header'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
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

export const metadata = {
  title: {
    default: 'Ozelim — туры по Казахстану',
    template: '%s · Ozelim',
  },
  description: 'Подбор и бронирование туров по Казахстану. Курорты, экскурсии, оздоровительные программы.',
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: 'Ozelim — туры по Казахстану',
    description: 'Подбор и бронирование туров по Казахстану.',
    type: 'website',
    locale: 'ru_RU',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-app-bg text-app-fg font-body antialiased">
        <ThemeProvider>
          <Header />
          <PageWrapper>{children}</PageWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}