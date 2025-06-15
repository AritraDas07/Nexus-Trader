import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Wallet,
  Bell,
  Settings,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Home,
  PieChart,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { clsx } from 'clsx';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'trading', label: 'Trading', icon: TrendingUp },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet },
  { id: 'charts', label: 'Charts', icon: BarChart3 },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, activeTab, toggleSidebar, setActiveTab } = useUIStore();

  return (
    <motion.div
      initial={false}
      animate={{
        width: sidebarCollapsed ? 80 : 280,
      }}
      className="bg-gray-900 border-r border-gray-800 flex flex-col h-full relative"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <motion.div
            initial={false}
            animate={{
              opacity: sidebarCollapsed ? 0 : 1,
            }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-white">TradePro</span>
            )}
          </motion.div>
          
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {!sidebarCollapsed && (
            <span className="text-sm text-gray-400">Live Market Data</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};