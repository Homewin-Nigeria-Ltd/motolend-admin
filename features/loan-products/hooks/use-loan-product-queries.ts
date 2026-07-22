"use client"

import { useQuery } from "@tanstack/react-query"

import { loanProductQueries } from "@/features/loan-products/api/queries"
import type { LoanProductListParams } from "@/features/loan-products/types"

export function useLoanProductMetrics() {
  return useQuery(loanProductQueries.metrics())
}

export function useLoanProductList(params: LoanProductListParams) {
  return useQuery(loanProductQueries.list(params))
}

export function useLoanProductDetail(id: string) {
  return useQuery(loanProductQueries.detail(id))
}
