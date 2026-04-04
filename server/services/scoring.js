const CATEGORIES = [
  { key: 'production', label: 'Produkcja', unit: 'kWh', points: 3, higher: true },
  { key: 'selfConsumptionRate', label: 'Autokonsumpcja', unit: '%', points: 2, higher: true },
  { key: 'exported', label: 'Eksport', unit: 'kWh', points: 1, higher: true },
  { key: 'imported', label: 'Import z sieci', unit: 'kWh', points: 2, higher: false },
]

export function calculateScores(p1Data, p2Data) {
  const player1 = { total: 0, categories: [] }
  const player2 = { total: 0, categories: [] }

  for (const cat of CATEGORIES) {
    const v1 = p1Data[cat.key] || 0
    const v2 = p2Data[cat.key] || 0

    let p1Won, p2Won
    if (cat.higher) {
      p1Won = v1 > v2
      p2Won = v2 > v1
    } else {
      p1Won = v1 < v2
      p2Won = v2 < v1
    }

    const p1Points = p1Won ? cat.points : 0
    const p2Points = p2Won ? cat.points : 0
    player1.total += p1Points
    player2.total += p2Points

    player1.categories.push({ ...cat, value: v1, points: p1Points, won: p1Won })
    player2.categories.push({ ...cat, value: v2, points: p2Points, won: p2Won })
  }

  return {
    player1,
    player2,
    totals: { player1: player1.total, player2: player2.total },
    categories: CATEGORIES,
  }
}

export function determineWinner(scores) {
  if (scores.totals.player1 > scores.totals.player2) return 'player1'
  if (scores.totals.player2 > scores.totals.player1) return 'player2'
  return 'draw'
}
