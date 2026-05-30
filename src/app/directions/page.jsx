export const dynamic = 'force-dynamic'

import Footer, { MarqueeTicker } from '@/components/sections/Footer'
import { listPublishedDirections } from '@/lib/resort-directions'
import DirectionsGrid from './DirectionsGrid'

export default async function DirectionsPage() {
  const resorts = await listPublishedDirections(40)

  return (
    <main className="pt-20">
      <MarqueeTicker />
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Курортные направления Казахстана
        </h1>
      </div>
      <DirectionsGrid items={resorts} />
      <Footer />
    </main>
  )
}
