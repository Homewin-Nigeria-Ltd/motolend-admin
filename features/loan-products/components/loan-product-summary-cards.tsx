import { StatSummaryCard } from "@/components/stat-summary-card"
import type { LoanProductKpi } from "@/features/loan-products/types"
import { Skeleton } from "@/components/ui/skeleton"

function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <Skeleton className="h-4 w-24 rounded-md" />
      <Skeleton className="mt-4 h-8 w-20 rounded-md" />
    </div>
  )
}

export function LoanProductSummaryCards({
  kpis,
  isLoading = false,
}: {
  kpis: LoanProductKpi[]
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {kpis.map((kpi) => (
        <StatSummaryCard
          key={kpi.key}
          label={kpi.label}
          value={kpi.value}
          changePercent={kpi.changePercent}
          trend={kpi.trend}
        />
      ))}
    </div>
  )
}
