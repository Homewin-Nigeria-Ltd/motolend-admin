"use client"

import { useQuery } from "@tanstack/react-query"

import { declineQueries } from "@/features/decline/api/queries"
import type { DeclineListParams } from "@/features/decline/types"

export function useDeclinedLoans(params: DeclineListParams) {
  return useQuery(declineQueries.list(params))
}
