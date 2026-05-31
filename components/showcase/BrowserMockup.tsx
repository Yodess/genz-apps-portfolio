'use client'

import { type ReactNode } from 'react'

interface BrowserMockupProps {
  url: string
  accent: string        // couleur hex signature du projet
  children: ReactNode
}

export function BrowserMockup({ url, accent, children }: BrowserMockupProps) {
  return (
    <div className="relative">
      {/* Halo coloré derrière */}
      <div
        className="absolute -inset-8 rounded-[2rem] blur-3xl opacity-20 -z-10"
        style={{ background: `radial-gradient(circle at 50% 40%, ${accent}, transparent 70%)` }}
      />
      {/* Cadre navigateur */}
      <div className="rounded-xl border border-white/10 bg-card/80 backdrop-blur shadow-2xl overflow-hidden">
        {/* Barre navigateur */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 rounded-md bg-white/5 text-xs text-muted-foreground font-mono max-w-[60%] truncate">
              {url}
            </div>
          </div>
        </div>
        {/* Contenu graphique */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
