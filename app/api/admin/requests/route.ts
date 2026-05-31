import { NextRequest, NextResponse } from 'next/server'
import { listRequests, updateRequestStatus, type RequestStatus } from '@/lib/db'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/admin-auth'

export const runtime = 'nodejs'

function isAuthed(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const requests = await listRequests()
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('[api/admin/requests] GET erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

const VALID_STATUSES: RequestStatus[] = ['new', 'read', 'replied', 'archived']

export async function PATCH(request: NextRequest) {
  if (!isAuthed(request)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const { id, status } = await request.json()
    if (!id || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }
    await updateRequestStatus(Number(id), status)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[api/admin/requests] PATCH erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
