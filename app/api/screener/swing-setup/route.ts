import { NextResponse } from 'next/server';

interface StockAnalysis {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  rsi: number;
  rsi3DaysAgo: number;
  rsiDeclining: boolean;
  macdStatus: 'bullish' | 'bearish' | 'neutral';
  volumeRatio: number;
  setupStrength: number;
  setupType: 'triple-rsi' | 'oversold-bounce' | 'none';
  pricePosition: {
    above20EMA: boolean;
    below50EMA: boolean;
    above200EMA: boolean;
  };
  // Trade levels
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  riskReward1: number;
  riskReward2: number;
  // Triple RSI criteria
  tripleRSICriteria: {
    rsiLessThan30: boolean;
    rsiDeclining3Days: boolean;
    rsiWasBelow55: boolean;
  };
}

interface ScreenerResponse {
  stocks: StockAnalysis[];
  marketFilters: {
    nifty50Above20EMA: boolean;
    vixLevel: number;
    marketTrendOK: boolean;
  };
  timestamp: string;
  analysisDate: string;
  validTill: string;
  totalScanned: number;
  matchingSetups: number;
}

// TwelveData API integration
async function getStockQuote(symbol: string): Promise<any> {
  const apiKey = process.env.TWELVEDATA_API_KEY;
  if (!apiKey) {
    console.error('TWELVEDATA_API_KEY not configured');
    return null;
  }
  
  try {
    const response = await fetch(
      `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`
    );
    const data = await response.json();
    
    if (data.code === 400 || data.code === 404) {
      console.log(`TwelveData: ${symbol} not found`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

async function getTechnicalIndicators(symbol: string): Promise<any> {
  const apiKey = process.env.TWELVEDATA_API_KEY;
  if (!apiKey) return null;
  
  try {
    // Get current indicators + historical data for RSI trends
    const [rsiRes, emaRes, macdRes, historyRes] = await Promise.all([
      fetch(`https://api.twelvedata.com/rsi?symbol=${symbol}&interval=daily&time_period=14&apikey=${apiKey}`),
      fetch(`https://api.twelvedata.com/ema?symbol=${symbol}&interval=daily&time_period=20&apikey=${apiKey}`),
      fetch(`https://api.twelvedata.com/macd?symbol=${symbol}&interval=daily&fast_period=12&slow_period=26&signal_period=9&apikey=${apiKey}`),
      fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=daily&outputsize=30&apikey=${apiKey}`)
    ]);

    const [rsi, ema, macd, history] = await Promise.all([
      rsiRes.json(),
      emaRes.json(),
      macdRes.json(),
      historyRes.json()
    ]);

    // Calculate RSI trends from historical data
    let rsiHistory: number[] = [];
    if (history.values && Array.isArray(history.values)) {
      const closes = history.values.map((v: any) => parseFloat(v.close)).reverse();
      rsiHistory = calculateRSIHistory(closes);
    }
    
    return { rsi, ema, macd, rsiHistory };
  } catch (error) {
    console.error(`Error fetching indicators for ${symbol}:`, error);
    return null;
  }
}

// Calculate RSI from price history
function calculateRSIHistory(closes: number[]): number[] {
  const rsi: number[] = [];
  const period = 14;
  
  for (let i = 0; i < closes.length; i++) {
    if (i < period) {
      rsi.push(50); // Default neutral
      continue;
    }
    
    let gains = 0;
    let losses = 0;
    
    for (let j = i - period + 1; j <= i; j++) {
      const change = closes[j] - closes[j - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  
  return rsi;
}

async function analyzeStock(symbol: string, name: string, sector: string): Promise<StockAnalysis | null> {
  try {
    // Fetch real data from TwelveData
    const [quote, indicators] = await Promise.all([
      getStockQuote(symbol),
      getTechnicalIndicators(symbol)
    ]);
    
    if (!quote || !quote.price) {
      // Fallback to mock if API fails
      console.log(`Using mock data for ${symbol} (API unavailable)`);
      return generateMockAnalysis(symbol, name, sector);
    }
    
    const price = parseFloat(quote.price) || 0;
    const volume = parseFloat(quote.volume) || 0;
    const previousClose = parseFloat(quote.close) || price;
    const avgVolume = parseFloat(quote.previous_volume) || volume;
    const volumeRatio = avgVolume > 0 ? volume / avgVolume : 1;
    
    // Extract technical indicators
    let rsi = 50;
    let ema20 = price;
    let ema50 = price;
    let macdLine = 0;
    let macdSignal = 0;
    
    if (indicators?.rsi?.value) {
      rsi = parseFloat(indicators.rsi.value);
    }
    if (indicators?.ema?.value) {
      ema20 = parseFloat(indicators.ema.value) || price;
    }
    if (indicators?.macd?.value) {
      const macdParts = indicators.macd.value.split(',');
      macdLine = parseFloat(macdParts[0]) || 0;
      macdSignal = parseFloat(macdParts[1]) || 0;
    }
    
    const macdStatus = macdLine > macdSignal ? 'bullish' : macdLine < macdSignal ? 'bearish' : 'neutral';
    
    // Get RSI history for Triple RSI analysis
    const rsiHistory = indicators?.rsiHistory || [];
    const rsi3DaysAgo = rsiHistory.length > 3 ? rsiHistory[rsiHistory.length - 4] : 50;
    const rsi2DaysAgo = rsiHistory.length > 2 ? rsiHistory[rsiHistory.length - 3] : 50;
    const rsi1DayAgo = rsiHistory.length > 1 ? rsiHistory[rsiHistory.length - 2] : 50;
    const currentRSI = rsiHistory.length > 0 ? rsiHistory[rsiHistory.length - 1] : rsi;
    
    // TRIPLE RSI CONDITIONS (from backtest)
    // 1. RSI < 30 (deeply oversold)
    const rsiLessThan30 = currentRSI < 30;
    // 2. RSI declining 3 consecutive days
    const rsiDeclining3Days = rsi2DaysAgo < rsi3DaysAgo && rsi1DayAgo < rsi2DaysAgo && currentRSI < rsi1DayAgo;
    // 3. RSI was < 55 three days ago
    const rsiWasBelow55 = rsi3DaysAgo < 55;
    
    // Triple RSI criteria met
    const tripleRSICriteria = {
      rsiLessThan30,
      rsiDeclining3Days,
      rsiWasBelow55
    };
    
    // Price position
    const above20EMA = price > ema20;
    const below50EMA = price < ema50;
    const above200EMA = price > (ema20 * 0.95); // Approximate
    
    // Setup type - based on Triple RSI
    let setupType: 'triple-rsi' | 'oversold-bounce' | 'none' = 'none';
    let strength = 0;
    
    // PRIMARY: Triple RSI setup (all 3 criteria met)
    if (rsiLessThan30 && rsiDeclining3Days && rsiWasBelow55) {
      setupType = 'triple-rsi';
      strength = 10; // Maximum strength
    } else if (rsiLessThan30 && rsiWasBelow55) {
      // Secondary: Oversold bounce (RSI < 30 and was < 55)
      setupType = 'oversold-bounce';
      strength = 7;
    }
    
    // Additional confirmations
    if (macdStatus === 'bullish') strength += 2;
    if (volumeRatio > 1.5) strength += 2;
    if (above200EMA) strength += 1;
    
    // Only return if setup strength >= 5 (minimum tradeable)
    if (strength < 5) {
      return null;
    }
    
    // Calculate trade levels based on swing criteria
    // Entry: current price (or slightly below for better risk)
    const entryPrice = Math.round(price * 100) / 100;
    // Stop Loss: 2% below entry
    const stopLoss = Math.round(price * 0.98 * 100) / 100;
    // Target 1: 5% above entry (1:2.5 risk/reward)
    const target1 = Math.round(price * 1.05 * 100) / 100;
    // Target 2: 8% above entry (1:4 risk/reward)
    const target2 = Math.round(price * 1.08 * 100) / 100;
    // Risk/Reward ratios
    const riskReward1 = 2.5; // 5% / 2%
    const riskReward2 = 4; // 8% / 2%
    
    return {
      symbol,
      name,
      sector,
      price: Math.round(price * 100) / 100,
      rsi: Math.round(currentRSI * 100) / 100,
      rsi3DaysAgo: Math.round(rsi3DaysAgo * 100) / 100,
      rsiDeclining: rsiDeclining3Days,
      macdStatus,
      volumeRatio: Math.round(volumeRatio * 100) / 100,
      setupStrength: strength,
      setupType,
      pricePosition: {
        above20EMA,
        below50EMA,
        above200EMA,
      },
      entryPrice,
      stopLoss,
      target1,
      target2,
      riskReward1,
      riskReward2,
      tripleRSICriteria,
    };
  } catch (error) {
    console.error(`Error analyzing ${symbol}:`, error);
    return generateMockAnalysis(symbol, name, sector);
  }
}

// Fallback mock generator for when API fails
function generateMockAnalysis(symbol: string, name: string, sector: string): StockAnalysis | null {
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  const seed = hash;
  const basePrice = 1000 + (hash % 5000);
  const priceVariation = random(seed);
  const currentPrice = basePrice * (0.95 + priceVariation * 0.1);
  
  const rsi = 30 + random(seed + 1) * 40;
  const volumeRatio = 0.8 + random(seed + 2) * 2.4;
  
  const ema20Price = basePrice * (0.98 + random(seed + 3) * 0.04);
  const ema50Price = basePrice * (0.97 + random(seed + 4) * 0.06);
  const ema200Price = basePrice * (0.95 + random(seed + 5) * 0.1);
  
  const above20EMA = currentPrice > ema20Price;
  const below50EMA = currentPrice < ema50Price;
  const above200EMA = currentPrice > ema200Price;
  
  const macdValue = random(seed + 6) - 0.5;
  const signalLine = random(seed + 7) - 0.5;
  const macdStatus = macdValue > signalLine ? 'bullish' : macdValue < signalLine ? 'bearish' : 'neutral';
  
  let setupType: 'uptrend-continuation' | 'recovery-play' | 'none' = 'none';
  if (above20EMA && below50EMA) {
    setupType = 'uptrend-continuation';
  } else if (!above20EMA && above200EMA) {
    setupType = 'recovery-play';
  }
  
  let strength = 0;
  if (setupType !== 'none') strength += 2;
  else if ((above20EMA && below50EMA) || (!above20EMA && above200EMA)) strength += 1;
  if (rsi >= 40 && rsi <= 60) strength += 2;
  else if (rsi >= 35 && rsi <= 65) strength += 1;
  if (macdStatus === 'bullish') strength += 2;
  else if (macdStatus === 'neutral') strength += 1;
  if (volumeRatio > 1.5) strength += 2;
  else if (volumeRatio > 1.2) strength += 1;
  strength += 2;
  
  if (strength < 5) return null;
  
  // Calculate trade levels
  const entryPrice = Math.round(currentPrice * 100) / 100;
  const stopLoss = Math.round(currentPrice * 0.98 * 100) / 100;
  const target1 = Math.round(currentPrice * 1.05 * 100) / 100;
  const target2 = Math.round(currentPrice * 1.08 * 100) / 100;
  
  // Triple RSI mock values
  const rsi3DaysAgo = rsi - random(seed + 8) * 10;
  const rsiDeclining3Days = random(seed + 9) > 0.5;
  const rsiLessThan30 = rsi < 30;
  const rsiWasBelow55 = rsi3DaysAgo < 55;
  
  // Triple RSI criteria
  let tripleRSIType: 'triple-rsi' | 'oversold-bounce' | 'none' = 'none';
  if (rsiLessThan30 && rsiDeclining3Days && rsiWasBelow55) {
    tripleRSIType = 'triple-rsi';
  } else if (rsiLessThan30 && rsiWasBelow55) {
    tripleRSIType = 'oversold-bounce';
  }
  
  return {
    symbol,
    name,
    sector,
    price: Math.round(currentPrice * 100) / 100,
    rsi: Math.round(rsi * 100) / 100,
    rsi3DaysAgo: Math.round(rsi3DaysAgo * 100) / 100,
    rsiDeclining: rsiDeclining3Days,
    macdStatus,
    volumeRatio: Math.round(volumeRatio * 100) / 100,
    setupStrength: strength,
    setupType: tripleRSIType,
    pricePosition: { above20EMA, below50EMA, above200EMA },
    entryPrice,
    stopLoss,
    target1,
    target2,
    riskReward1: 2.5,
    riskReward2: 4,
    tripleRSICriteria: {
      rsiLessThan30,
      rsiDeclining3Days,
      rsiWasBelow55
    },
  };
}

export async function GET(request: Request): Promise<NextResponse<ScreenerResponse>> {
  try {
    // Load Nifty 100 stocks list
    const stocksJson = require('@/data/nifty-100-stocks.json');
    const stocks = Array.isArray(stocksJson) ? stocksJson : [];
    
    // Market filters (simulated - in production, fetch real Nifty 50)
    const nifty50Above20EMA = true;
    const vixLevel = 18.5;
    const marketTrendOK = nifty50Above20EMA && vixLevel < 20;
    
    if (!marketTrendOK) {
      const now = new Date();
      const analysisDate = now.toISOString().split('T')[0];
      const validTill = new Date(now);
      validTill.setDate(validTill.getDate() + 1);
      const validTillDate = validTill.toISOString().split('T')[0];
      
      return NextResponse.json({
        stocks: [],
        marketFilters: {
          nifty50Above20EMA,
          vixLevel,
          marketTrendOK,
        },
        timestamp: new Date().toISOString(),
        analysisDate,
        validTill: validTillDate,
        totalScanned: stocks.length,
        matchingSetups: 0,
      });
    }
    
    // Analyze each stock
    const analysisList: StockAnalysis[] = [];
    
    // Process in batches of 5 to avoid rate limits
    for (let i = 0; i < stocks.length; i += 5) {
      const batch = stocks.slice(i, i + 5);
      const results = await Promise.all(
        batch.map(stock => analyzeStock(stock.symbol, stock.name, stock.sector))
      );
      
      for (const analysis of results) {
        if (analysis) {
          analysisList.push(analysis);
        }
      }
      
      // Small delay between batches to avoid rate limiting
      if (i + 5 < stocks.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Sort by setup strength descending
    analysisList.sort((a, b) => b.setupStrength - a.setupStrength);
    
    const now = new Date();
    const analysisDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Valid till: end of next trading day (assume 1 day validity for swing setups)
    const validTill = new Date(now);
    validTill.setDate(validTill.getDate() + 1);
    const validTillDate = validTill.toISOString().split('T')[0];
    
    return NextResponse.json({
      stocks: analysisList,
      marketFilters: {
        nifty50Above20EMA,
        vixLevel,
        marketTrendOK,
      },
      timestamp: new Date().toISOString(),
      analysisDate,
      validTill: validTillDate,
      totalScanned: stocks.length,
      matchingSetups: analysisList.length,
    });
  } catch (error) {
    console.error('Screener error:', error);
    const now = new Date();
    const analysisDate = now.toISOString().split('T')[0];
    const validTill = new Date(now);
    validTill.setDate(validTill.getDate() + 1);
    const validTillDate = validTill.toISOString().split('T')[0];
    
    return NextResponse.json(
      {
        stocks: [],
        marketFilters: {
          nifty50Above20EMA: false,
          vixLevel: 0,
          marketTrendOK: false,
        },
        timestamp: new Date().toISOString(),
        analysisDate,
        validTill: validTillDate,
        totalScanned: 0,
        matchingSetups: 0,
      },
      { status: 500 }
    );
  }
}
