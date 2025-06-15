import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, User, Search, Globe } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useMarketStore } from '../../store/marketStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import numeral from 'numeral';

export const Header: React.FC = () => {
  const { theme, toggleTheme, notifications } = useUIStore();
  const { isConnected, lastUpdate } = useMarketStore();
  const { portfolio } = usePortfolioStore();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Market Status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Global Market Cap:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                $2.15T
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <span className="text-gray-600 dark:text-gray-400">24h Vol:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                $95.2B
              </span>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex items-center max-w-md w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search symbols, coins, stocks..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Right Section - Portfolio & Controls */}
        <div className="flex items-center space-x-4">
          {/* Portfolio Summary */}
          <div className="hidden lg:flex items-center space-x-4 text-sm">
            <div className="text-right">
              <div className="text-gray-600 dark:text-gray-400">Portfolio Value</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {numeral(portfolio.totalValue).format('$0,0.00')}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-gray-600 dark:text-gray-400">P&L</div>
              <div className={`font-semibold ${
                portfolio.pnl >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolio.pnl >= 0 ? '+' : ''}{numeral(portfolio.pnl).format('$0,0.00')}
                ({portfolio.pnlPercent >= 0 ? '+' : ''}{numeral(portfolio.pnlPercent).format('0.00')}%)
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notifications.length}
                </div>
              )}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </motion.button>

            {/* User Profile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};