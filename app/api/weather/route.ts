import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetch('https://wttr.in/Chennai?format=j1', {
      next: { revalidate: 600 } // Cache for 10 minutes
    })
    const data = await res.json()
    
    const current = data.current_condition[0]
    
    return NextResponse.json({
      temp: parseInt(current.temp_C),
      high: parseInt(current.temp_C) + 3, // Approximate
      low: parseInt(current.temp_C) - 5,  // Approximate
      condition: current.weatherDesc[0]?.value || 'Clear',
      humidity: current.humidity,
      wind: current.windspeedKmph
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 })
  }
}
