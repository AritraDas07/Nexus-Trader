# Nexus Trader

A comprehensive trading simulator for cryptocurrency and stock markets with real-time data, advanced charting capabilities, and portfolio management tools.

🚀 **[Live Demo](https://nexus-trader.vercel.app/)**

## Overview

Nexus Trader is a professional-grade trading simulator designed for both educational purposes and advanced paper trading. It provides real-time market data, sophisticated charting tools, and comprehensive portfolio management in a risk-free environment.

## Features

- **Real-time Market Data**: Live price feeds via WebSocket connections with 1-second updates
- **Advanced Charting**: Professional-grade charts with 50+ technical indicators including RSI, MACD, Bollinger Bands, and more
- **Portfolio Management**: Track multiple portfolios with real-time P&L calculations and performance analytics
- **Trading Simulation**: Realistic order execution with market orders, limit orders, stop-loss, and take-profit orders
- **Alert System**: Customizable price alerts and technical indicator notifications
- **Backtesting Engine**: Test trading strategies against historical data with detailed performance reports
- **Risk Management**: Position sizing calculator, risk assessment tools, and portfolio allocation analysis
- **Educational Resources**: Built-in tutorials, trading guides, and market analysis tools
- **Multi-asset Support**: Trade cryptocurrencies and stocks from a single platform
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts and custom chart components
- **Data Fetching**: TanStack Query (React Query)
- **Real-time Data**: WebSocket connections
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Data Sources

- **Cryptocurrency**: CoinGecko API, Binance WebSocket
- **Stocks**: Alpha Vantage API, Finnhub API
- **Market Data**: Real-time and historical price data
- **News**: Integrated news feeds for market sentiment

## Installation

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nexus-trader.git
cd nexus-trader
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
REACT_APP_COINGECKO_API_KEY=your_coingecko_api_key
REACT_APP_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
REACT_APP_FINNHUB_API_KEY=your_finnhub_api_key
```

5. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## API Keys

To use all features, you'll need free API keys from:

- **CoinGecko**: [Get API Key](https://www.coingecko.com/en/api/pricing) - For cryptocurrency data
- **Alpha Vantage**: [Get API Key](https://www.alphavantage.co/support/#api-key) - For stock market data
- **Finnhub**: [Get API Key](https://finnhub.io/register) - For additional market data and news

## Project Structure

```
src/
├── components/
│   ├── Dashboard/          # Main dashboard components
│   ├── Charts/             # Charting components and indicators
│   ├── Portfolio/          # Portfolio management
│   ├── Trading/            # Trading interface and orders
│   ├── Alerts/             # Alert system
│   └── UI/                 # Reusable UI components
├── hooks/                  # Custom React hooks
├── services/               # API services and data fetching
├── store/                  # Zustand store configurations
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions and helpers
└── styles/                 # Global styles and theme
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Usage

### Creating a Portfolio

1. Navigate to the Portfolio section
2. Click "Create New Portfolio"
3. Set your starting capital ($10,000 - $1,000,000)
4. Choose your base currency (USD, EUR, BTC, ETH)

### Trading

1. Search for an asset using the search bar
2. Select the asset to view its chart
3. Choose order type (Market, Limit, Stop-Loss, Take-Profit)
4. Enter quantity and price (for limit orders)
5. Review and place the order

### Setting Alerts

1. Right-click on any chart
2. Select "Create Alert"
3. Choose alert type (Price, Technical Indicator, Pattern)
4. Set trigger conditions
5. Configure notification preferences

### Backtesting

1. Go to the Backtesting section
2. Select an asset and time period
3. Define your trading strategy
4. Run the backtest
5. Analyze results and performance metrics

## Configuration

### Default Settings

- **Starting Capital**: $100,000
- **Base Currency**: USD
- **Chart Timeframe**: 1 hour
- **Update Interval**: 1 second
- **Default Indicators**: Moving Average, RSI, MACD

### Customization

All settings can be customized through the Settings panel, including:
- Theme (Dark/Light mode)
- Chart preferences
- Alert configurations
- Risk management parameters

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write unit tests for new features
- Update documentation as needed
- Follow conventional commit message format

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

## Performance

- **Initial Load Time**: < 3 seconds
- **Chart Rendering**: < 1 second
- **Real-time Updates**: < 100ms latency
- **Memory Usage**: Optimized for long-running sessions
- **Mobile Performance**: Responsive and touch-optimized

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+



## Links

- **🌐 Live Application**: [https://nexus-trader.vercel.app/](https://nexus-trader.vercel.app/)

## Acknowledgments

- **TradingView** for charting inspiration
- **CoinGecko** for cryptocurrency data
- **Alpha Vantage** for stock market data
- **React community** for excellent libraries and tools

---

**Disclaimer**: This is a trading simulator for educational purposes only. No real money is involved. Past performance does not guarantee future results.
