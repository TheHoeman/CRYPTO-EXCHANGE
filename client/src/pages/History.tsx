import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import SandboxBanner from "@/components/SandboxBanner";
import TransactionTable from "@/components/TransactionTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

interface Transaction {
  id: string;
  type: "BUY" | "SELL";
  currency: string;
  amount: number;
  price: number;
  total: number;
  createdAt: string;
}

interface TransactionHistoryResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  };
}

export default function History() {
  const [sandboxMode, setSandboxMode] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery<TransactionHistoryResponse>({
    queryKey: ['/api/transactions/history', currentPage, sandboxMode, currencyFilter],
    queryFn: () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        sandbox: sandboxMode.toString(),
      });
      
      if (currencyFilter !== "all") {
        params.append("currency", currencyFilter);
      }
      
      return fetchWithAuth(`/api/transactions/history?${params.toString()}`);
    },
  });

  const formattedTransactions = data?.transactions.map(tx => ({
    ...tx,
    date: new Date(tx.createdAt).toLocaleString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    status: "COMPLETED" as const,
  })) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportCSV = () => {
    if (!data?.transactions || data.transactions.length === 0) {
      return;
    }

    const headers = ['Date', 'Type', 'Currency', 'Amount', 'Price', 'Total'];
    const csvRows = [headers.join(',')];

    data.transactions.forEach(tx => {
      const row = [
        new Date(tx.createdAt).toLocaleString('en-US', { 
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        tx.type,
        tx.currency,
        tx.amount,
        `$${tx.price}`,
        `$${tx.total}`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {sandboxMode && showBanner && <SandboxBanner onDismiss={() => setShowBanner(false)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground mt-1">View all your trading activity</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Label htmlFor="sandbox-mode" className="text-sm font-medium">Sandbox Mode</Label>
            <Switch
              id="sandbox-mode"
              checked={sandboxMode}
              onCheckedChange={(checked) => {
                setSandboxMode(checked);
                setShowBanner(true);
                setCurrentPage(1);
              }}
              data-testid="switch-sandbox"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive" data-testid="error-message">
            <p className="font-semibold">Error loading transaction history</p>
            <p className="text-sm">
              {error instanceof Error ? error.message : 'Failed to load transactions. Please try again later.'}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="currency-filter" className="text-sm font-medium">Filter by currency:</Label>
          </div>
          <Select value={currencyFilter} onValueChange={(value) => {
            setCurrencyFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-40" id="currency-filter" data-testid="select-currency-filter">
              <SelectValue placeholder="All currencies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" data-testid="option-all">All</SelectItem>
              <SelectItem value="BTC" data-testid="option-btc">BTC</SelectItem>
              <SelectItem value="ETH" data-testid="option-eth">ETH</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="ml-auto" 
            onClick={handleExportCSV}
            disabled={!data?.transactions || data.transactions.length === 0}
            data-testid="button-export"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {isLoading ? (
          <Card data-testid="skeleton-transactions">
            <CardContent className="p-6">
              <Skeleton className="h-12 mb-4" />
              <Skeleton className="h-16 mb-3" />
              <Skeleton className="h-16 mb-3" />
              <Skeleton className="h-16 mb-3" />
              <Skeleton className="h-16 mb-3" />
              <Skeleton className="h-16" />
            </CardContent>
          </Card>
        ) : (
          <TransactionTable
            transactions={formattedTransactions}
            currentPage={data?.pagination.page || 1}
            totalPages={data?.pagination.totalPages || 1}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
