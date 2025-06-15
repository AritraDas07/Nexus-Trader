import { create } from 'zustand';
import { Watchlist, Alert } from '../types';

interface UIState {
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  activeTab: string;
  watchlists: Watchlist[];
  alerts: Alert[];
  showOrderForm: boolean;
  showAlertForm: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;

  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  addWatchlist: (watchlist: Watchlist) => void;
  updateWatchlist: (id: string, updates: Partial<Watchlist>) => void;
  removeWatchlist: (id: string) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  removeAlert: (id: string) => void;
  setShowOrderForm: (show: boolean) => void;
  setShowAlertForm: (show: boolean) => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  sidebarCollapsed: false,
  activeTab: 'dashboard',
  watchlists: [
    {
      id: 'default',
      name: 'My Watchlist',
      symbols: ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT'],
      color: '#3B82F6',
    },
  ],
  alerts: [],
  showOrderForm: false,
  showAlertForm: false,
  notifications: [],

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  setActiveTab: (tab) =>
    set({ activeTab: tab }),

  addWatchlist: (watchlist) =>
    set((state) => ({
      watchlists: [...state.watchlists, watchlist],
    })),

  updateWatchlist: (id, updates) =>
    set((state) => ({
      watchlists: state.watchlists.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),

  removeWatchlist: (id) =>
    set((state) => ({
      watchlists: state.watchlists.filter((w) => w.id !== id),
    })),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [...state.alerts, alert],
    })),

  updateAlert: (id, updates) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),

  setShowOrderForm: (show) =>
    set({ showOrderForm: show }),

  setShowAlertForm: (show) =>
    set({ showAlertForm: show }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Date.now().toString() },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));