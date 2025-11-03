import BuySellForm from '../BuySellForm'

export default function BuySellFormExample() {
  return (
    <div className="max-w-md">
      <BuySellForm
        currency="Bitcoin"
        symbol="BTC"
        currentPrice={67842.50}
        balance={10000}
        cryptoBalance={0.5}
      />
    </div>
  )
}
