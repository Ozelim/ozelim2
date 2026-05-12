export const dynamic = 'force-dynamic'

import Hero from '@/components/sections/Hero'
import Footer, { MarqueeTicker } from '@/components/sections/Footer'
import { getAllResorts } from '@/lib/resorts'
import ResortsGrid from './ResortsGrid'

export default async function ResortsPage() {
  const resorts = await getAllResorts(20)

  return (
    <main>
      <Hero
        title="Курорты Казахстана"
        subtitle="Откройте лучшие курортные направления страны"
      />
      <MarqueeTicker />
      <ResortsGrid items={resorts} />
      <MarqueeTicker />
      <Footer />
    </main>
  )
}
