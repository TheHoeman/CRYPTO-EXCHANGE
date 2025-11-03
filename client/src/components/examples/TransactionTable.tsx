import TransactionTable from '../TransactionTable'

export default function TransactionTableExample() {
  const mockTransactions = [
    { id: "1", type: "BUY" as const, currency: "BTC", amount: 0.05, price: 67842.50, total: 3392.13, date: "2025-11-03 14:32", status: "COMPLETED" as const },
    { id: "2", type: "SELL" as const, currency: "ETH", amount: 0.5, price: 3524.18, total: 1762.09, date: "2025-11-03 12:15", status: "COMPLETED" as const },
    { id: "3", type: "BUY" as const, currency: "ETH", amount: 1.0, price: 3500.00, total: 3500.00, date: "2025-11-02 09:45", status: "COMPLETED" as const },
    { id: "4", type: "BUY" as const, currency: "BTC", amount: 0.1, price: 66500.00, total: 6650.00, date: "2025-11-01 16:20", status: "COMPLETED" as const },
  ];

  return (
    <TransactionTable
      transactions={mockTransactions}
      currentPage={1}
      totalPages={3}
      onPageChange={(page) => console.log('Go to page:', page)}
    />
  )
}
