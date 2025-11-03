import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import BalanceCard from "@/components/BalanceCard";
import SandboxBanner from "@/components/SandboxBanner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { useWallets } from "@/hooks/useWallets";
import { usePrices } from "@/hooks/usePrices";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

interface DepositWithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "deposit" | "withdraw";
  currency: string;
  symbol: string;
  currentBalance: number;
  sandboxMode: boolean;
}

function DepositWithdrawDialog({ 
  open, 
  onOpenChange, 
  type, 
  currency, 
  symbol, 
  currentBalance,
  sandboxMode 
}: DepositWithdrawDialogProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: { currency: string; amount: string; sandbox: boolean }) => {
      const endpoint = type === "deposit" ? "/api/wallet/deposit" : "/api/wallet/withdraw";
      const response = await apiRequest("POST", endpoint, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance', sandboxMode] });
      toast({
        title: `${type === "deposit" ? "Deposit" : "Withdrawal"} Successful`,
        description: `Successfully ${type === "deposit" ? "deposited" : "withdrew"} ${amount} ${symbol}`,
      });
      setAmount("");
      setError("");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      setError(error.message || `Failed to ${type}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (numAmount < 0.00000001) {
      setError("Minimum amount is 0.00000001");
      return;
    }

    if (type === "withdraw" && numAmount > currentBalance) {
      setError("Insufficient balance");
      return;
    }

    mutation.mutate({ 
      currency: symbol, 
      amount: amount,
      sandbox: sandboxMode 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid={`dialog-${type}-${symbol.toLowerCase()}`}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {type === "deposit" ? "Deposit" : "Withdraw"} {currency}
            </DialogTitle>
            <DialogDescription>
              {type === "deposit" 
                ? `Add ${currency} to your wallet` 
                : `Withdraw ${currency} from your wallet. Available: ${currentBalance.toFixed(8)} ${symbol}`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount ({symbol})
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              min="0.00000001"
              placeholder="0.00000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
              data-testid={`input-${type}-amount`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive mt-2" data-testid={`error-${type}`}>
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAmount("");
                setError("");
                onOpenChange(false);
              }}
              disabled={mutation.isPending}
              data-testid={`button-cancel-${type}`}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              data-testid={`button-submit-${type}`}
            >
              {mutation.isPending ? "Processing..." : type === "deposit" ? "Deposit" : "Withdraw"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Wallet() {
  const [sandboxMode, setSandboxMode] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [depositDialog, setDepositDialog] = useState<{ open: boolean; currency: string; symbol: string } | null>(null);
  const [withdrawDialog, setWithdrawDialog] = useState<{ open: boolean; currency: string; symbol: string } | null>(null);
  const { toast } = useToast();

  const { data: walletsData, isLoading: walletsLoading, error: walletsError } = useWallets(sandboxMode);
  const { data: pricesData } = usePrices();

  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/wallet/reset", { sandbox: true });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance', true] });
      toast({
        title: "Sandbox Reset",
        description: "Your sandbox wallet has been reset to default balances",
      });
    },
    onError: () => {
      toast({
        title: "Reset Failed",
        description: "Failed to reset sandbox wallet",
        variant: "destructive",
      });
    },
  });

  const walletBalances = useMemo(() => {
    if (!walletsData?.wallets || !pricesData) {
      return [];
    }

    const currencyMap: Record<string, { name: string; symbol: string }> = {
      BTC: { name: "Bitcoin", symbol: "BTC" },
      ETH: { name: "Ethereum", symbol: "ETH" },
      USD: { name: "US Dollar", symbol: "USD" },
    };

    return walletsData.wallets.map(wallet => {
      const balance = parseFloat(wallet.balance);
      const currencyInfo = currencyMap[wallet.currency] || { name: wallet.currency, symbol: wallet.currency };
      
      let valueUsd = balance;
      if (wallet.currency === 'BTC') {
        valueUsd = balance * pricesData.btc;
      } else if (wallet.currency === 'ETH') {
        valueUsd = balance * pricesData.eth;
      }

      return {
        currency: currencyInfo.name,
        symbol: currencyInfo.symbol,
        balance,
        valueUsd,
      };
    });
  }, [walletsData, pricesData]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {sandboxMode && showBanner && <SandboxBanner onDismiss={() => setShowBanner(false)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-muted-foreground mt-1">Manage your cryptocurrency balances</p>
          </div>
          
          <div className="flex items-center gap-3">
            {sandboxMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => resetMutation.mutate()}
                disabled={resetMutation.isPending}
                data-testid="button-reset-sandbox"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {resetMutation.isPending ? "Resetting..." : "Reset Sandbox"}
              </Button>
            )}
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

        {walletsError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive" data-testid="error-message">
            <p className="font-semibold">Error loading wallet data</p>
            <p className="text-sm">Failed to load wallet balances. Please try again.</p>
          </div>
        )}

        {walletsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-32" data-testid={`skeleton-wallet-${i}`} />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {walletBalances.map((wallet) => (
              <BalanceCard
                key={wallet.symbol}
                currency={wallet.currency}
                symbol={wallet.symbol}
                balance={wallet.balance}
                valueUsd={wallet.valueUsd}
                onDeposit={() => setDepositDialog({ open: true, currency: wallet.currency, symbol: wallet.symbol })}
                onWithdraw={() => setWithdrawDialog({ open: true, currency: wallet.currency, symbol: wallet.symbol })}
              />
            ))}
          </div>
        )}
      </div>

      {depositDialog && (
        <DepositWithdrawDialog
          open={depositDialog.open}
          onOpenChange={(open) => !open && setDepositDialog(null)}
          type="deposit"
          currency={depositDialog.currency}
          symbol={depositDialog.symbol}
          currentBalance={walletBalances.find(w => w.symbol === depositDialog.symbol)?.balance || 0}
          sandboxMode={sandboxMode}
        />
      )}

      {withdrawDialog && (
        <DepositWithdrawDialog
          open={withdrawDialog.open}
          onOpenChange={(open) => !open && setWithdrawDialog(null)}
          type="withdraw"
          currency={withdrawDialog.currency}
          symbol={withdrawDialog.symbol}
          currentBalance={walletBalances.find(w => w.symbol === withdrawDialog.symbol)?.balance || 0}
          sandboxMode={sandboxMode}
        />
      )}
    </div>
  );
}
