# CryptoLearn - Educational Cryptocurrency Exchange Platform

## Overview

CryptoLearn is a full-stack educational cryptocurrency trading platform designed for beginners and academic users. It provides a risk-free environment to learn cryptocurrency trading through sandbox mode while offering real trading capabilities with Bitcoin and Ethereum. The platform features real-time price updates, portfolio analytics, transaction history, and a leaderboard system with copy trading functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & UI Library**
- React.js with TypeScript for type safety and better developer experience
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing instead of React Router

**Component System**
- Shadcn/ui component library with Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Component structure follows atomic design principles with reusable UI components in `client/src/components/ui/`
- Feature-specific components like BalanceCard, BuySellForm, PriceWidget, LeaderboardTable encapsulate business logic

**State Management**
- React Context API for authentication state management
- TanStack Query (React Query) for server state management, caching, and real-time data synchronization
- Local component state for UI interactions
- 30-second polling interval for cryptocurrency prices to balance real-time updates with API rate limits

**Design System**
- Custom color system using CSS variables for theme consistency
- Typography scale using Inter for UI text and JetBrains Mono for financial values
- Spacing system based on Tailwind's default scale (2, 3, 4, 6, 8, 12, 16, 24, 32)
- Design guidelines reference modern fintech platforms (Coinbase, Robinhood, Binance)

### Backend Architecture

**Server Framework**
- Express.js on Node.js for RESTful API endpoints
- TypeScript for type safety across the stack
- Middleware-based architecture for request processing, authentication, and error handling

**Authentication & Security**
- JWT-based authentication with 24-hour token expiration
- bcrypt for password hashing with 10 salt rounds minimum
- Password validation requiring minimum 8 characters with uppercase, lowercase, numbers, and special characters
- Authorization middleware protecting all trading and wallet endpoints
- Session-based approach with Bearer token in Authorization header

**API Design**
- RESTful endpoints organized by feature domain (auth, wallet, orders, transactions, leaderboard, portfolio)
- Consistent error handling with appropriate HTTP status codes
- Request/response validation at API boundaries
- Support for sandbox mode through query parameters

**Business Logic Services**
- `cryptoService.ts`: Manages cryptocurrency price fetching from CoinGecko API with fallback to cached prices, implements 30-second polling mechanism
- `orderMatcher.ts`: Implements FIFO (First In, First Out) order matching algorithm for automatic trade execution between buy and sell orders

### Data Storage

**Database**
- PostgreSQL as the primary relational database
- Neon serverless PostgreSQL for cloud deployment
- Drizzle ORM for type-safe database queries and schema management

**Schema Design**
- `users`: Core user accounts with email, username, hashed passwords
- `wallets`: Real trading balances for USD, BTC, and ETH per user
- `sandbox_wallets`: Separate virtual balances for risk-free practice trading
- `orders`: Buy/sell orders with status tracking (PENDING, COMPLETED, FAILED)
- `transactions`: Complete transaction history for deposits, withdrawals, and trades
- `trader_stats`: Aggregated statistics for leaderboard (total trades, win rate, profit/loss)
- `portfolio_snapshots`: Time-series data for portfolio value tracking and charting

**Data Integrity**
- Foreign key constraints ensuring referential integrity
- Decimal precision (20, 8) for cryptocurrency amounts to handle fractional values
- Timestamp tracking for all entities (created_at, updated_at, completed_at)
- Separate real and sandbox data to prevent accidental mixing

### External Dependencies

**Third-Party APIs**
- CoinGecko API: Free cryptocurrency price data for Bitcoin and Ethereum in USD
  - No authentication required
  - Rate limiting handled through client-side caching and polling intervals
  - Fallback to cached prices on API failures

**Database Provider**
- Neon: Serverless PostgreSQL database
  - WebSocket connection support for serverless environments
  - Connection pooling handled through @neondatabase/serverless
  - DATABASE_URL environment variable for configuration

**Authentication**
- jsonwebtoken (JWT): Token generation and verification
- bcrypt: Password hashing and comparison

**UI Component Libraries**
- Radix UI: Unstyled, accessible component primitives (dialogs, dropdowns, tooltips, tabs, etc.)
- Recharts: React charting library for portfolio visualization
- Lucide React: Icon library

**Development Tools**
- Replit-specific plugins for development environment integration
- Vite plugins for runtime error overlay and development banners

**Build & Development**
- esbuild: Fast JavaScript bundler for server-side code
- tsx: TypeScript execution for development server
- PostCSS with Tailwind CSS for style processing

### Key Architectural Decisions

**Sandbox Mode Implementation**
- Dual wallet system (real vs. sandbox) allows risk-free learning without complex transaction rollback
- Toggle mechanism at UI level switches between wallet types
- All trading logic reused for both modes, reducing code duplication
- Sandbox starting balance: $10,000 USD equivalent distributed across currencies

**Order Matching Strategy**
- FIFO algorithm ensures fair execution based on price and time priority
- Automatic matching runs on order creation, no background jobs required
- Matches opposite order types (BUY matches with SELL) at compatible prices
- Partial fills not supported - orders must match completely or remain pending

**Real-time Price Updates**
- Client-side polling (30 seconds) balances freshness with API rate limits
- Prices cached on server to handle API failures gracefully
- TanStack Query handles refetch logic and caching automatically
- Manual refresh capability in UI for user-triggered updates

**Transaction History & Analytics**
- Server-side pagination for efficient data transfer (10 records per page)
- Filtering by currency type and date range
- CSV export functionality for user record-keeping
- Portfolio snapshots stored periodically for historical charting

**Copy Trading System**
- Read-only leaderboard showing trader statistics and rankings
- Manual viewing of top trader transactions for learning
- No automatic trade replication - educational focus on understanding strategies
- Statistics calculated from completed transactions and stored in trader_stats table