import { Gauge } from 'lucide-react'

function PowerRing({ value, max, color, label, size = 120 }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(value / max, 1)
  const dashOffset = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#1e293b" strokeWidth="8"
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white">{value.toFixed(0)}</span>
          <span className="text-[10px] text-slate-400">W</span>
        </div>
      </div>
      <span className="text-xs text-slate-400 mt-2">{label}</span>
    </div>
  )
}

export default function LivePowerGauge({ today }) {
  if (!today) return null

  const p1Power = today.player1.currentPower || 0
  const p2Power = today.player2.currentPower || 0
  const maxPower = Math.max(p1Power, p2Power, 1000) * 1.2

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-bold text-white">Aktualna moc</h3>
        <span className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400">Live</span>
        </span>
      </div>
      <div className="flex justify-around items-center">
        <PowerRing value={p1Power} max={maxPower} color="#3b82f6" label="Gracz 1" />
        <div className="text-slate-600 font-bold">VS</div>
        <PowerRing value={p2Power} max={maxPower} color="#f97316" label="Gracz 2" />
      </div>
    </div>
  )
}
