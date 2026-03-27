'use client'

import { useState } from 'react'
import type { KodianeList } from '../types'
import { ArrowLeft, MapPin, Calendar } from 'lucide-react'

interface Props {
  list: KodianeList
  onBack: () => void
}

export function KodianeListDetail({ list, onBack }: Props) {
  const [tab, setTab] = useState<'suppliers' | 'products'>('products')

  // Group items by supplier
  const bySupplier = list.items.reduce<Record<string, typeof list.items>>((acc, item) => {
    if (!acc[item.supplierName]) acc[item.supplierName] = []
    acc[item.supplierName].push(item)
    return acc
  }, {})

  const total = list.items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-[#4A1FB8] pt-10 pb-6 px-5 rounded-b-3xl">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 text-sm mb-3">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-white text-lg font-bold">{list.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-white/50 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {list.date}
              </span>
              {list.location && (
                <span className="text-white/50 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {list.location}
                </span>
              )}
            </div>
          </div>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: list.status === 'termine' ? '#DCFCE7' : '#FEF3C7',
              color: list.status === 'termine' ? '#16A34A' : '#D97706',
            }}
          >
            {list.status === 'termine' ? 'Terminé' : 'En cours'}
          </span>
        </div>
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <div className="text-white text-lg font-bold">{list.items.length}</div>
            <div className="text-white/50 text-[10px]">Produits</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <div className="text-white text-lg font-bold">{Object.keys(bySupplier).length}</div>
            <div className="text-white/50 text-[10px]">Fournisseurs</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <div className="text-white text-lg font-bold">{(total / 1000).toFixed(1)}k</div>
            <div className="text-white/50 text-[10px]">Total DA</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 flex gap-2">
        {(['products', 'suppliers'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{
              backgroundColor: tab === t ? '#6C3FE8' : '#EDE9FE',
              color: tab === t ? 'white' : '#6C3FE8',
            }}
          >
            {t === 'products' ? 'Produits' : 'Fournisseurs'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 mt-4 space-y-2.5">
        {tab === 'products' && list.items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-lg shrink-0">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-800 truncate">{item.productName}</div>
              <div className="text-xs text-gray-400">{item.supplierName} · {item.quantity} {item.unit}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-semibold text-sm text-[#6C3FE8]">{item.price} DA</div>
              <div className="text-[10px] text-gray-400">/ {item.unit}</div>
            </div>
          </div>
        ))}
        {tab === 'suppliers' && Object.entries(bySupplier).map(([name, items]) => (
          <div key={name} className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-gray-800">{name}</h3>
              <span className="text-xs bg-[#EDE9FE] text-[#6C3FE8] px-2 py-0.5 rounded-full font-medium">
                {items.length} produits
              </span>
            </div>
            <div className="space-y-1.5">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{item.emoji} {item.productName}</span>
                  <span className="text-gray-700 font-medium">{item.price} DA × {item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-gray-400">Sous-total</span>
              <span className="font-semibold text-[#6C3FE8]">
                {items.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString('fr-DZ')} DA
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
