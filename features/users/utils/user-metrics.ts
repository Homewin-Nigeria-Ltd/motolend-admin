import type { ApiUserMetricItem, ApiUserMetricsResponse, UserKpi } from "@/features/users/types"

const EMPTY_METRIC: ApiUserMetricItem = {
  value: 0,
  trend: { percentage: 0, direction: "up" },
}

function buildSparkline(trend: "up" | "down", value: number) {
  const scale = Math.max(Math.abs(value), 1)
  const base =
    trend === "up"
      ? [0.55, 0.62, 0.58, 0.7, 0.66, 0.78, 0.74, 0.86, 0.82, 1]
      : [1, 0.92, 0.96, 0.84, 0.88, 0.76, 0.8, 0.68, 0.72, 0.6]

  return base.map((point) => Math.max(1, Math.round(point * scale)))
}

function formatMetricValue(key: string, value: number | string) {
  const numericValue = typeof value === "number" ? value : Number(value)

  if (!Number.isNaN(numericValue)) {
    if (key === "churn_rate") {
      return `${new Intl.NumberFormat("en-NG", {
        maximumFractionDigits: 1,
      }).format(numericValue)}%`
    }

    return new Intl.NumberFormat("en-NG").format(numericValue)
  }

  return String(value)
}

function mapMetricToKpi(
  key: string,
  label: string,
  metric: ApiUserMetricItem,
): UserKpi {
  const numericValue =
    typeof metric.value === "number" ? metric.value : Number(metric.value)
  const trend = metric.trend.direction === "down" ? "down" : "up"

  return {
    key,
    label,
    value: formatMetricValue(key, metric.value),
    changePercent: metric.trend.percentage ?? 0,
    trend,
    sparkline: buildSparkline(
      trend,
      Number.isNaN(numericValue) ? 1 : numericValue,
    ),
  }
}

export function mapApiMetricsToUserKpis(
  metrics: ApiUserMetricsResponse,
): UserKpi[] {
  const entries = [
    {
      key: "new_signups",
      label: "New Signups Today",
      metric: metrics.new_signups_today,
    },
    {
      key: "all_users",
      label: "All users",
      metric: metrics.all_users ?? EMPTY_METRIC,
    },
    {
      key: "inactive_users",
      label: "Inactive User",
      metric: metrics.inactive_users ?? EMPTY_METRIC,
    },
    {
      key: "churn_rate",
      label: "Churn Rate",
      metric: metrics.churn_rate ?? EMPTY_METRIC,
    },
    {
      key: "active_users",
      label: "Active users",
      metric: metrics.active_users ?? EMPTY_METRIC,
    },
  ] as const

  return entries.map(({ key, label, metric }) =>
    mapMetricToKpi(key, label, metric),
  )
}
