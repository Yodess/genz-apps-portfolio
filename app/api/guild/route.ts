import { NextRequest, NextResponse } from 'next/server'
import {
  validateApplication,
  insertGuildApplication,
  countRecentByIpHash,
  listGuildPublic,
  countByRole,
  hashIp,
} from '@/lib/guild'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RATE_LIMIT_MAX = 3 // soumissions par heure et par hash IP

// ---------------------------------------------------------------------------
// POST — soumission d'une candidature
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  // Anti-bot : honeypot caché « website ». Rempli → 200 factice, aucun insert.
  const website = (body as Record<string, unknown>)?.website
  if (typeof website === 'string' && website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  // Validation serveur stricte (whitelists, longueurs, format lien).
  const result = validateApplication(body)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  // Rate limit : sha256 de la 1re IP de x-forwarded-for. On ne stocke que le hash.
  const ipHash = hashIp(request.headers.get('x-forwarded-for'))
  try {
    const recent = await countRecentByIpHash(ipHash)
    if (recent >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: 'Trop de candidatures envoyées. Réessaie dans une heure.' },
        { status: 429 },
      )
    }
    await insertGuildApplication(result.value, ipHash)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[api/guild] POST erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// GET — roster public (approuvés uniquement, JAMAIS le contact)
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const roster = await listGuildPublic()
    const counts = countByRole(roster)
    return NextResponse.json({ roster, counts })
  } catch (error) {
    console.error('[api/guild] GET erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
