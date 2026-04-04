import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function LeaderboardTable({ history }) {
  if (!history?.days?.length) return null

  const last7 = history.days.slice(-7)
  const prev7 = history.days.slice(-14, -7)

  const p1WinsRecent = last7.filter(d => d.winner === 'player1').length
  const p2WinsRecent = last7.filter(d => d.winner === 'player2').length
  const p1WinsPrev = prev7.filter(d => d.winner === 'player1').length
  const p2WinsPrev = prev7.filter(d => d.winner === 'player2').length

  const p1Trend = p1WinsRecent - p1WinsPrev
  const p2Trend = p2WinsRecent - p2WinsPrev

  const p1TotalProd = history.days.reduce((s, d) => s + d.player1.production, 0)
  const p2TotalProd = history.days.reduce((s, d) => s + d.player2.production, 0)

  const p1AvgProd = p1TotalProd / history.days.length
  const p2AvgProd = p2TotalProd / history.days.length

  const p1TotalWins = history.days.filter(d => d.winner === 'player1').length
  const p2TotalWins = history.days.filter(d => d.winner === 'player2').length

  const rows = [
    {
      name: 'Gracz 1',
      color: 'blue',
      wins: p1TotalWins,
      winRate: ((p1TotalWins / history.days.length) * 100).toFixed(0),
      totalProd: p1TotalProd.toFixed(1),
      avgProd: p1AvgProd.toFixed(1),
      trend: p1Trend,
      rank: p1TotalWins >= p2TotalWins ? 1 : 2,
    },
    {
      name: 'Gracz 2',
      color: 'orange',
      wins: p2TotalWins,
      winRate: ((p2TotalWins / history.days.length) * 100).toFixed(0),
      totalProd: p2TotalProd.toFixed(1),
      avgProd: p2AvgProd.toFixed(1),
      trend: p2Trend,
      rank: p2TotalWins >= p1TotalWins ? 1 : 2,
    },
  ].sort((a, b) => a.rank - b.rank)

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.35s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-amber-400" />
        <h3 className="text-lg font-bold text-white">Ranking</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs">
              <th className="text-left py-2 px-2">#</th>
              <th className="text-left py-2 px-2">Gracz</th>
              <th className="text-center py-2 px-2">Wygrane</th>
              <th className="text-center py-2 px-2">Win %</th>
              <th className="text-right py-2 px-2">Suma kWh</th>
              <th className="text-right py-2 px-2">Śr. kWh/d</th>
              <th className="text-center py-2 px-2">Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.name}
                className={`border-t border-slate-700/50 ${i === 0 ? 'bg-amber-500/5' : ''}`}
              >
                <td className="py-3 px-2">
                  {row.rank === 1 ? (
                    <Trophy className="w-4 h-4 text-amber-400" />
                  ) : (
                    <span className="text-slate-500 font-mono">{row.rank}</span>
                  )}
                </td>
                <td className={`py-3 px-2 font-medium ${row.color === 'blue' ? 'text-blue-400' : 'text-orange-400'}`}>
                  {row.name}
                </td>
                <td className="py-3 px-2 text-center font-bold text-white">{row.wins}</td>
                <td className="py-3 px-2 text-center text-slate-300">{row.winRate}%</td>
                <td className="py-3 px-2 text-right font-mono text-slate-300">{row.totalProd}</td>
                <td className="py-3 px-2 text-right font-mono text-slate-300">{row.avgProd}</td>
                <td className="py-3 px-2 text-center">
                  {row.trend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400 inline" />
                  ) : row.trend < 0 ? (
                    <TrendingDown className="w-4 h-4 text-red-400 inline" />
                  ) : (
                    <Minus className="w-4 h-4 text-slate-500 inline" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
