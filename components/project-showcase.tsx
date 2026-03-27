'use client'

import { type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, Code2, Info, Github } from 'lucide-react'

interface ProjectShowcaseProps {
  title: string
  description: string
  status: 'live' | 'development' | 'coming-soon'
  technologies: string[]
  githubUrl?: string
  features?: string[]
  appDemo: ReactNode
}

export function ProjectShowcase({
  title,
  description,
  status,
  technologies,
  githubUrl,
  features,
  appDemo,
}: ProjectShowcaseProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Tabs defaultValue="preview" className="w-full">
        <div className="px-4 pt-2 border-b bg-muted/30">
          <TabsList className="bg-transparent h-auto p-0 gap-0">
            <TabsTrigger value="preview" className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
              <Eye className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
            <TabsTrigger value="stack" className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
              <Code2 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Stack</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
              <Info className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Info</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Preview tab — renders the interactive demo */}
        <TabsContent value="preview" className="mt-0">
          {appDemo}
        </TabsContent>

        {/* Stack tab */}
        <TabsContent value="stack" className="mt-0">
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
  )
}
