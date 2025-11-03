import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PriceWidgetProps {
  currency: string;
  symbol: string;
  price: number;
  change24h: number;
  lastUpdated?: string;
  onRefresh?: () => void;
}

export default function PriceWidget({ 
  currency, 
  symbol, 
  price, 
  change24h, 
  lastUpdated = "Just now",
  onRefresh 
}: PriceWidgetProps) {
  const isPositive = change24h >= 0;

  return (
    <Card data-testid={`card-price-${symbol.toLowerCase()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{currency} ({symbol})</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onRefresh}
            data-testid={`button-refresh-${symbol.toLowerCase()}`}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-4xl font-bold font-mono tracking-tight" data-testid={`text-price-${symbol.toLowerCase()}`}>
              ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1 ${isPositive ? 'text-chart-2' : 'text-destructive'}`}>
              {isPositive ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span className="text-lg font-semibold font-mono" data-testid={`text-change-${symbol.toLowerCase()}`}>
                {isPositive ? '+' : ''}{change24h.toFixed(2)}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground">24h change</span>
          </div>
          <p className="text-xs text-muted-foreground">Updated: {lastUpdated}</p>
        </div>
      </CardContent>
    </Card>
  );
}
