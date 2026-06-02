import styles from './projects-dashboard.module.css'
import { ActiveUnits } from './active-units'
import { CountdownTimer } from './countdown-timer'

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
      </div>
    </div>
  )
}
