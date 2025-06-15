import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { MarketOverview } from './components/Dashboard/MarketOverview';
import { TradingChart } from './components/Trading/TradingChart';
import { OrderForm } from './components/Trading/OrderForm';
import { PortfolioOverview } from './components/Portfolio/PortfolioOverview';
import { useUIStore } from './store/uiStore';
import { usePortfolioStore } from './store/portfolioStore';
import { clsx } from 'clsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { theme, activeTab, sidebarCollapsed } = useUIStore();
  const { calculatePortfolioValue } = usePortfolioStore();

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Calculate portfolio value periodically
    const interval = setInterval(() => {
      calculatePortfolioValue();
    }, 5000);

    return () => clearInterval(interval);
  }, [calculatePortfolioValue]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MarketOverview />;
      case 'trading':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2">
              <TradingChart />
            </div>
            <div className="lg:col-span-1">
              <OrderForm />
            </div>
          </div>
        );
      case 'portfolio':
        return <PortfolioOverview />;
      case 'charts':
        return (
          <div className="h-full">
            <TradingChart />
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Coming soon - Advanced portfolio analytics, risk metrics, and performance attribution.
            </p>
          </div>
        );
      case 'alerts':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Smart Alerts
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Coming soon - Price alerts, technical indicator triggers, and portfolio notifications.
            </p>
          </div>
        );
      case 'education':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Trading Education
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Coming soon - Interactive tutorials, strategy guides, and market analysis lessons.
            </p>
          </div>
        );
      case 'social':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Social Trading
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Coming soon - Follow top traders, share strategies, and join trading competitions.
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Coming soon - Customize your trading environment, notifications, and preferences.
            </p>
          </div>
        );
      default:
        return <MarketOverview />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          
          <main className="flex-1 overflow-auto">
            <div className="p-6 h-full">
              {renderContent()}
            </div>
          </main>
        </div>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              border: `1px solid ${theme === 'dark' ? '#4B5563' : '#E5E7EB'}`,
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;