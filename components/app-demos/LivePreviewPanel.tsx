'use client'

import { Button } from '@/components/ui/button'
import { ExternalLink, Globe } from 'lucide-react'

interface LivePreviewPanelProps {
  url: string
  label?: string
  description?: string
  highlights?: string[]
}

export function LivePreviewPanel({
  url,
  label = 'Voir le site en direct',
  description = "Ce projet est en production. La meilleure démo, c'est le site lui-même.",
  highlights = [],
}: LivePreviewPanelProps) {
  return (
    <div className="min-h-[420px] flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-muted/20 to-transparent">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <Globe className="w-7 h-7 text-primary" />
      </div>
      <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">{description}</p>
      {highlights.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 max-w-lg">
          {highlights.map((h, i) => (
            <div key={i} className="text-sm">
              <span className="text-primary font-semibold">{h.split('·')[0]}</span>
              {h.includes('·') && (<span className="text-muted-foreground"> {h.split('·')[1]}</span>)}
            </div>
          ))}
        </div>
      )}
      <Button size="lg" asChild>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4 mr-2" />{label}
        </a>
      </Button>
    </div>
  )
}
