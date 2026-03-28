'use client'

import { useState, useCallback } from 'react'
import { kodianeData } from '../demo-data'
import type { KodianeList, KodianeData } from '../types'
import { KodianeHome } from './KodianeHome'
import { KodianeListDetail } from './KodianeListDetail'
import { KodianeSuppliers } from './KodianeSuppliers'
import { KodianePurchases } from './KodianePurchases'
import { ClipboardList, Building2, ShoppingCart, Settings } from 'lucide-react'

type Screen = 'home' | 'list-detail' | 'suppliers' | 'purchases' | 'settings'

const tabs = [
  { id: 'home' as const, label: 'Listes', icon: ClipboardList },
  { id: 'suppliers' as const, label: 'Fournis.', icon: Building2 },
  { id: 'purchases' as const, label: 'Achats', icon: ShoppingCart },
  { id: 'settings' as const, label: 'Paramètres', icon: Settings },
]

export function KodianeDemo({ onReset }: { onReset?: (resetFn: () => void) => void }) {
  const [data, setData] = useState<KodianeData>(() => structuredClone(kodianeData))
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedList, setSelectedList] = useState<KodianeList | null>(null)

  const reset = useCallback(() => {
    setData(structuredClone(kodianeData))
    setScreen('home')
    setSelectedList(null)
  }, [])

  // Expose reset to parent
  if (onReset) onReset(reset)

  const handleSelectList = (list: KodianeList) => {
    setSelectedList(list)
    setScreen('list-detail')
  }

  const handleAddList = (name: string, location: string) => {
    const newList: KodianeList = {
      id: `l${Date.now()}`,
      name,
      date: new Date().toISOString().split('T')[0],
      location,
      status: 'en-cours',
      items: [],
    }
    setData(prev => ({ ...prev, lists: [newList, ...prev.lists] }))
  }

  const activeTab = screen === 'list-detail' ? 'home' : screen

  return (
    <div className="flex flex-col h-full bg-[#F8F7FF]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Screen content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {screen === 'home' && (
          <KodianeHome
            lists={data.lists}
            supplierCount={data.suppliers.length}
            purchaseCount={data.purchases.length}
            onSelectList={handleSelectList}
            onAddList={handleAddList}
          />
        )}
        {screen === 'list-detail' && selectedList && (
          <KodianeListDetail
            list={selectedList}
            suppliers={data.suppliers}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'suppliers' && (
          <KodianeSuppliers suppliers={data.suppliers} />
        )}
        {screen === 'purchases' && (
          <KodianePurchases purchases={data.purchases} />
        )}
        {screen === 'settings' && (
          <div className="p-4 pt-14">
            <div className="bg-[#4A1FB8] -mx-4 -mt-14 pt-12 pb-8 px-5 rounded-b-3xl mb-6">
              <h1 className="text-white text-xl font-bold">⚙️ Paramètres</h1>
              <p className="text-white/60 text-sm mt-1">Configuration de l&apos;app</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm text-center py-8">
                Les paramètres sont disponibles dans l&apos;application complète.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      {screen !== 'list-detail' && (
        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-2 py-1.5 flex justify-around">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setScreen(id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-0"
            >
              <Icon
                className="w-5 h-5"
                style={{ color: activeTab === id ? '#6C3FE8' : '#9CA3AF' }}
              />
              <span
                className="text-[10px] font-medium truncate"
                style={{ color: activeTab === id ? '#6C3FE8' : '#9CA3AF' }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
