import Navbar from "@/components/Navbar";
import LeaderboardTable from "@/components/LeaderboardTable";
import StatCard from "@/components/StatCard";
import { Users, TrendingUp, Award } from "lucide-react";

export default function Leaderboard() {
  const mockTraders = [
    { id: "1", rank: 1, username: "CryptoKing", totalTrades: 247, winRate: 78.5, profitLoss: 15420.50, profitPercent: 154.2 },
    { id: "2", rank: 2, username: "TraderPro", totalTrades: 189, winRate: 72.1, profitLoss: 12350.80, profitPercent: 123.5 },
    { id: "3", rank: 3, username: "BullRunner", totalTrades: 156, winRate: 68.9, profitLoss: 9870.25, profitPercent: 98.7 },
    { id: "4", rank: 4, username: "DiamondHands", totalTrades: 134, winRate: 65.7, profitLoss: 7650.00, profitPercent: 76.5 },
    { id: "5", rank: 5, username: "MoonShot", totalTrades: 98, winRate: 62.3, profitLoss: 5420.90, profitPercent: 54.2 },
    { id: "6", rank: 6, username: "HODLMaster", totalTrades: 87, winRate: 59.8, profitLoss: 4230.15, profitPercent: 42.3 },
    { id: "7", rank: 7, username: "WhaleWatcher", totalTrades: 76, winRate: 57.2, profitLoss: 3450.60, profitPercent: 34.5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Top performing traders on the platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Active Traders"
            value="1,247"
            icon={Users}
          />
          <StatCard
            title="Avg. Win Rate"
            value="64.2%"
            change="+2.1%"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatCard
            title="Top Trader Gain"
            value="+154.2%"
            icon={Award}
          />
        </div>

        <LeaderboardTable
          traders={mockTraders}
          onCopyTrade={(id) => console.log('View trades for trader:', id)}
        />
      </div>
    </div>
  );
}
