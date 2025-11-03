import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import PriceWidget from "@/components/PriceWidget";
import BuySellForm from "@/components/BuySellForm";
import SandboxBanner from "@/components/SandboxBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePrices } from "@/hooks/usePrices";
import { useWallets } from "@/hooks/useWallets";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Trade() {
  const [sandboxMode, setSandboxMode] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: pricesData, isLoading: pricesLoading, error: pricesError } = usePrices();
  const { data: walletsData, isLoading: walletsLoading, error: walletsError } = useWallets(sandboxMode);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: {
      orderType: "BUY" | "SELL";
      currency: "BTC" | "ETH";
      amount: string;
      price: string;
      sandbox: boolean;
    }) => {
      const response = await apiRequest("POST", "/api/orders/create", orderData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance", sandboxMode] });
      toast({
        title: "Order placed successfully",
        description: "Your order has been submitted and will be matched shortly.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Order failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOrderSubmit = (
    orderType: "BUY" | "SELL",
    currency: "BTC" | "ETH",
    amount: string,
    price: number
  ) => {
    createOrderMutation.mutate({
      orderType,
      currency,
      amount,
      price: price.toString(),
      sandbox: sandboxMode,
    });
  };

  const isLoading = pricesLoading || walletsLoading;
  const hasError = pricesError || walletsError;

  const btcPrice = pricesData?.btc || 0;
  const ethPrice = pricesData?.eth || 0;

  const usdWallet = walletsData?.wallets?.find(w => w.currency === "USD");
  const btcWallet = walletsData?.wallets?.find(w => w.currency === "BTC");
  const ethWallet = walletsData?.wallets?.find(w => w.currency === "ETH");

  const usdBalance = usdWallet ? parseFloat(usdWallet.balance) : 0;
  const btcBalance = btcWallet ? parseFloat(btcWallet.balance) : 0;
  const ethBalance = ethWallet ? parseFloat(ethWallet.balance) : 0;

  if (hasError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-destructive">Failed to load trading data. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {sandboxMode && showBanner && <SandboxBanner onDismiss={() => setShowBanner(false)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Trading</h1>
            <p className="text-muted-foreground mt-1">Buy and sell cryptocurrencies with real-time prices</p>
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

        <Tabs defaultValue="btc" className="mb-8">
          <TabsList>
            <TabsTrigger value="btc" data-testid="tab-btc">Bitcoin (BTC)</TabsTrigger>
            <TabsTrigger value="eth" data-testid="tab-eth">Ethereum (ETH)</TabsTrigger>
          </TabsList>

          <TabsContent value="btc" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PriceWidget
                  currency="Bitcoin"
                  symbol="BTC"
                  price={btcPrice}
                  change24h={0}
                  lastUpdated={pricesData?.lastUpdated ? new Date(pricesData.lastUpdated).toLocaleTimeString() : "Loading..."}
                  onRefresh={() => queryClient.invalidateQueries({ queryKey: ["/api/prices"] })}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Order Book</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Order book will be displayed here
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {isLoading ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center h-96">
                        <p className="text-muted-foreground">Loading...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <BuySellForm
                    currency="Bitcoin"
                    symbol="BTC"
                    currentPrice={btcPrice}
                    balance={usdBalance}
                    cryptoBalance={btcBalance}
                    onSubmit={handleOrderSubmit}
                    isSubmitting={createOrderMutation.isPending}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="eth" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PriceWidget
                  currency="Ethereum"
                  symbol="ETH"
                  price={ethPrice}
                  change24h={0}
                  lastUpdated={pricesData?.lastUpdated ? new Date(pricesData.lastUpdated).toLocaleTimeString() : "Loading..."}
                  onRefresh={() => queryClient.invalidateQueries({ queryKey: ["/api/prices"] })}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Order Book</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Order book will be displayed here
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {isLoading ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center h-96">
                        <p className="text-muted-foreground">Loading...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <BuySellForm
                    currency="Ethereum"
                    symbol="ETH"
                    currentPrice={ethPrice}
                    balance={usdBalance}
                    cryptoBalance={ethBalance}
                    onSubmit={handleOrderSubmit}
                    isSubmitting={createOrderMutation.isPending}
                  />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
