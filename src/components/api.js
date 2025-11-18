const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export async function getPrices() {
  const res = await fetch(`${BASE_URL}/api/prices`)
  if (!res.ok) throw new Error('Failed to fetch prices')
  return res.json()
}

export async function openPosition(payload) {
  const res = await fetch(`${BASE_URL}/api/positions/open`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Failed to open position')
  }
  return res.json()
}

export async function listPositions(wallet) {
  const url = new URL(`${BASE_URL}/api/positions`)
  if (wallet) url.searchParams.set('wallet', wallet)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch positions')
  return res.json()
}

export async function closePosition(position_id, wallet) {
  const res = await fetch(`${BASE_URL}/api/positions/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ position_id, wallet }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Failed to close position')
  }
  return res.json()
}

export { BASE_URL }
