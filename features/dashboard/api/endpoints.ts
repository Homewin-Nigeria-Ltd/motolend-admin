const dashboardPath = "/admin/dashboard"

export const dashboardEndpoints = {
  overview: `/api/proxy${dashboardPath}/overview`,
  loanPurpose: `/api/proxy${dashboardPath}/loan-purpose`,
  productPerformance: `/api/proxy${dashboardPath}/product-performance`,
  interestOverTime: `/api/proxy${dashboardPath}/interest-over-time`,
} as const
