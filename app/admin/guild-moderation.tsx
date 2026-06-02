'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, Clock, Mail, Link2, AlertCircle, Users } from 'lucide-react'
import { ROLE_ICON, type GuildAdmin, type GuildStatus } from '@/lib/guild'

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

export function GuildModeration({
  initialGuild, dbError,
}: {
  initialGuild: GuildAdmin[]
  dbError: boolean
}) {
  const [apps, setApps] = useState(initialGuild)
  const [filter, setFilter] = useState<GuildStatus>('pending')
  const [busyId, setBusyId] = useState<number | null>(null)

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const a of apps) c[a.status] = (c[a.status] || 0) + 1
    return c
  }, [apps])

  const filtered = useMemo(() => apps.filter((a) => a.status === filter), [apps, filter])

  const moderate = async (id: number, action: 'approve' | 'reject') => {
    setBusyId(id)
    const prev = apps
    const newStatus: GuildStatus = action === 'approve' ? 'approved' : 'rejected'
    setApps((list) =>
      list.map((a) => (a.id === id ? { ...a, status: newStatus, reviewed_at: new Date().toISOString() } : a)),
    )
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
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
              filter === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
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
                      <Badge variant="outline" className={STATUS_META[a.status].className}>
                        {STATUS_META[a.status].label}
                      </Badge>
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
                    {a.apps.map((app) => (
                      <Badge key={app} variant="secondary" className="font-normal">{app}</Badge>
                    ))}
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
                      <a href={a.link} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline">
                        {a.link}
                      </a>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                  <Button
                    size="sm" variant="default"
                    disabled={busyId === a.id || a.status === 'approved'}
                    onClick={() => moderate(a.id, 'approve')}
                  >
                    <Check className="mr-1.5 h-4 w-4" /> Valider
                  </Button>
                  <Button
                    size="sm" variant="outline"
                    disabled={busyId === a.id || a.status === 'rejected'}
                    onClick={() => moderate(a.id, 'reject')}
                    className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="mr-1.5 h-4 w-4" /> Rejeter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
