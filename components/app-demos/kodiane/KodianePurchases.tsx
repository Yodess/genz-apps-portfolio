'use client'

import type { KodianePurchase } from '../types'
import { Calendar, MapPin, Package } from 'lucide-react'

interface Props {
  purchases: KodianePurchase[]
}

export function KodianePurchases({ purchases }: Props) {
  const totalSpent = purchases.reduce((s, p) => s + p.totalSpent, 0)
  const totalItems = purchases.reduce((s, p) => s + p.itemCount, 0)

  return (
    <div className="pb-4">
      {/* Header - green theme for purchases */}
      <div className="bg-[#059669] pt-10 pb-6 px-5 rounded-b-3xl">
        <h1 className="text-white text-xl font-bold">🛒 Historique d&apos;achats</h1>
        <p className="text-white/60 text-sm mt-1">{purchases.length} achats enregistrés</p>

        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
            <div className="text-white text-lg font-bold">{(totalSpent / 1000).toFixed(1)}k</div>
            <div className="text-white/50 text-[10px]">Total DA</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
            <div className="text-white text-lg font-bold">{totalItems}</div>
            <div className="text-white/50 text-[10px]">Articles</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
            <div className="text-white text-lg font-bold">{purchases.length}</div>
            <div className="text-white/50 text-[10px]">Achats</div>
          </div>
        </div>
      </div>

      {/* Purchase list */}
      <div className="px-4 mt-4 space-y-3">
        {purchases.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm text-gray-800">{p.listName}</h3>
              <span className="text-sm font-bold text-[#059669]">
                {p.totalSpent.toLocaleString('fr-DZ')} DA
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {p.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {p.location}
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3" /> {p.itemCount} articles
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
