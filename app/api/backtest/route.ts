import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Types
interface Candle {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface TradeResult {
  entryDate: string
  entryPrice: number
  stopLoss: number
  target1: number
  target2: number
  exitDate?: string
  exitPrice?: number
  profitLoss?: number
  returnPercent?: number
  result?: 'win' | 'loss' | 'pending'
}

interface StockBacktestResult {
  symbol: string
  signals: number
  wins: number
  losses: number
  winRate: number
  totalReturn: number
  avgReturn: number
  trades: TradeResult[]
}

interface BacktestResponse {
  stocks: StockBacktestResult[]
  summary: {
    totalSignals: number
    totalWins: number
    totalLosses: number
    overallWinRate: number
    overallReturn: number
  }
  timestamp: string
  error?: string
}

// Technical Indicators
function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = []
  const k = 2 / (period + 1)

  // Calculate SMA for first point
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += prices[i]
  }
  ema[period - 1] = sum / period

  // Calculate EMA for remaining points
  for (let i = period; i < prices.length; i++) {
    ema[i] = prices[i] * k + (ema[i - 1] || 0) * (1 - k)
  }

  return ema
}

function calculateRSI(prices: number[], period: number = 14): number[] {
  const rsi: number[] = []
  const deltas: number[] = []

  for (let i = 1; i < prices.length; i++) {
    deltas.push(prices[i] - prices[i - 1])
  }

  let gains = 0
  let losses = 0

  for (let i = 0; i < period; i++) {
    if (deltas[i] > 0) gains += deltas[i]
    else losses -= deltas[i]
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  rsi[period] = 100 - 100 / (1 + avgGain / (avgLoss || 1))

  for (let i = period + 1; i < deltas.length; i++) {
    const delta = deltas[i]
    if (delta > 0) {
      avgGain = (avgGain * (period - 1) + delta) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = (avgLoss * (period - 1) - delta) / period
    }

    rsi[i + 1] = 100 - 100 / (1 + avgGain / (avgLoss || 1))
  }

  return rsi
}

function calculateMACD(prices: number[]): { macd: number[]; signal: number[]; histogram: number[] } {
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)

  const macd: number[] = []
  for (let i = 0; i < prices.length; i++) {
    macd[i] = (ema12[i] || 0) - (ema26[i] || 0)
  }

  const signal = calculateEMA(macd.filter(v => v !== undefined), 9)
  const histogram: number[] = []

  for (let i = 0; i < macd.length; i++) {
    histogram[i] = macd[i] - (signal[i - 9] || 0)
  }

  return { macd, signal, histogram }
}

function calculateVolumeMA(volumes: number[], period: number = 20): number[] {
  const sma: number[] = []
  for (let i = period - 1; i < volumes.length; i++) {
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) {
      sum += volumes[j]
    }
    sma[i] = sum / period
  }
  return sma
}

// Fetch historical data from TwelveData
async function fetchHistoricalData(symbol: string, apiKey: string): Promise<Candle[]> {
  try {
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=365&apikey=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`TwelveData API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status === 'error') {
      throw new Error(data.message || `Failed to fetch data for ${symbol}`)
    }

    if (!data.values || !Array.isArray(data.values)) {
      throw new Error(`Invalid data format for ${symbol}`)
    }

    const candles: Candle[] = data.values
      .reverse() // Reverse to get chronological order
      .map((v: any) => ({
        date: v.datetime,
        open: parseFloat(v.open),
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        close: parseFloat(v.close),
        volume: parseInt(v.volume),
      }))
      .filter((c: Candle) => !isNaN(c.close) && c.volume > 0)

    return candles
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error)
    throw error
  }
}

// Check for swing trade entry signals
function findEntrySignals(candles: Candle[]): number[] {
  const signals: number[] = []

  const closes = candles.map(c => c.close)
  const volumes = candles.map(c => c.volume)

  const ema20 = calculateEMA(closes, 20)
  const ema50 = calculateEMA(closes, 50)
  const ema200 = calculateEMA(closes, 200)
  const rsi = calculateRSI(closes, 14)
  const { histogram: macdHist } = calculateMACD(closes)
  const volumeMA = calculateVolumeMA(volumes, 20)

  // Scan for entry signals starting from index 30 (enough data for indicators)
  for (let i = 30; i < candles.length - 1; i++) {
    const price = closes[i]
    const prevPrice = closes[i - 1]
    const currEMA20 = ema20[i]
    const currEMA50 = ema50[i]
    const currEMA200 = ema200[i]
    const prevEMA20 = ema20[i - 1]
    const currRSI = rsi[i]
    const prevMACDHist = macdHist[i - 1] || 0
    const currMACDHist = macdHist[i] || 0
    const currVolume = volumes[i]
    const currVolumeMA = volumeMA[i]

    // Skip if missing data
    if (
      !currEMA20 ||
      !currEMA50 ||
      !currEMA200 ||
      !prevEMA20 ||
      !currRSI ||
      !currVolumeMA
    ) {
      continue
    }

    // Check RSI (35-65 expanded range - relaxed from 40-60)
    if (currRSI < 35 || currRSI > 65) {
      continue
    }

    // Check MACD bullish crossover
    const macdCrossover = prevMACDHist <= 0 && currMACDHist > 0

    if (!macdCrossover) {
      continue
    }

    // Check volume (above 1.2x 20-day average) - relaxed from 1.5x
    if (currVolume < currVolumeMA * 1.2) {
      continue
    }

    // Check uptrend continuation: Price above 20 EMA and below 50 EMA
    const uptrendContinuation = price > currEMA20 && price < currEMA50

    // Check recovery play: Price below 20 EMA and above 200 EMA
    const recoveryPlay = price < currEMA20 && price > currEMA200

    if (uptrendContinuation || recoveryPlay) {
      signals.push(i)
    }
  }

  return signals
}

// Simulate trade execution
function simulateTrade(
  entryIndex: number,
  candles: Candle[],
  maxLookAhead: number = 20,
): TradeResult | null {
  const entryCandle = candles[entryIndex]
  const entryPrice = entryCandle.close
  const stopLoss = entryPrice * 0.98 // 2% below entry
  const target1 = entryPrice * 1.05 // 5% above
  const target2 = entryPrice * 1.08 // 8% above

  let exitDate: string | undefined
  let exitPrice: number | undefined
  let result: 'win' | 'loss' | 'pending' | undefined
  let profitLoss: number | undefined
  let returnPercent: number | undefined

  // Look ahead for SL or TP hits
  for (let i = entryIndex + 1; i < Math.min(entryIndex + maxLookAhead + 1, candles.length); i++) {
    const candle = candles[i]

    // Check if SL was hit
    if (candle.low <= stopLoss) {
      exitDate = candle.date
      exitPrice = stopLoss
      result = 'loss'
      profitLoss = exitPrice - entryPrice
      returnPercent = (profitLoss / entryPrice) * 100
      break
    }

    // Check if Target 2 was hit
    if (candle.high >= target2) {
      exitDate = candle.date
      exitPrice = target2
      result = 'win'
      profitLoss = exitPrice - entryPrice
      returnPercent = (profitLoss / entryPrice) * 100
      break
    }

    // Check if Target 1 was hit
    if (candle.high >= target1) {
      exitDate = candle.date
      exitPrice = target1
      result = 'win'
      profitLoss = exitPrice - entryPrice
      returnPercent = (profitLoss / entryPrice) * 100
      break
    }
  }

  // If no exit found within lookAhead, mark as pending
  if (!result) {
    result = 'pending'
  }

  return {
    entryDate: entryCandle.date,
    entryPrice,
    stopLoss,
    target1,
    target2,
    exitDate,
    exitPrice,
    profitLoss,
    returnPercent,
    result,
  }
}

// Backtest a single stock
async function backtestStock(symbol: string, apiKey: string): Promise<StockBacktestResult> {
  try {
    const candles = await fetchHistoricalData(symbol, apiKey)

    if (candles.length < 200) {
      throw new Error(`Insufficient data for ${symbol} (need 200+ candles, got ${candles.length})`)
    }

    const signalIndices = findEntrySignals(candles)
    const trades = signalIndices
      .map(index => simulateTrade(index, candles))
      .filter((trade): trade is TradeResult => trade !== null && trade.result !== 'pending')

    const wins = trades.filter(t => t.result === 'win').length
    const losses = trades.filter(t => t.result === 'loss').length
    const total = trades.length || 1 // Avoid division by zero

    const totalReturn = trades.reduce((sum, t) => sum + (t.returnPercent || 0), 0)
    const avgReturn = total > 0 ? totalReturn / total : 0

    return {
      symbol,
      signals: signalIndices.length,
      wins,
      losses,
      winRate: total > 0 ? wins / total : 0,
      totalReturn,
      avgReturn,
      trades,
    }
  } catch (error) {
    console.error(`Backtest error for ${symbol}:`, error)
    return {
      symbol,
      signals: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalReturn: 0,
      avgReturn: 0,
      trades: [],
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.TWELVEDATA_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'TWELVEDATA_API_KEY not configured' },
        { status: 500 },
      )
    }

    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA']

    // Run backtests in parallel with error handling
    const results = await Promise.allSettled(
      symbols.map(symbol => backtestStock(symbol, apiKey)),
    )

    const stocks = results
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value
        } else {
          console.error(`Backtest failed for ${symbols[index]}:`, result.reason)
          return {
            symbol: symbols[index],
            signals: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            totalReturn: 0,
            avgReturn: 0,
            trades: [],
          }
        }
      })

    // Calculate summary
    const totalSignals = stocks.reduce((sum, s) => sum + s.signals, 0)
    const totalWins = stocks.reduce((sum, s) => sum + s.wins, 0)
    const totalLosses = stocks.reduce((sum, s) => sum + s.losses, 0)
    const overallReturn = stocks.reduce((sum, s) => sum + s.totalReturn, 0)
    const totalTrades = totalWins + totalLosses || 1

    const response: BacktestResponse = {
      stocks,
      summary: {
        totalSignals,
        totalWins,
        totalLosses,
        overallWinRate: totalTrades > 0 ? totalWins / totalTrades : 0,
        overallReturn,
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    })
  } catch (error) {
    console.error('Backtest error:', error)
    return NextResponse.json(
      {
        error: 'Backtest failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
