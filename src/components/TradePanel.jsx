import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react'
import { getPrices, openPosition, listPositions, closePosition } from './api'

const ASSETS = ['BTC', 'ETH', 'SOL', 'BNB', 'ADA']

export default function TradePanel({ wallet }) {
  const [symbol, setSymbol] = useState('BTC')
  const [side, setSide] = useState('long')
  const [leverage, setLeverage] = useState(10)
  const [margin, setMargin] = useState(100)
  const [loading, setLoading] = useState(false)
  const [prices, setPrices] = useState({})
  const [positions, setPositions] = useState([])
  const [error, setError] = useState('')

  const price = prices[symbol] || 0
  const notional = useMemo(() => margin * leverage, [margin, leverage])
  const size = useMemo(() => (price ? notional / price : 0), [price, notional])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await getPrices()
        if (mounted) setPrices(data.prices || {})
      } catch {}
    }
    load()
    const id = setInterval(load, 5000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  useEffect(() => {
    if (!wallet) return
    refreshPositions()
  }, [wallet])

  const refreshPositions = async () => {
    if (!wallet) return
    try {
      const data = await listPositions(wallet)
      setPositions(data.positions || [])
    } catch (e) {
      console.error(e)
    }
  }

  const submit = async () => {
    if (!wallet) { setError('Connect a wallet first'); return }
    setLoading(true); setError('')
    try {
      await openPosition({ wallet, symbol, side, leverage: Number(leverage), margin_usd: Number(margin) })
      await refreshPositions()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = async (id) => {
    setLoading(true)
    try {
      await closePosition(id, wallet)
      await refreshPositions()
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <section id="trade" className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div className="bg-slate-900/40 backdrop-blur border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Place Order</h3>
          <div className="text-slate-400 text-sm">Price: <span className="text-white font-semibold">{price ? price.toLocaleString() : '--'}</span></div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {ASSETS.map(a => (
            <button key={a} onClick={() => setSymbol(a)} className={`px-3 py-2 rounded-lg text-sm ${symbol===a? 'bg-blue-500 text-white':'bg-white/5 text-slate-200 hover:bg-white/10'}`}>{a}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={() => setSide('long')} className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${side==='long'?'bg-emerald-500 text-white':'bg-white/5 text-slate-200 hover:bg-white/10'}`}>
            <ArrowUpRight size={16}/> Long
          </button>
          <button onClick={() => setSide('short')} className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${side==='short'?'bg-rose-500 text-white':'bg-white/5 text-slate-200 hover:bg-white/10'}`}>
            <ArrowDownRight size={16}/> Short
          </button>
        </div>

        <div className="mb-4">
          <label className="text-slate-300 text-sm">Leverage: {leverage}x</label>
          <input type="range" min="1" max="100" value={leverage} onChange={e=>setLeverage(Number(e.target.value))} className="w-full"/>
        </div>

        <div className="mb-4">
          <label className="text-slate-300 text-sm">Margin (USD)</label>
          <input type="number" value={margin} onChange={e=>setMargin(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"/>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm text-slate-300 mb-4">
          <div className="bg-white/5 rounded-lg p-3"><div className="text-slate-400">Notional</div><div className="text-white font-semibold">${notional.toLocaleString()}</div></div>
          <div className="bg-white/5 rounded-lg p-3"><div className="text-slate-400">Size</div><div className="text-white font-semibold">{size.toFixed(6)} {symbol}</div></div>
          <div className="bg-white/5 rounded-lg p-3"><div className="text-slate-400">Est. Fee</div><div className="text-white font-semibold">${(notional*0.0008).toFixed(2)}</div></div>
        </div>

        <button onClick={submit} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl">
          {loading && <Loader2 className="animate-spin" size={16}/>} Open {side==='long'?'Long':'Short'}
        </button>
        {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
      </div>

      <div id="positions" className="bg-slate-900/40 backdrop-blur border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Open Positions</h3>
          <button onClick={refreshPositions} className="text-sm text-slate-300 hover:text-white">Refresh</button>
        </div>

        {(!positions || positions.length===0) && (
          <div className="text-slate-400 text-sm">No open positions yet.</div>
        )}

        <div className="space-y-3">
          {positions.map(p => (
            <div key={p.id} className="bg-white/5 rounded-xl p-4 grid grid-cols-2 md:grid-cols-6 gap-2 items-center text-sm">
              <div className="text-white font-semibold">{p.symbol} / USDT</div>
              <div className="text-slate-300">{p.side.toUpperCase()} {p.leverage}x</div>
              <div className="text-slate-300">Entry: <span className="text-white">{p.entry_price}</span></div>
              <div className="text-slate-300">Notional: <span className="text-white">${p.size_usd}</span></div>
              <div className="text-slate-300">Liq: <span className="text-white">{p.liquidation_price}</span></div>
              <div className="text-right">
                <button onClick={() => handleClose(p.id)} className="px-3 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600">Close</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
