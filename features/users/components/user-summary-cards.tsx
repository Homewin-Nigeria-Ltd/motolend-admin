import type { UserKpi } from "@/features/users/types"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function Sparkline({
  values,
  trend,
}: {
  values: number[]
  trend: "up" | "down"
}) {
  const width = 88
  const height = 36
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((value - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={trend === "up" ? "#12B76A" : "#F04438"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <Skeleton className="h-4 w-24 rounded-md" />
      <Skeleton className="mt-4 h-8 w-20 rounded-md" />
    </div>
  )
}

function SummaryCard({ kpi }: { kpi: UserKpi }) {
  const isUp = kpi.trend === "up"

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {kpi.value}
          </p>
          <p
            className={cn(
              "mt-1 text-xs font-medium",
              isUp ? "text-emerald-600" : "text-destructive",
            )}
          >
            {isUp ? "↑" : "↓"} {kpi.changePercent}% vs last month
          </p>
        </div>
        <Sparkline values={kpi.sparkline} trend={kpi.trend} />
      </div>
    </div>
  )
}

export function UserSummaryCards({
  kpis,
  isLoading = false,
}: {
  kpis: UserKpi[]
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
