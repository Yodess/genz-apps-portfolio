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
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'
import { ArrowRight } from 'lucide-react'

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
      'Application PWA complète pour gérer votre activité de kodiane : suivi des stocks en temps réel, comparaison des prix fournisseurs, gestion des listes d\'achats et historique complet des transactions.',
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
    demoId: 'kodiane' as const,
  },
  {
    title: 'MakineApp',
    description:
      'Application de suivi de production de confiture : gestion des recettes, suivi des lots, calcul automatique des coûts et optimisation de la rentabilité.',
    status: 'development' as const,
    technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    features: [
      'Gestion des recettes et ingrédients',
      'Suivi des lots de production',
      'Calcul automatique des coûts de revient',
      'Tableaux de bord analytiques',
    ],
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
    <AppDemoShell title="MakineApp" status="development" onReset={() => resetRef.current?.()}>
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
          <Badge variant="secondary" className="mb-4">Portfolio</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Applications que j&apos;ai développées
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Testez mes applications directement ici — cliquez, naviguez, explorez.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
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
                    appDemo={getDemoComponent(project.demoId)}
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

            <div className="hidden md:block">
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </div>
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
