'use client'

import { useState, useCallback } from 'react'
import { makineData } from '../demo-data'
import type { MakineData } from '../types'
import { MakineDashboard } from './MakineDashboard'
import { MakineProduction } from './MakineProduction'
import { MakineSales } from './MakineSales'
import { MakineClients } from './MakineClients'
import { MakineInventory } from './MakineInventory'
import { Home, Factory, ShoppingCart, Package, Users, Target } from 'lucide-react'

type Screen = 'dashboard' | 'production' | 'sales' | 'inventory' | 'clients' | 'goals'

const tabs = [
  { id: 'dashboard' as const, label: 'Accueil', icon: Home },
  { id: 'production' as const, label: 'Prod.', icon: Factory },
  { id: 'sales' as const, label: 'Ventes', icon: ShoppingCart },
  { id: 'inventory' as const, label: 'Stock', icon: Package },
  { id: 'clients' as const, label: 'Clients', icon: Users },
  { id: 'goals' as const, label: 'Objectifs', icon: Target },
]

export function MakineDemo({ onReset }: { onReset?: (resetFn: () => void) => void }) {
  const [data, setData] = useState<MakineData>(() => structuredClone(makineData))
  const [screen, setScreen] = useState<Screen>('dashboard')

  const reset = useCallback(() => {
    setData(structuredClone(makineData))
    setScreen('dashboard')
  }, [])

  if (onReset) onReset(reset)

  const handleAddSale = (clientName: string, productName: string, qty: number, unitPrice: number) => {
    const newSale = {
      id: `v${Date.now()}`,
      clientName,
      date: new Date().toISOString().split('T')[0],
      products: [{ name: productName, qty, unitPrice }],
      total: qty * unitPrice,
      paymentStatus: 'unpaid' as const,
      amountPaid: 0,
    }
    setData(prev => ({
      ...prev,
      sales: [newSale, ...prev.sales],
      stats: { ...prev.stats, revenue: prev.stats.revenue + newSale.total, outstanding: prev.stats.outstanding + newSale.total },
    }))
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Floating orbs (decorative) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl" />
      </div>

      {/* Screen content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
        {screen === 'dashboard' && <MakineDashboard stats={data.stats} />}
        {screen === 'production' && <MakineProduction batches={data.batches} />}
        {screen === 'sales' && <MakineSales sales={data.sales} onAddSale={handleAddSale} />}
        {screen === 'inventory' && <MakineInventory inventory={data.inventory} />}
        {screen === 'clients' && <MakineClients clients={data.clients} />}
        {screen === 'goals' && (
          <div className="p-4 pt-12">
            <h1 className="text-xl font-bold mb-2">🎯 Objectifs</h1>
            <p className="text-white/50 text-sm mb-6">Suivez vos objectifs de production et de vente</p>
            {/* Progress ring */}
            <div className="flex flex-col items-center py-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeDasharray={`${0.68 * 264} 264`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">68%</span>
                  <span className="text-[10px] text-white/50">Niveau 3</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">340 / 500 XP vers le niveau 4</p>
            </div>
            <div className="space-y-3">
              {[
                { icon: '🎁', name: 'Objectif mensuel', progress: 75, target: '50 000 DA' },
                { icon: '🏭', name: '100 lots produits', progress: 42, target: '42 / 100' },
              ].map(g => (
                <div key={g.name} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{g.icon} {g.name}</span>
                    <span className="text-xs text-white/50">{g.target}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="flex-shrink-0 bg-slate-900/90 border-t border-white/10 px-1 py-1.5 flex justify-around relative z-10">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setScreen(id)}
            className="flex flex-col items-center gap-0.5 px-1 py-1 min-w-0"
          >
            <Icon
              className="w-4 h-4"
              style={{ color: screen === id ? '#8B5CF6' : 'rgba(255,255,255,0.4)' }}
            />
            <span
              className="text-[9px] font-medium truncate"
              style={{ color: screen === id ? '#8B5CF6' : 'rgba(255,255,255,0.4)' }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
