"use client"

import { useQuery } from "@tanstack/react-query"

import { loanApplicationQueries } from "@/features/loan-applications/api/queries"
import type { ApplicationListParams } from "@/features/loan-applications/types"

export function useApplicationMetrics() {
  return useQuery(loanApplicationQueries.metrics())
}

export function useApplicationList(params: ApplicationListParams) {
  return useQuery(loanApplicationQueries.list(params))
}

export function useApplicationDetail(id: string) {
  return useQuery(loanApplicationQueries.detail(id))
}
