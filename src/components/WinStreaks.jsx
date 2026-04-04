import { Flame, Calendar } from 'lucide-react'

function calculateStreaks(history) {
  if (!history?.days?.length) return { p1Current: 0, p2Current: 0, p1Best: 0, p2Best: 0 }

  let p1Current = 0, p2Current = 0, p1Best = 0, p2Best = 0
  let p1Temp = 0, p2Temp = 0

  for (const day of history.days) {
    if (day.winner === 'player1') {
      p1Temp++
      p2Temp = 0
      p1Best = Math.max(p1Best, p1Temp)
    } else if (day.winner === 'player2') {
      p2Temp++
      p1Temp = 0
      p2Best = Math.max(p2Best, p2Temp)
    } else {
      p1Temp = 0
      p2Temp = 0
    }
  }

  p1Current = p1Temp
  p2Current = p2Temp

  return { p1Current, p2Current, p1Best, p2Best }
}

export default function WinStreaks({ history }) {
  const streaks = calculateStreaks(history)
  const recentDays = history?.days?.slice(-14) || []

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-6 h-6 text-orange-400" />
        <h3 className="text-lg font-bold text-white">Serie zwycięstw</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="text-xs text-slate-400 mb-1">Gracz 1 - aktualna</div>
          <div className="flex items-center justify-center gap-1">
            <Flame className={`w-5 h-5 ${streaks.p1Current > 0 ? 'text-blue-400' : 'text-slate-600'}`} />
            <span className="text-2xl font-bold text-blue-400">{streaks.p1Current}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Rekord: {streaks.p1Best}</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="text-xs text-slate-400 mb-1">Gracz 2 - aktualna</div>
          <div className="flex items-center justify-center gap-1">
            <Flame className={`w-5 h-5 ${streaks.p2Current > 0 ? 'text-orange-400' : 'text-slate-600'}`} />
            <span className="text-2xl font-bold text-orange-400">{streaks.p2Current}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Rekord: {streaks.p2Best}</div>
        </div>
      </div>

      {/* Last 14 days mini calendar */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Ostatnie 14 dni</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {recentDays.map((day, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded flex items-center justify-center text-[9px] font-bold ${
                day.winner === 'player1'
                  ? 'bg-blue-500/30 text-blue-400 border border-blue-500/40'
                  : day.winner === 'player2'
                  ? 'bg-orange-500/30 text-orange-400 border border-orange-500/40'
                  : 'bg-slate-700/50 text-slate-500 border border-slate-600/30'
              }`}
              title={`${day.date}: ${day.winner === 'player1' ? 'P1' : day.winner === 'player2' ? 'P2' : 'Remis'}`}
            >
              {day.date.slice(8)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
