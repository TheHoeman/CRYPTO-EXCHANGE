import Navbar from "@/components/Navbar";
import BalanceCard from "@/components/BalanceCard";

export default function Wallet() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your cryptocurrency balances</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BalanceCard
            currency="Bitcoin"
            symbol="BTC"
            balance={0.5}
            valueUsd={33921.25}
            onDeposit={() => console.log('Deposit BTC')}
            onWithdraw={() => console.log('Withdraw BTC')}
          />
          <BalanceCard
            currency="Ethereum"
            symbol="ETH"
            balance={2.5}
            valueUsd={8810.45}
            onDeposit={() => console.log('Deposit ETH')}
            onWithdraw={() => console.log('Withdraw ETH')}
          />
          <BalanceCard
            currency="US Dollar"
            symbol="USD"
            balance={5000}
            valueUsd={5000}
            onDeposit={() => console.log('Deposit USD')}
            onWithdraw={() => console.log('Withdraw USD')}
          />
        </div>
      </div>
    </div>
  );
}
