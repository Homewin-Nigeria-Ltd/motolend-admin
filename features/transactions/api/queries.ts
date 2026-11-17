import { queryOptions } from "@tanstack/react-query"

import { transactionEndpoints } from "@/features/transactions/api/endpoints"
import { transactionKeys } from "@/features/transactions/api/keys"
import type {
  ApiTransactionListResponse,
  ApiTransactionMetricsResponse,
  TransactionListParams,
  TransactionListResponse,
  TransactionMetric,
} from "@/features/transactions/types"
import {
  mapApiTransactionListResponse,
  mapApiTransactionMetrics,
} from "@/features/transactions/utils/map-transaction"
import { api } from "@/lib/api/client"

async function fetchTransactionList(
  params: TransactionListParams,
): Promise<TransactionListResponse> {
  const perPage = params.per_page ?? 15
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: perPage,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  if (params.status) {
    query.status = params.status
  }

  const response = await api.get<ApiTransactionListResponse>(
    transactionEndpoints.list,
    query,
  )

  return mapApiTransactionListResponse(response, {
    page: params.page,
    per_page: perPage,
  })
}

async function fetchTransactionMetrics(): Promise<TransactionMetric[]> {
  const response = await api.get<ApiTransactionMetricsResponse>(
    transactionEndpoints.metrics,
  )

  return mapApiTransactionMetrics(response)
}

export const transactionQueries = {
  list: (params: TransactionListParams) =>
    queryOptions({
      queryKey: transactionKeys.list(params),
      queryFn: () => fetchTransactionList(params),
      placeholderData: (previous) => previous,
    }),

  metrics: () =>
    queryOptions({
      queryKey: transactionKeys.metrics(),
      queryFn: fetchTransactionMetrics,
      staleTime: 60 * 1000,
    }),
}
