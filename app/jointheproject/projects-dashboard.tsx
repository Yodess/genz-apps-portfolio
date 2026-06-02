import styles from './projects-dashboard.module.css'
import { ActiveUnits, BmcButton } from './active-units'
import { CountdownTimer } from './countdown-timer'
import { getApp } from '@/lib/ecosystem'

const QURAN = getApp('quranlearn')!

// Échéance de la quête (modifiable ici) : départ 2026-06-02, +6 mois.
const QUEST_DEADLINE = '2026-12-02T00:00:00'

// Dashboard SaaS Quest — les PROJETS en vedette (cœur de la page).
// HUD dynamique : MODE SOLO/SQUAD + ligne Maître injectés depuis la guilde.
export function ProjectsDashboard({
  squadLabel, masterName,
}: {
  squadLabel: string
  masterName: string | null
}) {
  const isSquad = squadLabel !== 'SOLO'
  return (
    <div className={styles.container}>
      {/* HUD Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span>⚡</span> GENZ <span>APPS</span>
        </div>
        <div className={styles.playerStats}>
          <div className={styles.statItem}><span className={styles.icon}>⏱️</span> <CountdownTimer deadline={QUEST_DEADLINE} /></div>
          <div className={`${styles.statItem} ${isSquad ? styles.squad : ''}`}>
            <span className={styles.icon}>⚔️</span> MODE: {squadLabel}
          </div>
          <div className={styles.statItem}><span className={styles.icon}>🤖</span> IA: ACTIVE</div>
        </div>
      </header>

      {masterName && (
        <p className={styles.masterLine}>👑 Guilde menée par <strong>{masterName}</strong></p>
      )}

      {/* Mission principale */}
      <div className={styles.missionTitle}>
        <h1>MISSION: 10 SAAS ARSENAL</h1>
        <p>Building the ecosystem | 1 Dev, Infinite Scalability</p>
      </div>

      {/* ====== HERO FLAGSHIP : QURANLEARN ====== */}
      <div className={styles.heroFlagship}>
        <div className={styles.heroWatermark} aria-hidden="true">ﷲ</div>
        <div className={styles.heroFlagBadge}>★ Core Unit — Cœur de l’incubateur</div>
        <div className={styles.heroGrid}>
          <div>
            <h2 className={styles.heroName}>
              📖 QuranLearn <span className={styles.heroArabic} lang="ar" dir="rtl">قرآن ليرن</span>
            </h2>
            <div className={styles.heroTag}>Le projet phare · La raison d’être</div>
            <p className={styles.heroDesc}>
              L’app de suivi d’apprentissage du Coran pour les professeurs (mouqri’/shaykh) et les écoles
              coraniques. Lecture du Coran gratuite pour tous, suivi pédagogique pour les enseignants,
              transparence pour les parents. Symboliquement et spirituellement, elle est le cœur de tout
              l’écosystème Genz.
            </p>
            <ul className={styles.heroFeatures}>
              <li><span className={styles.dot}>◆</span> Mushaf cliquable (Hafs QCF4)</li>
              <li><span className={styles.dot}>◆</span> Traduction + Tafsir multilingues</li>
              <li><span className={styles.dot}>◆</span> Suivi élèves : fautes, notes /10</li>
              <li><span className={styles.dot}>◆</span> Lien parent (WhatsApp)</li>
              <li><span className={styles.dot}>◆</span> Multi-plateforme (PWA + mobile)</li>
              <li><span className={styles.dot}>◆</span> Pack Ihssane · إحسان (gratuit)</li>
            </ul>
            <div className={styles.heroActions}>
              <a className={styles.heroCta} href="https://quranlearn.artisanadz.com" target="_blank" rel="noopener noreferrer">
                ▶ LANCER L’APP — quranlearn.artisanadz.com
              </a>
              <BmcButton app={QURAN} variant="hero" />
            </div>
          </div>
          <div className={styles.heroSide}>
            <h4>◢ Core Unit Status</h4>
            <div className={styles.coreStat}>
              <div className={styles.label}>État</div>
              <div className={styles.coreStatusLive}><span className={styles.pulse} aria-hidden="true" /> EN LIGNE · PROD</div>
            </div>
            <div className={styles.coreStat}>
              <div className={styles.label}>Lecteur Coran</div>
              <div className={styles.value}>Live · Hafs</div>
            </div>
            <div className={styles.coreStat}>
              <div className={styles.label}>Suivi professeur</div>
              <div className={styles.value}>Live · Phase 2 ✓</div>
            </div>
            <div className={styles.coreStat}>
              <div className={styles.label}>Forfaits</div>
              <div className={styles.value}>Ihssane · Shaykh · Madrassa</div>
            </div>
            <div className={styles.coreStat}>
              <div className={styles.label}>Progression V1</div>
              <div className={styles.heroProgressTrack}><div className={styles.heroProgressFill} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grille des projets */}
      <div className={styles.gridSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>📦 Active Units</div>
          <div className={styles.sectionMeta}>4 déployées · 1 dev · 1 standby · 1 pipeline</div>
        </div>
        <ActiveUnits />
      </div>

      {/* Next Arc : Incubateur */}
      <div className={styles.nextArc}>
        <div className={styles.cornerLock}><span>🔐</span> UNLOCK: 2M DA</div>
        <h2 className={styles.arcTitle}>🏢 NEXT ARC: THE INCUBATOR</h2>
        <div className={styles.arcContent}>
          <div>
            <h3 className={styles.arcColTitle}>Infrastructure</h3>
            <ul className={styles.arcList}>
              <li>🏢 Location Grand Local</li>
              <li>💻 Setup Studio &amp; Équipage</li>
              <li>🧰 Outils &amp; Serveurs</li>
            </ul>
          </div>
          <div>
            <h3 className={styles.arcColTitle}>Business Model</h3>
            <ul className={styles.arcList}>
              <li>🎓 Vente Formations en ligne</li>
              <li>🤝 Incubation Externe</li>
              <li>💸 Investissement Startups</li>
              <li>🌐 Plateforme Investisseurs</li>
            </ul>
          </div>
        </div>
        <div className={styles.arcCoreNote}>
          ★ QuranLearn · إحسان — le cœur spirituel de l’incubateur. Tout commence par elle.
        </div>
      </div>
    </div>
  )
}
