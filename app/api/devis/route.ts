import { NextRequest, NextResponse } from 'next/server'

interface DevisRequest {
  name: string
  email: string
  projectType: string
  description: string
  budget?: string
}

const projectTypeLabels: Record<string, string> = {
  webapp: 'Application web sur mesure',
  pwa: 'PWA (Progressive Web App)',
  consulting: 'Consulting technique',
  other: 'Autre',
}

const budgetLabels: Record<string, string> = {
  'under-2k': '< 2000 EUR',
  '2k-5k': '2000 EUR - 5000 EUR',
  '5k-10k': '5000 EUR - 10000 EUR',
  'over-10k': '> 10000 EUR',
  unknown: 'Non defini',
}

export async function POST(request: NextRequest) {
  try {
    const body: DevisRequest = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.projectType || !body.description) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Format email invalide' },
        { status: 400 }
      )
    }

    // Log the request (in production, you would send an email or save to database)
    console.log('=== Nouvelle demande de devis ===')
    console.log('Nom:', body.name)
    console.log('Email:', body.email)
    console.log('Type de projet:', projectTypeLabels[body.projectType] || body.projectType)
    console.log('Budget:', budgetLabels[body.budget || 'unknown'])
    console.log('Description:', body.description)
    console.log('================================')

    // Here you would typically:
    // 1. Send an email notification using Resend or Nodemailer
    // 2. Save to a database
    // 3. Send a confirmation email to the client
    
    // Example with Resend (uncomment when you have RESEND_API_KEY):
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'Portfolio <onboarding@resend.dev>',
    //   to: 'your-email@example.com',
    //   subject: `Nouvelle demande de devis - ${body.name}`,
    //   html: `<h1>Nouvelle demande de devis</h1>...`
    // })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Demande envoyee avec succes' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing devis request:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la demande' },
      { status: 500 }
    )
  }
}
