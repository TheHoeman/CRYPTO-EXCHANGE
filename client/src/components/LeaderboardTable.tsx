import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award } from "lucide-react";

interface Trader {
  id: string;
  rank: number;
  username: string;
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  profitPercent: number;
}

interface LeaderboardTableProps {
  traders: Trader[];
  onCopyTrade?: (traderId: string) => void;
}

export default function LeaderboardTable({ traders, onCopyTrade }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-chart-4" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 3) return <Award className="h-5 w-5 text-chart-4/60" />;
    return <span className="text-sm font-semibold text-muted-foreground">{rank}</span>;
  };

  return (
    <Card data-testid="card-leaderboard">
      <CardHeader>
        <CardTitle>Top Traders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Trader</TableHead>
                <TableHead>Trades</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Profit/Loss</TableHead>
                <TableHead>% Gain</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traders.map((trader) => (
                <TableRow key={trader.id} data-testid={`row-trader-${trader.id}`}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {getRankIcon(trader.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{trader.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{trader.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{trader.totalTrades}</TableCell>
                  <TableCell className="font-mono font-semibold">{trader.winRate.toFixed(1)}%</TableCell>
                  <TableCell className={`font-mono font-semibold ${trader.profitLoss >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                    ${trader.profitLoss >= 0 ? '+' : ''}{trader.profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className={`font-mono font-semibold ${trader.profitPercent >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                    {trader.profitPercent >= 0 ? '+' : ''}{trader.profitPercent.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCopyTrade?.(trader.id)}
                      data-testid={`button-copy-${trader.id}`}
                    >
                      View Trades
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
