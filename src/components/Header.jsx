import { Sun, Zap, RefreshCw } from 'lucide-react'

export default function Header({ config, useMock, onRefresh }) {
  return (
    <header className="text-center py-8 px-4">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Sun className="w-10 h-10 text-amber-400 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            PV Battle
          </span>
        </h1>
        <Zap className="w-10 h-10 text-yellow-400 animate-pulse" />
      </div>
      <p className="text-slate-400 text-lg">
        {config?.player1?.name || 'Gracz 1'} vs {config?.player2?.name || 'Gracz 2'}
      </p>
      <div className="flex items-center justify-center gap-4 mt-3">
        {useMock && (
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium border border-amber-500/30">
            Tryb Demo
          </span>
        )}
        <button
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          title="Odśwież dane"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
