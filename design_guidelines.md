# Cryptocurrency Exchange Platform Design Guidelines

## Design Approach

**Reference-Based Approach**: Draw inspiration from leading fintech platforms (Coinbase, Robinhood, Binance) combined with modern SaaS aesthetics (Linear, Stripe). Balance trust and professionalism with approachability for educational users.

**Core Principles**:
- **Clarity Over Complexity**: Clean interfaces that make trading understandable for beginners
- **Data Visibility**: Information-dense layouts without feeling overwhelming
- **Trust & Security**: Professional aesthetic that conveys reliability
- **Real-time Responsiveness**: Visual feedback for live price updates and transactions

---

## Typography

**Font Family**: 
- Primary: Inter (via Google Fonts CDN) - clean, modern, excellent at small sizes
- Monospace: JetBrains Mono - for numerical values, prices, balances

**Type Scale**:
- Hero/Display: text-5xl to text-6xl, font-bold (56-60px)
- Page Titles: text-3xl, font-semibold (30px)
- Section Headers: text-2xl, font-semibold (24px)
- Card Titles: text-lg, font-semibold (18px)
- Body Text: text-base, font-normal (16px)
- Supporting Text: text-sm, font-normal (14px)
- Micro Copy: text-xs, font-medium (12px)
- Price/Numbers: Use monospace font, font-semibold for all financial values

**Hierarchy Application**:
- All cryptocurrency prices and balances in monospace
- Percentage changes prominently displayed with larger font-weight
- Form labels in text-sm with font-medium
- Button text in text-sm to text-base with font-semibold

---

## Layout System

**Spacing Units**: Use Tailwind spacing: 2, 3, 4, 6, 8, 12, 16, 24, 32
- Micro spacing (between related elements): 2, 3, 4
- Component internal padding: 4, 6, 8
- Section spacing: 12, 16, 24
- Page margins: 16, 24, 32

**Grid Structure**:
- Container max-width: max-w-7xl (1280px)
- Dashboard cards: 2-3 column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Trading interface: 2-column layout (order book + trading form)
- Portfolio charts: Full-width cards with internal padding p-6

**Responsive Breakpoints**:
- Mobile-first approach
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)

---

## Component Library

### Navigation
**Top Navigation Bar**:
- Fixed header with backdrop-blur effect
- Height: h-16
- Logo left-aligned with text-xl font-bold
- Primary navigation links (Dashboard, Trade, Portfolio, Wallet, History) centered
- User menu (balance preview + avatar) right-aligned
- Sandbox mode toggle prominently displayed in header when active

**Sidebar (Dashboard Pages)**:
- Width: w-64 on desktop, collapsible drawer on mobile
- Vertical navigation with icon + label
- Active state with background treatment
- Section dividers between logical groups

### Cards & Containers
**Standard Card**:
- Rounded corners: rounded-lg
- Border: border with subtle treatment
- Padding: p-6
- Shadow: subtle shadow for depth

**Stat Cards** (Quick stats, balances):
- Compact height with p-4 to p-6
- Large number display in monospace
- Small label above or below
- Icon in top-right corner (32x32px from Heroicons)

**Chart Cards**:
- Full-width with p-6 to p-8
- Header with title + time range selector (tabs)
- Chart area with min-h-80
- Legend below chart if multi-asset

### Trading Interface Components

**Order Book Display**:
- Two-column table (Buy/Sell)
- Monospace font for all numbers
- Row highlighting on hover
- Background intensity showing order depth
- Sticky headers

**Buy/Sell Form**:
- Vertical form layout
- Large input fields with h-12
- Amount and total in monospace
- Prominent action button (full-width)
- Balance display above form
- Real-time price at top with auto-refresh indicator

**Price Display Widget**:
- Large current price (text-4xl, monospace)
- 24h change with percentage (green/red indicator)
- Small line chart sparkline showing recent trend
- Last updated timestamp

### Tables

**Transaction History**:
- Zebra striping for readability
- Fixed column widths for alignment
- Monospace for amounts and prices
- Filter pills above table
- Pagination controls below
- Export button in top-right

**Leaderboard**:
- Rank badge in first column
- Trader avatar + name
- Stats in separate columns (trades, win rate, profit)
- Follow/Copy button in last column
- Sticky header on scroll

### Forms

**Input Fields**:
- Height: h-12 for primary inputs
- Rounded: rounded-md
- Padding: px-4 py-3
- Border focus states
- Label spacing: mb-2
- Helper text below in text-sm
- Error states with descriptive messages

**Buttons**:
- Primary action: h-11, px-8, rounded-md, font-semibold
- Secondary: same size with border treatment
- Icon buttons: h-10 w-10, rounded-md
- Loading states with spinner

### Notifications & Alerts

**Toast Notifications**:
- Fixed position: top-right
- Width: w-96
- Padding: p-4
- Auto-dismiss after 5 seconds
- Success/error/info variants with icons

**Alert Banners** (Sandbox mode):
- Full-width at top of content
- Height: h-12
- Icon + message centered
- Distinctive treatment for visibility
- Dismissible option

### Charts & Visualizations

**Portfolio Pie Chart**:
- Center area with total value display
- Legend positioned right on desktop, below on mobile
- Interactive hover states
- Minimum 300x300px

**Portfolio Line Chart**:
- Full-width responsive
- Height: h-96 on desktop
- Time range tabs above chart
- Y-axis for USD value, X-axis for dates
- Grid lines for readability
- Tooltip on hover with exact values

---

## Images

### Hero Section (Marketing/Landing)
**Primary Hero Image**:
- Location: Landing page top section
- Description: Modern, abstract visualization of cryptocurrency network or blockchain, featuring interconnected nodes with glowing particles, predominantly blues and purples with accent gradients
- Placement: Full-width background with overlay gradient
- Height: min-h-screen on desktop, min-h-[70vh] on mobile
- Overlay: Dark gradient overlay (opacity-60) for text contrast

**Supporting Images**:
- Dashboard Preview: Screenshot mockup of the trading interface positioned in features section
- Security Icons: Simple, clean icon illustrations for security features
- Team/About: Professional photos if applicable, otherwise omit

### Buttons on Hero Images
All CTAs on hero background must have:
- Backdrop blur: backdrop-blur-sm
- Semi-transparent background
- No hover/active state animations
- Standard button hover states handle all interactions

### Application Pages (No Hero Images)
Dashboard and internal pages focus on data visualization and functionality without decorative hero sections. Charts and real-time data are the visual centerpieces.

---

## Page-Specific Layouts

### Landing Page
1. **Hero Section**: Full-viewport with large headline "Start Trading Crypto with Confidence", subtitle about educational platform, dual CTA (Get Started + Learn More), hero image background
2. **Features Grid**: 3-column layout showcasing key features (Real-time Trading, Sandbox Mode, Copy Trading) with icons and descriptions
3. **Platform Preview**: Large dashboard screenshot with callouts highlighting key features
4. **How It Works**: 3-step process with numbered cards
5. **Trust Indicators**: Logos/stats strip showing security features
6. **Final CTA**: Centered section with prominent signup button

### Dashboard
**Multi-column layout**:
- Top row: 3-4 stat cards (Portfolio Value, 24h Change, Total Trades, Win Rate)
- Middle section: 2-column (Portfolio Pie Chart left, Recent Trades table right)
- Bottom section: Full-width portfolio value line chart

### Trading Page
**2-column desktop layout**:
- Left column (60%): Real-time price widget at top, order book below, recent trades at bottom
- Right column (40%): Buy/Sell tabs with forms, balance display, order confirmation

### Portfolio Page
**Full-width sections**:
- Summary cards row at top
- Asset allocation pie chart (left) + value over time line chart (right)
- Asset breakdown table full-width below

### Wallet Page
**Center-focused layout**:
- Balance cards for each currency in grid
- Deposit/Withdraw forms in modal overlays
- Transaction history table below

### Leaderboard Page
**Single-column focus**:
- Filter/search bar at top
- Stats summary cards row
- Main leaderboard table
- Pagination at bottom

---

## Accessibility & Interaction States

- All interactive elements have clear focus indicators
- Form inputs have associated labels (no placeholder-only)
- Sufficient contrast ratios for all text
- Keyboard navigation support throughout
- Loading states for all async operations (spinner icons from Heroicons)
- Error messages descriptive and actionable
- Success confirmations for all transactions

**No Animations**: Interface remains clean and professional without distracting motion. Focus on instant visual feedback through state changes rather than transitions.