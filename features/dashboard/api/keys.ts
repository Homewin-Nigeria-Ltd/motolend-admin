import type {
  DashboardFilter,
  InterestOverTimeParams,
} from "@/features/dashboard/types"

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
  loanPurpose: (filter: DashboardFilter) =>
    [...dashboardKeys.all, "loan-purpose", filter] as const,
  productPerformance: (filter: DashboardFilter) =>
    [...dashboardKeys.all, "product-performance", filter] as const,
  interestOverTime: (params: InterestOverTimeParams) =>
    [...dashboardKeys.all, "interest-over-time", params] as const,
}
