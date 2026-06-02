import { createHash } from 'crypto'
import { sql } from './db'

// ---------------------------------------------------------------------------
// Constantes métier (whitelists strictes — validées côté serveur)
// ---------------------------------------------------------------------------
export const ROLES = [
  'Architecte / Tech lead', 'Comptable', 'Partenaire financier', 'Content creator',
  'Ambassadeur ArtisanaDZ', 'Ambassadeur Makine', 'Ambassadeur Kodiane',
  'Ambassadeur QuranLearn', 'Ambassadeur ComptaApp', 'Ambassadeur Reda Photo',
] as const
export type Role = (typeof ROLES)[number]

export const APPS = [
  'ArtisanaDZ', 'Makine', 'Kodiane', 'QuranLearn', 'ComptaApp', 'Reda Photo', 'Genz-Incub', 'Tout l’écosystème',
] as const
export type App = (typeof APPS)[number]

export const ROLE_ICON: Record<string, string> = {
  'Architecte / Tech lead': '🏛️', 'Comptable': '🧮', 'Partenaire financier': '💰', 'Content creator': '🎬',
  'Ambassadeur ArtisanaDZ': '🔨', 'Ambassadeur Makine': '🛠️', 'Ambassadeur Kodiane': '🛒',
  'Ambassadeur QuranLearn': '📖', 'Ambassadeur ComptaApp': '📊', 'Ambassadeur Reda Photo': '📷',
}

// Couleur de « classe » par rôle — uniquement des tokens de design EXISTANTS
// (aucune couleur inventée). Sert au dégradé des pastilles d'initiales.
export const ROLE_COLOR: Record<string, string> = {
  'Architecte / Tech lead': 'var(--primary)',
  'Comptable': 'var(--accent)',
  'Partenaire financier': 'var(--warning)',
  'Content creator': 'var(--chart-4)',
  'Ambassadeur ArtisanaDZ': 'var(--chart-1)',
  'Ambassadeur Makine': 'var(--chart-5)',
  'Ambassadeur Kodiane': 'var(--chart-2)',
  'Ambassadeur QuranLearn': 'var(--success)',
  'Ambassadeur ComptaApp': 'var(--primary)',
  'Ambassadeur Reda Photo': 'var(--chart-3)',
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type GuildStatus = 'pending' | 'approved' | 'rejected'

/** Recrue exposée publiquement — JAMAIS de contact ni d'ip_hash. */
export interface GuildPublic {
  id: number
  display_name: string
  role: string
  apps: string[]
  pitch: string
  link: string | null
}

/** Vue admin — inclut le contact privé et le statut. */
export interface GuildAdmin extends GuildPublic {
  contact: string
  status: GuildStatus
  created_at: string
  reviewed_at: string | null
}

// ---------------------------------------------------------------------------
// Validation serveur (ne JAMAIS faire confiance au client)
// ---------------------------------------------------------------------------
export interface ValidatedApplication {
  display_name: string
  role: Role
  apps: App[]
  pitch: string
  contact: string
  link: string | null
}

type ValidationResult =
  | { ok: true; value: ValidatedApplication }
  | { ok: false; error: string }

export function validateApplication(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Requête invalide.' }
  }
  const b = body as Record<string, unknown>

  const display_name = typeof b.display_name === 'string' ? b.display_name.trim() : ''
  if (display_name.length < 2 || display_name.length > 60) {
    return { ok: false, error: 'Le pseudo doit faire entre 2 et 60 caractères.' }
  }

  const role = typeof b.role === 'string' ? b.role.trim() : ''
  if (!(ROLES as readonly string[]).includes(role)) {
    return { ok: false, error: 'Rôle invalide.' }
  }

  if (!Array.isArray(b.apps)) {
    return { ok: false, error: 'Apps invalides.' }
  }
  const apps = b.apps.filter((a): a is string => typeof a === 'string')
  if (apps.length < 1 || apps.length > 8) {
    return { ok: false, error: 'Sélectionne entre 1 et 8 apps.' }
  }
  if (!apps.every((a) => (APPS as readonly string[]).includes(a))) {
    return { ok: false, error: 'Une app sélectionnée est invalide.' }
  }
  // dédoublonnage
  const uniqueApps = Array.from(new Set(apps)) as App[]

  const pitch = typeof b.pitch === 'string' ? b.pitch.trim() : ''
  if (pitch.length < 10 || pitch.length > 280) {
    return { ok: false, error: 'Ton pitch doit faire entre 10 et 280 caractères.' }
  }

  const contact = typeof b.contact === 'string' ? b.contact.trim() : ''
  if (contact.length < 5 || contact.length > 120) {
    return { ok: false, error: 'Le contact doit faire entre 5 et 120 caractères.' }
  }

  let link: string | null = null
  if (typeof b.link === 'string' && b.link.trim().length > 0) {
    const l = b.link.trim()
    if (l.length > 200 || !/^https?:\/\//.test(l)) {
      return { ok: false, error: 'Le lien doit commencer par http:// ou https:// (200 car. max).' }
    }
    link = l
  }

  return { ok: true, value: { display_name, role: role as Role, apps: uniqueApps, pitch, contact, link } }
}

// ---------------------------------------------------------------------------
// Sécurité — hash IP (on ne stocke jamais l'IP brute)
// ---------------------------------------------------------------------------
export function hashIp(forwardedFor: string | null): string {
  const first = (forwardedFor || '').split(',')[0].trim() || 'unknown'
  return createHash('sha256').update(first).digest('hex')
}

// ---------------------------------------------------------------------------
// Accès base de données — requêtes paramétrées uniquement
// ---------------------------------------------------------------------------

/** Nombre de soumissions du même hash IP sur la dernière heure (rate limit). */
export async function countRecentByIpHash(ipHash: string): Promise<number> {
  const rows = await sql`
    SELECT count(*)::int AS n
    FROM guild_applications
    WHERE ip_hash = ${ipHash}
      AND created_at > NOW() - INTERVAL '1 hour'
  `
  return (rows[0]?.n as number) ?? 0
}

export async function insertGuildApplication(
  data: ValidatedApplication,
  ipHash: string,
): Promise<void> {
  await sql`
    INSERT INTO guild_applications (display_name, role, apps, pitch, contact, link, ip_hash, status)
    VALUES (
      ${data.display_name}, ${data.role}, ${JSON.stringify(data.apps)}, ${data.pitch},
      ${data.contact}, ${data.link}, ${ipHash}, 'pending'
    )
  `
}

/** Roster public : approuvés uniquement, JAMAIS le contact. */
export async function listGuildPublic(): Promise<GuildPublic[]> {
  const rows = await sql`
    SELECT id, display_name, role, apps, pitch, link
    FROM guild_applications
    WHERE status = 'approved'
    ORDER BY created_at DESC
  `
  return rows.map((r) => ({
    id: r.id as number,
    display_name: r.display_name as string,
    role: r.role as string,
    apps: Array.isArray(r.apps) ? (r.apps as string[]) : [],
    pitch: r.pitch as string,
    link: (r.link as string | null) ?? null,
  }))
}

/** Compteur d'approuvés par rôle (pour le HUD « Classes recherchées »). */
export function countByRole(roster: Pick<GuildPublic, 'role'>[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const role of ROLES) counts[role] = 0
  for (const r of roster) counts[r.role] = (counts[r.role] || 0) + 1
  return counts
}

/** Vue admin : toutes les candidatures, contact inclus, pending d'abord. */
export async function listGuildAdmin(): Promise<GuildAdmin[]> {
  const rows = await sql`
    SELECT id, display_name, role, apps, pitch, contact, link, status, created_at, reviewed_at
    FROM guild_applications
    ORDER BY
      CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
      created_at DESC
  `
  return rows.map((r) => ({
    id: r.id as number,
    display_name: r.display_name as string,
    role: r.role as string,
    apps: Array.isArray(r.apps) ? (r.apps as string[]) : [],
    pitch: r.pitch as string,
    contact: r.contact as string,
    link: (r.link as string | null) ?? null,
    status: r.status as GuildStatus,
    created_at: r.created_at as string,
    reviewed_at: (r.reviewed_at as string | null) ?? null,
  }))
}

export async function updateGuildStatus(id: number, status: 'approved' | 'rejected'): Promise<void> {
  await sql`
    UPDATE guild_applications
    SET status = ${status}, reviewed_at = NOW()
    WHERE id = ${id}
  `
}
