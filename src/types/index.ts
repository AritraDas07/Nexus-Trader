export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  timestamp: number;
  bid?: number;
  ask?: number;
}

export interface Position {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  side: 'long' | 'short';
  timestamp: number;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'market' | 'limit' | 'stop' | 'stop-limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  timestamp: number;
  fillPrice?: number;
  fillQuantity?: number;
}

export interface Portfolio {
  id: string;
  balance: number;
  totalValue: number;
  pnl: number;
  pnlPercent: number;
  positions: Position[];
  orders: Order[];
  history: Transaction[];
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  fee: number;
  timestamp: number;
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'percent' | 'volume' | 'indicator';
  condition: 'above' | 'below' | 'crosses';
  value: number;
  message: string;
  isActive: boolean;
  triggered?: boolean;
  timestamp: number;
}

export interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicator {
  name: string;
  type: 'overlay' | 'oscillator';
  parameters: Record<string, number>;
  data: number[];
}

export interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
  color: string;
}

export interface Theme {
  name: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}