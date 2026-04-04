import { Sun, Plug, Upload, Download, Battery, Gauge } from 'lucide-react'

const statDefs = [
  { key: 'production', label: 'Produkcja', icon: Sun, unit: 'kWh', color: 'amber' },
  { key: 'consumption', label: 'Zużycie', icon: Plug, unit: 'kWh', color: 'red' },
  { key: 'exported', label: 'Eksport', icon: Upload, unit: 'kWh', color: 'green' },
  { key: 'imported', label: 'Import', icon: Download, unit: 'kWh', color: 'purple' },
  { key: 'batterySoc', label: 'Bateria', icon: Battery, unit: '%', color: 'teal' },
  { key: 'currentPower', label: 'Moc', icon: Gauge, unit: 'W', color: 'yellow' },
]

const colorMap = {
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: 'text-amber-500' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: 'text-red-500' },
  green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'text-emerald-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', icon: 'text-purple-500' },
  teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400', icon: 'text-teal-500' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', icon: 'text-yellow-500' },
}

function StatCard({ stat, p1Value, p2Value, delay }) {
  const Icon = stat.icon
  const c = colorMap[stat.color]
  const p1 = p1Value ?? 0
  const p2 = p2Value ?? 0
  const max = Math.max(p1, p2, 1)

  return (
    <div
      className={`${c.bg} border ${c.border} rounded-xl p-4 animate-slide-up`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${c.icon}`} />
        <span className="text-sm font-medium text-slate-300">{stat.label}</span>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-blue-400">Gracz 1</span>
            <span className={`font-mono font-bold ${c.text}`}>{p1.toFixed(stat.unit === 'W' ? 0 : 1)} {stat.unit}</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full progress-bar" style={{ width: `${(p1 / max) * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-orange-400">Gracz 2</span>
            <span className={`font-mono font-bold ${c.text}`}>{p2.toFixed(stat.unit === 'W' ? 0 : 1)} {stat.unit}</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full progress-bar" style={{ width: `${(p2 / max) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StatsCards({ today }) {
  if (!today) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {statDefs.map((stat, idx) => (
        <StatCard
          key={stat.key}
          stat={stat}
          p1Value={today.player1[stat.key]}
          p2Value={today.player2[stat.key]}
          delay={0.05 * idx}
        />
      ))}
    </div>
  )
}
