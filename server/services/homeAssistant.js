import axios from 'axios'
import { generateMockData, generateMockHistory } from './mockData.js'

const HA_URL = process.env.HA_URL
const HA_TOKEN = process.env.HA_TOKEN

const sensors = {
  production: process.env.HA_SENSOR_PV_PRODUCTION || 'sensor.deye_daily_production',
  consumption: process.env.HA_SENSOR_PV_CONSUMPTION || 'sensor.deye_daily_consumption',
  export: process.env.HA_SENSOR_PV_EXPORT || 'sensor.deye_daily_export',
  import: process.env.HA_SENSOR_PV_IMPORT || 'sensor.deye_daily_import',
  power: process.env.HA_SENSOR_PV_POWER || 'sensor.deye_current_power',
  batterySoc: process.env.HA_SENSOR_PV_BATTERY_SOC || 'sensor.deye_battery_soc',
  selfConsumption: process.env.HA_SENSOR_PV_SELF_CONSUMPTION || 'sensor.deye_self_consumption_rate',
}

async function getState(entityId) {
  const resp = await axios.get(`${HA_URL}/api/states/${entityId}`, {
    headers: { Authorization: `Bearer ${HA_TOKEN}` },
  })
  return parseFloat(resp.data.state) || 0
}

export async function fetchHAData() {
  if (!HA_URL || !HA_TOKEN) {
    return generateMockData('player1')
  }

  try {
    const [production, consumption, exported, imported, power, batterySoc, selfConsumption] =
      await Promise.all([
        getState(sensors.production),
        getState(sensors.consumption),
        getState(sensors.export),
        getState(sensors.import),
        getState(sensors.power),
        getState(sensors.batterySoc),
        getState(sensors.selfConsumption),
      ])

    return {
      production,
      consumption,
      exported,
      imported,
      currentPower: power,
      batterySoc,
      selfConsumptionRate: selfConsumption || (consumption > 0 ? Math.min(100, ((production - exported) / production) * 100) : 0),
      peakPower: power,
    }
  } catch (err) {
    console.error('HA fetch error, using mock data:', err.message)
    return generateMockData('player1')
  }
}

export async function fetchHAHistory(period) {
  if (!HA_URL || !HA_TOKEN) {
    return generateMockHistory('player1', period)
  }

  try {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const resp = await axios.get(
      `${HA_URL}/api/history/period/${startDate.toISOString()}?filter_entity_id=${sensors.production}`,
      { headers: { Authorization: `Bearer ${HA_TOKEN}` } }
    )

    if (!resp.data?.[0]?.length) {
      return generateMockHistory('player1', period)
    }

    return resp.data[0].map(entry => ({
      date: entry.last_changed.split('T')[0],
      production: parseFloat(entry.state) || 0,
      consumption: 0,
      exported: 0,
      imported: 0,
    }))
  } catch (err) {
    console.error('HA history error, using mock:', err.message)
    return generateMockHistory('player1', period)
  }
}
