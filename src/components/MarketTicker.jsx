import { useEffect, useState } from 'react'
import { getPrices } from './api'

export default function MarketTicker() {
  const [prices, setPrices] = useState({})

  useEffect(() => {
    let active = true
    const fetchPrices = async () => {
      try {
        const data = await getPrices()
        if (!active) return
        setPrices(data.prices || {})
      } catch (e) {
        // ignore
      }
    }
    fetchPrices()
    const id = setInterval(fetchPrices, 5000)
    return () => { active = false; clearInterval(id) }
  }, [])

  const entries = Object.entries(prices)

  return (
    <div className="overflow-hidden border-y border-white/5 bg-slate-900/40">
      <div className="whitespace-nowrap animate-[ticker_30s_linear_infinite] py-2 text-sm text-slate-200" style={{
        display: 'inline-block',
      }}>
        {entries.map(([sym, price]) => (
          <span key={sym} className="mx-6">
            <span className="text-slate-400">{sym}/USDT</span>
            <span className="ml-2 text-white font-semibold">{Number(price).toLocaleString()}</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { 0%{ transform: translateX(0)} 100%{ transform: translateX(-50%) } }`}</style>
    </div>
  )
}
