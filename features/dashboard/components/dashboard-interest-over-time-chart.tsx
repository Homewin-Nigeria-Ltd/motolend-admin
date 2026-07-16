"use client"

import { useId } from "react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

import type { InterestOverTimePoint } from "@/features/dashboard/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type DashboardInterestOverTimeChartProps = {
  data: InterestOverTimePoint[]
  year: number
  onYearChange: (year: number) => void
  isLoading?: boolean
}

const chartConfig = {
  interest: {
    label: "Interest",
    color: "#166534",
  },
} satisfies ChartConfig

const YEAR_OPTIONS = [2024, 2025, 2026, 2027]

function formatYAxisTick(value: number) {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`
  }

  return String(value)
}

export function DashboardInterestOverTimeChart({
  data,
  year,
  onYearChange,
  isLoading = false,
}: DashboardInterestOverTimeChartProps) {
  const gradientId = useId().replace(/:/g, "")
  const chartData = data.map((point) => ({
    label: point.label.replace(` ${year}`, ""),
    interest: point.interest,
    formattedInterest: point.formattedInterest,
  }))

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="flex flex-col gap-3 px-5 pb-0 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-sm font-semibold text-foreground">
          Income from Interest Over Time
        </CardTitle>
        <Select
          value={String(year)}
          onValueChange={(value) => onYearChange(Number(value))}
        >
          <SelectTrigger className="h-9 w-[11rem]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent align="end">
            {YEAR_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                Jan {option} - Dec {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Loading interest data...
          </p>
        ) : data.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No interest data for this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 8,
                right: 12,
                top: 8,
              }}
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="rgba(22, 101, 52, 0.25)" />
                  <stop offset="100%" stopColor="rgba(22, 101, 52, 0)" />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatYAxisTick}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(_, __, item) =>
                      String(item.payload.formattedInterest)
                    }
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="interest"
                stroke="var(--color-interest)"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
