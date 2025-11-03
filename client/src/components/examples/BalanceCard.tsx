import BalanceCard from '../BalanceCard'

export default function BalanceCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
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
  )
}
