import { useState } from "react";
import Navbar from "@/components/Navbar";
import SandboxBanner from "@/components/SandboxBanner";
import StatCard from "@/components/StatCard";
import TransactionTable from "@/components/TransactionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, Activity, Target } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const [sandboxMode, setSandboxMode] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const mockTransactions = [
    { id: "1", type: "BUY" as const, currency: "BTC", amount: 0.05, price: 67842.50, total: 3392.13, date: "2025-11-03 14:32", status: "COMPLETED" as const },
    { id: "2", type: "SELL" as const, currency: "ETH", amount: 0.5, price: 3524.18, total: 1762.09, date: "2025-11-03 12:15", status: "COMPLETED" as const },
    { id: "3", type: "BUY" as const, currency: "ETH", amount: 1.0, price: 3500.00, total: 3500.00, date: "2025-11-02 09:45", status: "COMPLETED" as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {sandboxMode && showBanner && <SandboxBanner onDismiss={() => setShowBanner(false)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your trading overview</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Label htmlFor="sandbox-mode" className="text-sm font-medium">Sandbox Mode</Label>
            <Switch
              id="sandbox-mode"
              checked={sandboxMode}
              onCheckedChange={(checked) => {
                setSandboxMode(checked);
                setShowBanner(true);
                console.log('Sandbox mode:', checked);
              }}
              data-testid="switch-sandbox"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Portfolio Value"
            value="$12,458.32"
            change="+12.5%"
            changeType="positive"
            icon={Wallet}
          />
          <StatCard
            title="24h Change"
            value="+$1,245.80"
            change="+11.2%"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatCard
            title="Total Trades"
            value="47"
            icon={Activity}
          />
          <StatCard
            title="Win Rate"
            value="68.1%"
            change="+5.3%"
            changeType="positive"
            icon={Target}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Pie chart will be displayed here
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold">{tx.type} {tx.currency}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold">{tx.amount.toFixed(8)} {tx.currency}</p>
                      <p className="text-sm text-muted-foreground">${tx.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <TransactionTable
          transactions={mockTransactions}
          currentPage={1}
          totalPages={1}
        />
      </div>
    </div>
  );
}
