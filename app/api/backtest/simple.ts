export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

// Simple backtest - just RSI + volume, very relaxed
interface SimpleStockResult {
  symbol: string
  signals: number
  winRate: number
  avgReturn: number
}

interface SimpleBacktestResponse {
  stocks: SimpleStockResult[]
  summary: {
    totalSignals: number
    avgWinRate: number
    avgReturn: number
  }
}

export async function GET(request: NextRequest) {
  try {
    // Use same symbols
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA']
    const stocks: SimpleStockResult[] = []
    
    // Very relaxed criteria - catch oversold conditions
    for (const symbol of symbols) {
      // Simulate some data based on symbol hash
      const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const random = (seed: number) => {
        const x = Math.sin(seed) * 10000
        return x - Math.floor(x)
      }
      
      // Simulate RSI (oversold is < 30)
      const rsi = 25 + random(hash + 1) * 45
      
      // Simulate volume (1-10x)
      const volumeMultiplier = 1 + random(hash + 2) * 9
      
      // Check criteria - very relaxed
      const isOversold = rsi < 30
      const hasVolume = volumeMultiplier > 2
      
      let signals = 0
      let wins = 0
      
      if (isOversold) {
        // Randomly win some oversold plays
        if (random(hash + 3) > 60) {
          wins++
        } else {
          signals++
        }
      }
      
      if (hasVolume) {
        if (random(hash + 4) > 50) {
          wins++
        } else {
          signals++
        }
      }
      
      const winRate = signals > 0 ? wins / signals : 0
      const avgReturn = (winRate * 0.5 - 0.15) * 100 // Simulated return
      
      stocks.push({
        symbol,
        signals,
        wins,
        winRate,
        avgReturn,
      })
    }
    
    // Calculate summary
    const totalSignals = stocks.reduce((sum, stock) => sum + stock.signals, 0)
    const totalWins = stocks.reduce((sum, stock) => sum + stock.wins, 0)
    const avgWinRate = totalSignals > 0 ? totalWins / totalSignals : 0
    
    // Simulated average return
    const avgReturn = stocks.reduce((sum, stock) => sum + stock.avgReturn, 0) / stocks.length
    
    const summary = {
      totalSignals,
      avgWinRate,
      avgReturn,
    }
    
    return NextResponse.json({
      stocks,
      summary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Simple backtest error:', error)
    return NextResponse.json(
      {
        stocks: [],
        summary: {
          totalSignals: 0,
          avgWinRate: 0,
          avgReturn: 0,
        },
        error: 'Simple backtest failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
