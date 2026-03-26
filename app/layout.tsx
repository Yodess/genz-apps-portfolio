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

export const metadata: Metadata = {
  title: 'Genz Apps | Applications Web & PWA sur mesure',
  description: 'Genz Apps - Developpeur full-stack specialise en PWA et applications metier sur mesure. Solutions digitales modernes, rapides et installables qui resolvent de vrais problemes business.',
  keywords: ['Genz Apps', 'developpeur web', 'full-stack', 'PWA', 'applications metier', 'Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'Genz Apps' }],
  openGraph: {
    title: 'Genz Apps | Applications Web & PWA sur mesure',
    description: 'Solutions digitales modernes, rapides et installables qui resolvent de vrais problemes business.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genz Apps | Applications Web & PWA sur mesure',
    description: 'Solutions digitales modernes, rapides et installables qui resolvent de vrais problemes business.',
  },
  robots: {
    index: true,
    follow: true,
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
