'use client'

// ArtisanaDZ — terracotta/orange, réseau social + marketplace
export function ArtisanaScene() {
  const c = '#C4501A'
  return (
    <div className="absolute inset-0 p-5 flex gap-3" style={{ background: 'linear-gradient(135deg, #1a1410, #0f0c0a)' }}>
      {/* Colonne feed */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full" style={{ background: c }} />
          <div className="flex-1">
            <div className="h-2 w-20 rounded-full bg-white/20" />
            <div className="h-1.5 w-12 rounded-full bg-white/10 mt-1" />
          </div>
          <div className="px-2 py-1 rounded-md text-[8px] font-medium" style={{ background: c, color: '#fff' }}>Suivre</div>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-3 flex flex-col gap-2">
          <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
          <div className="h-20 rounded-md" style={{ background: `linear-gradient(135deg, ${c}40, ${c}10)` }} />
          <div className="flex gap-3">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{ background: `${c}80` }} /><div className="h-1.5 w-4 rounded-full bg-white/10" /></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-white/20" /><div className="h-1.5 w-4 rounded-full bg-white/10" /></div>
          </div>
        </div>
      </div>
      {/* Colonne marketplace */}
      <div className="w-1/3 flex flex-col gap-2">
        <div className="h-1.5 w-16 rounded-full bg-white/20 mb-1" />
        {[0,1,2].map(i => (
          <div key={i} className="rounded-md bg-white/5 border border-white/10 p-2 flex gap-2 items-center">
            <div className="w-6 h-6 rounded" style={{ background: `${c}50` }} />
            <div className="flex-1"><div className="h-1.5 w-full rounded-full bg-white/15" /><div className="h-1 w-2/3 rounded-full bg-white/10 mt-1" /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Kodiane — vert/teal, listes d'achats + comparaison prix
export function KodianeScene() {
  const c = '#1D9E75'
  return (
    <div className="absolute inset-0 p-5 flex flex-col gap-3" style={{ background: 'linear-gradient(135deg, #0c1614, #08100e)' }}>
      <div className="flex items-center justify-between">
        <div className="h-2 w-24 rounded-full bg-white/20" />
        <div className="px-2 py-1 rounded-md text-[8px] font-medium" style={{ background: c, color: '#fff' }}>+ Liste</div>
      </div>
      {[
        { w: 'w-2/3', best: true },
        { w: 'w-1/2', best: false },
        { w: 'w-3/5', best: false },
      ].map((row, i) => (
        <div key={i} className="rounded-lg bg-white/5 border border-white/10 p-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded" style={{ background: row.best ? c : `${c}40` }} />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className={`h-1.5 ${row.w} rounded-full bg-white/15`} />
            <div className="flex gap-2">
              <div className="h-4 w-12 rounded" style={{ background: `${c}25` }} />
              <div className="h-4 w-10 rounded bg-white/5" />
              <div className="h-4 w-10 rounded bg-white/5" />
            </div>
          </div>
          {row.best && <div className="px-2 py-0.5 rounded text-[7px] font-bold" style={{ background: c, color: '#fff' }}>BEST</div>}
        </div>
      ))}
    </div>
  )
}

// Makine — violet/indigo, dashboard ERP dark glassmorphique
export function MakineScene() {
  const c = '#7F77DD'
  return (
    <div className="absolute inset-0 p-5 flex gap-3" style={{ background: 'linear-gradient(135deg, #14132a, #0c0b1a)' }}>
      {/* Sidebar */}
      <div className="w-1/5 flex flex-col gap-2">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: i === 0 ? c : 'rgba(255,255,255,0.15)' }} />
            <div className="h-1 flex-1 rounded-full" style={{ background: i === 0 ? `${c}60` : 'rgba(255,255,255,0.08)' }} />
          </div>
        ))}
      </div>
      {/* Main : KPI cards + graphe */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[c, '#5DCAA5', '#EF9F27'].map((col, i) => (
            <div key={i} className="rounded-lg p-2 border border-white/10" style={{ background: `${col}18` }}>
              <div className="h-1 w-8 rounded-full bg-white/20" />
              <div className="h-2.5 w-12 rounded-full mt-1.5" style={{ background: `${col}90` }} />
            </div>
          ))}
        </div>
        <div className="flex-1 rounded-lg bg-white/5 border border-white/10 p-3 flex items-end gap-1.5">
          {[40,65,45,80,55,70,90,60].map((h, i) => (
            <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `linear-gradient(to top, ${c}, ${c}40)` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
