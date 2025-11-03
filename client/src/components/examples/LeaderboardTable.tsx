import LeaderboardTable from '../LeaderboardTable'

export default function LeaderboardTableExample() {
  const mockTraders = [
    { id: "1", rank: 1, username: "CryptoKing", totalTrades: 247, winRate: 78.5, profitLoss: 15420.50, profitPercent: 154.2 },
    { id: "2", rank: 2, username: "TraderPro", totalTrades: 189, winRate: 72.1, profitLoss: 12350.80, profitPercent: 123.5 },
    { id: "3", rank: 3, username: "BullRunner", totalTrades: 156, winRate: 68.9, profitLoss: 9870.25, profitPercent: 98.7 },
    { id: "4", rank: 4, username: "DiamondHands", totalTrades: 134, winRate: 65.7, profitLoss: 7650.00, profitPercent: 76.5 },
    { id: "5", rank: 5, username: "MoonShot", totalTrades: 98, winRate: 62.3, profitLoss: 5420.90, profitPercent: 54.2 },
  ];

  return (
    <LeaderboardTable
      traders={mockTraders}
      onCopyTrade={(id) => console.log('View trades for trader:', id)}
    />
  )
}
