import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  type: "BUY" | "SELL";
  currency: string;
  amount: number;
  price: number;
  total: number;
  date: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
}

interface TransactionTableProps {
  transactions: Transaction[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function TransactionTable({ 
  transactions, 
  currentPage = 1, 
  totalPages = 1,
  onPageChange 
}: TransactionTableProps) {
  return (
    <Card data-testid="card-transactions">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} data-testid={`row-transaction-${tx.id}`}>
                  <TableCell>
                    <Badge 
                      variant={tx.type === "BUY" ? "default" : "destructive"}
                      data-testid={`badge-type-${tx.id}`}
                    >
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{tx.currency}</TableCell>
                  <TableCell className="font-mono">{tx.amount.toFixed(8)}</TableCell>
                  <TableCell className="font-mono">${tx.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className="font-mono font-semibold">${tx.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={tx.status === "COMPLETED" ? "secondary" : tx.status === "PENDING" ? "outline" : "destructive"}
                      data-testid={`badge-status-${tx.id}`}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                data-testid="button-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
