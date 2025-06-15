import { create } from 'zustand';
import { MarketData, ChartData } from '../types';

interface MarketState {
  marketData: Record<string, MarketData>;
  chartData: Record<string, ChartData[]>;
  selectedSymbol: string;
  timeframe: string;
  isConnected: boolean;
  lastUpdate: number;
  
  // Actions
  setMarketData: (data: MarketData) => void;
  setChartData: (symbol: string, data: ChartData[]) => void;
  setSelectedSymbol: (symbol: string) => void;
  setTimeframe: (timeframe: string) => void;
  setConnected: (connected: boolean) => void;
  updatePrice: (symbol: string, price: number, change: number) => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  marketData: {},
  chartData: {},
  selectedSymbol: 'BTCUSDT',
  timeframe: '1h',
  isConnected: false,
  lastUpdate: Date.now(),

  setMarketData: (data) =>
    set((state) => ({
      marketData: {
        ...state.marketData,
        [data.symbol]: data,
      },
      lastUpdate: Date.now(),
    })),

  setChartData: (symbol, data) =>
    set((state) => ({
      chartData: {
        ...state.chartData,
        [symbol]: data,
      },
    })),

  setSelectedSymbol: (symbol) =>
    set({ selectedSymbol: symbol }),

  setTimeframe: (timeframe) =>
    set({ timeframe }),

  setConnected: (connected) =>
    set({ isConnected: connected }),

  updatePrice: (symbol, price, change) =>
    set((state) => ({
      marketData: {
        ...state.marketData,
        [symbol]: {
          ...state.marketData[symbol],
          price,
          change24h: change,
          changePercent24h: (change / (price - change)) * 100,
          timestamp: Date.now(),
        },
      },
      lastUpdate: Date.now(),
    })),
}));