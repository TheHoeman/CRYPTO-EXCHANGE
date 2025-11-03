import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface BuySellFormProps {
  currency: string;
  symbol: string;
  currentPrice: number;
  balance: number;
  cryptoBalance: number;
  onSubmit: (orderType: "BUY" | "SELL", currency: "BTC" | "ETH", amount: string, price: number) => void;
  isSubmitting?: boolean;
}

export default function BuySellForm({ 
  currency, 
  symbol, 
  currentPrice, 
  balance, 
  cryptoBalance,
  onSubmit,
  isSubmitting = false
}: BuySellFormProps) {
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");

  const buyTotal = parseFloat(buyAmount || "0") * currentPrice;
  const sellTotal = parseFloat(sellAmount || "0") * currentPrice;

  const handleBuy = () => {
    if (buyAmount && parseFloat(buyAmount) > 0) {
      onSubmit("BUY", symbol as "BTC" | "ETH", buyAmount, currentPrice);
      setBuyAmount("");
    }
  };

  const handleSell = () => {
    if (sellAmount && parseFloat(sellAmount) > 0) {
      onSubmit("SELL", symbol as "BTC" | "ETH", sellAmount, currentPrice);
      setSellAmount("");
    }
  };

  return (
    <Card data-testid={`card-trade-${symbol.toLowerCase()}`}>
      <CardHeader>
        <CardTitle>Trade {currency}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" data-testid="tab-buy">Buy</TabsTrigger>
            <TabsTrigger value="sell" data-testid="tab-sell">Sell</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="buy-amount">Amount ({symbol})</Label>
                <span className="text-xs text-muted-foreground">Balance: ${balance.toFixed(2)}</span>
              </div>
              <Input
                id="buy-amount"
                type="number"
                placeholder="0.00"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="font-mono"
                data-testid="input-buy-amount"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Price</Label>
              <div className="text-lg font-mono font-semibold" data-testid="text-buy-price">
                ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Total (USD)</Label>
              <div className="text-2xl font-mono font-bold" data-testid="text-buy-total">
                ${buyTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleBuy}
              disabled={!buyAmount || parseFloat(buyAmount) <= 0 || buyTotal > balance || isSubmitting}
              data-testid="button-buy"
            >
              {isSubmitting ? "Submitting..." : `Buy ${symbol}`}
            </Button>
          </TabsContent>
          
          <TabsContent value="sell" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sell-amount">Amount ({symbol})</Label>
                <span className="text-xs text-muted-foreground">Balance: {cryptoBalance.toFixed(8)} {symbol}</span>
              </div>
              <Input
                id="sell-amount"
                type="number"
                placeholder="0.00"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="font-mono"
                data-testid="input-sell-amount"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Price</Label>
              <div className="text-lg font-mono font-semibold" data-testid="text-sell-price">
                ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Total (USD)</Label>
              <div className="text-2xl font-mono font-bold" data-testid="text-sell-total">
                ${sellTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <Button 
              className="w-full" 
              size="lg"
              variant="destructive"
              onClick={handleSell}
              disabled={!sellAmount || parseFloat(sellAmount) <= 0 || parseFloat(sellAmount) > cryptoBalance || isSubmitting}
              data-testid="button-sell"
            >
              {isSubmitting ? "Submitting..." : `Sell ${symbol}`}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
