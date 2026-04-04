import axios from 'axios'
import { generateMockData, generateMockHistory } from './mockData.js'

const FS_USER = process.env.FUSIONSOLAR_USER
const FS_PASS = process.env.FUSIONSOLAR_PASSWORD
const FS_BASE = process.env.FUSIONSOLAR_URL || 'https://intl.fusionsolar.huawei.com/thirdData'

let xsrfToken = null
let tokenExpiry = 0
let cachedStationCode = process.env.FUSIONSOLAR_STATION_CODE || null

async function login() {
  const resp = await axios.post(`${FS_BASE}/login`, {
    userName: FS_USER,
    systemCode: FS_PASS,
  }, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  })

  if (!resp.data.success) {
    throw new Error(`FusionSolar login failed: ${JSON.stringify(resp.data)}`)
  }

  const cookies = resp.headers['set-cookie'] || []
  for (const cookie of cookies) {
    const match = cookie.match(/XSRF-TOKEN=([^;]+)/)
    if (match) {
      xsrfToken = match[1]
      break
    }
  }

  if (!xsrfToken && resp.data?.data?.token) {
    xsrfToken = resp.data.data.token
  }

  tokenExpiry = Date.now() + 18 * 60 * 1000
  console.log('FusionSolar: logged in successfully')
}

async function ensureAuth() {
  if (!xsrfToken || Date.now() >= tokenExpiry) {
    await login()
  }
}

async function fsRequest(endpoint, data = {}) {
  await ensureAuth()

  try {
    const resp = await axios.post(`${FS_BASE}/${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'XSRF-TOKEN': xsrfToken,
      },
    })

    if (!resp.data.success) {
      if ([305, 306, 307].includes(resp.data.failCode)) {
        xsrfToken = null
        await login()
        return fsRequest(endpoint, data)
      }
      if (resp.data.failCode === 407) {
        console.warn('FusionSolar: rate limited, waiting 5s...')
        await new Promise(r => setTimeout(r, 5000))
        return fsRequest(endpoint, data)
      }
      throw new Error(`FusionSolar error: ${JSON.stringify(resp.data)}`)
    }

    return resp.data
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      xsrfToken = null
      await login()
      return fsRequest(endpoint, data)
    }
    throw err
  }
}

async function getStationCode() {
  if (cachedStationCode) return cachedStationCode

  const resp = await fsRequest('getStationList')
  const stations = resp.data || []

  if (stations.length === 0) {
    throw new Error('FusionSolar: no stations found')
  }

  cachedStationCode = stations[0].stationCode
  console.log(`FusionSolar: auto-discovered station "${stations[0].stationName}" (${cachedStationCode})`)
  return cachedStationCode
}

export async function fetchFusionSolarData() {
  if (!FS_USER || !FS_PASS) {
    return generateMockData('player2')
  }

  try {
    const stationCode = await getStationCode()
    const resp = await fsRequest('getStationRealKpi', {
      stationCodes: stationCode,
    })

    const station = resp.data?.[0]
    if (!station) {
      console.warn('FusionSolar: no real-time data, using mock')
      return generateMockData('player2')
    }

    const kpi = station.dataItemMap || {}

    const production = kpi.day_power || 0
    const consumption = kpi.day_power ? (kpi.day_power - (kpi.day_on_grid_power || 0) + (kpi.day_from_grid_power || 0)) : 0

    return {
      production,
      consumption: Math.max(0, consumption),
      exported: kpi.day_on_grid_power || kpi.ongrid_power || 0,
      imported: kpi.day_from_grid_power || 0,
      currentPower: (kpi.active_power || 0) * 1000,
      batterySoc: kpi.battery_soc || 0,
      selfConsumptionRate: kpi.self_sufficiency_rate || (production > 0 ? Math.min(100, ((production - (kpi.day_on_grid_power || 0)) / production) * 100) : 0),
      peakPower: (kpi.peak_power || kpi.active_power || 0) * 1000,
    }
  } catch (err) {
    console.error('FusionSolar fetch error, using mock:', err.message)
    return generateMockData('player2')
  }
}

export async function fetchFusionSolarHistory(period) {
  if (!FS_USER || !FS_PASS) {
    return generateMockHistory('player2', period)
  }

  try {
    const stationCode = await getStationCode()
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365

    const results = []
    const now = new Date()

    const batchSize = period === 'year' ? 30 : days
    for (let i = days - 1; i >= 0; i -= batchSize) {
      const batchDays = Math.min(batchSize, i + 1)
      const promises = []

      for (let j = i; j > i - batchDays && j >= 0; j--) {
        const date = new Date(now)
        date.setDate(date.getDate() - j)
        date.setHours(0, 0, 0, 0)
        const collectTime = date.getTime()

        promises.push(
          fsRequest('getKpiStationDay', {
            stationCodes: stationCode,
            collectTime,
          }).then(resp => {
            const points = resp.data || []
            for (const point of points) {
              const kpi = point.dataItemMap || {}
              results.push({
                date: new Date(point.collectTime).toISOString().split('T')[0],
                production: kpi.inverter_power || kpi.installed_capacity_power || 0,
                consumption: kpi.use_power || 0,
                exported: kpi.ongrid_power || 0,
                imported: kpi.buy_power || 0,
              })
            }
          }).catch(() => {})
        )
      }

      await Promise.all(promises)

      if (i - batchDays >= 0) {
        await new Promise(r => setTimeout(r, 2000))
      }
    }

    results.sort((a, b) => a.date.localeCompare(b.date))

    if (results.length === 0) {
      return generateMockHistory('player2', period)
    }

    return results
  } catch (err) {
    console.error('FusionSolar history error, using mock:', err.message)
    return generateMockHistory('player2', period)
  }
}
