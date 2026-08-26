import type {
  ApiRepaymentMetricItem,
  ApiRepaymentMetrics,
} from "@/features/repayments/types"
import { formatMoney } from "@/features/users/utils/format-money"
import { MetricSummaryCard } from "@/components/metric-summary-card"
import { Skeleton } from "@/components/ui/skeleton"

const METRIC_CARDS = [
  {
    key: "total_outstanding",
    label: "Total Outstanding",
    formatValue: (value: number) => formatMoney(value),
  },
  {
    key: "total_repaid",
    label: "Total Repaid",
    formatValue: (value: number) => formatMoney(value),
  },
  {
    key: "repayment_rate",
    label: "Repayment Rate",
    formatValue: (value: number) => `${value}%`,
  },
  {
    key: "overdue_payments",
    label: "Overdue Payments",
    formatValue: (value: number) => String(value),
  },
] as const satisfies ReadonlyArray<{
  key: keyof ApiRepaymentMetrics
  label: string
  formatValue: (value: number) => string
}>

function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <Skeleton className="h-4 w-28 rounded-md" />
      <Skeleton className="mt-4 h-8 w-24 rounded-md" />
      <Skeleton className="mt-4 h-3 w-32 rounded-md" />
    </div>
  )
}

export function RepaymentSummaryCards({
  metrics,
  isLoading = false,
}: {
  metrics?: ApiRepaymentMetrics
  isLoading?: boolean
}) {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {METRIC_CARDS.map((card) => {
        const metric: ApiRepaymentMetricItem = metrics[card.key]

        return (
          <MetricSummaryCard
            key={card.key}
            label={card.label}
            value={card.formatValue(metric.value)}
            changePercent={metric.trend.percentage}
            trend={metric.trend.direction}
          />
        )
      })}
    </div>
  )
}
