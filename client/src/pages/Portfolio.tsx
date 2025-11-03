import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import SandboxBanner from "@/components/SandboxBanner";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, TrendingUp, Activity } from "lucide-react";
import { usePrices } from "@/hooks/usePrices";
import { useWallets } from "@/hooks/useWallets";

export default function Portfolio() {
  const [sandboxMode, setSandboxMode] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const { data: pricesData, isLoading: pricesLoading, error: pricesError } = usePrices();
  const { data: walletsData, isLoading: walletsLoading, error: walletsError } = useWallets(sandboxMode);

  const portfolioStats = useMemo(() => {
    if (!pricesData || !walletsData?.wallets) {
      return {
        totalValue: 0,
        btcValue: 0,
        ethValue: 0,
        usdValue: 0,
        btcBalance: 0,
        ethBalance: 0,
        usdBalance: 0,
        assets: [],
      };
    }

    const btcWallet = walletsData.wallets.find(w => w.currency === 'BTC');
    const ethWallet = walletsData.wallets.find(w => w.currency === 'ETH');
    const usdWallet = walletsData.wallets.find(w => w.currency === 'USD');

    const btcBalance = btcWallet ? parseFloat(btcWallet.balance) : 0;
    const ethBalance = ethWallet ? parseFloat(ethWallet.balance) : 0;
    const usdBalance = usdWallet ? parseFloat(usdWallet.balance) : 0;

    const btcValue = btcBalance * pricesData.btc;
    const ethValue = ethBalance * pricesData.eth;
    const totalValue = btcValue + ethValue + usdBalance;

    const assets = [
      {
        name: "Bitcoin",
        symbol: "BTC",
        amount: btcBalance,
        value: btcValue,
        percent: totalValue > 0 ? (btcValue / totalValue) * 100 : 0,
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        amount: ethBalance,
        value: ethValue,
        percent: totalValue > 0 ? (ethValue / totalValue) * 100 : 0,
      },
      {
        name: "US Dollar",
        symbol: "USD",
        amount: usdBalance,
        value: usdBalance,
        percent: totalValue > 0 ? (usdBalance / totalValue) * 100 : 0,
      },
    ];

    return {
      totalValue,
      btcValue,
      ethValue,
      usdValue: usdBalance,
      btcBalance,
      ethBalance,
      usdBalance,
      assets,
    };
  }, [pricesData, walletsData]);

  const isLoading = pricesLoading || walletsLoading;
  const hasError = pricesError || walletsError;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {sandboxMode && showBanner && <SandboxBanner onDismiss={() => setShowBanner(false)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Analytics</h1>
            <p className="text-muted-foreground mt-1">Detailed insights into your trading performance</p>
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="sandbox-mode" className="text-sm font-medium">Sandbox Mode</Label>
            <Switch
              id="sandbox-mode"
              checked={sandboxMode}
              onCheckedChange={(checked) => {
                setSandboxMode(checked);
                setShowBanner(true);
              }}
              data-testid="switch-sandbox"
            />
          </div>
        </div>

        {hasError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive" data-testid="error-message">
            <p className="font-semibold">Error loading data</p>
            <p className="text-sm">
              {pricesError ? 'Failed to load prices. ' : ''}
              {walletsError ? 'Failed to load wallet balances.' : ''}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            <>
              <Card className="p-6">
                <Skeleton className="h-24" data-testid="skeleton-total-value" />
              </Card>
              <Card className="p-6">
                <Skeleton className="h-24" data-testid="skeleton-all-time-return" />
              </Card>
              <Card className="p-6">
                <Skeleton className="h-24" data-testid="skeleton-total-trades" />
              </Card>
            </>
          ) : (
            <>
              <StatCard
                title="Total Value"
                value={`$${portfolioStats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={Wallet}
                data-testid="stat-total-value"
              />
              <StatCard
                title="BTC Holdings"
                value={`$${portfolioStats.btcValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={TrendingUp}
                data-testid="stat-btc-holdings"
              />
              <StatCard
                title="ETH Holdings"
                value={`$${portfolioStats.ethValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={Activity}
                data-testid="stat-eth-holdings"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80" data-testid="skeleton-portfolio-allocation" />
              ) : portfolioStats.totalValue > 0 ? (
                <div className="h-80 space-y-4" data-testid="portfolio-allocation">
                  {portfolioStats.assets.map((asset) => (
                    <div 
                      key={asset.symbol} 
                      className="flex items-center justify-between p-4 border rounded-md"
                      data-testid={`allocation-${asset.symbol.toLowerCase()}`}
                    >
                      <div>
                        <p className="font-semibold">{asset.name} ({asset.symbol})</p>
                        <p className="text-sm text-muted-foreground">
                          {asset.percent.toFixed(1)}%
                        </p>
                      </div>
                      <p className="font-mono font-semibold">
                        ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground" data-testid="portfolio-allocation-empty">
                  No assets in portfolio
                </div>
              )}
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
              <div className="h-80 flex items-center justify-center text-muted-foreground" data-testid="chart-placeholder">
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
            {isLoading ? (
              <Skeleton className="h-48" data-testid="skeleton-asset-breakdown" />
            ) : portfolioStats.totalValue > 0 ? (
              <div className="space-y-4" data-testid="asset-breakdown">
                {portfolioStats.assets.map((asset) => (
                  <div 
                    key={asset.symbol} 
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    data-testid={`asset-${asset.symbol.toLowerCase()}`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{asset.name} ({asset.symbol})</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {asset.amount.toFixed(asset.symbol === 'USD' ? 2 : 8)} {asset.symbol}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold">
                        ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-muted-foreground">{asset.percent.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground" data-testid="asset-breakdown-empty">
                No assets in portfolio
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
