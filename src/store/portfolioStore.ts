import { create } from 'zustand';
import { Portfolio, Position, Order, Transaction } from '../types';

interface PortfolioState {
  portfolio: Portfolio;
  activeOrders: Order[];
  
  // Actions
  updateBalance: (amount: number) => void;
  addPosition: (position: Position) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  removePosition: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
  calculatePortfolioValue: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolio: {
    id: 'default',
    balance: 100000, // Starting with $100k
    totalValue: 100000,
    pnl: 0,
    pnlPercent: 0,
    positions: [],
    orders: [],
    history: [],
  },
  activeOrders: [],

  updateBalance: (amount) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        balance: state.portfolio.balance + amount,
      },
    })),

  addPosition: (position) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        positions: [...state.portfolio.positions, position],
      },
    })),

  updatePosition: (id, updates) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        positions: state.portfolio.positions.map((pos) =>
          pos.id === id ? { ...pos, ...updates } : pos
        ),
      },
    })),

  removePosition: (id) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        positions: state.portfolio.positions.filter((pos) => pos.id !== id),
      },
    })),

  addOrder: (order) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        orders: [...state.portfolio.orders, order],
      },
      activeOrders: [...state.activeOrders, order],
    })),

  updateOrder: (id, updates) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        orders: state.portfolio.orders.map((order) =>
          order.id === id ? { ...order, ...updates } : order
        ),
      },
      activeOrders: state.activeOrders.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      ),
    })),

  removeOrder: (id) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        orders: state.portfolio.orders.filter((order) => order.id !== id),
      },
      activeOrders: state.activeOrders.filter((order) => order.id !== id),
    })),

  addTransaction: (transaction) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        history: [...state.portfolio.history, transaction],
      },
    })),

  calculatePortfolioValue: () => {
    const state = get();
    const { positions, balance } = state.portfolio;
    
    const positionsValue = positions.reduce((total, position) => {
      return total + (position.quantity * position.currentPrice);
    }, 0);
    
    const totalValue = balance + positionsValue;
    const pnl = totalValue - 100000; // Initial balance
    const pnlPercent = (pnl / 100000) * 100;

    set((state) => ({
      portfolio: {
        ...state.portfolio,
        totalValue,
        pnl,
        pnlPercent,
      },
    }));
  },
}));