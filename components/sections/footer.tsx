'use client'

import { Github, Linkedin, Mail } from 'lucide-react'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

const quickLinks = [
  { label: 'Projets', href: '#projets' },
  { label: 'Services', href: '#services' },
  { label: 'Processus', href: '#processus' },
  { label: 'Devis', href: '#devis' },
]

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:contact@exemple.com', label: 'Email' },
]

export function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/genz-apps-logo.png"
                alt="Genz Apps"
                width={140}
                height={40}
                className="h-8 w-auto invert"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Developpeur full-stack specialise dans la creation d&apos;applications web 
              modernes et performantes. PWA, applications metier, solutions sur mesure.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Reseaux</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Genz Apps. Tous droits reserves.</p>
          <div className="flex gap-6">
            <button className="hover:text-primary transition-colors">
              Mentions legales
            </button>
            <button className="hover:text-primary transition-colors">
              Politique de confidentialite
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
