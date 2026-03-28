import type { Metadata, Viewport } from 'next'
import { Inter, Fira_Code } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const firaCode = Fira_Code({ 
  subsets: ["latin"],
  variable: '--font-fira-code',
  display: 'swap',
});

const SITE_URL = 'https://www.genz-apps.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GenZ Apps | Applications Web & PWA sur mesure en Algérie',
    template: '%s — GenZ Apps',
  },
  description: 'GenZ Apps — Développeur full-stack spécialisé en PWA et applications métier sur mesure. Solutions digitales modernes, rapides et installables qui résolvent de vrais problèmes business.',
  keywords: [
    'GenZ Apps', 'développeur web Algérie', 'application sur mesure', 'PWA', 'développeur full-stack',
    'Next.js', 'React', 'TypeScript', 'application mobile Algérie', 'développeur freelance Algérie',
  ],
  authors: [{ name: 'GenZ Apps', url: SITE_URL }],
  creator: 'GenZ Apps',
  openGraph: {
    title: 'GenZ Apps | Applications Web & PWA sur mesure en Algérie',
    description: 'Développeur full-stack spécialisé en applications métier sur mesure. Des apps livrées en production, pas des maquettes.',
    url: SITE_URL,
    siteName: 'GenZ Apps',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'GenZ Apps — Applications Web & PWA sur mesure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GenZ Apps | Applications Web & PWA sur mesure en Algérie',
    description: 'Développeur full-stack spécialisé en applications métier sur mesure.',
    images: ['/images/og-default.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
