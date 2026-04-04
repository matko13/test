import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fetchHAData, fetchHAHistory } from './services/homeAssistant.js'
import { fetchSolarFusionData, fetchSolarFusionHistory } from './services/solarFusion.js'
import { calculateScores, determineWinner } from './services/scoring.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

const PLAYER1 = process.env.PLAYER1_NAME || 'Ja (Deye)'
const PLAYER2 = process.env.PLAYER2_NAME || 'Sąsiad (Huawei)'

app.get('/api/config', (req, res) => {
  res.json({
    player1: { name: PLAYER1, inverter: 'Deye', source: 'Home Assistant' },
    player2: { name: PLAYER2, inverter: 'Huawei', source: 'SolarFusion' },
    demoMode: !process.env.HA_TOKEN || !process.env.SOLARFUSION_API_KEY,
  })
})

app.get('/api/today', async (req, res) => {
  try {
    const [p1Data, p2Data] = await Promise.all([
      fetchHAData(),
      fetchSolarFusionData(),
    ])

    const scores = calculateScores(p1Data, p2Data)
    const winner = determineWinner(scores)

    res.json({
      date: new Date().toISOString().split('T')[0],
      player1: { name: PLAYER1, ...p1Data, scores: scores.player1 },
      player2: { name: PLAYER2, ...p2Data, scores: scores.player2 },
      winner,
      totalScores: scores.totals,
    })
  } catch (err) {
    console.error('Error fetching today data:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/history/:period', async (req, res) => {
  const { period } = req.params
  try {
    const [p1History, p2History] = await Promise.all([
      fetchHAHistory(period),
      fetchSolarFusionHistory(period),
    ])

    const dailyResults = p1History.map((p1Day, idx) => {
      const p2Day = p2History[idx] || {}
      const scores = calculateScores(p1Day, p2Day)
      return {
        date: p1Day.date,
        player1: { ...p1Day, scores: scores.player1 },
        player2: { ...p2Day, scores: scores.player2 },
        winner: determineWinner(scores),
      }
    })

    const p1Wins = dailyResults.filter(d => d.winner === 'player1').length
    const p2Wins = dailyResults.filter(d => d.winner === 'player2').length

    res.json({
      period,
      days: dailyResults,
      summary: {
        player1Wins: p1Wins,
        player2Wins: p2Wins,
        draws: dailyResults.length - p1Wins - p2Wins,
        periodWinner: p1Wins > p2Wins ? 'player1' : p2Wins > p1Wins ? 'player2' : 'draw',
      },
    })
  } catch (err) {
    console.error('Error fetching history:', err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`PV Battle API running on port ${PORT}`)
})
