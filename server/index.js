import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fetchHAData, fetchHAHistory } from './services/homeAssistant.js'
import { fetchFusionSolarData, fetchFusionSolarHistory } from './services/fusionSolar.js'
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
    player2: { name: PLAYER2, inverter: 'Huawei', source: 'FusionSolar' },
    demoMode: !process.env.HA_TOKEN || !process.env.FUSIONSOLAR_USER,
  })
})

app.get('/api/today', async (req, res) => {
  try {
    const [p1Data, p2Data] = await Promise.all([
      fetchHAData(),
      fetchFusionSolarData(),
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
      fetchFusionSolarHistory(period),
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

app.get('/api/debug/ha-sensors', async (req, res) => {
  if (!process.env.HA_URL || !process.env.HA_TOKEN) {
    return res.json({ error: 'HA not configured', hint: 'Set HA_URL and HA_TOKEN in .env' })
  }
  try {
    const { default: axios } = await import('axios')
    const resp = await axios.get(`${process.env.HA_URL}/api/states`, {
      headers: { Authorization: `Bearer ${process.env.HA_TOKEN}` },
    })
    const solarSensors = resp.data
      .filter(s => {
        const id = s.entity_id.toLowerCase()
        return id.includes('solar') || id.includes('deye') || id.includes('pv')
          || id.includes('inverter') || id.includes('production') || id.includes('consumption')
          || id.includes('battery') || id.includes('grid') || id.includes('energy')
          || id.includes('solarman') || id.includes('power')
      })
      .map(s => ({
        entity_id: s.entity_id,
        state: s.state,
        unit: s.attributes?.unit_of_measurement || '',
        name: s.attributes?.friendly_name || '',
      }))
    res.json({ count: solarSensors.length, sensors: solarSensors })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/debug/fusionsolar', async (req, res) => {
  if (!process.env.FUSIONSOLAR_USER || !process.env.FUSIONSOLAR_PASSWORD) {
    return res.json({ error: 'FusionSolar not configured', hint: 'Set FUSIONSOLAR_USER and FUSIONSOLAR_PASSWORD in .env' })
  }
  try {
    const { fetchFusionSolarData } = await import('./services/fusionSolar.js')
    const data = await fetchFusionSolarData()
    res.json({ status: 'ok', data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`PV Battle API running on port ${PORT}`)
})
