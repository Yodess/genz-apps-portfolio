'use client'

import type { KodianeSupplier } from '../types'
import { Phone, MapPin } from 'lucide-react'

interface Props {
  suppliers: KodianeSupplier[]
}

export function KodianeSuppliers({ suppliers }: Props) {
  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-[#6C3FE8] pt-10 pb-6 px-5 rounded-b-3xl">
        <h1 className="text-white text-xl font-bold">🏢 Fournisseurs</h1>
        <p className="text-white/60 text-sm mt-1">
          {suppliers.length} fournisseurs enregistrés
        </p>
      </div>

      {/* List */}
      <div className="px-4 mt-4 space-y-3">
        {suppliers.map(s => (
          <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-xl">
                {s.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-800">{s.name}</h3>
                <span className="text-xs bg-[#EDE9FE] text-[#6C3FE8] px-2 py-0.5 rounded-full font-medium">
                  {s.productCount} produits
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              {s.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="w-3 h-3" /> {s.phone}
                </div>
              )}
              {s.location && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" /> {s.location}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
