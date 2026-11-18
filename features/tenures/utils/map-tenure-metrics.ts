import type {
  ApiLoanTenureMetricsResponse,
  TenureMetric,
} from "@/features/tenures/types"

function formatTenureCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function mapApiMetricsToTenureMetrics(
  metrics: ApiLoanTenureMetricsResponse,
): TenureMetric[] {
  const entries = [
    {
      key: "total",
      label: "Total Tenures",
      metric: metrics.total_tenures,
    },
    {
      key: "active",
      label: "Active Tenures",
      metric: metrics.active_tenures,
    },
    {
      key: "inactive",
      label: "Inactive Tenures",
      metric: metrics.inactive_tenures,
    },
  ] as const

  return entries.map(({ key, label, metric }) => ({
    key,
    label,
    value: formatTenureCount(metric.value),
    changePercent: metric.percentage ?? 0,
    trend: metric.direction === "down" ? "down" : "up",
  }))
}
