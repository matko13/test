import { Trophy, Crown, Swords } from 'lucide-react'

export default function ScoreBoard({ today }) {
  if (!today) return null

  const { player1, player2, winner } = today
  const p1Score = today.totalScores?.player1 || 0
  const p2Score = today.totalScores?.player2 || 0
  const maxScore = Math.max(p1Score, p2Score, 1)

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-slide-up">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Swords className="w-6 h-6 text-amber-400" />
        <h2 className="text-xl font-bold text-white">Dzisiejszy pojedynek</h2>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* Player 1 */}
        <div className={`text-center p-4 rounded-xl transition-all ${winner === 'player1' ? 'winner-glow-blue' : ''}`}>
          {winner === 'player1' && (
            <div className="flex justify-center mb-2">
              <Crown className="w-8 h-8 text-amber-400 animate-trophy" />
            </div>
          )}
          <div className="text-sm text-slate-400 mb-1">{player1.name}</div>
          <div className="text-5xl md:text-6xl font-black text-blue-400 animate-count-up">
            {p1Score}
          </div>
          <div className="text-xs text-slate-500 mt-1">punktów</div>
          <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full progress-bar"
              style={{ width: `${(p1Score / maxScore) * 100}%` }}
            />
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <span className="text-lg font-black text-white">VS</span>
          </div>
          {winner === 'draw' && (
            <span className="mt-2 text-xs text-amber-400 font-medium">Remis!</span>
          )}
        </div>

        {/* Player 2 */}
        <div className={`text-center p-4 rounded-xl transition-all ${winner === 'player2' ? 'winner-glow-orange' : ''}`}>
          {winner === 'player2' && (
            <div className="flex justify-center mb-2">
              <Crown className="w-8 h-8 text-amber-400 animate-trophy" />
            </div>
          )}
          <div className="text-sm text-slate-400 mb-1">{player2.name}</div>
          <div className="text-5xl md:text-6xl font-black text-orange-400 animate-count-up">
            {p2Score}
          </div>
          <div className="text-xs text-slate-500 mt-1">punktów</div>
          <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full progress-bar"
              style={{ width: `${(p2Score / maxScore) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
