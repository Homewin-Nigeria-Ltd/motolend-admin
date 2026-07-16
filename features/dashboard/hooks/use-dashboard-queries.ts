"use client"

import { useQuery } from "@tanstack/react-query"

import { dashboardQueries } from "@/features/dashboard/api/queries"
import type {
  DashboardFilter,
  InterestOverTimeParams,
} from "@/features/dashboard/types"

export function useDashboardOverview() {
  return useQuery(dashboardQueries.overview())
}

export function useDashboardLoanPurpose(filter: DashboardFilter) {
  return useQuery(dashboardQueries.loanPurpose(filter))
}

export function useDashboardProductPerformance(filter: DashboardFilter) {
  return useQuery(dashboardQueries.productPerformance(filter))
}

export function useDashboardInterestOverTime(params: InterestOverTimeParams) {
  return useQuery(dashboardQueries.interestOverTime(params))
}
