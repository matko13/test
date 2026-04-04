function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

function dateSeed(dateStr) {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function generateMockData(player) {
  const today = new Date().toISOString().split('T')[0]
  const seed = dateSeed(today + player)
  const rng = seededRandom(seed)

  const hour = new Date().getHours()
  const isSunny = hour >= 6 && hour <= 20
  const sunFactor = isSunny ? Math.sin(((hour - 6) / 14) * Math.PI) : 0

  const baseCapacity = player === 'player1' ? 10 : 8.5
  const weatherFactor = 0.5 + rng() * 0.5
  const maxProduction = baseCapacity * weatherFactor

  const production = +(maxProduction * (0.7 + rng() * 0.3) * (hour / 14)).toFixed(2)
  const currentPower = +(baseCapacity * 1000 * sunFactor * weatherFactor * (0.7 + rng() * 0.3)).toFixed(0)
  const consumption = +(2 + rng() * 6 + production * 0.3).toFixed(2)
  const selfUsed = Math.min(production, consumption)
  const exported = +(production - selfUsed).toFixed(2)
  const imported = +(consumption - selfUsed).toFixed(2)
  const selfConsumptionRate = production > 0 ? +((selfUsed / production) * 100).toFixed(1) : 0
  const batterySoc = +(20 + rng() * 80).toFixed(0)

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

export function generateMockHistory(player, period) {
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 365
  const results = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const seed = dateSeed(dateStr + player)
    const rng = seededRandom(seed)

    const month = date.getMonth()
    const seasonFactor = [0.3, 0.4, 0.6, 0.75, 0.85, 0.95, 1.0, 0.95, 0.8, 0.6, 0.35, 0.25][month]

    const baseCapacity = player === 'player1' ? 10 : 8.5
    const weatherFactor = 0.3 + rng() * 0.7
    const production = +(baseCapacity * seasonFactor * weatherFactor * (0.7 + rng() * 0.3)).toFixed(2)
    const consumption = +(5 + rng() * 15).toFixed(2)
    const selfUsed = Math.min(production, consumption)
    const exported = +(production - selfUsed).toFixed(2)
    const imported = +(consumption - selfUsed).toFixed(2)

    results.push({
      date: dateStr,
      production: Math.max(0, production),
      consumption: Math.max(0, consumption),
      exported: Math.max(0, exported),
      imported: Math.max(0, imported),
    })
  }

  return results
}
