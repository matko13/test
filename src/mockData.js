function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

function dateSeed(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function generateDay(dateStr, player) {
  const seed = dateSeed(dateStr + player)
  const rng = seededRandom(seed)
  const month = new Date(dateStr).getMonth()
  const seasonFactor = [0.3, 0.4, 0.6, 0.75, 0.85, 0.95, 1.0, 0.95, 0.8, 0.6, 0.35, 0.25][month]
  const baseCapacity = player === 'player1' ? 10 : 8.5
  const weatherFactor = 0.3 + rng() * 0.7

  const production = +(baseCapacity * seasonFactor * weatherFactor * (0.7 + rng() * 0.3)).toFixed(2)
  const consumption = +(5 + rng() * 15).toFixed(2)
  const selfUsed = Math.min(production, consumption)
  const exported = +(production - selfUsed).toFixed(2)
  const imported = +(consumption - selfUsed).toFixed(2)
  const selfConsumptionRate = production > 0 ? +((selfUsed / production) * 100).toFixed(1) : 0
  const batterySoc = +(20 + rng() * 80).toFixed(0)
  const currentPower = +(baseCapacity * 1000 * seasonFactor * weatherFactor * (0.5 + rng() * 0.5)).toFixed(0)

  return {
    production: Math.max(0, production),
    consumption: Math.max(0, consumption),
    exported: Math.max(0, exported),
    imported: Math.max(0, imported),
    currentPower: Math.max(0, currentPower),
    batterySoc,
    selfConsumptionRate,
    peakPower: +(currentPower * (1 + rng() * 0.3)).toFixed(0),
  }
}

const CATEGORIES = [
  { key: 'production', label: 'Produkcja', unit: 'kWh', points: 3, higher: true },
  { key: 'selfConsumptionRate', label: 'Autokonsumpcja', unit: '%', points: 2, higher: true },
  { key: 'exported', label: 'Eksport', unit: 'kWh', points: 1, higher: true },
  { key: 'imported', label: 'Import z sieci', unit: 'kWh', points: 2, higher: false },
]

function calcScores(p1, p2) {
  const player1 = { total: 0, categories: [] }
  const player2 = { total: 0, categories: [] }
  for (const cat of CATEGORIES) {
    const v1 = p1[cat.key] || 0
    const v2 = p2[cat.key] || 0
    const p1Won = cat.higher ? v1 > v2 : v1 < v2
    const p2Won = cat.higher ? v2 > v1 : v2 < v1
    player1.total += p1Won ? cat.points : 0
    player2.total += p2Won ? cat.points : 0
    player1.categories.push({ ...cat, value: v1, points: p1Won ? cat.points : 0, won: p1Won })
    player2.categories.push({ ...cat, value: v2, points: p2Won ? cat.points : 0, won: p2Won })
  }
  return { player1, player2, totals: { player1: player1.total, player2: player2.total } }
}

function winner(scores) {
  if (scores.totals.player1 > scores.totals.player2) return 'player1'
  if (scores.totals.player2 > scores.totals.player1) return 'player2'
  return 'draw'
}

export function getMockConfig() {
  return {
    player1: { name: 'Ja (Deye)', inverter: 'Deye', source: 'Home Assistant' },
    player2: { name: 'Sąsiad (Huawei)', inverter: 'Huawei', source: 'FusionSolar' },
    demoMode: true,
  }
}

export function getMockToday() {
  const today = new Date().toISOString().split('T')[0]
  const p1 = generateDay(today, 'player1')
  const p2 = generateDay(today, 'player2')
  const scores = calcScores(p1, p2)
  return {
    date: today,
    player1: { name: 'Ja (Deye)', ...p1, scores: scores.player1 },
    player2: { name: 'Sąsiad (Huawei)', ...p2, scores: scores.player2 },
    winner: winner(scores),
    totalScores: scores.totals,
  }
}

export function getMockHistory(period) {
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 365
  const results = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const p1 = generateDay(dateStr, 'player1')
    const p2 = generateDay(dateStr, 'player2')
    const scores = calcScores(p1, p2)
    results.push({
      date: dateStr,
      player1: { ...p1, scores: scores.player1 },
      player2: { ...p2, scores: scores.player2 },
      winner: winner(scores),
    })
  }
  const p1Wins = results.filter(d => d.winner === 'player1').length
  const p2Wins = results.filter(d => d.winner === 'player2').length
  return {
    period,
    days: results,
    summary: {
      player1Wins: p1Wins,
      player2Wins: p2Wins,
      draws: results.length - p1Wins - p2Wins,
      periodWinner: p1Wins > p2Wins ? 'player1' : p2Wins > p1Wins ? 'player2' : 'draw',
    },
  }
}
