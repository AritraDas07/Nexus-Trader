import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { useMarketStore } from '../../store/marketStore';
import { useUIStore } from '../../store/uiStore';
import { webSocketService } from '../../services/websocketService';
import { apiService } from '../../services/apiService';
import numeral from 'numeral';

export const MarketOverview: React.FC = () => {
  const { marketData, selectedSymbol, setSelectedSymbol } = useMarketStore();
  const { watchlists } = useUIStore();

  useEffect(() => {
    // Initialize WebSocket connection
    webSocketService.connect();
    
    // Subscribe to default symbols
    const defaultSymbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT', 'LINKUSDT'];
    defaultSymbols.forEach(symbol => webSocketService.subscribe(symbol));

    // Fetch initial market data
    apiService.getMarketData(defaultSymbols).then(data => {
      data.forEach(item => {
        useMarketStore.getState().setMarketData(item);
      });
    });

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const marketDataArray = Object.values(marketData);
  const topGainers = marketDataArray
    .filter(item => item.changePercent24h > 0)
    .sort((a, b) => b.changePercent24h - a.changePercent24h)
    .slice(0, 5);
  
  const topLosers = marketDataArray
    .filter(item => item.changePercent24h < 0)
    .sort((a, b) => a.changePercent24h - b.changePercent24h)
    .slice(0, 5);

  const MarketCard: React.FC<{ title: string; data: typeof marketDataArray; icon: React.ReactNode }> = ({
    title,
    data,
    icon,
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {icon}
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedSymbol(item.symbol)}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {item.symbol.slice(0, 3)}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {item.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.symbol}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">
                {numeral(item.price).format('$0,0.00')}
              </div>
              <div className={`text-sm font-medium ${
                item.changePercent24h >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {item.changePercent24h >= 0 ? '+' : ''}{numeral(item.changePercent24h).format('0.00')}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Market Cap
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $2.15T
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            +2.4% from yesterday
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                24h Volume
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $95.2B
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            +12.3% from yesterday
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                BTC Dominance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                52.3%
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            -0.8% from yesterday
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Fear & Greed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                73
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
            Greed
          </p>
        </motion.div>
      </div>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketCard
          title="Top Gainers"
          data={topGainers}
          icon={<TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />}
        />
        
        <MarketCard
          title="Top Losers"
          data={topLosers}
          icon={<TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />}
        />
      </div>

      {/* Watchlist */}
      {watchlists.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            My Watchlist
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlists[0]?.symbols.map((symbol, index) => {
              const data = marketData[symbol];
              if (!data) return null;
              
              return (
                <motion.div
                  key={symbol}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedSymbol(symbol)}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {data.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {symbol}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {numeral(data.price).format('$0,0.00')}
                    </span>
                    <span className={`text-sm font-medium ${
                      data.changePercent24h >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {data.changePercent24h >= 0 ? '+' : ''}{numeral(data.changePercent24h).format('0.00')}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};