"use client"

import { useQuery } from "@tanstack/react-query"

import { recoveryQueries } from "@/features/recovery/api/queries"
import type { RecoveryListParams } from "@/features/recovery/types"

export function useRecoveryLoans(params: RecoveryListParams) {
  return useQuery(recoveryQueries.list(params))
}

export function useRecoveryStageCounts() {
  return useQuery(recoveryQueries.stageCounts())
}

export function useRecoveryMetrics() {
  return useQuery(recoveryQueries.metrics())
}
