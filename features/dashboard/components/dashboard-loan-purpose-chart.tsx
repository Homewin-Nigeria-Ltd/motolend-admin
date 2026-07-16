"use client"

import { Cell, Pie, PieChart } from "recharts"

import { LOAN_PURPOSE_COLORS } from "@/features/dashboard/api/queries"
import { DashboardPeriodFilter } from "@/features/dashboard/components/dashboard-period-filter"
import type { DashboardFilter, LoanPurposeItem } from "@/features/dashboard/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type DashboardLoanPurposeChartProps = {
  items: LoanPurposeItem[]
  filter: DashboardFilter
  onFilterChange: (value: DashboardFilter) => void
  isLoading?: boolean
}

export function DashboardLoanPurposeChart({
  items,
  filter,
  onFilterChange,
  isLoading = false,
}: DashboardLoanPurposeChartProps) {
  const chartData = items.map((item, index) => ({
    ...item,
    fill: `var(--color-${item.colorKey})`,
    color: LOAN_PURPOSE_COLORS[index % LOAN_PURPOSE_COLORS.length],
  }))

  const chartConfig = items.reduce<ChartConfig>((acc, item, index) => {
    acc[item.colorKey] = {
      label: item.category,
      color: LOAN_PURPOSE_COLORS[index % LOAN_PURPOSE_COLORS.length],
    }
    return acc
  }, {})

  return (
    <Card className="flex h-full min-w-0 flex-col gap-4 py-5">
      <CardHeader className="flex flex-col gap-3 px-4 pb-0 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-sm font-semibold text-foreground">
            Loan Purpose
          </CardTitle>
          <p className="text-xs leading-relaxed text-muted-foreground">
            This pie chart visually breaks down the various reasons for
            payments, providing a clear representation of the most common
            purposes for transactions.
          </p>
        </div>
        <DashboardPeriodFilter value={filter} onChange={onFilterChange} />
      </CardHeader>
      <CardContent className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 pb-5 sm:px-5">
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Loading loan purpose data...
          </p>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No loan purpose data for this period.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
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
                        formatter={(value, _name, item) => [
                          `${value}%`,
                          item.payload?.category ?? String(_name),
                        ]}
                      />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="percentage"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius="88%"
                    paddingAngle={1}
                    strokeWidth={0}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.colorKey} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            <ul className="grid gap-2.5 sm:grid-cols-2">
              {items.map((item, index) => (
                <li
                  key={item.colorKey}
                  className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        LOAN_PURPOSE_COLORS[index % LOAN_PURPOSE_COLORS.length],
                    }}
                  />
                  <span className="truncate">{item.category}</span>
                  <span className="ml-auto shrink-0 font-medium text-foreground">
                    {item.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
