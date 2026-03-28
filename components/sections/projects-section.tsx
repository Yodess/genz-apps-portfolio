'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProjectShowcase } from '@/components/project-showcase'
import { AppDemoShell } from '@/components/app-demos/AppDemoShell'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const KodianeDemo = dynamic(
  () => import('@/components/app-demos/kodiane/KodianeDemo').then(m => ({ default: m.KodianeDemo })),
  { ssr: false }
)

const MakineDemo = dynamic(
  () => import('@/components/app-demos/makine/MakineDemo').then(m => ({ default: m.MakineDemo })),
  { ssr: false }
)

const projects = [
  {
    title: 'Kodiane',
    description:
      'Application PWA de gestion d\'achats pour marchés de gros — installable sur mobile, fonctionne hors ligne, déployée en production.',
    status: 'live' as const,
    technologies: ['Next.js 16', 'PostgreSQL (Neon)', 'Prisma', 'PWA', 'TypeScript', 'Zustand', 'Tailwind CSS'],
    caseStudy: {
      problem: 'Les commerçants algériens gèrent leurs achats au marché de gros avec des carnets papier et des photos. Résultat : oublis, mauvaises décisions de prix, aucun suivi des dépenses.',
      solution: 'Une PWA mobile-first installable sur Android et iOS. Listes d\'achats structurées, comparaison de prix multi-fournisseurs avec paliers (gros / demi-gros / détail), historique complet, mode offline.',
      results: [
        'Livré de 0 à production en 6 semaines',
        '15+ écrans, auth JWT, base PostgreSQL',
        'PWA installable — disponible sur Vercel',
        'Système freemium intégré (Free / Pro)',
      ],
    },
    features: [
      'Comparaison de prix multi-fournisseurs en temps réel',
      'Multi-paliers de prix (gros, demi-gros, détail)',
      'Liaison entre produits similaires',
      'Historique d\'achats avec détails',
      'Auth sécurisée (JWT + bcrypt)',
      'Mode offline (Service Worker)',
      'PWA installable sur Android & iOS',
    ],
    liveUrl: 'https://kodiane-app-5enx.vercel.app/',
    demoId: 'kodiane' as const,
  },
  {
    title: 'Confiture Gestion',
    description:
      'Application de gestion de production pour artisans — suivi des lots, coût de revient, stocks et ventes clients.',
    status: 'development' as const,
    technologies: ['Next.js 16', 'PostgreSQL', 'Prisma', 'TypeScript', 'Tailwind CSS'],
    caseStudy: {
      problem: 'Un producteur artisanal (confiture, conserves, agroalimentaire) ne sait pas exactement combien lui coûte un lot, ni combien il lui rapporte. La gestion se fait sur papier ou sur Excel.',
      solution: 'Une application dédiée qui calcule le coût de revient au centime, suit chaque lot de la matière première au produit fini, gère les clients et les impayés, et affiche la marge réelle en temps réel.',
      results: [
        'Visibilité complète sur les marges par lot',
        'Gestion des clients et suivi des impayés',
        'Inventaire en temps réel',
        'Adaptable à tout secteur de production artisanale',
      ],
    },
    features: [
      'Calcul automatique du coût de revient par lot',
      'Suivi de production : du fruit au pot étiqueté',
      'Gestion des clients et impayés',
      'Inventaire matières premières + produits finis',
      'Tableaux de bord : capital, revenus, dépenses',
      'Objectifs de vente et production',
    ],
    ctaLabel: 'Commander votre application',
    ctaUrl: '#devis',
    demoId: 'makine' as const,
  },
]

function KodianeDemoWrapper() {
  const resetRef = useRef<(() => void) | null>(null)
  return (
    <AppDemoShell title="Kodiane" status="live" onReset={() => resetRef.current?.()}>
      {() => <KodianeDemo onReset={(fn) => { resetRef.current = fn }} />}
    </AppDemoShell>
  )
}

function MakineDemoWrapper() {
  const resetRef = useRef<(() => void) | null>(null)
  return (
    <AppDemoShell title="Confiture Gestion" status="development" onReset={() => resetRef.current?.()}>
      {() => <MakineDemo onReset={(fn) => { resetRef.current = fn }} />}
    </AppDemoShell>
  )
}

export function ProjectsSection() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  const getDemoComponent = useCallback((demoId: 'kodiane' | 'makine') => {
    if (demoId === 'kodiane') return <KodianeDemoWrapper />
    return <MakineDemoWrapper />
  }, [])

  return (
    <section id="projets" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Réalisations</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Des applications livrées, pas des maquettes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chaque projet ci-dessous est en production. Testez l&apos;interface, lisez le case study — c&apos;est ce qu&apos;on peut faire pour votre activité.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Navigation header with project indicator and arrows */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {[...projects.map(p => p.title), 'Votre projet'].map((name, i) => (
                <button
                  key={name}
                  onClick={() => api?.scrollTo(i)}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
                    i === current
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => api?.scrollPrev()}
                disabled={current === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[3ch] text-center">
                {current + 1}/{count}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => api?.scrollNext()}
                disabled={current === count - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Carousel setApi={setApi} opts={{ loop: false }} className="w-full">
            <CarouselContent>
              {projects.map((project) => (
                <CarouselItem key={project.title}>
                  <ProjectShowcase
                    title={project.title}
                    description={project.description}
                    status={project.status}
                    technologies={project.technologies}
                    features={project.features}
                    caseStudy={project.caseStudy}
                    appDemo={getDemoComponent(project.demoId)}
                    liveUrl={project.liveUrl}
                    ctaLabel={project.ctaLabel}
                    ctaUrl={project.ctaUrl}
                  />
                </CarouselItem>
              ))}

              {/* CTA slide */}
              <CarouselItem>
                <div className="rounded-xl border border-dashed bg-card/50 p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
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
              </CarouselItem>
            </CarouselContent>


          </Carousel>

          {/* Dot indicators */}
          {count > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
                  }`}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Aller au projet ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
