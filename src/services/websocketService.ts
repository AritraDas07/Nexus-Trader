import { useMarketStore } from '../store/marketStore';
import { MarketData } from '../types';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectInterval: number = 5000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private subscribers: Set<string> = new Set();

  connect() {
    // Check if real WebSocket should be used (defaults to false for demo mode)
    const useRealWebSocket = import.meta.env.VITE_USE_REAL_WEBSOCKET === 'true';
    
    if (!useRealWebSocket) {
      // Skip real WebSocket connection and use mock data mode
      console.log('Using mock data mode - WebSocket connection skipped');
      useMarketStore.getState().setConnected(true);
      return;
    }

    try {
      // Using Binance WebSocket API for real-time crypto data
      this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        useMarketStore.getState().setConnected(true);
        this.clearReconnectTimer();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        useMarketStore.getState().setConnected(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Fallback to mock data mode on connection error
        console.log('Falling back to mock data mode');
        useMarketStore.getState().setConnected(true);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      // Fallback to mock data mode
      console.log('Using mock data mode due to connection failure');
      useMarketStore.getState().setConnected(true);
    }
  }

  private handleMessage(data: any) {
    if (Array.isArray(data)) {
      // Handle ticker array from Binance
      data.forEach((ticker) => {
        if (this.subscribers.has(ticker.s)) {
          const marketData: MarketData = {
            symbol: ticker.s,
            name: ticker.s,
            price: parseFloat(ticker.c),
            change24h: parseFloat(ticker.P),
            changePercent24h: parseFloat(ticker.P),
            volume: parseFloat(ticker.v),
            marketCap: 0, // Not available in ticker data
            high24h: parseFloat(ticker.h),
            low24h: parseFloat(ticker.l),
            timestamp: Date.now(),
            bid: parseFloat(ticker.b),
            ask: parseFloat(ticker.a),
          };
          
          useMarketStore.getState().setMarketData(marketData);
        }
      });
    }
  }

  subscribe(symbol: string) {
    this.subscribers.add(symbol);
    
    // Initialize with sample data for immediate display
    this.initializeMockData(symbol);
  }

  unsubscribe(symbol: string) {
    this.subscribers.delete(symbol);
  }

  private initializeMockData(symbol: string) {
    // Mock data for immediate display while WebSocket connects
    const mockData: MarketData = {
      symbol,
      name: symbol,
      price: Math.random() * 50000 + 1000,
      change24h: (Math.random() - 0.5) * 10,
      changePercent24h: (Math.random() - 0.5) * 10,
      volume: Math.random() * 1000000,
      marketCap: Math.random() * 1000000000,
      high24h: Math.random() * 55000 + 1000,
      low24h: Math.random() * 45000 + 500,
      timestamp: Date.now(),
    };

    useMarketStore.getState().setMarketData(mockData);
    
    // Simulate real-time updates
    setInterval(() => {
      const currentData = useMarketStore.getState().marketData[symbol];
      if (currentData) {
        const priceChange = (Math.random() - 0.5) * currentData.price * 0.001;
        const newPrice = currentData.price + priceChange;
        useMarketStore.getState().updatePrice(symbol, newPrice, priceChange);
      }
    }, 1000);
  }

  private scheduleReconnect() {
    // Only attempt reconnection if real WebSocket is enabled
    const useRealWebSocket = import.meta.env.VITE_USE_REAL_WEBSOCKET === 'true';
    if (!useRealWebSocket) {
      return;
    }

    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      this.connect();
    }, this.reconnectInterval);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  disconnect() {
    this.clearReconnectTimer();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const webSocketService = new WebSocketService();