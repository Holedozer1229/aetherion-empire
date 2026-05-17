import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Using CoinGecko API (free, no key required)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 30 } // Cache for 30 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch BTC price');
    }

    const data = await response.json();
    const btcPrice = data.bitcoin?.usd;

    if (!btcPrice) {
      throw new Error('Invalid response from CoinGecko');
    }

    return NextResponse.json({ 
      price: btcPrice,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch BTC price' },
      { status: 500 }
    );
  }
}
