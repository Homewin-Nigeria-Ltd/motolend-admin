"use client"

import { useMemo, useState } from "react"

import { DashboardInterestOverTimeChart } from "@/features/dashboard/components/dashboard-interest-over-time-chart"
import { DashboardAreaChartSpinner } from "@/features/dashboard/components/dashboard-section-spinners"
import { useDashboardInterestOverTime } from "@/features/dashboard/hooks/use-dashboard-queries"

export function DashboardInterestOverTimeSection() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

  const params = useMemo(
    () => ({
      start_date: `${year}-01-01`,
      end_date: `${year}-12-31`,
    }),
    [year],
  )

  const { data, isPending, isFetching, isError } =
    useDashboardInterestOverTime(params)

  if (isPending) {
    return <DashboardAreaChartSpinner />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
        Failed to load interest data.
      </div>
    )
  }

  return (
    <DashboardInterestOverTimeChart
      data={data ?? []}
      year={year}
      onYearChange={setYear}
      isLoading={isFetching}
    />
  )
}
