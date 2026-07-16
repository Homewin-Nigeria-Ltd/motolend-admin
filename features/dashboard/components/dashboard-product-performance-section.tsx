"use client"

import { useState } from "react"

import { DashboardProductPerformanceChart } from "@/features/dashboard/components/dashboard-product-performance-chart"
import { DashboardChartCardSpinner } from "@/features/dashboard/components/dashboard-section-spinners"
import { useDashboardProductPerformance } from "@/features/dashboard/hooks/use-dashboard-queries"
import type { DashboardFilter } from "@/features/dashboard/types"

export function DashboardProductPerformanceSection() {
  const [filter, setFilter] = useState<DashboardFilter>("monthly")
  const { data, isPending, isFetching, isError } =
    useDashboardProductPerformance(filter)

  if (isPending) {
    return <DashboardChartCardSpinner />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
        Failed to load product performance data.
      </div>
    )
  }

  return (
    <DashboardProductPerformanceChart
      performance={data}
      filter={filter}
      onFilterChange={setFilter}
      isLoading={isFetching}
    />
  )
}
