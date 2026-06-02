'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  ROLES, APPS, ROLE_ICON, ROLE_COLOR, RANK_META, type Rank, type GuildPublic,
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
// Carte recrue normale (rank null) — style .project-card
// ---------------------------------------------------------------------------
function RecruitCard({ recruit }: { recruit: GuildPublic }) {
  const color = ROLE_COLOR[recruit.role] ?? 'var(--primary)'
  return (
    <article className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_30px_-8px_var(--accent)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-foreground shadow-inner"
          style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 25%, transparent))` }}
          aria-hidden="true"
        >
          {initials(recruit.display_name)}
        </div>
        <div className="min-w-0">
          <h3 className={`${FONT_TITLE} truncate text-lg font-bold tracking-wide text-foreground`}>
            {recruit.display_name}
          </h3>
          <span className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <span aria-hidden="true">{ROLE_ICON[recruit.role] ?? '🎮'}</span>
            <span className="truncate">{recruit.role}</span>
          </span>
        </div>
      </div>

      {recruit.apps.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {recruit.apps.map((app) => (
            <span key={app} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
              {app}
            </span>
          ))}
        </div>
      )}

      <p className={`${FONT_BODY} text-base leading-relaxed text-foreground/90`}>{recruit.pitch}</p>

      {recruit.link && (
        <a
          href={recruit.link}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-auto inline-flex w-fit items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Profil <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  )
}

// ---------------------------------------------------------------------------
// Carte officier du Conseil (rank != null) — Maître = premium, autres = officier
// ---------------------------------------------------------------------------
function CouncilCard({ recruit, variant }: { recruit: GuildPublic; variant: 'master' | 'officer' }) {
  const rank = recruit.rank as Rank
  const meta = RANK_META[rank]
  const color = `var(${meta.colorVar})`
  const isMaster = variant === 'master'

  return (
    <article
      className={`group relative flex flex-col gap-4 rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        isMaster ? 'border-2 p-7' : 'p-6'
      }`}
      style={{
        borderColor: `color-mix(in srgb, ${color} 60%, transparent)`,
        boxShadow: `0 0 ${isMaster ? '48px -10px' : '34px -12px'} ${color}`,
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold"
          style={{
            color,
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
          }}
        >
          <span aria-hidden="true">{meta.icon}</span> {meta.label}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl font-bold text-foreground shadow-inner ${
            isMaster ? 'h-16 w-16 text-2xl' : 'h-14 w-14 text-xl'
          }`}
          style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 25%, transparent))` }}
          aria-hidden="true"
        >
          {initials(recruit.display_name)}
        </div>
        <div className="min-w-0">
          <h3 className={`${FONT_TITLE} font-bold tracking-wide text-foreground ${isMaster ? 'text-2xl' : 'text-xl'}`}>
            {recruit.display_name}
          </h3>
          <p className="mt-1 inline-flex items-center gap-1.5 text-base text-muted-foreground">
            <span aria-hidden="true">{ROLE_ICON[recruit.role] ?? '🎮'}</span>
            <span>{recruit.role}</span>
          </p>
        </div>
      </div>

      {recruit.apps.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recruit.apps.map((app) => (
            <span
              key={app}
              className="rounded-full px-2.5 py-0.5 text-sm font-medium"
              style={{
                color,
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
              }}
            >
              {app}
            </span>
          ))}
        </div>
      )}

      <p className={`${FONT_BODY} text-base leading-relaxed text-foreground/90 ${isMaster ? 'sm:text-lg' : ''}`}>
        {recruit.pitch}
      </p>

      {recruit.link && (
        <a
          href={recruit.link}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-auto inline-flex w-fit items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:text-foreground"
          style={{ borderColor: `color-mix(in srgb, ${color} 50%, transparent)` }}
        >
          Profil <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
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
        body: JSON.stringify({
          display_name: displayName, role, apps, pitch, contact,
          link: link.trim() || undefined, website,
        }),
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
  const inputCls =
    'w-full rounded-md border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30'

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guild-modal-title"
        className={`${FONT_BODY} relative my-8 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl sm:my-0`}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          ✕
        </button>

        <h2 id="guild-modal-title" className={`${FONT_TITLE} mb-2 pr-8 text-xl font-bold tracking-wide text-foreground`}>
          ▶ Rejoindre la Guilde
        </h2>
        <p className="mb-5 text-base text-muted-foreground">
          Présente ta classe. Les recrues validées rejoignent la party publique.
        </p>

        {submit.status === 'success' ? (
          <div className="rounded-xl border border-success/40 bg-success/10 p-6 text-center">
            <p className="text-lg font-semibold text-success">{submit.message}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmit({ status: 'idle' })}
                className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Envoyer une autre candidature
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-110"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Honeypot anti-bot : invisible, hors-écran, exclu du tab et du lecteur d'écran */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Ne pas remplir</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            <div>
              <label htmlFor="display_name" className="mb-1.5 block text-sm font-semibold text-foreground">
                Pseudo / Nom <span className="text-destructive">*</span>
              </label>
              <input
                ref={firstFieldRef}
                id="display_name" type="text" required minLength={2} maxLength={60}
                value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                className={inputCls} placeholder="Ton nom de joueur"
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-1.5 block text-sm font-semibold text-foreground">
                Rôle / Classe <span className="text-destructive">*</span>
              </label>
              <select id="role" required value={role} onChange={(e) => setRole(e.target.value)} className={inputCls}>
                <option value="" disabled>Choisis ta classe…</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_ICON[r] ? `${ROLE_ICON[r]} ` : ''}{r}</option>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className="mb-1.5 block text-sm font-semibold text-foreground">
                Apps ralliées <span className="text-destructive">*</span>
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {APPS.map((app) => {
                  const checked = apps.includes(app)
                  return (
                    <label
                      key={app}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                        checked ? 'border-accent bg-accent/10 text-foreground' : 'border-input text-muted-foreground hover:border-border hover:text-foreground'
                      }`}
                    >
                      <input type="checkbox" className="accent-[color:var(--accent)]" checked={checked} onChange={() => toggleApp(app)} />
                      <span className="truncate">{app}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="pitch" className="mb-1.5 block text-sm font-semibold text-foreground">
                Ce que j’apporte <span className="text-destructive">*</span>
              </label>
              <textarea
                id="pitch" required minLength={10} maxLength={280} rows={3}
                value={pitch} onChange={(e) => setPitch(e.target.value)}
                className={`${inputCls} resize-none leading-relaxed`}
                placeholder="Ta valeur ajoutée pour la guilde (10 à 280 caractères)…"
              />
              <div className={`mt-1 text-right text-sm ${pitchLen > 280 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {pitchLen}/280
              </div>
            </div>

            <div>
              <label htmlFor="contact" className="mb-1.5 block text-sm font-semibold text-foreground">
                Contact (email / WhatsApp) <span className="text-destructive">*</span>
              </label>
              <input
                id="contact" type="text" required minLength={5} maxLength={120}
                value={contact} onChange={(e) => setContact(e.target.value)}
                className={inputCls} placeholder="ton@email.com ou +213…"
              />
              <p className="mt-1 text-sm text-muted-foreground">Privé — visible uniquement par le Game Master.</p>
            </div>

            <div>
              <label htmlFor="link" className="mb-1.5 block text-sm font-semibold text-foreground">
                Lien (portfolio, profil) <span className="text-muted-foreground">— optionnel</span>
              </label>
              <input id="link" type="url" maxLength={200} value={link} onChange={(e) => setLink(e.target.value)} className={inputCls} placeholder="https://…" />
            </div>

            {submit.status === 'error' && (
              <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                {submit.message}
              </p>
            )}

            <button
              type="submit"
              disabled={submit.status === 'loading'}
              className="w-full rounded-lg px-4 py-3 text-base font-bold tracking-wide text-warning-foreground shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundImage: 'linear-gradient(135deg, var(--warning), var(--chart-1))' }}
            >
              {submit.status === 'loading' ? 'Envoi en cours…' : '⚔️ Envoyer ma candidature'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page principale : HUD + Conseil + classes recherchées + roster
// ---------------------------------------------------------------------------
const CTA_STYLE = { backgroundImage: 'linear-gradient(135deg, var(--warning), var(--chart-1))' } as const

export function GuildClient({
  roster, counts, dbError,
}: {
  roster: GuildPublic[]
  counts: Record<string, number>
  dbError: boolean
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const memberCount = roster.length
  const isSquad = memberCount >= 1
  const openPosts = ROLES.filter((r) => (counts[r] || 0) === 0).length

  // Sépare le Conseil (rank != null) des recrues normales.
  const council = useMemo(
    () =>
      roster
        .filter((r): r is GuildPublic & { rank: Rank } => r.rank != null)
        .sort((a, b) => RANK_META[a.rank].order - RANK_META[b.rank].order),
    [roster],
  )
  const master = council.find((r) => r.rank === 'maitre')
  const officers = council.filter((r) => r.rank !== 'maitre')
  const recruits = useMemo(() => roster.filter((r) => r.rank == null), [roster])

  const openModal = () => setModalOpen(true)

  return (
    <section className={`${FONT_BODY} relative min-h-[100dvh] bg-background px-4 pb-24 pt-28 text-foreground`}>
      <div className="mx-auto max-w-5xl">
        {/* ---------------- HUD ---------------- */}
        <header className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${FONT_MONO} rounded border border-accent/40 bg-accent/10 px-2.5 py-1 text-sm uppercase tracking-widest text-accent`}>
              GenZ Guild · Recrutement
            </span>
          </div>
          <h1 className={`${FONT_TITLE} mt-4 text-3xl font-bold leading-tight tracking-wide text-foreground sm:text-4xl`}>
            Rejoins la Guilde
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            L’écosystème GenZ Apps se construit en équipe. Ambassadeurs, tech leads, partenaires,
            créateurs — choisis ta classe et rallie la mission.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div
              className={`${FONT_MONO} inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold ${
                isSquad ? 'border-success/50 bg-success/10 text-success' : 'border-border bg-muted/40 text-muted-foreground'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isSquad ? 'bg-success' : 'bg-muted-foreground'}`} aria-hidden="true" />
              {isSquad ? `MODE: SQUAD · ${memberCount} membre${memberCount > 1 ? 's' : ''}` : 'MODE: SOLO'}
            </div>
            <div className={`${FONT_MONO} inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground`}>
              {openPosts} poste{openPosts > 1 ? 's' : ''} ouvert{openPosts > 1 ? 's' : ''}
            </div>
            <button
              type="button"
              onClick={openModal}
              className="ml-auto rounded-lg px-5 py-2.5 text-sm font-bold tracking-wide text-warning-foreground shadow-lg transition-all hover:brightness-110"
              style={CTA_STYLE}
            >
              ▶ REJOINDRE LA GUILDE
            </button>
          </div>

          {master && (
            <p className="mt-4 inline-flex items-center gap-2 text-base text-muted-foreground">
              <span aria-hidden="true">👑</span>
              Guilde menée par <span className="font-semibold text-foreground">{master.display_name}</span>
            </p>
          )}

          {dbError && (
            <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              Roster temporairement indisponible. Tu peux quand même postuler.
            </p>
          )}
        </header>

        {/* ---------------- LE CONSEIL (officiers) ---------------- */}
        {council.length > 0 && (
          <div className="mt-12">
            <h2 className={`${FONT_TITLE} text-2xl font-bold tracking-wide text-foreground`}>◢ Le Conseil</h2>
            <p className="mt-2 text-base text-muted-foreground">Les officiers qui mènent la guilde.</p>

            {master && (
              <div className="mt-6">
                <CouncilCard recruit={master} variant="master" />
              </div>
            )}

            {officers.length > 0 && (
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {officers.map((officer) => (
                  <CouncilCard key={officer.id} recruit={officer} variant="officer" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- Classes recherchées ---------------- */}
        <div className="mt-12">
          <h2 className={`${FONT_TITLE} text-xl font-bold tracking-wide text-foreground`}>◣ Classes recherchées</h2>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ROLES.map((r) => {
              const n = counts[r] || 0
              const filled = n > 0
              return (
                <div key={r} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/50 px-4 py-3">
                  <span className="flex min-w-0 items-center gap-2 text-base text-foreground">
                    <span aria-hidden="true">{ROLE_ICON[r] ?? '🎮'}</span>
                    <span className="truncate">{r}</span>
                  </span>
                  {filled ? (
                    <span className="shrink-0 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-sm font-semibold text-success">
                      {n} rallié{n > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-1 text-sm font-semibold text-destructive">
                      POSTE OUVERT
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ---------------- LA GUILDE (recrues normales) ---------------- */}
        <div className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className={`${FONT_TITLE} text-2xl font-bold tracking-wide text-foreground`}>◢ La Guilde</h2>
            {isSquad && (
              <span className="text-base text-muted-foreground">
                {memberCount} membre{memberCount > 1 ? 's' : ''} actif{memberCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {memberCount === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
              <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground">
                La guilde recrute ses premiers membres. Sois le premier à rejoindre la mission.
              </p>
              <button type="button" onClick={openModal} className="mt-5 rounded-lg px-5 py-2.5 text-sm font-bold tracking-wide text-warning-foreground shadow-lg transition-all hover:brightness-110" style={CTA_STYLE}>
                ▶ REJOINDRE LA GUILDE
              </button>
            </div>
          ) : recruits.length === 0 ? (
            <p className="mt-6 text-base text-muted-foreground">
              Tous les membres actuels siègent au Conseil. La guilde recrute de nouvelles recrues.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recruits.map((recruit) => (
                <RecruitCard key={recruit.id} recruit={recruit} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ApplyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
