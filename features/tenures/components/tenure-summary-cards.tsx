import { StatSummaryCard } from "@/components/stat-summary-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { TenureMetric } from "@/features/tenures/types"

function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <Skeleton className="h-4 w-24 rounded-md" />
      <Skeleton className="mt-4 h-8 w-20 rounded-md" />
    </div>
  )
}

export function TenureSummaryCards({
  metrics,
  isLoading = false,
}: {
  metrics: TenureMetric[]
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
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
