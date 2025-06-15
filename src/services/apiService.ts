import { MarketData, ChartData } from '../types';

class APIService {
  private baseURL = 'https://api.coingecko.com/api/v3';

  async getMarketData(symbols: string[]): Promise<MarketData[]> {
    try {
      const ids = symbols.map(s => s.toLowerCase().replace('usdt', '')).join(',');
      const response = await fetch(
        `${this.baseURL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      const data = await response.json();
      
      return data.map((coin: any): MarketData => ({
        symbol: coin.symbol.toUpperCase() + 'USDT',
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_24h || 0,
        changePercent24h: coin.price_change_percentage_24h || 0,
        volume: coin.total_volume || 0,
        marketCap: coin.market_cap || 0,
        high24h: coin.high_24h || coin.current_price,
        low24h: coin.low_24h || coin.current_price,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.getMockMarketData(symbols);
    }
  }

  async getChartData(symbol: string, timeframe: string): Promise<ChartData[]> {
    try {
      // For demo purposes, generate mock chart data
      return this.generateMockChartData(symbol, timeframe);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return this.generateMockChartData(symbol, timeframe);
    }
  }

  private getMockMarketData(symbols: string[]): MarketData[] {
    return symbols.map((symbol): MarketData => ({
      symbol,
      name: symbol.replace('USDT', ''),
      price: Math.random() * 50000 + 1000,
      change24h: (Math.random() - 0.5) * 1000,
      changePercent24h: (Math.random() - 0.5) * 10,
      volume: Math.random() * 1000000,
      marketCap: Math.random() * 1000000000,
      high24h: Math.random() * 55000 + 1000,
      low24h: Math.random() * 45000 + 500,
      timestamp: Date.now(),
    }));
  }

  private generateMockChartData(symbol: string, timeframe: string): ChartData[] {
    const data: ChartData[] = [];
    const now = new Date();
    const intervals = {
      '1m': 1,
      '5m': 5,
      '15m': 15,
      '1h': 60,
      '4h': 240,
      '1d': 1440,
    };
    
    const interval = intervals[timeframe as keyof typeof intervals] || 60;
    const points = 100;
    let basePrice = Math.random() * 50000 + 10000;
    
    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval * 60 * 1000);
      const volatility = basePrice * 0.02;
      const change = (Math.random() - 0.5) * volatility;
      const open = basePrice;
      const close = basePrice + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = Math.random() * 1000000;
      
      data.push({
        time: time.toISOString(),
        open,
        high,
        low,
        close,
        volume,
      });
      
      basePrice = close;
    }
    
    return data;
  }
}

export const apiService = new APIService();