"use client"

import type { ApplicationKpi } from "@/features/loan-applications/types"
import { MetricSummaryCard } from "@/components/metric-summary-card"
import { Skeleton } from "@/components/ui/skeleton"

function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <Skeleton className="h-4 w-24 rounded-md" />
      <Skeleton className="mt-4 h-8 w-20 rounded-md" />
    </div>
  )
}

function SummaryCard({ kpi }: { kpi: ApplicationKpi }) {
  return (
    <MetricSummaryCard
      label={kpi.label}
      value={kpi.value}
      changePercent={kpi.changePercent}
      trend={kpi.trend}
    />
  )
}

export function ApplicationSummaryCards({
  kpis,
  isLoading = false,
}: {
  kpis: ApplicationKpi[]
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {kpis.map((kpi) => (
        <SummaryCard key={kpi.key} kpi={kpi} />
      ))}
    </div>
  )
}
