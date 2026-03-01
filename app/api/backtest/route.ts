import { NextRequest, NextResponse } from 'next/server'
import { backtestStockTripleRSI } from './triple-rsi'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA']
    const stocks = []
    
    for (const symbol of symbols) {
      const result = await backtestStockTripleRSI(symbol)
      stocks.push(result)
    }
    
    const totalSignals = stocks.reduce((sum: number, s: any) => sum + s.signals, 0)
    const totalWins = stocks.reduce((sum: number, s: any) => sum + s.wins, 0)
    const totalLosses = stocks.reduce((sum: number, s: any) => sum + s.losses, 0)
    const overallWinRate = totalSignals > 0 ? totalWins / totalSignals : 0
    const overallReturn = stocks.reduce((sum: number, s: any) => sum + s.totalReturn, 0)
    
    return NextResponse.json({
      stocks,
      summary: {
        totalSignals,
        totalWins,
        totalLosses,
        overallWinRate,
        overallReturn,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Backtest error:', error)
    return NextResponse.json({
      stocks: [],
      summary: { totalSignals: 0, totalWins: 0, totalLosses: 0, overallWinRate: 0, overallReturn: 0 },
      error: 'Backtest failed',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
