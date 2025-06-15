import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Volume,
  Settings,
  Maximize2,
  ChevronDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  CandlestickChart,
  ReferenceLine,
} from 'recharts';
import { useMarketStore } from '../../store/marketStore';
import { apiService } from '../../services/apiService';
import numeral from 'numeral';

const timeframes = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
];

const chartTypes = [
  { label: 'Line', value: 'line', icon: TrendingUp },
  { label: 'Candlestick', value: 'candlestick', icon: BarChart3 },
];

const indicators = [
  { label: 'Moving Average (20)', value: 'ma20', color: '#3B82F6' },
  { label: 'Moving Average (50)', value: 'ma50', color: '#EF4444' },
  { label: 'Bollinger Bands', value: 'bb', color: '#10B981' },
  { label: 'RSI', value: 'rsi', color: '#F59E0B' },
  { label: 'MACD', value: 'macd', color: '#8B5CF6' },
];

export const TradingChart: React.FC = () => {
  const { selectedSymbol, timeframe, setTimeframe, marketData, chartData, setChartData } = useMarketStore();
  const [chartType, setChartType] = useState('line');
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [showIndicators, setShowIndicators] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await apiService.getChartData(selectedSymbol, timeframe);
        setChartData(selectedSymbol, data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [selectedSymbol, timeframe, setChartData]);

  const currentData = chartData[selectedSymbol] || [];
  const currentMarketData = marketData[selectedSymbol];

  // Transform data for chart
  const chartDataFormatted = currentData.map((item, index) => ({
    ...item,
    timestamp: new Date(item.time).getTime(),
    ma20: calculateMA(currentData, index, 20),
    ma50: calculateMA(currentData, index, 50),
  }));

  function calculateMA(data: any[], index: number, period: number): number {
    if (index < period - 1) return data[index]?.close || 0;
    
    const sum = data
      .slice(Math.max(0, index - period + 1), index + 1)
      .reduce((acc, item) => acc + item.close, 0);
    
    return sum / period;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(label).toLocaleString()}
          </p>
          <div className="space-y-1 mt-2">
            <p className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Open: </span>
              <span className="font-semibold">{numeral(data.open).format('$0,0.00')}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">High: </span>
              <span className="font-semibold">{numeral(data.high).format('$0,0.00')}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Low: </span>
              <span className="font-semibold">{numeral(data.low).format('$0,0.00')}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Close: </span>
              <span className="font-semibold">{numeral(data.close).format('$0,0.00')}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Volume: </span>
              <span className="font-semibold">{numeral(data.volume).format('0.0a')}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Chart Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentMarketData?.name || selectedSymbol}
            </h2>
            {currentMarketData && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {numeral(currentMarketData.price).format('$0,0.00')}
                </span>
                <span className={`text-lg font-semibold ${
                  currentMarketData.changePercent24h >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {currentMarketData.changePercent24h >= 0 ? '+' : ''}
                  {numeral(currentMarketData.changePercent24h).format('0.00')}%
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Timeframe Selector */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timeframe === tf.value
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {chartTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setChartType(type.value)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                      chartType === type.value
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Indicators */}
          <div className="relative">
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Indicators
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showIndicators && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10"
              >
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Technical Indicators
                  </h3>
                  <div className="space-y-2">
                    {indicators.map((indicator) => (
                      <label
                        key={indicator.value}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={activeIndicators.includes(indicator.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setActiveIndicators([...activeIndicators, indicator.value]);
                            } else {
                              setActiveIndicators(activeIndicators.filter(i => i !== indicator.value));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: indicator.color }}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {indicator.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartDataFormatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              stroke="#6B7280"
            />
            <YAxis
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => numeral(value).format('$0,0')}
              stroke="#6B7280"
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line
              type="monotone"
              dataKey="close"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2 }}
            />

            {/* Moving Averages */}
            {activeIndicators.includes('ma20') && (
              <Line
                type="monotone"
                dataKey="ma20"
                stroke="#3B82F6"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
            
            {activeIndicators.includes('ma50') && (
              <Line
                type="monotone"
                dataKey="ma50"
                stroke="#EF4444"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {currentMarketData && (
              <>
                <div className="flex items-center space-x-1">
                  <Volume className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Volume:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {numeral(currentMarketData.volume).format('0.0a')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600 dark:text-gray-400">24h High:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {numeral(currentMarketData.high24h).format('$0,0.00')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600 dark:text-gray-400">24h Low:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {numeral(currentMarketData.low24h).format('$0,0.00')}
                  </span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {activeIndicators.map((indicator) => {
              const indicatorConfig = indicators.find(i => i.value === indicator);
              return (
                <div key={indicator} className="flex items-center space-x-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: indicatorConfig?.color }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {indicatorConfig?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};