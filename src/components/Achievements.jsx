import { Trophy, Flame, Zap, Star, Target, Award, Shield, TrendingUp } from 'lucide-react'

const achievementDefs = [
  {
    id: 'first_win',
    icon: Trophy,
    name: 'Pierwsze zwycięstwo',
    desc: 'Wygraj swój pierwszy dzień',
    check: (h) => h?.days?.some(d => d.winner === 'player1'),
    color: 'amber',
  },
  {
    id: 'streak_3',
    icon: Flame,
    name: 'Seria 3 dni',
    desc: 'Wygraj 3 dni z rzędu',
    check: (h) => hasStreak(h, 3),
    color: 'red',
  },
  {
    id: 'streak_7',
    icon: Flame,
    name: 'Tygodniowa dominacja',
    desc: 'Wygraj 7 dni z rzędu',
    check: (h) => hasStreak(h, 7),
    color: 'orange',
  },
  {
    id: 'production_10',
    icon: Zap,
    name: 'Mega produkcja',
    desc: 'Wyprodukuj ponad 40 kWh w jednym dniu',
    check: (h) => h?.days?.some(d => d.player1.production > 40),
    color: 'yellow',
  },
  {
    id: 'self_90',
    icon: Shield,
    name: 'Samowystarczalny',
    desc: 'Autokonsumpcja powyżej 90%',
    check: (h) => h?.days?.some(d => d.player1.selfConsumptionRate > 90),
    color: 'green',
  },
  {
    id: 'week_winner',
    icon: Star,
    name: 'Mistrz tygodnia',
    desc: 'Wygraj więcej dni w tygodniu',
    check: (h) => h?.summary?.periodWinner === 'player1',
    color: 'blue',
  },
  {
    id: 'zero_import',
    icon: Target,
    name: 'Zero importu',
    desc: 'Dzień bez importu z sieci',
    check: (h) => h?.days?.some(d => d.player1.imported < 0.1),
    color: 'teal',
  },
  {
    id: 'comeback',
    icon: TrendingUp,
    name: 'Comeback',
    desc: 'Wygraj po 3 przegranych z rzędu',
    check: (h) => hasComeback(h),
    color: 'purple',
  },
]

function hasStreak(history, n) {
  if (!history?.days) return false
  let streak = 0
  for (const d of history.days) {
    if (d.winner === 'player1') {
      streak++
      if (streak >= n) return true
    } else {
      streak = 0
    }
  }
  return false
}

function hasComeback(history) {
  if (!history?.days) return false
  let losses = 0
  for (const d of history.days) {
    if (d.winner === 'player2') {
      losses++
    } else if (d.winner === 'player1' && losses >= 3) {
      return true
    } else {
      losses = 0
    }
  }
  return false
}

const colorClasses = {
  amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
  red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
  yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
  green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-400',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
}

export default function Achievements({ history }) {
  const unlocked = achievementDefs.filter(a => a.check(history))
  const locked = achievementDefs.filter(a => !a.check(history))

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-6 h-6 text-amber-400" />
        <h3 className="text-lg font-bold text-white">Osiągnięcia</h3>
        <span className="ml-auto text-sm text-slate-400">
          {unlocked.length}/{achievementDefs.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {unlocked.map(a => {
          const Icon = a.icon
          return (
            <div
              key={a.id}
              className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[a.color]} border transition-transform hover:scale-105`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <div className="text-xs font-bold">{a.name}</div>
              <div className="text-[10px] opacity-60 mt-0.5">{a.desc}</div>
            </div>
          )
        })}

        {locked.map(a => {
          const Icon = a.icon
          return (
            <div key={a.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 opacity-40">
              <Icon className="w-6 h-6 mb-2 text-slate-600" />
              <div className="text-xs font-bold text-slate-600">{a.name}</div>
              <div className="text-[10px] text-slate-700 mt-0.5">{a.desc}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
