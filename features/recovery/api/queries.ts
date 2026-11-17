import { queryOptions } from "@tanstack/react-query"

import { recoveryEndpoints } from "@/features/recovery/api/endpoints"
import { recoveryKeys } from "@/features/recovery/api/keys"
import type {
  ApiRecoveryLoanListResponse,
  ApiRecoveryMetricsResponse,
  ApiRecoveryStageCountsResponse,
  RecoveryListParams,
  RecoveryListResponse,
  RecoveryMetric,
  RecoveryStageCount,
} from "@/features/recovery/types"
import {
  mapApiRecoveryLoanListResponse,
  mapApiRecoveryMetrics,
  mapApiRecoveryStageCounts,
} from "@/features/recovery/utils/map-recovery"
import { api } from "@/lib/api/client"

async function fetchRecoveryLoans(
  params: RecoveryListParams,
): Promise<RecoveryListResponse> {
  const perPage = params.per_page ?? 15
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: perPage,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  if (params.stage) {
    query.stage = params.stage
  }

  if (params.status) {
    query.status = params.status
  }

  if (params.loan_product_id != null) {
    query.loan_product_id = params.loan_product_id
  }

  if (params.date_from) {
    query.date_from = params.date_from
  }

  if (params.date_to) {
    query.date_to = params.date_to
  }

  const response = await api.get<ApiRecoveryLoanListResponse>(
    recoveryEndpoints.list,
    query,
  )

  return mapApiRecoveryLoanListResponse(response, {
    page: params.page,
    per_page: perPage,
    stage: params.stage ?? "active",
  })
}

async function fetchRecoveryStageCounts(): Promise<RecoveryStageCount[]> {
  const response = await api.get<ApiRecoveryStageCountsResponse>(
    recoveryEndpoints.stageCounts,
  )

  return mapApiRecoveryStageCounts(response)
}

async function fetchRecoveryMetrics(): Promise<RecoveryMetric[]> {
  const response = await api.get<ApiRecoveryMetricsResponse>(
    recoveryEndpoints.metrics,
  )

  return mapApiRecoveryMetrics(response)
}

export const recoveryQueries = {
  list: (params: RecoveryListParams) =>
    queryOptions({
      queryKey: recoveryKeys.list(params),
      queryFn: () => fetchRecoveryLoans(params),
      placeholderData: (previous) => previous,
    }),

  stageCounts: () =>
    queryOptions({
      queryKey: recoveryKeys.stageCounts(),
      queryFn: fetchRecoveryStageCounts,
      staleTime: 60 * 1000,
    }),

  metrics: () =>
    queryOptions({
      queryKey: recoveryKeys.metrics(),
      queryFn: fetchRecoveryMetrics,
      staleTime: 60 * 1000,
    }),
}
