import { MetricSummaryCard } from "@/components/metric-summary-card"
import type { RecoveryMetric } from "@/features/recovery/types"

export function RecoverySummaryCards({
  metrics,
}: {
  metrics: RecoveryMetric[]
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricSummaryCard
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
