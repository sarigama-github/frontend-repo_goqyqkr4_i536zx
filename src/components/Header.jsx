import { useState } from 'react'
import { Menu, Wallet, TrendingUp } from 'lucide-react'

export default function Header({ onConnect, wallet }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/40 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-white/5 text-slate-200">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-cyan-500" />
            <div className="text-white font-bold tracking-tight">LeverageX</div>
            <span className="text-xs text-slate-400 border border-white/10 px-2 py-0.5 rounded-full">Testnet</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-slate-300">
          <a className="hover:text-white transition" href="#markets">Markets</a>
          <a className="hover:text-white transition" href="#trade">Trade</a>
          <a className="hover:text-white transition" href="#positions">Positions</a>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-slate-300 text-xs hidden sm:block">{wallet ? wallet.slice(0, 6) + '...' + wallet.slice(-4) : 'Not connected'}</div>
          <button onClick={onConnect} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow hover:shadow-lg transition">
            <Wallet size={16} />
            {wallet ? 'Switch Wallet' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  )
}
