'use client'

import { useState } from 'react'
import type { KodianeList } from '../types'
import { Plus, Search, MapPin, Calendar, Package } from 'lucide-react'

interface Props {
  lists: KodianeList[]
  supplierCount: number
  purchaseCount: number
  onSelectList: (list: KodianeList) => void
  onAddList: (name: string, location: string) => void
}

export function KodianeHome({ lists, supplierCount, purchaseCount, onSelectList, onAddList }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [search, setSearch] = useState('')

  const handleSubmit = () => {
    if (!newName.trim()) return
    onAddList(newName.trim(), newLocation.trim())
    setNewName('')
    setNewLocation('')
    setShowForm(false)
  }

  const totalItems = lists.reduce((sum, l) => sum + l.items.length, 0)
  const filtered = lists.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="pb-2">
      {/* Header */}
      <div className="bg-[#4A1FB8] pt-10 pb-6 px-5 rounded-b-3xl">
        <h1 className="text-white text-xl font-bold mb-1">📋 Mes Listes</h1>
        <p className="text-white/60 text-sm">Gérez vos listes d&apos;achats</p>

        {/* Stat cards */}
        <div className="flex gap-3 mt-5">
          {[
            { label: 'Listes', value: lists.length, color: '#EDE9FE' },
            { label: 'Fournisseurs', value: supplierCount, color: '#FEF3C7' },
            { label: 'Produits', value: totalItems, color: '#DCFCE7' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: color }}>
              <div className="text-xl font-bold text-gray-800">{value}</div>
              <div className="text-[10px] text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm border border-gray-100">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une liste..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Add list button */}
      <div className="px-4 mt-3">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6C3FE8, #5D2FD8)' }}
          >
            <Plus className="w-4 h-4" /> Nouvelle liste
          </button>
        ) : (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
            <input
              type="text"
              placeholder="Nom de la liste"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#6C3FE8]"
              autoFocus
            />
            <input
              type="text"
              placeholder="Lieu (optionnel)"
              value={newLocation}
              onChange={e => setNewLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#6C3FE8]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded-lg text-sm text-gray-500 border border-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 rounded-lg text-sm text-white font-medium"
                style={{ backgroundColor: '#6C3FE8' }}
              >
                Créer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lists */}
      <div className="px-4 mt-4 space-y-3">
        {filtered.map(list => {
          const total = list.items.reduce((s, i) => s + i.price * i.quantity, 0)
          return (
            <button
              key={list.id}
              onClick={() => onSelectList(list)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-50 text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{list.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" /> {list.date}
                    {list.location && (
                      <>
                        <MapPin className="w-3 h-3 ml-1" /> {list.location}
                      </>
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
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">
                  <Package className="w-3 h-3" /> {list.items.length} produits
                </span>
                <span className="font-semibold text-[#6C3FE8]">
                  {total.toLocaleString('fr-DZ')} DA
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
