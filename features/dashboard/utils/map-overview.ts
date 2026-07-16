import type {
  ApiDashboardOverviewResponse,
  DashboardKpiCard,
  DashboardMetric,
  DashboardOverview,
  DashboardTrendDirection,
} from "@/features/dashboard/types"
import {
  formatDashboardCount,
  formatDashboardPercent,
  formatInterestValue,
} from "@/features/dashboard/utils/format"

function buildSparkline(trend: DashboardTrendDirection) {
  const base = trend === "up" ? [3, 4, 5, 6, 7, 8, 9] : [9, 8, 7, 6, 5, 4, 3]
  return base.map((value, index) => value + (index % 2))
}

function mapMetricToKpi(
  key: string,
  label: string,
  metric: DashboardMetric,
  formatValue: (value: number) => string,
): DashboardKpiCard {
  return {
    key,
    label,
    value: formatValue(metric.value),
    changePercent: metric.trend.percentage,
    trend: metric.trend.direction,
    sparkline: buildSparkline(metric.trend.direction),
  }
}

export function mapApiOverviewToDashboard(
  response: ApiDashboardOverviewResponse,
): DashboardOverview {
  const { data } = response

  return {
    topKpis: [
      mapMetricToKpi(
        "total_amount_disbursed",
        "Total Amt. of Loans Disbursed",
        data.total_amount_disbursed,
        formatInterestValue,
      ),
      mapMetricToKpi(
        "total_count_disbursed",
        "Total No. of Loans Disbursed",
        data.total_count_disbursed,
        formatDashboardCount,
      ),
      mapMetricToKpi(
        "repayment_rate",
        "Repayment Rate",
        data.repayment_rate,
        formatDashboardPercent,
      ),
      mapMetricToKpi(
        "active_borrowers",
        "Active Borrowers",
        data.active_borrowers,
        formatDashboardCount,
      ),
    ],
    bottomKpis: [
      mapMetricToKpi(
        "pending_applications",
        "Pending Applications",
        data.pending_applications,
        formatDashboardCount,
      ),
      mapMetricToKpi(
        "defaults",
        "Defaults",
        data.defaults,
        formatDashboardCount,
      ),
      mapMetricToKpi(
        "outstanding_amount",
        "Outstanding Amount",
        data.outstanding_amount,
        formatInterestValue,
      ),
      mapMetricToKpi(
        "interest_income",
        "Income from Interest",
        data.interest_income,
        formatInterestValue,
      ),
    ],
  }
}
