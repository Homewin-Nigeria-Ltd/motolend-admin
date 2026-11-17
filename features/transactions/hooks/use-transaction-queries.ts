"use client"

import { useQuery } from "@tanstack/react-query"

import { transactionQueries } from "@/features/transactions/api/queries"
import type { TransactionListParams } from "@/features/transactions/types"

export function useTransactionList(params: TransactionListParams) {
  return useQuery(transactionQueries.list(params))
}

export function useTransactionMetrics() {
  return useQuery(transactionQueries.metrics())
}
