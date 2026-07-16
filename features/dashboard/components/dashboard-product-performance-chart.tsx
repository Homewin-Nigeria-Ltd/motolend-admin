"use client"

import { Cell, Pie, PieChart } from "recharts"

import { DashboardPeriodFilter } from "@/features/dashboard/components/dashboard-period-filter"
import type {
  DashboardFilter,
  ProductPerformance,
} from "@/features/dashboard/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type DashboardProductPerformanceChartProps = {
  performance: ProductPerformance | undefined
  filter: DashboardFilter
  onFilterChange: (value: DashboardFilter) => void
  isLoading?: boolean
}

const PERFORMANCE_COLORS = {
  successful: "#166534",
  failed: "#F04438",
} as const

const chartConfig = {
  successful: {
    label: "Successful",
    color: PERFORMANCE_COLORS.successful,
  },
  failed: {
    label: "Failed",
    color: PERFORMANCE_COLORS.failed,
  },
} satisfies ChartConfig

export function DashboardProductPerformanceChart({
  performance,
  filter,
  onFilterChange,
  isLoading = false,
}: DashboardProductPerformanceChartProps) {
  const chartData = performance
    ? [
        {
          key: "successful",
          name: "Successful",
          value: performance.successful.count,
          percentage: performance.successful.percentage,
          fill: "var(--color-successful)",
        },
        {
          key: "failed",
          name: "Failed",
          value: performance.failed.count,
          percentage: performance.failed.percentage,
          fill: "var(--color-failed)",
        },
      ]
    : []

  const total = performance?.totalTransactions ?? 0

  return (
    <Card className="flex h-full min-w-0 flex-col gap-4 py-5">
      <CardHeader className="flex flex-col gap-3 px-4 pb-0 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-sm font-semibold text-foreground">
            Loan Product Performance
          </CardTitle>
          <p className="text-xs leading-relaxed text-muted-foreground">
            This indicator reflects whether a transaction was completed
            successfully or encountered an error.
          </p>
        </div>
        <DashboardPeriodFilter value={filter} onChange={onFilterChange} />
      </CardHeader>
      <CardContent className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 pb-5 sm:px-5">
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Loading product performance data...
          </p>
        ) : total === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No product performance data for this period.
          </p>
        ) : (
          <>
            <div className="mx-auto w-full min-w-0 max-w-[17.5rem]">
              <ChartContainer
                config={chartConfig}
                className="aspect-square w-full min-w-0"
                initialDimension={{ width: 280, height: 280 }}
              >
                <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, _name, item) => {
                          const count = Number(value)
                          const percent = item.payload?.percentage ?? 0

                          return [
                            `${percent}% (${count})`,
                            item.payload?.name ?? String(_name),
                          ]
                        }}
                      />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="88%"
                    paddingAngle={1}
                    strokeWidth={0}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            <ul className="mt-4 flex min-w-0 flex-wrap items-center justify-center gap-4">
              {chartData.map((item) => (
                <li
                  key={item.key}
                  className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        PERFORMANCE_COLORS[
                          item.key as keyof typeof PERFORMANCE_COLORS
                        ],
                    }}
                  />
                  <span>{item.name}</span>
                  <span className="font-medium text-foreground">
                    {item.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
