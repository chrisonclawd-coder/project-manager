import { NextResponse } from 'next/server';

interface StockAnalysis {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  rsi: number;
  macdStatus: 'bullish' | 'bearish' | 'neutral';
  volumeRatio: number;
  setupStrength: number;
  setupType: 'uptrend-continuation' | 'recovery-play' | 'none';
  pricePosition: {
    above20EMA: boolean;
    below50EMA: boolean;
    above200EMA: boolean;
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
  totalScanned: number;
  matchingSetups: number;
}

// Mock data function - In production, would call TwelveData API
async function analyzeStock(symbol: string, name: string, sector: string): Promise<StockAnalysis | null> {
  try {
    // Simulated API call to TwelveData for real implementation
    // const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.TWELVEDATA_API_KEY}`);
    
    // For now, generate realistic mock data based on symbol hash
    const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    const seed = hash;
    const basePrice = 1000 + (hash % 5000);
    const priceVariation = random(seed);
    const currentPrice = basePrice * (0.95 + priceVariation * 0.1);
    
    // Generate technical indicators with realistic ranges
    const rsi = 30 + random(seed + 1) * 40; // 30-70 range
    const volumeRatio = 0.8 + random(seed + 2) * 2.4; // 0.8-3.2x
    
    // Price position simulation
    const ema20Price = basePrice * (0.98 + random(seed + 3) * 0.04);
    const ema50Price = basePrice * (0.97 + random(seed + 4) * 0.06);
    const ema200Price = basePrice * (0.95 + random(seed + 5) * 0.1);
    
    const above20EMA = currentPrice > ema20Price;
    const below50EMA = currentPrice < ema50Price;
    const above200EMA = currentPrice > ema200Price;
    
    // MACD status
    const macdValue = random(seed + 6) - 0.5;
    const signalLine = random(seed + 7) - 0.5;
    const macdStatus = macdValue > signalLine ? 'bullish' : macdValue < signalLine ? 'bearish' : 'neutral';
    
    // Determine setup type
    let setupType: 'uptrend-continuation' | 'recovery-play' | 'none' = 'none';
    if (above20EMA && below50EMA) {
      setupType = 'uptrend-continuation';
    } else if (!above20EMA && above200EMA) {
      setupType = 'recovery-play';
    }
    
    // Calculate setup strength (1-10)
    let strength = 0;
    
    // Price action (0-2)
    if (setupType !== 'none') strength += 2;
    else if ((above20EMA && below50EMA) || (!above20EMA && above200EMA)) strength += 1;
    
    // RSI (0-2)
    if (rsi >= 40 && rsi <= 60) strength += 2;
    else if (rsi >= 35 && rsi <= 65) strength += 1;
    
    // MACD (0-2)
    if (macdStatus === 'bullish') strength += 2;
    else if (macdStatus === 'neutral') strength += 1;
    
    // Volume (0-2)
    if (volumeRatio > 1.5) strength += 2;
    else if (volumeRatio > 1.2) strength += 1;
    
    // Fundamentals (0-2) - Assume good if in selection
    strength += 2;
    
    // Only return if setup strength >= 5 (minimum tradeable)
    if (strength < 5) {
      return null;
    }
    
    return {
      symbol,
      name,
      sector,
      price: Math.round(currentPrice * 100) / 100,
      rsi: Math.round(rsi * 100) / 100,
      macdStatus,
      volumeRatio: Math.round(volumeRatio * 100) / 100,
      setupStrength: strength,
      setupType,
      pricePosition: {
        above20EMA,
        below50EMA,
        above200EMA,
      },
    };
  } catch (error) {
    console.error(`Error analyzing ${symbol}:`, error);
    return null;
  }
}

export async function GET(request: Request): Promise<NextResponse<ScreenerResponse>> {
  try {
    // Load Nifty 100 stocks list
    const stocksJson = require('@/data/nifty-100-stocks.json');
    const stocks = Array.isArray(stocksJson) ? stocksJson : [];
    
    // Market filters (simulated)
    const nifty50Above20EMA = true; // In production: check actual Nifty 50 price vs 20 EMA
    const vixLevel = 18.5; // Simulated VIX level
    const marketTrendOK = nifty50Above20EMA && vixLevel < 20;
    
    if (!marketTrendOK) {
      return NextResponse.json({
        stocks: [],
        marketFilters: {
          nifty50Above20EMA,
          vixLevel,
          marketTrendOK,
        },
        timestamp: new Date().toISOString(),
        totalScanned: stocks.length,
        matchingSetups: 0,
      });
    }
    
    // Analyze each stock
    const analysisList: StockAnalysis[] = [];
    
    for (const stock of stocks) {
      const analysis = await analyzeStock(stock.symbol, stock.name, stock.sector);
      if (analysis) {
        analysisList.push(analysis);
      }
    }
    
    // Sort by setup strength descending
    analysisList.sort((a, b) => b.setupStrength - a.setupStrength);
    
    return NextResponse.json({
      stocks: analysisList,
      marketFilters: {
        nifty50Above20EMA,
        vixLevel,
        marketTrendOK,
      },
      timestamp: new Date().toISOString(),
      totalScanned: stocks.length,
      matchingSetups: analysisList.length,
    });
  } catch (error) {
    console.error('Screener error:', error);
    
    return NextResponse.json(
      {
        stocks: [],
        marketFilters: {
          nifty50Above20EMA: false,
          vixLevel: 0,
          marketTrendOK: false,
        },
        timestamp: new Date().toISOString(),
        totalScanned: 0,
        matchingSetups: 0,
      },
      { status: 500 }
    );
  }
}
