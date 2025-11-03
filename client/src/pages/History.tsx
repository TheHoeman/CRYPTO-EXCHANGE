import Navbar from "@/components/Navbar";
import TransactionTable from "@/components/TransactionTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function History() {
  const mockTransactions = [
    { id: "1", type: "BUY" as const, currency: "BTC", amount: 0.05, price: 67842.50, total: 3392.13, date: "2025-11-03 14:32", status: "COMPLETED" as const },
    { id: "2", type: "SELL" as const, currency: "ETH", amount: 0.5, price: 3524.18, total: 1762.09, date: "2025-11-03 12:15", status: "COMPLETED" as const },
    { id: "3", type: "BUY" as const, currency: "ETH", amount: 1.0, price: 3500.00, total: 3500.00, date: "2025-11-02 09:45", status: "COMPLETED" as const },
    { id: "4", type: "BUY" as const, currency: "BTC", amount: 0.1, price: 66500.00, total: 6650.00, date: "2025-11-01 16:20", status: "COMPLETED" as const },
    { id: "5", type: "SELL" as const, currency: "BTC", amount: 0.02, price: 67000.00, total: 1340.00, date: "2025-10-31 11:45", status: "COMPLETED" as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground mt-1">View all your trading activity</p>
          </div>
          
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <TransactionTable
          transactions={mockTransactions}
          currentPage={1}
          totalPages={3}
          onPageChange={(page) => console.log('Go to page:', page)}
        />
      </div>
    </div>
  );
}
