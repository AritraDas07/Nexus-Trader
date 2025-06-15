import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  BarChart3,
  Target,
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Pie } from 'recharts';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useMarketStore } from '../../store/marketStore';
import numeral from 'numeral';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const PortfolioOverview: React.FC = () => {
  const { portfolio } = usePortfolioStore();
  const { marketData } = useMarketStore();

  // Calculate portfolio metrics
  const totalPositionsValue = portfolio.positions.reduce((total, position) => {
    const currentPrice = marketData[position.symbol]?.price || position.currentPrice;
    return total + (position.quantity * currentPrice);
  }, 0);

  const totalPnL = portfolio.positions.reduce((total, position) => {
    const currentPrice = marketData[position.symbol]?.price || position.currentPrice;
    const currentValue = position.quantity * currentPrice;
    const initialValue = position.quantity * position.avgPrice;
    return total + (currentValue - initialValue);
  }, 0);

  const totalPnLPercent = totalPositionsValue > 0 ? (totalPnL / (totalPositionsValue - totalPnL)) * 100 : 0;

  // Portfolio allocation data for pie chart
  const allocationData = portfolio.positions.map((position, index) => {
    const currentPrice = marketData[position.symbol]?.price || position.currentPrice;
    const value = position.quantity * currentPrice;
    return {
      name: position.symbol.replace('USDT', ''),
      value,
      color: COLORS[index % COLORS.length],
    };
  });

  // Add cash allocation
  if (portfolio.balance > 0) {
    allocationData.push({
      name: 'Cash',
      value: portfolio.balance,
      color: '#6B7280',
    });
  }

  // Mock historical performance data
  const performanceData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 100000 + (Math.random() - 0.5) * 10000 + (i * 500),
  }));

  const stats = [
    {
      label: 'Total Value',
      value: numeral(portfolio.balance + totalPositionsValue).format('$0,0.00'),
      change: totalPnLPercent,
      icon: Wallet,
      color: 'blue',
    },
    {
      label: 'Unrealized P&L',
      value: numeral(totalPnL).format('$0,0.00'),
      change: totalPnLPercent,
      icon: totalPnL >= 0 ? TrendingUp : TrendingDown,
      color: totalPnL >= 0 ? 'green' : 'red',
    },
    {
      label: 'Available Cash',
      value: numeral(portfolio.balance).format('$0,0.00'),
      change: 0,
      icon: Target,
      color: 'gray',
    },
    {
      label: 'Positions',
      value: portfolio.positions.length.toString(),
      change: 0,
      icon: PieChart,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  {stat.change !== 0 && (
                    <p className={`text-sm mt-1 ${
                      stat.change >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change >= 0 ? '+' : ''}{numeral(stat.change).format('0.00')}%
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${{
                  blue: 'bg-blue-100 dark:bg-blue-900',
                  green: 'bg-green-100 dark:bg-green-900',
                  red: 'bg-red-100 dark:bg-red-900',
                  gray: 'bg-gray-100 dark:bg-gray-700',
                  purple: 'bg-purple-100 dark:bg-purple-900',
                }[stat.color]}`}>
                  <Icon className={`w-6 h-6 ${{
                    blue: 'text-blue-600 dark:text-blue-400',
                    green: 'text-green-600 dark:text-green-400',
                    red: 'text-red-600 dark:text-red-400',
                    gray: 'text-gray-600 dark:text-gray-400',
                    purple: 'text-purple-600 dark:text-purple-400',
                  }[stat.color]}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Portfolio Performance
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => numeral(value).format('$0,0')}
                />
                <Tooltip
                  formatter={(value: number) => [numeral(value).format('$0,0.00'), 'Portfolio Value']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Portfolio Allocation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Asset Allocation
            </h3>
            <PieChart className="w-5 h-5 text-gray-500" />
          </div>
          
          {allocationData.length > 0 ? (
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [numeral(value).format('$0,0.00'), 'Value']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {numeral(portfolio.balance + totalPositionsValue).format('$0,0')}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Value
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No positions yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Start trading to see your allocation
                </p>
              </div>
            </div>
          )}
          
          {allocationData.length > 0 && (
            <div className="mt-4 space-y-2">
              {allocationData.map((item, index) => {
                const percentage = (item.value / (portfolio.balance + totalPositionsValue)) * 100;
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {numeral(percentage).format('0.0')}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {numeral(item.value).format('$0,0')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Positions Table */}
      {portfolio.positions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Open Positions
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Avg Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {portfolio.positions.map((position) => {
                  const currentPrice = marketData[position.symbol]?.price || position.currentPrice;
                  const currentValue = position.quantity * currentPrice;
                  const initialValue = position.quantity * position.avgPrice;
                  const pnl = currentValue - initialValue;
                  const pnlPercent = (pnl / initialValue) * 100;
                  
                  return (
                    <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {position.symbol.slice(0, 3)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {position.symbol.replace('USDT', '')}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {position.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {numeral(position.quantity).format('0,0.000000')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {numeral(position.avgPrice).format('$0,0.00')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {numeral(currentPrice).format('$0,0.00')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {numeral(currentValue).format('$0,0.00')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          pnl >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {pnl >= 0 ? '+' : ''}{numeral(pnl).format('$0,0.00')}
                        </div>
                        <div className={`text-xs ${
                          pnl >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {pnl >= 0 ? '+' : ''}{numeral(pnlPercent).format('0.00')}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};