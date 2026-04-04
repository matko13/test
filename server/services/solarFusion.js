import axios from 'axios'
import { generateMockData, generateMockHistory } from './mockData.js'

const SF_URL = process.env.SOLARFUSION_URL
const SF_KEY = process.env.SOLARFUSION_API_KEY
const SF_PLANT = process.env.SOLARFUSION_PLANT_ID

async function sfGet(path) {
  return axios.get(`${SF_URL}${path}`, {
    headers: { 'X-API-Key': SF_KEY },
  })
}

export async function fetchSolarFusionData() {
  if (!SF_URL || !SF_KEY) {
    return generateMockData('player2')
  }

  try {
    const resp = await sfGet(`/plants/${SF_PLANT}/realtime`)
    const d = resp.data

    return {
      production: d.daily_production || d.dailyProduction || 0,
      consumption: d.daily_consumption || d.dailyConsumption || 0,
      exported: d.daily_export || d.dailyExport || 0,
      imported: d.daily_import || d.dailyImport || 0,
      currentPower: d.current_power || d.currentPower || 0,
      batterySoc: d.battery_soc || d.batterySoc || 0,
      selfConsumptionRate: d.self_consumption_rate || d.selfConsumptionRate || 0,
      peakPower: d.peak_power || d.peakPower || 0,
    }
  } catch (err) {
    console.error('SolarFusion fetch error, using mock:', err.message)
    return generateMockData('player2')
  }
}

export async function fetchSolarFusionHistory(period) {
  if (!SF_URL || !SF_KEY) {
    return generateMockHistory('player2', period)
  }

  try {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365
    const resp = await sfGet(`/plants/${SF_PLANT}/history?days=${days}`)

    return resp.data.map(entry => ({
      date: entry.date,
      production: entry.production || 0,
      consumption: entry.consumption || 0,
      exported: entry.exported || entry.export || 0,
      imported: entry.imported || entry.import || 0,
    }))
  } catch (err) {
    console.error('SolarFusion history error, using mock:', err.message)
    return generateMockHistory('player2', period)
  }
}
