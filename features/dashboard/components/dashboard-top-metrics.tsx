"use client"

import { DashboardMetricCards } from "@/features/dashboard/components/dashboard-metric-cards"
import { DashboardMetricCardsSpinner } from "@/features/dashboard/components/dashboard-section-spinners"
import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-queries"

export function DashboardTopMetrics() {
  const { data, isPending, isError } = useDashboardOverview()

  if (isPending) {
    return <DashboardMetricCardsSpinner />
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-border bg-background p-4 text-sm text-destructive">
        Failed to load dashboard metrics.
      </div>
    )
  }

  return <DashboardMetricCards kpis={data.topKpis} />
}
