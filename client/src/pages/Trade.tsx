import Navbar from "@/components/Navbar";
import PriceWidget from "@/components/PriceWidget";
import BuySellForm from "@/components/BuySellForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Trade() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Trading</h1>
          <p className="text-muted-foreground mt-1">Buy and sell cryptocurrencies with real-time prices</p>
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
                  price={67842.50}
                  change24h={5.32}
                  onRefresh={() => console.log('Refresh BTC price')}
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
                <BuySellForm
                  currency="Bitcoin"
                  symbol="BTC"
                  currentPrice={67842.50}
                  balance={10000}
                  cryptoBalance={0.5}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="eth" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PriceWidget
                  currency="Ethereum"
                  symbol="ETH"
                  price={3524.18}
                  change24h={-2.14}
                  onRefresh={() => console.log('Refresh ETH price')}
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
                <BuySellForm
                  currency="Ethereum"
                  symbol="ETH"
                  currentPrice={3524.18}
                  balance={10000}
                  cryptoBalance={2.5}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
