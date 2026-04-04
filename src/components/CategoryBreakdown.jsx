import { CheckCircle, XCircle, Minus } from 'lucide-react'

export default function CategoryBreakdown({ today }) {
  if (!today) return null

  const { player1, player2 } = today
  const cats1 = player1.scores?.categories || []
  const cats2 = player2.scores?.categories || []

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-lg font-bold text-white mb-4 text-center">Kategorie punktowe</h3>
      <div className="space-y-3">
        {cats1.map((cat, idx) => {
          const cat2 = cats2[idx]
          const isDraw = !cat.won && !cat2?.won
          return (
            <div key={cat.key} className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${cat.won ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-slate-800/50'}`}>
                <span className="text-sm font-mono text-slate-300">
                  {cat.value.toFixed(1)} {cat.unit}
                </span>
                {cat.won ? (
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                ) : isDraw ? (
                  <Minus className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </div>

              <div className="text-center min-w-[100px]">
                <div className="text-xs text-slate-400 font-medium">{cat.label}</div>
                <div className="text-[10px] text-slate-600">
                  {cat.points > 0 ? `+${cat.points}` : cat2?.points > 0 ? '' : '0'} | {cat2?.points > 0 ? `+${cat2.points}` : '0'} pkt
                </div>
              </div>

              <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${cat2?.won ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-slate-800/50'}`}>
                {cat2?.won ? (
                  <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                ) : isDraw ? (
                  <Minus className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <span className="text-sm font-mono text-slate-300">
                  {cat2?.value?.toFixed(1) || '0.0'} {cat.unit}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
