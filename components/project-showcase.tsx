'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  ExternalLink,
  Maximize2,
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Code2,
  Info,
  Github,
} from 'lucide-react'

interface ProjectShowcaseProps {
  title: string
  description: string
  previewUrl: string | null
  status: 'live' | 'development' | 'coming-soon'
  technologies: string[]
  githubUrl?: string
  features?: string[]
}

const statusConfig = {
  live: { label: 'Live', className: 'bg-success/20 text-success' },
  development: { label: 'En développement', className: 'bg-warning/20 text-warning' },
  'coming-soon': { label: 'Bientôt', className: 'bg-muted text-muted-foreground' },
}

type Device = 'desktop' | 'tablet' | 'mobile'
const deviceWidths: Record<Device, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

export function ProjectShowcase({
  title,
  description,
  previewUrl,
  status,
  technologies,
  githubUrl,
  features,
}: ProjectShowcaseProps) {
  const [device, setDevice] = useState<Device>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Lazy loading: only load iframe when visible
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect() } },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Detect iframe load failure via timeout
  useEffect(() => {
    if (!isVisible || !previewUrl) return
    setIsLoading(true)
    setIframeError(false)
    const timeout = setTimeout(() => {
      if (isLoading) setIframeError(true)
    }, 15000)
    return () => clearTimeout(timeout)
  }, [isVisible, previewUrl, iframeKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false)
    setIframeError(false)
  }, [])

  const handleRefresh = useCallback(() => {
    setIframeKey(k => k + 1)
    setIsLoading(true)
    setIframeError(false)
  }, [])

  const statusCfg = statusConfig[status]

  const renderIframe = (height: string, inDialog = false) => {
    if (!previewUrl || !isVisible) {
      return <PlaceholderContent title={title} description={description} technologies={technologies} status={status} previewUrl={previewUrl} />
    }

    return (
      <div className="relative w-full h-full flex items-center justify-center bg-background">
        {/* Device frame wrapper */}
        <div
          className={cn(
            'h-full transition-all duration-300 mx-auto',
            !inDialog && 'relative'
          )}
          style={{ width: deviceWidths[device], maxWidth: '100%' }}
        >
          {isLoading && !iframeError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background">
              <Skeleton className="w-full h-full rounded-none" />
              <p className="absolute text-sm text-muted-foreground animate-pulse">
                Chargement de {title}...
              </p>
            </div>
          )}
          {iframeError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background">
              <p className="text-sm text-muted-foreground">
                Impossible de charger la prévisualisation.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleRefresh}>
                  <RotateCw className="w-4 h-4 mr-1" /> Réessayer
                </Button>
                <Button size="sm" asChild>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" /> Ouvrir l&apos;app
                  </a>
                </Button>
              </div>
            </div>
          )}
          <iframe
            key={iframeKey}
            src={previewUrl}
            className="w-full border-0"
            style={{ height }}
            title={`Démo de ${title}`}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            loading="lazy"
            onLoad={handleIframeLoad}
            aria-label={`Prévisualisation interactive de ${title}`}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div ref={containerRef} className="rounded-xl border bg-card overflow-hidden">
        {/* Header bar - macOS style */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <Badge variant="secondary" className={cn('text-xs', statusCfg.className)}>
              {statusCfg.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {/* Device toggle - hidden on mobile */}
            {previewUrl && (
              <div className="hidden md:flex items-center gap-0.5 mr-2 border rounded-md p-0.5">
                {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(
                  ([d, Icon]) => (
                    <Button
                      key={d}
                      variant="ghost"
                      size="icon"
                      className={cn('h-7 w-7', device === d && 'bg-accent')}
                      onClick={() => setDevice(d)}
                      aria-label={`Vue ${d}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </Button>
                  )
                )}
              </div>
            )}
            {previewUrl && (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh} aria-label="Recharger">
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFullscreen(true)} aria-label="Plein écran">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </>
            )}
            {previewUrl && (
              <Button variant="ghost" size="sm" asChild>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ouvrir ${title} dans un nouvel onglet`}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Ouvrir</span>
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="preview" className="w-full">
          <div className="px-4 pt-2 border-b bg-muted/30">
            <TabsList className="bg-transparent h-auto p-0 gap-0">
              <TabsTrigger value="preview" className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
                <Eye className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Preview</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
                <Code2 className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Stack</span>
              </TabsTrigger>
              <TabsTrigger value="info" className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
                <Info className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Info</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Preview tab */}
          <TabsContent value="preview" className="mt-0">
            <div className={cn(
              'relative transition-all duration-300 overflow-hidden',
              'h-[400px] md:h-[500px] lg:h-[600px]'
            )}>
              {renderIframe('100%')}
            </div>
          </TabsContent>

          {/* Code/Stack tab */}
          <TabsContent value="code" className="mt-0">
            <div className="p-8 min-h-[300px]">
              <h3 className="text-lg font-semibold mb-4">Stack Technique</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="font-mono text-sm px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
              {githubUrl && (
                <Button variant="outline" asChild>
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    Voir le code source
                  </a>
                </Button>
              )}
              {!githubUrl && (
                <p className="text-sm text-muted-foreground">
                  Code source privé — disponible sur demande.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Info tab */}
          <TabsContent value="info" className="mt-0">
            <div className="p-8 min-h-[300px]">
              <h3 className="text-lg font-semibold mb-3">{title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
              {features && features.length > 0 && (
                <>
                  <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                    Fonctionnalités
                  </h4>
                  <ul className="space-y-2">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 gap-0">
          <DialogTitle className="sr-only">{title} — Plein écran</DialogTitle>
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{title}</span>
              <Badge variant="secondary" className={cn('text-xs', statusCfg.className)}>
                {statusCfg.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <div className="hidden md:flex items-center gap-0.5 mr-2 border rounded-md p-0.5">
                {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(
                  ([d, Icon]) => (
                    <Button
                      key={d}
                      variant="ghost"
                      size="icon"
                      className={cn('h-7 w-7', device === d && 'bg-accent')}
                      onClick={() => setDevice(d)}
                      aria-label={`Vue ${d}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </Button>
                  )
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh} aria-label="Recharger">
                <RotateCw className="w-4 h-4" />
              </Button>
              {previewUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" /> Ouvrir
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-background">
            {renderIframe('calc(90vh - 52px)', true)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function PlaceholderContent({
  title,
  description,
  technologies,
  status,
  previewUrl,
}: {
  title: string
  description: string
  technologies: string[]
  status: string
  previewUrl: string | null
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <span className="text-4xl font-bold text-primary">
          {title.charAt(0)}
        </span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {technologies.map((tech) => (
          <Badge key={tech} variant="outline" className="font-mono text-xs">
            {tech}
          </Badge>
        ))}
      </div>
      {status === 'live' && previewUrl && (
        <Button asChild>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            Voir l&apos;application
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      )}
      {status === 'development' && (
        <p className="text-sm text-warning">Démo interactive bientôt disponible</p>
      )}
      {status === 'coming-soon' && (
        <p className="text-sm text-muted-foreground">En cours de développement</p>
      )}
    </div>
  )
}
