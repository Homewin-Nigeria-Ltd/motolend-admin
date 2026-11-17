"use client"

import { useQuery } from "@tanstack/react-query"

import { loanTierProgressionQueries } from "@/features/loan-progression/api/queries"
import type { ProgressionCustomerListParams } from "@/features/loan-progression/types"

export function useLoanTierProgression(params: ProgressionCustomerListParams) {
  return useQuery(loanTierProgressionQueries.detail(params))
}
