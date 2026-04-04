import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts'

const periodLabels = { week: 'Tydzień', month: 'Miesiąc', year: 'Rok' }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-lg p-3 border border-slate-600">
      <p className="text-sm font-medium text-white mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value?.toFixed(2)} kWh
        </p>
      ))}
    </div>
  )
}

export default function HistoryChart({ history, period, onPeriodChange }) {
  if (!history) return null

  const data = history.days.map(d => ({
    date: d.date.slice(5),
    'Gracz 1': d.player1.production,
    'Gracz 2': d.player2.production,
  }))

  const { summary } = history
  const totalDays = summary.player1Wins + summary.player2Wins + summary.draws

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-white">Historia produkcji</h3>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map(p => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Period summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">{summary.player1Wins}</div>
          <div className="text-xs text-slate-400">Wygrane P1</div>
          <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full progress-bar" style={{ width: `${(summary.player1Wins / totalDays) * 100}%` }} />
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-slate-500/10 border border-slate-500/20">
          <div className="text-2xl font-bold text-slate-400">{summary.draws}</div>
          <div className="text-xs text-slate-400">Remisy</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="text-2xl font-bold text-orange-400">{summary.player2Wins}</div>
          <div className="text-xs text-slate-400">Wygrane P2</div>
          <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full progress-bar" style={{ width: `${(summary.player2Wins / totalDays) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              interval={period === 'year' ? 29 : period === 'month' ? 4 : 0}
            />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" kWh" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Gracz 1" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} />
            <Bar dataKey="Gracz 2" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
