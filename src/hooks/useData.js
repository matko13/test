import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import { getMockConfig, getMockToday, getMockHistory } from '../mockData'

export function useData() {
  const [config, setConfig] = useState(null)
  const [today, setToday] = useState(null)
  const [history, setHistory] = useState(null)
  const [period, setPeriod] = useState('week')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [useMock, setUseMock] = useState(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [cfg, todayData, histData] = await Promise.all([
        api.getConfig(),
        api.getToday(),
        api.getHistory(period),
      ])
      setConfig(cfg)
      setToday(todayData)
      setHistory(histData)
      setUseMock(false)
    } catch {
      setConfig(getMockConfig())
      setToday(getMockToday())
      setHistory(getMockHistory(period))
      setUseMock(true)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 60_000)
    return () => clearInterval(interval)
  }, [fetchAll])

  const changePeriod = useCallback(async (newPeriod) => {
    setPeriod(newPeriod)
    try {
      const histData = await api.getHistory(newPeriod)
      setHistory(histData)
    } catch {
      setHistory(getMockHistory(newPeriod))
    }
  }, [])

  return { config, today, history, period, changePeriod, loading, error, useMock, refresh: fetchAll }
}
