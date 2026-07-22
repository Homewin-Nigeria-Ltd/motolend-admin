"use client"

import { useQuery } from "@tanstack/react-query"

import { repaymentQueries } from "@/features/repayments/api/queries"
import type { RepaymentListParams } from "@/features/repayments/types"

export function useRepaymentList(params: RepaymentListParams) {
  return useQuery(repaymentQueries.list(params))
}

export function useRepaymentDetail(id: string) {
  return useQuery(repaymentQueries.detail(id))
}
