import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import SandboxBanner from "@/components/SandboxBanner";
import StatCard from "@/components/StatCard";
import TransactionTable from "@/components/TransactionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, Activity, Target } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePrices } from "@/hooks/usePrices";
import { useWallets } from "@/hooks/useWallets";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [sandboxMode, setSandboxMode] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  
  const { user } = useAuth();
  const { data: pricesData, isLoading: pricesLoading, error: pricesError } = usePrices();
  const { data: walletsData, isLoading: walletsLoading, error: walletsError } = useWallets(sandboxMode);

  const portfolioStats = useMemo(() => {
    if (!pricesData || !walletsData?.wallets) {
      return {
        totalValue: 0,
        btcValue: 0,
        ethValue: 0,
        usdValue: 0,
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

    return {
      totalValue,
      btcValue,
      ethValue,
      usdValue: usdBalance,
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
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back{user?.username ? `, ${user.username}` : ''}! Here's your trading overview
            </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            <>
              <Card className="p-6">
                <Skeleton className="h-24" data-testid="skeleton-portfolio-value" />
              </Card>
              <Card className="p-6">
                <Skeleton className="h-24" data-testid="skeleton-24h-change" />
              </Card>
              <Card className="p-6">
                <Skeleton className="h-24" data-testid="skeleton-total-trades" />
              </Card>
              <Card className="p-6">
                <Skeleton className="h-24" data-testid="skeleton-win-rate" />
              </Card>
            </>
          ) : (
            <>
              <StatCard
                title="Portfolio Value"
                value={`$${portfolioStats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={Wallet}
                data-testid="stat-portfolio-value"
              />
              <StatCard
                title="BTC Holdings"
                value={`$${portfolioStats.btcValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={TrendingUp}
                data-testid="stat-btc-value"
              />
              <StatCard
                title="ETH Holdings"
                value={`$${portfolioStats.ethValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={Activity}
                data-testid="stat-eth-value"
              />
              <StatCard
                title="USD Balance"
                value={`$${portfolioStats.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={Target}
                data-testid="stat-usd-value"
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
                <Skeleton className="h-64" data-testid="skeleton-portfolio-allocation" />
              ) : (
                <div className="h-64 space-y-4" data-testid="portfolio-allocation">
                  {portfolioStats.totalValue > 0 ? (
                    <>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <p className="font-semibold">Bitcoin (BTC)</p>
                          <p className="text-sm text-muted-foreground">
                            {((portfolioStats.btcValue / portfolioStats.totalValue) * 100).toFixed(2)}%
                          </p>
                        </div>
                        <p className="font-mono font-semibold" data-testid="text-btc-allocation">
                          ${portfolioStats.btcValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <p className="font-semibold">Ethereum (ETH)</p>
                          <p className="text-sm text-muted-foreground">
                            {((portfolioStats.ethValue / portfolioStats.totalValue) * 100).toFixed(2)}%
                          </p>
                        </div>
                        <p className="font-mono font-semibold" data-testid="text-eth-allocation">
                          ${portfolioStats.ethValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <p className="font-semibold">US Dollar (USD)</p>
                          <p className="text-sm text-muted-foreground">
                            {((portfolioStats.usdValue / portfolioStats.totalValue) * 100).toFixed(2)}%
                          </p>
                        </div>
                        <p className="font-mono font-semibold" data-testid="text-usd-allocation">
                          ${portfolioStats.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      No assets in portfolio
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Prices</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64" data-testid="skeleton-prices" />
              ) : pricesData ? (
                <div className="space-y-4" data-testid="current-prices">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-semibold">Bitcoin</p>
                      <p className="text-sm text-muted-foreground">BTC</p>
                    </div>
                    <p className="font-mono font-semibold text-lg" data-testid="text-btc-price">
                      ${pricesData.btc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-semibold">Ethereum</p>
                      <p className="text-sm text-muted-foreground">ETH</p>
                    </div>
                    <p className="font-mono font-semibold text-lg" data-testid="text-eth-price">
                      ${pricesData.eth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="pt-2 text-xs text-muted-foreground text-center" data-testid="text-last-updated">
                    Last updated: {new Date(pricesData.lastUpdated).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Price data unavailable
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Balances</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-32" data-testid="skeleton-wallets" />
            ) : walletsData?.wallets ? (
              <div className="space-y-3" data-testid="wallet-balances">
                {walletsData.wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between p-4 border rounded-md"
                    data-testid={`wallet-${wallet.currency.toLowerCase()}`}
                  >
                    <div>
                      <p className="font-semibold">{wallet.currency}</p>
                      <p className="text-sm text-muted-foreground">
                        {wallet.currency === 'BTC' ? 'Bitcoin' : wallet.currency === 'ETH' ? 'Ethereum' : 'US Dollar'}
                      </p>
                    </div>
                    <p className="font-mono font-semibold" data-testid={`balance-${wallet.currency.toLowerCase()}`}>
                      {parseFloat(wallet.balance).toFixed(wallet.currency === 'USD' ? 2 : 8)} {wallet.currency}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                No wallet data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
