import type { Metadata } from 'next'
import { Orbitron, Rajdhani } from 'next/font/google'
import { Navbar } from '@/components/sections/navbar'
import { Footer } from '@/components/sections/footer'
import { listGuildPublic, countByRole } from '@/lib/guild'
import { GuildClient } from './guild-client'

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' })
const rajdhani = Rajdhani({
  subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-rajdhani', display: 'swap',
})

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Rejoindre la Guilde',
  description:
    'Rejoins la guilde GenZ Apps : ambassadeurs, tech lead, partenaires et créateurs qui font grandir l’écosystème ArtisanaDZ, Makine, Kodiane, QuranLearn et plus.',
  alternates: { canonical: 'https://www.genz-apps.com/jointheproject' },
}

export default async function JoinTheProjectPage() {
  let roster: Awaited<ReturnType<typeof listGuildPublic>> = []
  let dbError = false
  try {
    roster = await listGuildPublic()
  } catch (e) {
    console.error('[jointheproject] chargement roster échoué:', e)
    dbError = true
  }
  const counts = countByRole(roster)

  return (
    <div className={`${orbitron.variable} ${rajdhani.variable}`}>
      <Navbar />
      <main>
        <GuildClient roster={roster} counts={counts} dbError={dbError} />
      </main>
      <Footer />
    </div>
  )
}
