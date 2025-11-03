import PriceWidget from '../PriceWidget'

export default function PriceWidgetExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <PriceWidget
        currency="Bitcoin"
        symbol="BTC"
        price={67842.50}
        change24h={5.32}
        onRefresh={() => console.log('Refresh BTC price')}
      />
      <PriceWidget
        currency="Ethereum"
        symbol="ETH"
        price={3524.18}
        change24h={-2.14}
        onRefresh={() => console.log('Refresh ETH price')}
      />
    </div>
  )
}
