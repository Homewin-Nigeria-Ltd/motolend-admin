import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import { dashboardEndpoints } from "@/features/dashboard/api/endpoints"
import { dashboardKeys } from "@/features/dashboard/api/keys"
import type {
  ApiDashboardOverviewResponse,
  ApiInterestOverTimeResponse,
  ApiLoanPurposeResponse,
  ApiProductPerformanceResponse,
  DashboardFilter,
  DashboardOverview,
  InterestOverTimeParams,
  InterestOverTimePoint,
  LoanPurposeItem,
  ProductPerformance,
} from "@/features/dashboard/types"
import { formatInterestValue } from "@/features/dashboard/utils/format"
import { mapApiOverviewToDashboard } from "@/features/dashboard/utils/map-overview"
import { api } from "@/lib/api/client"

const LOAN_PURPOSE_COLORS = [
  "#166534",
  "#15803D",
  "#16A34A",
  "#22C55E",
  "#4ADE80",
  "#86EFAC",
  "#BBF7D0",
  "#DCFCE7",
  "#14532D",
]

async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const response = await api.get<ApiDashboardOverviewResponse>(
    dashboardEndpoints.overview,
  )

  return mapApiOverviewToDashboard(response)
}

async function fetchLoanPurpose(
  filter: DashboardFilter,
): Promise<LoanPurposeItem[]> {
  const response = await api.get<ApiLoanPurposeResponse>(
    dashboardEndpoints.loanPurpose,
    { filter },
  )

  return response.data.map((item, index) => ({
    category: item.category,
    percentage: item.percentage,
    count: item.count,
    colorKey: `purpose_${index}`,
  }))
}

async function fetchProductPerformance(
  filter: DashboardFilter,
): Promise<ProductPerformance> {
  const response = await api.get<ApiProductPerformanceResponse>(
    dashboardEndpoints.productPerformance,
    { filter },
  )

  return {
    successful: response.data.successful,
    failed: response.data.failed,
    totalTransactions: response.data.total_transactions,
  }
}

async function fetchInterestOverTime(
  params: InterestOverTimeParams,
): Promise<InterestOverTimePoint[]> {
  const response = await api.get<ApiInterestOverTimeResponse>(
    dashboardEndpoints.interestOverTime,
    params,
  )

  return response.data.map((item) => ({
    label: item.label,
    interest: item.interest,
    formattedInterest: formatInterestValue(item.interest),
  }))
}

export const dashboardQueries = {
  overview: () =>
    queryOptions({
      queryKey: dashboardKeys.overview(),
      queryFn: fetchDashboardOverview,
    }),

  loanPurpose: (filter: DashboardFilter) =>
    queryOptions({
      queryKey: dashboardKeys.loanPurpose(filter),
      queryFn: () => fetchLoanPurpose(filter),
      placeholderData: keepPreviousData,
    }),

  productPerformance: (filter: DashboardFilter) =>
    queryOptions({
      queryKey: dashboardKeys.productPerformance(filter),
      queryFn: () => fetchProductPerformance(filter),
      placeholderData: keepPreviousData,
    }),

  interestOverTime: (params: InterestOverTimeParams) =>
    queryOptions({
      queryKey: dashboardKeys.interestOverTime(params),
      queryFn: () => fetchInterestOverTime(params),
      placeholderData: keepPreviousData,
    }),
}

export { LOAN_PURPOSE_COLORS }
