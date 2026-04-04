import { useData } from './hooks/useData'
import Header from './components/Header'
import ScoreBoard from './components/ScoreBoard'
import CategoryBreakdown from './components/CategoryBreakdown'
import StatsCards from './components/StatsCards'
import LivePowerGauge from './components/LivePowerGauge'
import HistoryChart from './components/HistoryChart'
import WinStreaks from './components/WinStreaks'
import Achievements from './components/Achievements'
import LeaderboardTable from './components/LeaderboardTable'
import { Loader2 } from 'lucide-react'

export default function App() {
  const { config, today, history, period, changePeriod, loading, useMock, refresh } = useData()

  if (loading && !today) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
          <p className="text-slate-400">Ładowanie danych PV...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Header config={config} useMock={useMock} onRefresh={refresh} />

        <div className="space-y-6">
          <ScoreBoard today={today} />

          <div className="grid md:grid-cols-2 gap-6">
            <CategoryBreakdown today={today} />
            <LivePowerGauge today={today} />
          </div>

          <StatsCards today={today} />

          <HistoryChart history={history} period={period} onPeriodChange={changePeriod} />

          <div className="grid md:grid-cols-2 gap-6">
            <WinStreaks history={history} />
            <LeaderboardTable history={history} />
          </div>

          <Achievements history={history} />
        </div>

        <footer className="text-center mt-12 text-xs text-slate-600">
          <p>PV Battle - Gamifikacja produkcji fotowoltaicznej</p>
          <p className="mt-1">Deye (Home Assistant) vs Huawei (SolarFusion)</p>
        </footer>
      </div>
    </div>
  )
}
