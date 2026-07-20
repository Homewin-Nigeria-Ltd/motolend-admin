import type { ApiUserMetricItem, ApiUserMetricsResponse, UserKpi } from "@/features/users/types"

const EMPTY_METRIC: ApiUserMetricItem = {
  value: 0,
  trend: { percentage: 0, direction: "up" },
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
  const trend = metric.trend.direction === "down" ? "down" : "up"

  return {
    key,
    label,
    value: formatMetricValue(key, metric.value),
    changePercent: metric.trend.percentage ?? 0,
    trend,
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
