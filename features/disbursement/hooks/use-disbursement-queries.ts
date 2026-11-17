"use client"

import { useQuery } from "@tanstack/react-query"

import { disbursementQueries } from "@/features/disbursement/api/queries"
import type { DisbursementListParams } from "@/features/disbursement/types"

export function useDisbursementList(params: DisbursementListParams) {
  return useQuery(disbursementQueries.list(params))
}

export function useDisbursementAllocation() {
  return useQuery(disbursementQueries.allocation())
}
