'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  ROLES, APPS, ROLE_ICON, ROLE_COLOR, RANKS, RANK_META, type Rank, type GuildPublic,
} from '@/lib/guild'

const FONT_TITLE = 'font-[family-name:var(--font-orbitron)]'
const FONT_BODY = 'font-[family-name:var(--font-rajdhani)]'
const FONT_MONO = 'font-[family-name:var(--font-fira-code)]'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ---------------------------------------------------------------------------
// Slot du Conseil — POURVU (compact)
// ---------------------------------------------------------------------------
function CouncilFilledCard({ rank, member }: { rank: Rank; member: GuildPublic }) {
  const meta = RANK_META[rank]
  const color = `var(${meta.colorVar})`
  const isMaster = rank === 'maitre'

  return (
    <article
      className={`relative flex h-full flex-col gap-2.5 rounded-2xl bg-card p-5 transition-all duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${isMaster ? 'border-2' : 'border'}`}
      style={{
        borderColor: `color-mix(in srgb, ${color} ${isMaster ? 70 : 55}%, transparent)`,
        boxShadow: `0 0 ${isMaster ? '34px -12px' : '24px -14px'} ${color}`,
      }}
    >
      {isMaster && (
        <span className={`${FONT_MONO} absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold tracking-widest`} style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 45%, transparent)` }}>
          LEADER
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-foreground shadow-inner" style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 25%, transparent))` }} aria-hidden="true">
          {initials(member.display_name)}
        </div>
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color }}>
            <span aria-hidden="true">{meta.icon}</span> {meta.label}
          </span>
          <h3 className={`${FONT_TITLE} text-base font-bold leading-tight tracking-wide text-foreground [overflow-wrap:anywhere]`}>{member.display_name}</h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        <span style={{ color }} className="font-semibold">{meta.subtitle}</span>
        <span className="mx-1.5" aria-hidden="true">·</span>
        <span>{member.role}</span>
      </p>

      {member.apps.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {member.apps.slice(0, 4).map((app) => (
            <span key={app} className="rounded-full px-2 py-0.5 text-sm font-medium" style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 35%, transparent)` }}>{app}</span>
          ))}
        </div>
      )}

      <p className={`${FONT_BODY} line-clamp-2 text-base leading-relaxed text-foreground/85`}>{member.pitch}</p>

      {member.link && (
        <a href={member.link} target="_blank" rel="noopener noreferrer nofollow" className="mt-auto inline-flex w-fit items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-semibold text-foreground" style={{ borderColor: `color-mix(in srgb, ${color} 50%, transparent)` }}>
          Profil <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  )
}

// ---------------------------------------------------------------------------
// Slot du Conseil — VACANT (compact)
// ---------------------------------------------------------------------------
function CouncilVacantCard({ rank, onApply }: { rank: Rank; onApply: () => void }) {
  const meta = RANK_META[rank]
  const color = `var(${meta.colorVar})`
  return (
    <article className="relative flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-card/40 p-5 text-center" style={{ borderColor: `color-mix(in srgb, ${color} 45%, transparent)` }}>
      <span className="text-4xl opacity-40 grayscale" aria-hidden="true">{meta.icon}</span>
      <h3 className={`${FONT_TITLE} text-lg font-bold tracking-wide text-foreground`}>{meta.label}</h3>
      <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
      <span className={`${FONT_MONO} rounded-full px-2.5 py-0.5 text-sm font-bold tracking-widest`} style={{ color: 'var(--danger)', background: 'color-mix(in srgb, var(--danger) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--danger) 40%, transparent)' }}>
        ◆ RECHERCHÉ
      </span>
      <p className={`${FONT_BODY} max-w-[24ch] text-base leading-relaxed text-muted-foreground`}>
        Tu veux être {meta.label} ? Rejoins le Conseil.
      </p>
      <button type="button" onClick={onApply} className="mt-1 min-h-11 rounded-lg border px-4 py-2 text-sm font-bold tracking-wide text-foreground transition-colors" style={{ borderColor: `color-mix(in srgb, ${color} 55%, transparent)`, background: `color-mix(in srgb, ${color} 10%, transparent)` }}>
        Postuler ▶
      </button>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Carrousel du Conseil — 4 slots, hauteur réduite (swipe + flèches + dots)
// ---------------------------------------------------------------------------
function CouncilCarousel({ byRank, onApply }: { byRank: Partial<Record<Rank, GuildPublic>>; onApply: () => void }) {
  const slides = useMemo(() => [...RANKS].sort((a, b) => RANK_META[a].order - RANK_META[b].order), [])
  const trackRef = useRef<HTMLDivElement>(null)
  const reducedRef = useRef(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    reducedRef.current = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(slides.length - 1, i))
    const card = track.children[clamped] as HTMLElement | undefined
    if (!card) return
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: reducedRef.current ? 'auto' : 'smooth' })
  }, [slides.length])

  const onScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    let nearest = 0, best = Infinity
    for (let i = 0; i < track.children.length; i++) {
      const c = track.children[i] as HTMLElement
      const d = Math.abs(c.offsetLeft - track.offsetLeft - track.scrollLeft)
      if (d < best) { best = d; nearest = i }
    }
    setActive(nearest)
  }, [])

  return (
    <div className="relative mt-5">
      <button type="button" onClick={() => scrollToIndex(active - 1)} disabled={active === 0} aria-label="Slot précédent" className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:border-accent hover:text-accent disabled:opacity-40 sm:flex">‹</button>
      <button type="button" onClick={() => scrollToIndex(active + 1)} disabled={active === slides.length - 1} aria-label="Slot suivant" className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:border-accent hover:text-accent disabled:opacity-40 sm:flex">›</button>

      <div ref={trackRef} onScroll={onScroll} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-roledescription="carrousel" aria-label="Le Conseil de la guilde">
        {slides.map((rank) => {
          const member = byRank[rank]
          return (
            <div key={rank} className="w-[78%] shrink-0 snap-start sm:w-[300px]">
              {member ? <CouncilFilledCard rank={rank} member={member} /> : <CouncilVacantCard rank={rank} onApply={onApply} />}
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-1">
        {slides.map((rank, i) => (
          <button key={rank} type="button" onClick={() => scrollToIndex(i)} aria-label={`Aller au slot ${RANK_META[rank].label}`} aria-current={active === i} className="flex h-11 w-11 items-center justify-center">
            <span className={`block rounded-full transition-all ${active === i ? 'h-2.5 w-6 bg-accent' : 'h-2.5 w-2.5 bg-muted-foreground/40'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Recrues validées — rangée compacte (avatars + nom + mini-badge rôle)
// ---------------------------------------------------------------------------
function RecruitsRow({ recruits }: { recruits: GuildPublic[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {recruits.map((r) => {
        const color = ROLE_COLOR[r.role] ?? 'var(--primary)'
        return (
          <div key={r.id} className="flex items-center gap-2.5 rounded-full border border-border bg-card/60 py-1.5 pl-1.5 pr-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-foreground" style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 25%, transparent))` }} aria-hidden="true">
              {initials(r.display_name)}
            </span>
            <span className="min-w-0">
              <span className={`${FONT_BODY} block truncate text-base font-semibold leading-tight text-foreground`}>{r.display_name}</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <span aria-hidden="true">{ROLE_ICON[r.role] ?? '🎮'}</span>
                <span className="truncate">{r.role}</span>
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal formulaire de candidature (accessible : role=dialog, focus trap, Esc)
// ---------------------------------------------------------------------------
type SubmitState = { status: 'idle' | 'loading' | 'error' | 'success'; message?: string }

function ApplyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState<string>('')
  const [apps, setApps] = useState<string[]>([])
  const [pitch, setPitch] = useState('')
  const [contact, setContact] = useState('')
  const [link, setLink] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  const reset = useCallback(() => {
    setDisplayName(''); setRole(''); setApps([]); setPitch(''); setContact(''); setLink(''); setWebsite('')
  }, [])

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement
      const t = setTimeout(() => firstFieldRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  const handleClose = useCallback(() => {
    onClose()
    previouslyFocused.current?.focus()
    if (submit.status === 'success') { reset(); setSubmit({ status: 'idle' }) }
  }, [onClose, submit.status, reset])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); handleClose(); return }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleApp = (app: string) => {
    setApps((prev) => (prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submit.status === 'loading') return
    setSubmit({ status: 'loading' })
    try {
      const res = await fetch('/api/guild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName, role, apps, pitch, contact, link: link.trim() || undefined, website }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.ok) {
        setSubmit({ status: 'success', message: '⚔️ Candidature envoyée — en attente de validation par le Game Master.' })
        reset()
      } else {
        setSubmit({ status: 'error', message: data?.error || 'Une erreur est survenue. Réessaie.' })
      }
    } catch {
      setSubmit({ status: 'error', message: 'Connexion impossible. Vérifie ta connexion et réessaie.' })
    }
  }

  if (!open) return null

  const pitchLen = pitch.length
  const inputCls = 'w-full rounded-md border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm sm:items-center" onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose() }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="guild-modal-title" className={`${FONT_BODY} relative my-8 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl sm:my-0`}>
        <button type="button" onClick={handleClose} aria-label="Fermer" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">✕</button>

        <h2 id="guild-modal-title" className={`${FONT_TITLE} mb-2 pr-8 text-xl font-bold tracking-wide text-foreground`}>▶ Rejoindre la Guilde</h2>
        <p className="mb-5 text-base text-muted-foreground">Présente ta classe. Les recrues validées rejoignent la party publique.</p>

        {submit.status === 'success' ? (
          <div className="rounded-xl border border-success/40 bg-success/10 p-6 text-center">
            <p className="text-lg font-semibold text-success">{submit.message}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setSubmit({ status: 'idle' })} className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent">Envoyer une autre candidature</button>
              <button type="button" onClick={handleClose} className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-110">Fermer</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Ne pas remplir</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            <div>
              <label htmlFor="display_name" className="mb-1.5 block text-sm font-semibold text-foreground">Pseudo / Nom <span className="text-destructive">*</span></label>
              <input ref={firstFieldRef} id="display_name" type="text" required minLength={2} maxLength={60} value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputCls} placeholder="Ton nom de joueur" />
            </div>

            <div>
              <label htmlFor="role" className="mb-1.5 block text-sm font-semibold text-foreground">Rôle / Classe <span className="text-destructive">*</span></label>
              <select id="role" required value={role} onChange={(e) => setRole(e.target.value)} className={inputCls}>
                <option value="" disabled>Choisis ta classe…</option>
                {ROLES.map((r) => <option key={r} value={r}>{ROLE_ICON[r] ? `${ROLE_ICON[r]} ` : ''}{r}</option>)}
              </select>
            </div>

            <fieldset>
              <legend className="mb-1.5 block text-sm font-semibold text-foreground">Apps ralliées <span className="text-destructive">*</span></legend>
              <div className="grid grid-cols-2 gap-2">
                {APPS.map((app) => {
                  const checked = apps.includes(app)
                  return (
                    <label key={app} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors ${checked ? 'border-accent bg-accent/10 text-foreground' : 'border-input text-muted-foreground hover:border-border hover:text-foreground'}`}>
                      <input type="checkbox" className="accent-[color:var(--accent)]" checked={checked} onChange={() => toggleApp(app)} />
                      <span className="truncate">{app}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="pitch" className="mb-1.5 block text-sm font-semibold text-foreground">Ce que j’apporte <span className="text-destructive">*</span></label>
              <textarea id="pitch" required minLength={10} maxLength={280} rows={3} value={pitch} onChange={(e) => setPitch(e.target.value)} className={`${inputCls} resize-none leading-relaxed`} placeholder="Ta valeur ajoutée pour la guilde (10 à 280 caractères)…" />
              <div className={`mt-1 text-right text-sm ${pitchLen > 280 ? 'text-destructive' : 'text-muted-foreground'}`}>{pitchLen}/280</div>
            </div>

            <div>
              <label htmlFor="contact" className="mb-1.5 block text-sm font-semibold text-foreground">Contact (email / WhatsApp) <span className="text-destructive">*</span></label>
              <input id="contact" type="text" required minLength={5} maxLength={120} value={contact} onChange={(e) => setContact(e.target.value)} className={inputCls} placeholder="ton@email.com ou +213…" />
              <p className="mt-1 text-sm text-muted-foreground">Privé — visible uniquement par le Game Master.</p>
            </div>

            <div>
              <label htmlFor="link" className="mb-1.5 block text-sm font-semibold text-foreground">Lien (portfolio, profil) <span className="text-muted-foreground">— optionnel</span></label>
              <input id="link" type="url" maxLength={200} value={link} onChange={(e) => setLink(e.target.value)} className={inputCls} placeholder="https://…" />
            </div>

            {submit.status === 'error' && (
              <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{submit.message}</p>
            )}

            <button type="submit" disabled={submit.status === 'loading'} className="w-full rounded-lg px-4 py-3 text-base font-bold tracking-wide text-warning-foreground shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" style={{ backgroundImage: 'linear-gradient(135deg, var(--warning), var(--chart-1))' }}>
              {submit.status === 'loading' ? 'Envoi en cours…' : '⚔️ Envoyer ma candidature'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section guilde CONDENSÉE (clôture de page, juste avant le footer)
// ---------------------------------------------------------------------------
const CTA_STYLE = { backgroundImage: 'linear-gradient(135deg, var(--warning), var(--chart-1))' } as const

export function GuildClient({
  roster, dbError,
}: {
  roster: GuildPublic[]
  counts: Record<string, number>
  dbError: boolean
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const memberCount = roster.length
  const isSquad = memberCount >= 1

  const byRank = useMemo(() => {
    const m: Partial<Record<Rank, GuildPublic>> = {}
    for (const r of roster) if (r.rank) m[r.rank] = r
    return m
  }, [roster])
  const recruits = useMemo(() => roster.filter((r) => r.rank == null), [roster])

  const openModal = useCallback(() => setModalOpen(true), [])

  return (
    <section id="guilde" className={`${FONT_BODY} border-t border-border bg-card/20 px-4 py-16 text-foreground`}>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={`${FONT_TITLE} text-2xl font-bold tracking-wide text-foreground`}>◢ Rejoindre la Guilde</h2>
          <span className={`${FONT_MONO} inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold ${isSquad ? 'border-success/50 bg-success/10 text-success' : 'border-border bg-muted/40 text-muted-foreground'}`}>
            <span className={`h-2 w-2 rounded-full ${isSquad ? 'bg-success' : 'bg-muted-foreground'}`} aria-hidden="true" />
            {isSquad ? `SQUAD · ${memberCount}` : 'SOLO'}
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
          L’écosystème se construit en équipe. Tu rejoins la guilde si un projet t’accroche — choisis ta classe et rallie la mission.
        </p>

        {dbError && (
          <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">Roster temporairement indisponible. Tu peux quand même postuler.</p>
        )}

        {/* Conseil — carrousel compact, moteur du FOMO */}
        <CouncilCarousel byRank={byRank} onApply={openModal} />

        {/* Recrues validées — rangée compacte */}
        {recruits.length > 0 ? (
          <RecruitsRow recruits={recruits} />
        ) : (
          <p className="mt-5 text-base text-muted-foreground">Sois la première recrue de la guilde.</p>
        )}

        {/* CTA principal unique */}
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={openModal} className="rounded-lg px-6 py-3 text-base font-bold tracking-wide text-warning-foreground shadow-lg transition-all hover:brightness-110" style={CTA_STYLE}>
            ▶ Rejoindre la guilde
          </button>
        </div>
      </div>

      <ApplyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
