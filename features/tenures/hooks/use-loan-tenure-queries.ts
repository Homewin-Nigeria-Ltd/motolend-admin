"use client"

import { useQuery } from "@tanstack/react-query"

import { loanTenureQueries } from "@/features/tenures/api/queries"
import type { TenureListParams } from "@/features/tenures/types"

export function useLoanTenureList(params: TenureListParams) {
  return useQuery(loanTenureQueries.list(params))
}

export function useLoanTenureDetail(id: string) {
  return useQuery(loanTenureQueries.detail(id))
}
