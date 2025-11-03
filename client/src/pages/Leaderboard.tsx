import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import LeaderboardTable from "@/components/LeaderboardTable";
import StatCard from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Award, AlertCircle } from "lucide-react";

interface LeaderboardEntry {
  id: number;
  rank: number;
  username: string;
  totalTrades: number;
  winRate: string;
  profitLoss: number;
  profitPercent: string;
}

export default function Leaderboard() {
  const { data, isLoading, error } = useQuery<{ leaderboard: LeaderboardEntry[] }>({
    queryKey: ["/api/leaderboard"],
  });

  const traders = data?.leaderboard.map(trader => ({
    ...trader,
    id: trader.id.toString(),
    winRate: parseFloat(trader.winRate),
    profitPercent: parseFloat(trader.profitPercent),
  })) || [];

  const activeTraders = traders.length;
  const avgWinRate = traders.length > 0
    ? (traders.reduce((sum, t) => sum + t.winRate, 0) / traders.length).toFixed(1)
    : "0.0";
  const topTraderGain = traders.length > 0 ? traders[0].profitPercent.toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Top performing traders on the platform</p>
        </div>

        {isLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Skeleton className="h-32" data-testid="skeleton-stat-1" />
              <Skeleton className="h-32" data-testid="skeleton-stat-2" />
              <Skeleton className="h-32" data-testid="skeleton-stat-3" />
            </div>
            <Card data-testid="skeleton-leaderboard">
              <CardHeader>
                <CardTitle>Top Traders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16" data-testid={`skeleton-row-${i}`} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : error ? (
          <Card data-testid="error-leaderboard">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">Failed to Load Leaderboard</h3>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : "Unable to fetch leaderboard data. Please try again later."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Active Traders"
                value={activeTraders.toLocaleString()}
                icon={Users}
              />
              <StatCard
                title="Avg. Win Rate"
                value={`${avgWinRate}%`}
                icon={TrendingUp}
              />
              <StatCard
                title="Top Trader Gain"
                value={`+${topTraderGain}%`}
                icon={Award}
              />
            </div>

            <LeaderboardTable
              traders={traders}
              onCopyTrade={(id) => console.log('View trades for trader:', id)}
            />
          </>
        )}
      </div>
    </div>
  );
}
