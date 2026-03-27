'use client'

import { useState } from 'react'
import type { MakineInventoryItem } from '../types'

interface Props {
  inventory: MakineInventoryItem[]
}

const statusColors = {
  active: { bg: 'rgba(16,185,129,0.2)', text: '#10B981', label: 'Actif' },
  low: { bg: 'rgba(245,158,11,0.2)', text: '#F59E0B', label: 'Faible' },
  expired: { bg: 'rgba(239,68,68,0.2)', text: '#EF4444', label: 'Expiré' },
}

export function MakineInventory({ inventory }: Props) {
  const [tab, setTab] = useState<'finished' | 'consumable'>('finished')
  const filtered = inventory.filter(i => i.type === tab)

  const finishedCount = inventory.filter(i => i.type === 'finished').length
  const consumableCount = inventory.filter(i => i.type === 'consumable').length

  return (
    <div className="p-4 pt-12 pb-4">
      <h1 className="text-xl font-bold mb-1">📦 Inventaire</h1>
      <p className="text-white/50 text-sm mb-5">{inventory.length} articles en stock</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {([['finished', `🫙 Produits finis (${finishedCount})`], ['consumable', `📦 Consommables (${consumableCount})`]] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 text-xs py-2 rounded-xl border transition-colors"
            style={{
              backgroundColor: tab === id ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
              borderColor: tab === id ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
              color: tab === id ? '#A78BFA' : 'rgba(255,255,255,0.5)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table-like list */}
      <div className="space-y-2.5">
        {filtered.map(item => {
          const sc = statusColors[item.status]
          return (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50">{item.quantity} {item.unit}</span>
                  {item.expiryDate && (
                    <span className="text-[10px] text-white/30">Exp. {item.expiryDate}</span>
                  )}
                </div>
              </div>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: sc.bg, color: sc.text }}
              >
                {sc.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
