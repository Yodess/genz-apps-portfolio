'use client'

import type { MakineDashboardStats } from '../types'

interface Props {
  stats: MakineDashboardStats
}

function fmt(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(v >= 100000 ? 0 : 1)}k` : v.toString()
}

// Mini bar chart in pure SVG
function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  return (
    <svg viewBox="0 0 80 30" className="w-full h-8 mt-3">
      {data.map((v, i) => {
        const h = max > 0 ? (v / max) * 24 : 2
        return (
          <rect
            key={i}
            x={i * 12 + 2}
            y={28 - h}
            width="8"
            height={h}
            rx="2"
            fill={color}
            opacity={0.7 + (i / data.length) * 0.3}
          />
        )
      })}
    </svg>
  )
}

export function MakineDashboard({ stats }: Props) {
  const statCards = [
    { label: 'Capital', value: stats.capital, emoji: '💰', color: '#8B5CF6', chartData: [70, 80, 75, 85, 90, 88, 95] },
    { label: 'Revenue', value: stats.revenue, emoji: '📈', color: '#06B6D4', chartData: [20, 35, 30, 50, 45, 60, 55] },
    { label: 'Dépenses', value: stats.expenses, emoji: '📉', color: '#EF4444', chartData: [40, 35, 45, 30, 38, 33, 28] },
    { label: 'Impayés', value: stats.outstanding, emoji: '⏳', color: '#F59E0B', chartData: [10, 15, 12, 18, 14, 20, 15] },
    { label: 'Pertes', value: stats.wasteValue, emoji: '🗑️', color: '#6B7280', chartData: [5, 3, 8, 4, 6, 2, 7] },
  ]

  const chartTabs = [
    { label: '🏭 Production', color: '#8B5CF6', data: [12, 18, 15, 22, 28, 25, 32] },
    { label: '🛒 Ventes', color: '#06B6D4', data: [8, 14, 20, 16, 24, 22, 30] },
    { label: '📦 Stock', color: '#F59E0B', data: [45, 40, 38, 42, 35, 47, 50] },
  ]

  return (
    <div className="p-4 pt-12 pb-8">
      <h1 className="text-xl font-bold mb-1">🏠 Tableau de bord</h1>
      <p className="text-white/50 text-sm mb-5">Vue d&apos;ensemble de votre activité</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map(({ label, value, emoji, color, chartData }) => (
          <div
            key={label}
            className="rounded-xl p-3 border border-white/10"
            style={{ backgroundColor: `${color}10` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-white/50 font-medium">{emoji} {label}</span>
            </div>
            <div className="text-lg font-bold" style={{ color }}>{fmt(value)} DA</div>
            <MiniChart data={chartData} color={color} />
          </div>
        ))}
        {/* Last card spans full width */}
      </div>

      {/* Charts section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-3">Tendances</h3>
        <div className="flex gap-2 mb-4">
          {chartTabs.map(tab => (
            <span key={tab.label} className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/60">
              {tab.label}
            </span>
          ))}
        </div>
        {/* Area chart SVG */}
        <svg viewBox="0 0 280 100" className="w-full h-24">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,80 L40,65 L80,70 L120,50 L160,35 L200,40 L240,25 L280,20 L280,100 L0,100Z" fill="url(#areaGrad)" />
          <path d="M0,80 L40,65 L80,70 L120,50 L160,35 L200,40 L240,25 L280,20" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
          {[0, 40, 80, 120, 160, 200, 240, 280].map((x, i) => {
            const y = [80, 65, 70, 50, 35, 40, 25, 20][i]
            return <circle key={i} cx={x} cy={y} r="3" fill="#8B5CF6" />
          })}
        </svg>
        <div className="flex justify-between text-[9px] text-white/30 mt-1">
          <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[
          { label: 'Nouveau lot', emoji: '🏭', color: '#8B5CF6' },
          { label: 'Nouvelle vente', emoji: '🛒', color: '#06B6D4' },
          { label: 'Inventaire', emoji: '📦', color: '#F59E0B' },
        ].map(a => (
          <div key={a.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{a.emoji}</div>
            <div className="text-[10px] text-white/60">{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
