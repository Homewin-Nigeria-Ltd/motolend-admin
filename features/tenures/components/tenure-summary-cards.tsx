import { MetricSummaryCard } from "@/components/metric-summary-card"
import type { TenureMetric } from "@/features/tenures/types"

export function TenureSummaryCards({ metrics }: { metrics: TenureMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
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
