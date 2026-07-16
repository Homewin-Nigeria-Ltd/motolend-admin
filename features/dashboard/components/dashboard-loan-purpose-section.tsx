"use client"

import { useState } from "react"

import { DashboardLoanPurposeChart } from "@/features/dashboard/components/dashboard-loan-purpose-chart"
import { DashboardChartCardSpinner } from "@/features/dashboard/components/dashboard-section-spinners"
import { useDashboardLoanPurpose } from "@/features/dashboard/hooks/use-dashboard-queries"
import type { DashboardFilter } from "@/features/dashboard/types"

export function DashboardLoanPurposeSection() {
  const [filter, setFilter] = useState<DashboardFilter>("monthly")
  const { data, isPending, isFetching, isError } =
    useDashboardLoanPurpose(filter)

  if (isPending) {
    return <DashboardChartCardSpinner />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
        Failed to load loan purpose data.
      </div>
    )
  }

  return (
    <DashboardLoanPurposeChart
      items={data ?? []}
      filter={filter}
      onFilterChange={setFilter}
      isLoading={isFetching}
    />
  )
}
