'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Clock, LogOut, Inbox, CheckCheck, Archive, Eye, AlertCircle, MessageSquare, Users } from 'lucide-react'
import type { ContactRequest, RequestStatus } from '@/lib/db'
import type { GuildAdmin } from '@/lib/guild'
import { GuildModeration } from './guild-moderation'

const STATUS_META: Record<RequestStatus, { label: string; className: string }> = {
  new: { label: 'Nouveau', className: 'bg-primary/15 text-primary border-primary/30' },
  read: { label: 'Lu', className: 'bg-warning/15 text-warning border-warning/30' },
  replied: { label: 'Répondu', className: 'bg-success/15 text-success border-success/30' },
  archived: { label: 'Archivé', className: 'bg-muted text-muted-foreground border-border' },
}

const PROJECT_LABELS: Record<string, string> = {
  webapp: 'Application web sur mesure',
  pwa: 'PWA',
  consulting: 'Consulting technique',
  other: 'Autre',
}

const BUDGET_LABELS: Record<string, string> = {
  'under-50k': '< 50 000 DZD',
  '50k-150k': '50 000 - 150 000 DZD',
  '150k-400k': '150 000 - 400 000 DZD',
  'over-400k': '> 400 000 DZD',
  unknown: 'Non défini',
}

const FILTERS: { key: RequestStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'new', label: 'Nouvelles' },
  { key: 'read', label: 'Lues' },
  { key: 'replied', label: 'Répondues' },
  { key: 'archived', label: 'Archivées' },
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-DZ', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export function AdminDashboard({
  initialRequests, dbError, initialGuild, guildDbError,
}: {
  initialRequests: ContactRequest[]
  dbError: boolean
  initialGuild: GuildAdmin[]
  guildDbError: boolean
}) {
  const router = useRouter()
  const [view, setView] = useState<'requests' | 'guild'>('requests')
  const [requests, setRequests] = useState(initialRequests)
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all')
  const [busyId, setBusyId] = useState<number | null>(null)

  const guildPending = useMemo(() => initialGuild.filter((g) => g.status === 'pending').length, [initialGuild])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: requests.length }
    for (const r of requests) c[r.status] = (c[r.status] || 0) + 1
    return c
  }, [requests])

  const filtered = useMemo(
    () => (filter === 'all' ? requests : requests.filter((r) => r.status === filter)),
    [requests, filter]
  )

  const setStatus = async (id: number, status: RequestStatus) => {
    setBusyId(id)
    const prev = requests
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)))
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) setRequests(prev)
    } catch {
      setRequests(prev)
    } finally {
      setBusyId(null)
    }
  }

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <main className="min-h-[100dvh] bg-background">
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setView('requests')}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${view === 'requests' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <Inbox className="w-4 h-4" /> Demandes
              <Badge variant="secondary">{counts.all || 0}</Badge>
            </button>
            <button
              onClick={() => setView('guild')}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${view === 'guild' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <Users className="w-4 h-4" /> Guilde
              {guildPending > 0 && (
                <Badge variant="outline" className="bg-warning/15 text-warning border-warning/30">{guildPending}</Badge>
              )}
            </button>
          </nav>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />Déconnexion
          </Button>
        </div>
      </header>

      {view === 'guild' ? (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <GuildModeration initialGuild={initialGuild} dbError={guildDbError} />
        </div>
      ) : (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {dbError && (
          <div className="flex items-center gap-2 text-sm text-destructive mb-6 p-3 rounded-lg border border-destructive/30 bg-destructive/10">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Connexion DB impossible. Vérifie DATABASE_URL sur Vercel.</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all ${filter === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              {f.label}{counts[f.key] ? ` (${counts[f.key]})` : ''}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Inbox className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Aucune demande {filter !== 'all' ? 'dans cette catégorie' : 'pour le moment'}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <Card key={r.id} className={r.status === 'new' ? 'border-primary/40' : ''}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{r.name}</span>
                        <Badge variant="outline" className={STATUS_META[r.status].className}>{STATUS_META[r.status].label}</Badge>
                      </div>
                      <a href={`mailto:${r.email}`} className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1">
                        <Mail className="w-3.5 h-3.5" />{r.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />{formatDate(r.created_at)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="font-normal">{PROJECT_LABELS[r.project_type] || r.project_type}</Badge>
                    {r.budget && (<Badge variant="secondary" className="font-normal">{BUDGET_LABELS[r.budget] || r.budget}</Badge>)}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap mb-4">{r.description}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                    <Button size="sm" variant="default" asChild>
                      <a href={`mailto:${r.email}?subject=Re: votre demande sur GenZ Apps`}>
                        <MessageSquare className="w-4 h-4 mr-1.5" />Répondre
                      </a>
                    </Button>
                    <div className="flex-1" />
                    <Button size="sm" variant="ghost" disabled={busyId === r.id || r.status === 'read'} onClick={() => setStatus(r.id, 'read')}>
                      <Eye className="w-4 h-4 mr-1.5" /> Lu
                    </Button>
                    <Button size="sm" variant="ghost" disabled={busyId === r.id || r.status === 'replied'} onClick={() => setStatus(r.id, 'replied')}>
                      <CheckCheck className="w-4 h-4 mr-1.5" /> Répondu
                    </Button>
                    <Button size="sm" variant="ghost" disabled={busyId === r.id || r.status === 'archived'} onClick={() => setStatus(r.id, 'archived')}>
                      <Archive className="w-4 h-4 mr-1.5" /> Archiver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      )}
    </main>
  )
}
