'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, Clock, Mail, Link2, AlertCircle, Users, Pencil, Shield, ChevronDown } from 'lucide-react'
import {
  ROLE_ICON, ROLES, APPS, RANKS, RANK_META,
  type GuildAdmin, type GuildStatus, type Rank,
} from '@/lib/guild'

const STATUS_META: Record<GuildStatus, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-warning/15 text-warning border-warning/30' },
  approved: { label: 'Validée', className: 'bg-success/15 text-success border-success/30' },
  rejected: { label: 'Rejetée', className: 'bg-destructive/15 text-destructive border-destructive/30' },
}

const FILTERS: { key: GuildStatus; label: string }[] = [
  { key: 'pending', label: 'En attente' },
  { key: 'approved', label: 'Validées' },
  { key: 'rejected', label: 'Rejetées' },
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-DZ', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// ---------------------------------------------------------------------------
// Formulaire d'édition inline (PUT)
// ---------------------------------------------------------------------------
function EditForm({ app, onCancel, onSaved }: { app: GuildAdmin; onCancel: () => void; onSaved: () => void }) {
  const [displayName, setDisplayName] = useState(app.display_name)
  const [role, setRole] = useState(app.role)
  const [apps, setApps] = useState<string[]>(app.apps)
  const [pitch, setPitch] = useState(app.pitch)
  const [link, setLink] = useState(app.link ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleApp = (a: string) => setApps((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]))

  const inputCls = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30'

  const save = async () => {
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/guild/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: app.id, display_name: displayName, role, apps, pitch, link: link.trim() || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.ok) onSaved()
      else setError(data?.error || 'Échec de l’enregistrement.')
    } catch {
      setError('Connexion impossible.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
      <div>
        <label htmlFor={`edit-name-${app.id}`} className="mb-1 block text-sm font-semibold">Pseudo / Nom</label>
        <input id={`edit-name-${app.id}`} className={inputCls} value={displayName} maxLength={60} onChange={(e) => setDisplayName(e.target.value)} />
      </div>
      <div>
        <label htmlFor={`edit-role-${app.id}`} className="mb-1 block text-sm font-semibold">Rôle</label>
        <select id={`edit-role-${app.id}`} className={inputCls} value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <span className="mb-1 block text-sm font-semibold">Apps</span>
        <div className="grid grid-cols-2 gap-1.5">
          {APPS.map((a) => {
            const checked = apps.includes(a)
            return (
              <label key={a} className={`flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm ${checked ? 'border-accent bg-accent/10' : 'border-input text-muted-foreground'}`}>
                <input type="checkbox" className="accent-[color:var(--accent)]" checked={checked} onChange={() => toggleApp(a)} />
                <span className="truncate">{a}</span>
              </label>
            )
          })}
        </div>
      </div>
      <div>
        <label htmlFor={`edit-pitch-${app.id}`} className="mb-1 block text-sm font-semibold">Pitch</label>
        <textarea id={`edit-pitch-${app.id}`} className={`${inputCls} resize-none`} rows={3} maxLength={280} value={pitch} onChange={(e) => setPitch(e.target.value)} />
        <div className={`mt-1 text-right text-sm ${pitch.length > 280 ? 'text-destructive' : 'text-muted-foreground'}`}>{pitch.length}/280</div>
      </div>
      <div>
        <label htmlFor={`edit-link-${app.id}`} className="mb-1 block text-sm font-semibold">Lien (optionnel)</label>
        <input id={`edit-link-${app.id}`} className={inputCls} value={link} maxLength={200} placeholder="https://…" onChange={(e) => setLink(e.target.value)} />
      </div>
      {error && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={save} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        <Button size="sm" variant="ghost" onClick={onCancel} disabled={saving}>Annuler</Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Barre de promotion (POST {id, rank})
// ---------------------------------------------------------------------------
function RankBar({
  app, holders, busy, onSetRank,
}: {
  app: GuildAdmin
  holders: Partial<Record<Rank, GuildAdmin>>
  busy: boolean
  onSetRank: (rank: Rank | null) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-3 rounded-lg border border-border bg-muted/20 p-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 text-sm font-semibold text-foreground"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          {app.rank ? `Rang actuel : ${RANK_META[app.rank].icon} ${RANK_META[app.rank].label}` : 'Promouvoir au Conseil'}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {RANKS.map((rank) => {
            const meta = RANK_META[rank]
            const holder = holders[rank]
            const isThis = app.rank === rank
            const heldByOther = holder && holder.id !== app.id
            return (
              <div key={rank} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2">
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-foreground">{meta.icon} {meta.label}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {holder ? `occupé par ${holder.id === app.id ? 'ce membre' : holder.display_name}` : 'libre'}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant={isThis ? 'secondary' : 'outline'}
                  disabled={busy || isThis}
                  onClick={() => onSetRank(rank)}
                  title={heldByOther ? `Reprendra le rang à ${holder!.display_name}` : undefined}
                >
                  {isThis ? 'Rang actuel' : heldByOther ? 'Réattribuer' : 'Assigner'}
                </Button>
              </div>
            )
          })}

          {app.rank && (
            <Button
              size="sm" variant="outline" disabled={busy}
              onClick={() => onSetRank(null)}
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Rétrograder en recrue
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modération principale
// ---------------------------------------------------------------------------
export function GuildModeration({ initialGuild, dbError }: { initialGuild: GuildAdmin[]; dbError: boolean }) {
  const [apps, setApps] = useState(initialGuild)
  const [filter, setFilter] = useState<GuildStatus>('pending')
  const [busyId, setBusyId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const a of apps) c[a.status] = (c[a.status] || 0) + 1
    return c
  }, [apps])

  const holders = useMemo(() => {
    const m: Partial<Record<Rank, GuildAdmin>> = {}
    for (const a of apps) if (a.rank) m[a.rank] = a
    return m
  }, [apps])

  const filtered = useMemo(() => apps.filter((a) => a.status === filter), [apps, filter])

  // Re-synchronise depuis le serveur (après édition / changement de rang) sans reload.
  const refresh = async () => {
    try {
      const res = await fetch('/api/guild/admin', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.applications)) setApps(data.applications as GuildAdmin[])
      }
    } catch { /* silencieux : l'état local reste affiché */ }
  }

  const moderate = async (id: number, action: 'approve' | 'reject') => {
    setBusyId(id)
    const prev = apps
    const newStatus: GuildStatus = action === 'approve' ? 'approved' : 'rejected'
    setApps((list) => list.map((a) => (a.id === id ? { ...a, status: newStatus, reviewed_at: new Date().toISOString() } : a)))
    try {
      const res = await fetch('/api/guild/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      if (!res.ok) setApps(prev)
    } catch {
      setApps(prev)
    } finally {
      setBusyId(null)
    }
  }

  const setRank = async (id: number, rank: Rank | null) => {
    setBusyId(id)
    try {
      const res = await fetch('/api/guild/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, rank }),
      })
      if (res.ok) await refresh()
    } catch { /* no-op */ }
    finally { setBusyId(null) }
  }

  return (
    <div>
      {dbError && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Connexion DB impossible. Vérifie DATABASE_URL sur Vercel.</span>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${filter === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            {f.label}{counts[f.key] ? ` (${counts[f.key]})` : ''}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <Users className="mx-auto mb-4 h-12 w-12 opacity-40" />
          <p>Aucune candidature {filter === 'pending' ? 'en attente' : filter === 'approved' ? 'validée' : 'rejetée'}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <Card key={a.id} className={a.status === 'pending' ? 'border-warning/40' : ''}>
              <CardContent className="p-5">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{a.display_name}</span>
                      <Badge variant="outline" className={STATUS_META[a.status].className}>{STATUS_META[a.status].label}</Badge>
                      {a.rank && (
                        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                          {RANK_META[a.rank].icon} {RANK_META[a.rank].label}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span aria-hidden="true">{ROLE_ICON[a.role] ?? '🎮'}</span>
                      <span>{a.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />{formatDate(a.created_at)}
                  </div>
                </div>

                {a.apps.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {a.apps.map((app) => <Badge key={app} variant="secondary" className="font-normal">{app}</Badge>)}
                  </div>
                )}

                <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{a.pitch}</p>

                {/* Contact privé — visible UNIQUEMENT dans l'admin protégé */}
                <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <a href={`mailto:${a.contact}`} className="text-primary hover:underline">{a.contact}</a>
                  </span>
                  {a.link && (
                    <span className="inline-flex items-center gap-1.5 text-foreground">
                      <Link2 className="h-3.5 w-3.5 text-primary" />
                      <a href={a.link} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline">{a.link}</a>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                  <Button size="sm" variant="default" disabled={busyId === a.id || a.status === 'approved'} onClick={() => moderate(a.id, 'approve')}>
                    <Check className="mr-1.5 h-4 w-4" /> Valider
                  </Button>
                  <Button size="sm" variant="outline" disabled={busyId === a.id || a.status === 'rejected'} onClick={() => moderate(a.id, 'reject')} className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <X className="mr-1.5 h-4 w-4" /> Rejeter
                  </Button>
                  <Button size="sm" variant="ghost" disabled={busyId === a.id} onClick={() => setEditingId(editingId === a.id ? null : a.id)}>
                    <Pencil className="mr-1.5 h-4 w-4" /> Éditer
                  </Button>
                </div>

                {editingId === a.id && (
                  <EditForm app={a} onCancel={() => setEditingId(null)} onSaved={() => { setEditingId(null); refresh() }} />
                )}

                <RankBar app={a} holders={holders} busy={busyId === a.id} onSetRank={(rank) => setRank(a.id, rank)} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
