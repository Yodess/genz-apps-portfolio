'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { GRID_APPS, STATUS_META, type AppBMC } from '@/lib/ecosystem'
import styles from './active-units.module.css'

// ---------------------------------------------------------------------------
// Modal BMC plein écran (accessible : role=dialog, focus-trap, Esc, backdrop)
// ---------------------------------------------------------------------------
function BmcModal({ app, onClose }: { app: AppBMC; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const meta = STATUS_META[app.status]
  const isWaqf = app.status === 'FLAGSHIP'

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement
    const t = setTimeout(() => closeRef.current?.focus(), 40)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        if (f.length === 0) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previouslyFocused.current?.focus()
    }
  }, [onClose])

  const toneClass =
    meta.tone === 'live' ? styles.toneLive : meta.tone === 'standby' ? styles.toneStandby :
    meta.tone === 'pipeline' ? styles.tonePipeline : meta.tone === 'dev' ? styles.toneDev : styles.toneFlagship

  const blocks: { label: string; value: string; gold?: boolean }[] = [
    { label: 'Revenu', value: app.bmc.revenu },
    { label: 'Coûts clés', value: app.bmc.couts },
    { label: 'Estimation prudente (M12)', value: app.bmc.prudent, gold: isWaqf },
    { label: 'Estimation optimiste (M12)', value: app.bmc.optimiste },
    { label: 'Levier', value: app.bmc.levier },
  ]

  return (
    <div className={`${styles.scope} ${styles.overlay}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`bmc-title-${app.key}`} className={styles.dialog}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Fermer" className={styles.close}>✕</button>

        <div className={styles.mHead}>
          <span className={styles.mIcon} aria-hidden="true">{app.icon}</span>
          <div className={styles.mTitleWrap}>
            <h2 id={`bmc-title-${app.key}`} className={styles.mTitle}>
              {app.name}
              {app.nameAr && <span className={styles.mAr} lang="ar" dir="rtl">{app.nameAr}</span>}
            </h2>
            <span className={`${styles.mBadge} ${toneClass}`}>{meta.label}</span>
          </div>
        </div>

        <p className={styles.mTagline}>{app.tagline}</p>

        <div className={styles.bmcGrid}>
          {blocks.map((b) => (
            <div key={b.label} className={`${styles.bmcBlock} ${b.gold ? styles.bmcGold : ''}`}>
              <p className={styles.bmcLabel}>{b.label}</p>
              <p className={styles.bmcValue}>{b.value}</p>
            </div>
          ))}
        </div>

        {app.url && (
          <div className={styles.mActions}>
            <a className={styles.mOpen} href={app.url} target="_blank" rel="noopener noreferrer">Ouvrir l’app ↗</a>
          </div>
        )}

        <p className={styles.disclaimer}>
          Estimations prudentes à 12 mois — potentiel, pas une promesse. Revenus actuels : phase de lancement.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Bouton "Business Model" + son modal (réutilisable : cartes & hero)
// ---------------------------------------------------------------------------
export function BmcButton({ app, variant = 'card' }: { app: AppBMC; variant?: 'card' | 'hero' }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={variant === 'hero' ? styles.btnHero : `${styles.btn} ${styles.btnBmc}`}>
        📊 Business Model
      </button>
      {open && <BmcModal app={app} onClose={close} />}
    </>
  )
}

// ---------------------------------------------------------------------------
// Grille Active Units (data-driven depuis ECOSYSTEM, hors flagship)
// ---------------------------------------------------------------------------
export function ActiveUnits() {
  return (
    <div className={`${styles.scope} ${styles.grid}`}>
      {GRID_APPS.map((app) => {
        const meta = STATUS_META[app.status]
        const toneClass =
          meta.tone === 'live' ? styles.toneLive : meta.tone === 'standby' ? styles.toneStandby :
          meta.tone === 'pipeline' ? styles.tonePipeline : meta.tone === 'dev' ? styles.toneDev : styles.toneFlagship
        const cardClass = `${styles.card} ${meta.tone === 'standby' ? styles.cardStandby : ''} ${meta.tone === 'pipeline' ? styles.cardPipeline : ''}`
        return (
          <div key={app.key} className={cardClass}>
            <div className={`${styles.badge} ${toneClass}`}>{meta.label}</div>
            <div className={`${styles.name} ${meta.tone === 'pipeline' ? styles.namePipeline : ''}`}>
              <span aria-hidden="true">{app.icon}</span> {app.name}
            </div>
            <div className={styles.tagline}>{app.tagline}</div>
            <div className={styles.actions}>
              <BmcButton app={app} />
              {app.url && (
                <a
                  className={`${styles.btn} ${meta.tone === 'dev' ? styles.btnOpenDev : styles.btnOpen}`}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ouvrir ↗
                </a>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
