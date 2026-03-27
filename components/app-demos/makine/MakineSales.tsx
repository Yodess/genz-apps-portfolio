'use client'

import { useState } from 'react'
import type { MakineSale } from '../types'

interface Props {
  sales: MakineSale[]
  onAddSale: (clientName: string, productName: string, qty: number, unitPrice: number) => void
}

const paymentColors = {
  paid: { bg: 'rgba(16,185,129,0.2)', text: '#10B981', label: 'Payé' },
  partial: { bg: 'rgba(245,158,11,0.2)', text: '#F59E0B', label: 'Partiel' },
  unpaid: { bg: 'rgba(239,68,68,0.2)', text: '#EF4444', label: 'Impayé' },
}

export function MakineSales({ sales, onAddSale }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [client, setClient] = useState('')
  const [product, setProduct] = useState('')
  const [qty, setQty] = useState('')
  const [price, setPrice] = useState('')

  const totalRevenue = sales.reduce((s, v) => s + v.amountPaid, 0)
  const totalOutstanding = sales.reduce((s, v) => s + (v.total - v.amountPaid), 0)

  const handleSubmit = () => {
    if (!client || !product || !qty || !price) return
    onAddSale(client, product, Number(qty), Number(price))
    setClient('')
    setProduct('')
    setQty('')
    setPrice('')
    setShowForm(false)
  }

  return (
    <div className="p-4 pt-12 pb-4">
      <h1 className="text-xl font-bold mb-1">🛒 Ventes</h1>
      <p className="text-white/50 text-sm mb-5">{sales.length} ventes enregistrées</p>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3">
          <div className="text-[10px] text-cyan-400/60">Revenue</div>
          <div className="text-lg font-bold text-cyan-400">{(totalRevenue / 1000).toFixed(1)}k DA</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
          <div className="text-[10px] text-amber-400/60">Impayés</div>
          <div className="text-lg font-bold text-amber-400">{(totalOutstanding / 1000).toFixed(1)}k DA</div>
        </div>
      </div>

      {/* Add sale */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2.5 rounded-xl text-sm font-medium mb-5 border border-violet-500/30 bg-violet-500/10 text-violet-400"
        >
          + Nouvelle vente
        </button>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5 space-y-2.5">
          <input
            placeholder="Nom du client"
            value={client}
            onChange={e => setClient(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/50"
            autoFocus
          />
          <input
            placeholder="Produit"
            value={product}
            onChange={e => setProduct(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/50"
          />
          <div className="flex gap-2">
            <input
              placeholder="Qté"
              type="number"
              value={qty}
              onChange={e => setQty(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/50"
            />
            <input
              placeholder="Prix unit."
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/50"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg text-sm text-white/50 border border-white/10">
              Annuler
            </button>
            <button onClick={handleSubmit} className="flex-1 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white">
              Ajouter
            </button>
          </div>
        </div>
      )}

      {/* Sales list */}
      <div className="space-y-3">
        {sales.map(sale => {
          const pc = paymentColors[sale.paymentStatus]
          return (
            <div key={sale.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold">{sale.clientName}</h3>
                  <p className="text-[10px] text-white/40">{sale.date}</p>
                </div>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: pc.bg, color: pc.text }}
                >
                  {pc.label}
                </span>
              </div>
              <div className="space-y-1 mb-2">
                {sale.products.map((p, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-white/60">{p.name} × {p.qty}</span>
                    <span className="text-white/80">{(p.qty * p.unitPrice).toLocaleString()} DA</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between text-xs">
                <span className="text-white/40">Total</span>
                <span className="font-bold text-cyan-400">{sale.total.toLocaleString()} DA</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
