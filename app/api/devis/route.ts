import { NextRequest, NextResponse } from 'next/server'
import { insertRequest } from '@/lib/db'

export const runtime = 'nodejs'

interface DevisRequest {
  name: string
  email: string
  projectType: string
  description: string
  budget?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: DevisRequest = await request.json()

    if (!body.name || !body.email || !body.projectType || !body.description) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Format email invalide' }, { status: 400 })
    }

    if (body.name.length > 200 || body.email.length > 200 || body.description.length > 5000) {
      return NextResponse.json({ error: 'Données trop volumineuses' }, { status: 400 })
    }

    const saved = await insertRequest({
      name: body.name.trim(),
      email: body.email.trim(),
      projectType: body.projectType,
      budget: body.budget || null,
      description: body.description.trim(),
    })

    return NextResponse.json(
      { success: true, message: 'Demande enregistrée avec succès', id: saved.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('[api/devis] erreur:', error)
    return NextResponse.json({ error: 'Erreur lors du traitement de la demande' }, { status: 500 })
  }
}
