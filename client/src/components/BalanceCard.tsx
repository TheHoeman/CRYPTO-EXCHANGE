import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface BalanceCardProps {
  currency: string;
  symbol: string;
  balance: number;
  valueUsd: number;
  onDeposit?: () => void;
  onWithdraw?: () => void;
}

export default function BalanceCard({ 
  currency, 
  symbol, 
  balance, 
  valueUsd,
  onDeposit,
  onWithdraw 
}: BalanceCardProps) {
  return (
    <Card data-testid={`card-balance-${symbol.toLowerCase()}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{currency}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Balance</p>
          <p className="text-3xl font-bold font-mono" data-testid={`text-balance-${symbol.toLowerCase()}`}>
            {balance.toFixed(8)} {symbol}
          </p>
          <p className="text-sm text-muted-foreground mt-1" data-testid={`text-value-${symbol.toLowerCase()}`}>
            ≈ ${valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onDeposit}
            data-testid={`button-deposit-${symbol.toLowerCase()}`}
          >
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Deposit
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onWithdraw}
            data-testid={`button-withdraw-${symbol.toLowerCase()}`}
          >
            <ArrowUpFromLine className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
