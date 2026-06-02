import type { Metadata } from 'next'
import { Orbitron, Rajdhani, Amiri } from 'next/font/google'
import { Navbar } from '@/components/sections/navbar'
import { Footer } from '@/components/sections/footer'
import { listGuildPublic, countByRole } from '@/lib/guild'
import { ProjectsDashboard } from './projects-dashboard'
import { GuildClient } from './guild-client'

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' })
const rajdhani = Rajdhani({
  subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-rajdhani', display: 'swap',
})
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-amiri', display: 'swap' })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Rejoindre le projet',
  description:
    'Le dashboard SaaS Quest de GenZ Apps : ArtisanaDZ, Makine, Kodiane et l’écosystème en construction. Rejoins la guilde qui bâtit 10 SaaS.',
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

  // HUD : injecté en haut du dashboard (les projets sont la vedette).
  const memberCount = roster.length
  const squadLabel = memberCount >= 1 ? `SQUAD · ${memberCount}` : 'SOLO'
  const masterName = roster.find((r) => r.rank === 'maitre')?.display_name ?? null

  return (
    <div className={`${orbitron.variable} ${rajdhani.variable} ${amiri.variable} bg-background`}>
      <Navbar />
      <main className="pt-16">
        {/* 1+2. HUD + dashboard projets (vedette, occupe la majorité de la page) */}
        <ProjectsDashboard squadLabel={squadLabel} masterName={masterName} />
        {/* 3. Section guilde condensée, en clôture juste avant le footer */}
        <GuildClient roster={roster} counts={counts} dbError={dbError} />
      </main>
      <Footer />
    </div>
  )
}
