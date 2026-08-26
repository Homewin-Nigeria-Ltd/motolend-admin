"use client"

import { useQuery } from "@tanstack/react-query"

import { repaymentQueries } from "@/features/repayments/api/queries"

export function useRepaymentMetrics() {
  return useQuery(repaymentQueries.metrics())
}
