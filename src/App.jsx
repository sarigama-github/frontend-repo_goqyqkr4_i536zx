import { useState } from 'react'
import Header from './components/Header'
import MarketTicker from './components/MarketTicker'
import TradePanel from './components/TradePanel'

function App() {
  const [wallet, setWallet] = useState('')

  const connectWallet = async () => {
    // For this demo, just prompt a pseudo wallet address
    const w = prompt('Enter your wallet address (demo)')
    if (w) setWallet(w)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Header onConnect={connectWallet} wallet={wallet} />
      <MarketTicker />

      <main>
        <section className="max-w-6xl mx-auto px-4 pt-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Trade top crypto with leverage</h1>
          <p className="text-slate-300 mt-2">BTC, ETH, SOL and more. Paper trade on testnet with instant settlement.</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{t:'Max Leverage',v:'100x'},{t:'Maker/Taker',v:'0.02% / 0.08%'},{t:'Funding',v:'0.01%/8h'},{t:'Engine',v:'Off-chain sim'}].map((i,idx)=>(
              <div key={idx} className="bg-white/5 rounded-xl p-4">
                <div className="text-slate-400 text-xs">{i.t}</div>
                <div className="text-white font-semibold text-lg">{i.v}</div>
              </div>
            ))}
          </div>
        </section>

        <TradePanel wallet={wallet} />

        <section id="disclaimer" className="max-w-6xl mx-auto px-4 pb-16 text-slate-400 text-xs">
          <p>
            Disclaimer: This is a demo trading interface for educational purposes only. Prices are mocked and no real
            trades are executed. Always do your own research. Leverage trading is high risk and can result in losses.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
