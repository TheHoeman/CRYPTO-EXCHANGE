import StatCard from '../StatCard'
import { Wallet, TrendingUp, Activity, Target } from 'lucide-react'

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Portfolio Value"
        value="$12,458.32"
        change="+12.5%"
        changeType="positive"
        icon={Wallet}
      />
      <StatCard
        title="24h Change"
        value="+$1,245.80"
        change="+11.2%"
        changeType="positive"
        icon={TrendingUp}
      />
      <StatCard
        title="Total Trades"
        value="47"
        icon={Activity}
      />
      <StatCard
        title="Win Rate"
        value="68.1%"
        change="+5.3%"
        changeType="positive"
        icon={Target}
      />
    </div>
  )
}
