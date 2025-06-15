import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  AlertCircle,
  Check,
} from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useMarketStore } from '../../store/marketStore';
import { useUIStore } from '../../store/uiStore';
import { Order } from '../../types';
import numeral from 'numeral';
import { clsx } from 'clsx';

const orderSchema = z.object({
  type: z.enum(['market', 'limit', 'stop', 'stop-limit']),
  side: z.enum(['buy', 'sell']),
  quantity: z.number().min(0.001, 'Minimum quantity is 0.001'),
  price: z.number().min(0.01, 'Minimum price is $0.01').optional(),
  stopPrice: z.number().min(0.01, 'Minimum stop price is $0.01').optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

const orderTypes = [
  { value: 'market', label: 'Market', description: 'Execute immediately at market price' },
  { value: 'limit', label: 'Limit', description: 'Execute at specific price or better' },
  { value: 'stop', label: 'Stop', description: 'Trigger market order at stop price' },
  { value: 'stop-limit', label: 'Stop Limit', description: 'Trigger limit order at stop price' },
];

export const OrderForm: React.FC = () => {
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<string>('market');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stopPrice, setStopPrice] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);

  const { portfolio, addOrder, updateBalance } = usePortfolioStore();
  const { selectedSymbol, marketData } = useMarketStore();
  const { addNotification } = useUIStore();

  const currentPrice = marketData[selectedSymbol]?.price || 0;
  const estimatedTotal = parseFloat(quantity || '0') * (parseFloat(price) || currentPrice);
  const availableBalance = orderSide === 'buy' ? portfolio.balance : 0;
  const tradingFee = estimatedTotal * 0.001; // 0.1% trading fee

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      type: 'market',
      side: 'buy',
      quantity: 0,
    },
  });

  const watchedType = watch('type');

  const handlePercentageClick = (percent: number) => {
    setPercentage(percent);
    if (orderSide === 'buy' && currentPrice > 0) {
      const availableForTrade = availableBalance * (percent / 100);
      const calculatedQuantity = availableForTrade / currentPrice;
      setQuantity(calculatedQuantity.toFixed(6));
      setValue('quantity', calculatedQuantity);
    }
  };

  const onSubmit = (data: OrderFormData) => {
    try {
      const order: Order = {
        id: Date.now().toString(),
        symbol: selectedSymbol,
        type: data.type,
        side: orderSide,
        quantity: data.quantity,
        price: data.price,
        stopPrice: data.stopPrice,
        status: 'pending',
        timestamp: Date.now(),
      };

      // Simulate order execution for market orders
      if (data.type === 'market') {
        const executionPrice = currentPrice + (Math.random() - 0.5) * currentPrice * 0.001; // Small slippage
        order.status = 'filled';
        order.fillPrice = executionPrice;
        order.fillQuantity = data.quantity;

        // Update balance
        const totalCost = data.quantity * executionPrice + tradingFee;
        if (orderSide === 'buy') {
          updateBalance(-totalCost);
        } else {
          updateBalance(data.quantity * executionPrice - tradingFee);
        }
      }

      addOrder(order);
      
      addNotification({
        type: 'success',
        message: `${orderSide.toUpperCase()} order for ${data.quantity} ${selectedSymbol} placed successfully`,
        timestamp: Date.now(),
      });

      // Reset form
      setQuantity('');
      setPrice('');
      setStopPrice('');
      setPercentage(0);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to place order',
        timestamp: Date.now(),
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Place Order
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {selectedSymbol}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Order Side */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setOrderSide('buy')}
            className={clsx(
              'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors',
              orderSide === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Buy</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderSide('sell')}
            className={clsx(
              'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors',
              orderSide === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <TrendingDown className="w-4 h-4" />
            <span>Sell</span>
          </button>
        </div>

        {/* Order Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Order Type
          </label>
          <select
            {...register('type')}
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {orderTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {orderTypes.find(t => t.value === orderType)?.description}
          </p>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quantity
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.000001"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setValue('quantity', parseFloat(e.target.value) || 0);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              {selectedSymbol.replace('USDT', '')}
            </div>
          </div>
          {errors.quantity && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Percentage Buttons */}
        {orderSide === 'buy' && (
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((percent) => (
              <button
                key={percent}
                type="button"
                onClick={() => handlePercentageClick(percent)}
                className={clsx(
                  'py-2 px-3 text-sm font-medium rounded-lg transition-colors',
                  percentage === percent
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                {percent}%
              </button>
            ))}
          </div>
        )}

        {/* Price (for limit orders) */}
        {(watchedType === 'limit' || watchedType === 'stop-limit') && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Limit Price
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setValue('price', parseFloat(e.target.value) || 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={currentPrice.toFixed(2)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                USD
              </div>
            </div>
            {errors.price && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.price.message}
              </p>
            )}
          </div>
        )}

        {/* Stop Price (for stop orders) */}
        {(watchedType === 'stop' || watchedType === 'stop-limit') && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Stop Price
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => {
                  setStopPrice(e.target.value);
                  setValue('stopPrice', parseFloat(e.target.value) || 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={currentPrice.toFixed(2)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                USD
              </div>
            </div>
            {errors.stopPrice && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.stopPrice.message}
              </p>
            )}
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {numeral(currentPrice).format('$0,0.00')}
            </span>
          </div>
          
          {quantity && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Estimated Total:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {numeral(estimatedTotal).format('$0,0.00')}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Trading Fee (0.1%):</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {numeral(tradingFee).format('$0,0.00')}
                </span>
              </div>
              
              <div className="flex justify-between text-sm font-semibold border-t border-gray-200 dark:border-gray-600 pt-2">
                <span className="text-gray-700 dark:text-gray-300">Total:</span>
                <span className="text-gray-900 dark:text-white">
                  {numeral(estimatedTotal + tradingFee).format('$0,0.00')}
                </span>
              </div>
            </>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Available Balance:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {numeral(availableBalance).format('$0,0.00')}
            </span>
          </div>
        </div>

        {/* Insufficient Balance Warning */}
        {orderSide === 'buy' && estimatedTotal + tradingFee > availableBalance && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300">
              Insufficient balance for this order
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={orderSide === 'buy' && estimatedTotal + tradingFee > availableBalance}
          className={clsx(
            'w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors',
            orderSide === 'buy'
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white'
              : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white',
            'disabled:cursor-not-allowed'
          )}
        >
          <Check className="w-4 h-4" />
          <span>
            Place {orderSide.toUpperCase()} Order
          </span>
        </button>
      </form>
    </div>
  );
};