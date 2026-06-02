'use client'

import { useState, useEffect } from 'react'

// Compte à rebours live de la "SaaS Quest".
// `deadline` = échéance FIXE (ISO). Démarrée le 2026-06-02, fin à +6 mois (2026-12-02).
// Affiche un placeholder stable jusqu'au montage client pour éviter tout
// mismatch d'hydratation (l'heure courante diffère serveur/client).
export function CountdownTimer({ deadline }: { deadline: string }) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const target = new Date(deadline).getTime()
    const tick = () => setRemaining(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline])

  // SSR + premier rendu client : placeholder identique → pas de mismatch.
  if (remaining === null) return <span>TIMER: 6 MOIS</span>
  if (remaining === 0) return <span>TIMER: TEMPS ÉCOULÉ</span>

  const totalSec = Math.floor(remaining / 1000)
  const days = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      TIMER: {days}J {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  )
}
