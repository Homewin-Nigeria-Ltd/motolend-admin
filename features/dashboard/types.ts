export type DashboardTrendDirection = "up" | "down"

export type DashboardFilter = "weekly" | "monthly" | "yearly"

export type DashboardMetricTrend = {
  percentage: number
  direction: DashboardTrendDirection
}

export type DashboardMetric = {
  value: number
  trend: DashboardMetricTrend
}

export type ApiDashboardOverviewResponse = {
  data: {
    total_amount_disbursed: DashboardMetric
    total_count_disbursed: DashboardMetric
    repayment_rate: DashboardMetric
    active_borrowers: DashboardMetric
    pending_applications: DashboardMetric
    defaults: DashboardMetric
    outstanding_amount: DashboardMetric
    interest_income: DashboardMetric
  }
}

export type ApiLoanPurposeItem = {
  category: string
  percentage: number
  count: number
}

export type ApiLoanPurposeResponse = {
  filter: DashboardFilter
  data: ApiLoanPurposeItem[]
}

export type ApiProductPerformanceResponse = {
  filter: DashboardFilter
  data: {
    successful: {
      count: number
      percentage: number
    }
    failed: {
      count: number
      percentage: number
    }
    total_transactions: number
  }
}

export type ApiInterestOverTimeItem = {
  month: string
  label: string
  interest: number
}

export type ApiInterestOverTimeResponse = {
  start_date: string
  end_date: string
  data: ApiInterestOverTimeItem[]
}

export type InterestOverTimeParams = {
  start_date: string
  end_date: string
}

export type DashboardKpiCard = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: DashboardTrendDirection
  sparkline: number[]
}

export type DashboardOverview = {
  topKpis: DashboardKpiCard[]
  bottomKpis: DashboardKpiCard[]
}

export type LoanPurposeItem = {
  category: string
  percentage: number
  count: number
  colorKey: string
}

export type ProductPerformance = {
  successful: {
    count: number
    percentage: number
  }
  failed: {
    count: number
    percentage: number
  }
  totalTransactions: number
}

export type InterestOverTimePoint = {
  label: string
  interest: number
  formattedInterest: string
}
