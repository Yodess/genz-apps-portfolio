'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProjectShowcase } from '@/components/project-showcase'
import { ArrowRight } from 'lucide-react'

const projects = [
  {
    title: 'Kodiane',
    description:
      'Application PWA complète pour gérer votre activité de kodiane : suivi des stocks en temps réel, comparaison des prix fournisseurs, gestion des listes d\'achats et historique complet des transactions.',
    previewUrl: 'https://kodiane-app.vercel.app',
    status: 'live' as const,
    technologies: ['Next.js 16', 'PostgreSQL (Neon)', 'Prisma', 'PWA', 'TypeScript', 'Zustand', 'Tailwind CSS'],
    features: [
      'Comparaison de prix multi-fournisseurs en temps réel',
      'Multi-paliers de prix par produit (gros, demi-gros, détail)',
      'Liaison entre produits similaires chez différents fournisseurs',
      'Historique d\'achats avec détails produits et quantités',
      'Authentification sécurisée (JWT + bcrypt)',
      'Mode offline avec Service Worker',
      'Interface mobile-first installable (PWA)',
    ],
  },
  {
    title: 'MakineApp',
    description:
      'Application de suivi de production de confiture : gestion des recettes, suivi des lots, calcul automatique des coûts et optimisation de la rentabilité.',
    previewUrl: null,
    status: 'development' as const,
    technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    features: [
      'Gestion des recettes et ingrédients',
      'Suivi des lots de production',
      'Calcul automatique des coûts de revient',
      'Tableaux de bord analytiques',
    ],
  },
]

export function ProjectsSection() {
  return (
    <section id="projets" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Portfolio</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Applications que j&apos;ai développées
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Testez mes applications directement ici — cliquez, naviguez, explorez.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {projects.map((project) => (
            <ProjectShowcase key={project.title} {...project} />
          ))}

          {/* CTA Card */}
          <div className="rounded-xl border border-dashed bg-card/50 p-12 text-center">
            <h3 className="text-xl font-semibold mb-3">Votre projet pourrait être ici</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Vous avez une idée d&apos;application ? Je peux la développer pour vous, 
              de la maquette au déploiement.
            </p>
            <Button asChild>
              <a href="#devis">
                Demander un devis
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
