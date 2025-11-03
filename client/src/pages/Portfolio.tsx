import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, TrendingUp, Activity } from "lucide-react";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Portfolio Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed insights into your trading performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Value"
            value="$12,458.32"
            change="+12.5%"
            changeType="positive"
            icon={Wallet}
          />
          <StatCard
            title="All-Time Return"
            value="+$2,458.32"
            change="+24.6%"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatCard
            title="Total Trades"
            value="47"
            icon={Activity}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                Pie chart showing BTC, ETH, and USD allocation
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Portfolio Value Over Time</CardTitle>
                <Tabs defaultValue="7d">
                  <TabsList>
                    <TabsTrigger value="7d" data-testid="tab-7d">7D</TabsTrigger>
                    <TabsTrigger value="30d" data-testid="tab-30d">30D</TabsTrigger>
                    <TabsTrigger value="90d" data-testid="tab-90d">90D</TabsTrigger>
                    <TabsTrigger value="1y" data-testid="tab-1y">1Y</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                Line chart showing portfolio value over time
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Asset Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Bitcoin", symbol: "BTC", amount: 0.5, value: 33921.25, percent: 68.5 },
                { name: "Ethereum", symbol: "ETH", amount: 2.5, value: 8810.45, percent: 17.8 },
                { name: "US Dollar", symbol: "USD", amount: 5000, value: 5000, percent: 10.1 }
              ].map((asset, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="font-semibold">{asset.name} ({asset.symbol})</p>
                    <p className="text-sm text-muted-foreground font-mono">{asset.amount} {asset.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold">${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm text-muted-foreground">{asset.percent.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
