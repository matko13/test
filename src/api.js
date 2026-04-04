const API_BASE = '/api'

async function fetchJSON(path) {
  const resp = await fetch(`${API_BASE}${path}`)
  if (!resp.ok) throw new Error(`API error: ${resp.status}`)
  return resp.json()
}

export const api = {
  getConfig: () => fetchJSON('/config'),
  getToday: () => fetchJSON('/today'),
  getHistory: (period) => fetchJSON(`/history/${period}`),
}
