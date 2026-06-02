import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/admin-auth'
import { listGuildAdmin, updateGuildStatus } from '@/lib/guild'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Réutilise EXACTEMENT le mécanisme d'auth admin existant (cookie de session
// signé HMAC), comme app/api/admin/requests/route.ts. Aucun nouveau système.
function isAuthed(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
}

// ---------------------------------------------------------------------------
// GET — toutes les candidatures (pending d'abord), contact inclus
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  if (!isAuthed(request)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const applications = await listGuildAdmin()
    return NextResponse.json({ applications })
  } catch (error) {
    console.error('[api/guild/admin] GET erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// PATCH — { id, action: 'approve' | 'reject' }
// ---------------------------------------------------------------------------
export async function PATCH(request: NextRequest) {
  if (!isAuthed(request)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const { id, action } = await request.json()
    const numId = Number(id)
    if (!Number.isInteger(numId) || numId <= 0 || (action !== 'approve' && action !== 'reject')) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }
    await updateGuildStatus(numId, action === 'approve' ? 'approved' : 'rejected')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[api/guild/admin] PATCH erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
