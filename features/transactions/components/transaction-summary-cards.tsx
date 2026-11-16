import { StatSummaryCard } from "@/components/stat-summary-card"
import type { TransactionMetric } from "@/features/transactions/types"

export function TransactionSummaryCards({
  metrics,
}: {
  metrics: TransactionMetric[]
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatSummaryCard
          key={metric.key}
          label={metric.label}
          value={metric.value}
          changePercent={metric.changePercent}
          trend={metric.trend}
        />
      ))}
    </div>
  )
}
