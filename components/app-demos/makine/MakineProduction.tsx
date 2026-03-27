'use client'

import { useState } from 'react'
import type { MakineBatch } from '../types'

interface Props {
  batches: MakineBatch[]
}

export function MakineProduction({ batches }: Props) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  const filtered = filter === 'all' ? batches : batches.filter(b => b.status === filter)

  return (
    <div className="p-4 pt-12 pb-4">
      <h1 className="text-xl font-bold mb-1">🏭 Production</h1>
      <p className="text-white/50 text-sm mb-5">{batches.length} lots enregistrés</p>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {([['all', 'Tous'], ['completed', 'Terminés'], ['pending', 'En cours']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className="text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={{
              backgroundColor: filter === id ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
              borderColor: filter === id ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
              color: filter === id ? '#A78BFA' : 'rgba(255,255,255,0.5)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Batch list */}
      <div className="space-y-3">
        {filtered.map(batch => (
          <div key={batch.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold">{batch.productName}</h3>
                <p className="text-[10px] text-white/40 font-mono">{batch.ref}</p>
              </div>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: batch.status === 'completed' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                  color: batch.status === 'completed' ? '#10B981' : '#F59E0B',
                }}
              >
                {batch.status === 'completed' ? 'Terminé' : 'En cours'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div>
                <div className="text-[10px] text-white/40">Date</div>
                <div className="text-xs font-medium">{batch.date}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40">Coût</div>
                <div className="text-xs font-medium text-red-400">{batch.totalCost.toLocaleString()} DA</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40">Produit</div>
                <div className="text-xs font-medium text-emerald-400">{batch.qtyProduced} pots</div>
              </div>
            </div>
            {/* Ingredient summary */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="text-[10px] text-white/40 mb-1.5">Ingrédients ({batch.ingredients.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {batch.ingredients.map(ing => (
                  <span key={ing.name} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                    {ing.name} · {ing.qtyUsed}{ing.unit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
