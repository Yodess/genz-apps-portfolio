'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, ExternalLink, Check } from 'lucide-react'
import { BrowserMockup } from '@/components/showcase/BrowserMockup'
import { ArtisanaScene, KodianeScene, MakineScene } from '@/components/showcase/mockup-scenes'
import { useScrollReveal } from '@/components/showcase/useScrollReveal'

type Scene = 'artisanadz' | 'kodiane' | 'makine'

interface Project {
  title: string
  tagline: string
  status: 'live' | 'development'
  url: string
  accent: string
  scene: Scene
  description: string
  problem: string
  solution: string
  results: string[]
  technologies: string[]
}

const projects: Project[] = [
  {
    title: 'ArtisanaDZ',
    tagline: 'Réseau social + marketplace pour artisans',
    status: 'live',
    url: 'artisanadz.com',
    accent: '#C4501A',
    scene: 'artisanadz',
    description: "Plateforme tout-en-un pour les artisans algériens : réseau social, marketplace digitale et outils de gestion réunis sur un seul produit en production.",
    problem: "Les artisans algériens n'ont aucun endroit pour exister en ligne, vendre leurs créations et gérer leur activité — dispersés entre Instagram, WhatsApp et le papier.",
    solution: "Un réseau social (feed, vidéos, messagerie), une marketplace (ateliers style Udemy, ebooks, patrons, recettes) et des outils de gestion (boutique, stock, commandes, avis).",
    results: [
      'En production sur artisanadz.com (SSL, domaine custom)',
      'Architecture microservices scalable (6 services)',
      'Upload média via CDN Cloudflare, messagerie temps réel',
      'Gamification : badges, classements, veille concurrentielle',
    ],
    technologies: ['Next.js / React', 'Microservices Node.js', 'PostgreSQL', 'Cloudflare R2', 'JWT'],
  },
  {
    title: 'Kodiane',
    tagline: "PWA de gestion d'achats & comparaison de prix",
    status: 'live',
    url: 'kodiane-app-5enx.vercel.app',
    accent: '#1D9E75',
    scene: 'kodiane',
    description: "Application PWA installable pour gérer ses achats au marché de gros — listes structurées, comparaison de prix multi-fournisseurs, mode offline.",
    problem: "Les commerçants gèrent leurs achats au marché de gros sur des carnets papier : oublis, mauvaises décisions de prix, aucun suivi des dépenses.",
    solution: "Une PWA mobile-first installable sur Android/iOS. Comparaison de prix multi-paliers (gros / demi-gros / détail), historique complet, fonctionnement hors ligne.",
    results: [
      'Livré de 0 à production en 6 semaines',
      '15+ écrans, auth JWT, base PostgreSQL',
      'PWA installable — fonctionne hors ligne',
      'Système freemium intégré (Free / Pro)',
    ],
    technologies: ['Next.js', 'PostgreSQL (Neon)', 'Prisma', 'PWA', 'TypeScript'],
  },
  {
    title: 'Makine',
    tagline: 'Gestion production & ventes artisan',
    status: 'live',
    url: 'makine-app.vercel.app',
    accent: '#7F77DD',
    scene: 'makine',
    description: "ERP léger pour producteurs artisanaux : suivi des lots, coût de revient au centime, stocks, ventes clients et tableaux de bord en temps réel.",
    problem: "Un producteur artisanal ne sait pas exactement combien lui coûte un lot ni combien il lui rapporte. Tout se gère sur papier ou Excel.",
    solution: "Une application qui calcule le coût de revient par lot, suit chaque production de la matière première au produit fini, gère clients, impayés et marges, avec export comptable.",
    results: [
      'Traçabilité complète des lots de production',
      'Calcul automatique du coût de revient et des marges',
      'Export comptable (interconnexion ComptaDZ)',
      'Dashboard temps réel + gamification métier',
    ],
    technologies: ['React', 'Express / Node.js', 'PostgreSQL (Neon)', 'Recharts', 'Vercel'],
  },
]

function getScene(scene: Scene) {
  if (scene === 'artisanadz') return <ArtisanaScene />
  if (scene === 'kodiane') return <KodianeScene />
  return <MakineScene />
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  const reversed = index % 2 === 1

  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Mockup */}
      <div className={reversed ? 'lg:order-2' : ''}>
        <BrowserMockup url={project.url} accent={project.accent}>
          {getScene(project.scene)}
        </BrowserMockup>
      </div>

      {/* Texte */}
      <div className={reversed ? 'lg:order-1' : ''}>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: `${project.accent}20`, color: project.accent }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: project.accent }} />
            {project.status === 'live' ? 'En production' : 'En développement'}
          </span>
        </div>

        <h3 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h3>
        <p className="text-lg text-muted-foreground mb-5">{project.tagline}</p>
        <p className="text-muted-foreground leading-relaxed mb-6">{project.description}</p>

        {/* Case study condensé */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400 shrink-0 w-20 pt-0.5">Problème</span>
            <p className="text-sm text-muted-foreground">{project.problem}</p>
          </div>
          <div className="flex gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 shrink-0 w-20 pt-0.5">Solution</span>
            <p className="text-sm text-muted-foreground">{project.solution}</p>
          </div>
        </div>

        {/* Résultats */}
        <ul className="grid sm:grid-cols-2 gap-2 mb-6">
          {project.results.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: project.accent }} />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        {/* Techs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((t) => (
            <Badge key={t} variant="outline" className="font-mono text-xs">{t}</Badge>
          ))}
        </div>

        <Button asChild size="lg">
          <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Voir le site
          </a>
        </Button>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  return (
    <section id="projets" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4">Réalisations</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Des applications livrées, pas des maquettes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chaque projet ci-dessous est en production. Découvrez ce qu&apos;on peut construire pour votre activité.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-28">
          {projects.map((project, i) => (
            <ProjectRow key={project.title} project={project} index={i} />
          ))}

          {/* Carte CTA */}
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
            <h3 className="text-2xl font-bold mb-3">Votre projet pourrait être ici</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Une idée d&apos;application ? Je la développe pour vous, de la maquette au déploiement en production.
            </p>
            <Button asChild size="lg">
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
