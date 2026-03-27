'use client'

import type { MakineClient } from '../types'
import { Phone, Mail } from 'lucide-react'

interface Props {
  clients: MakineClient[]
}

const typeConfig = {
  particulier: { emoji: '👤', color: '#10B981', label: 'Particulier' },
  magasin: { emoji: '🏪', color: '#F59E0B', label: 'Magasin' },
  revendeur: { emoji: '🚚', color: '#3B82F6', label: 'Revendeur' },
}

export function MakineClients({ clients }: Props) {
  const byType = {
    particulier: clients.filter(c => c.type === 'particulier').length,
    magasin: clients.filter(c => c.type === 'magasin').length,
    revendeur: clients.filter(c => c.type === 'revendeur').length,
  }

  return (
    <div className="p-4 pt-12 pb-4">
      <h1 className="text-xl font-bold mb-1">👥 Clients</h1>
      <p className="text-white/50 text-sm mb-5">{clients.length} clients enregistrés</p>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {Object.entries(typeConfig).map(([key, cfg]) => (
          <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="text-lg">{cfg.emoji}</div>
            <div className="text-lg font-bold" style={{ color: cfg.color }}>{byType[key as keyof typeof byType]}</div>
            <div className="text-[9px] text-white/40">{cfg.label}s</div>
          </div>
        ))}
      </div>

      {/* Client cards */}
      <div className="space-y-3">
        {clients.map(client => {
          const cfg = typeConfig[client.type]
          return (
            <div key={client.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${cfg.color}20` }}
                >
                  {cfg.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{client.name}</h3>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <div className="text-[10px] text-white/40">Achats</div>
                  <div className="text-xs font-medium">{client.totalPurchases}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40">Revenue</div>
                  <div className="text-xs font-medium text-cyan-400">{(client.totalRevenue / 1000).toFixed(1)}k</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40">Impayé</div>
                  <div className="text-xs font-medium" style={{ color: client.outstanding > 0 ? '#F59E0B' : '#10B981' }}>
                    {client.outstanding > 0 ? `${(client.outstanding / 1000).toFixed(1)}k` : '0'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-white/40">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                <span className="flex items-center gap-1 truncate"><Mail className="w-3 h-3" />{client.email}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
