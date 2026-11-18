import { queryOptions } from "@tanstack/react-query"

import { loanTenureEndpoints } from "@/features/tenures/api/endpoints"
import { loanTenureKeys } from "@/features/tenures/api/keys"
import type {
  ApiLoanTenureDetailResponse,
  ApiLoanTenureListResponse,
  ApiLoanTenureMetricsResponse,
  TenureDetail,
  TenureListParams,
  TenureListResponse,
  TenureMetric,
} from "@/features/tenures/types"
import {
  extractApiLoanTenure,
  mapApiLoanTenure,
  mapApiLoanTenureDetail,
} from "@/features/tenures/utils/map-tenure"
import { mapApiMetricsToTenureMetrics } from "@/features/tenures/utils/map-tenure-metrics"
import { api } from "@/lib/api/client"

async function fetchLoanTenureMetrics(): Promise<TenureMetric[]> {
  const response = await api.get<ApiLoanTenureMetricsResponse>(
    loanTenureEndpoints.metrics,
  )

  return mapApiMetricsToTenureMetrics(response)
}

async function fetchLoanTenureList(
  params: TenureListParams,
): Promise<TenureListResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: params.per_page ?? 15,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  if (params.status === "active" || params.status === "inactive") {
    query.status = params.status
  }

  const response = await api.get<ApiLoanTenureListResponse>(
    loanTenureEndpoints.list,
    query,
  )

  const perPage = response.per_page ?? params.per_page ?? 15
  const total = response.total ?? response.data?.length ?? 0
  const lastPage =
    response.last_page ?? Math.max(1, Math.ceil(total / Math.max(perPage, 1)))

  return {
    items: (response.data ?? []).map(mapApiLoanTenure),
    meta: {
      current_page: response.current_page ?? params.page,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  }
}

async function fetchLoanTenureDetail(id: string): Promise<TenureDetail> {
  const response = await api.get<ApiLoanTenureDetailResponse>(
    loanTenureEndpoints.detail(id),
  )
  const tenure = extractApiLoanTenure(response)

  if (!tenure) {
    throw new Error("Loan tenure not found")
  }

  return mapApiLoanTenureDetail(tenure)
}

export const loanTenureQueries = {
  metrics: () =>
    queryOptions({
      queryKey: loanTenureKeys.metrics(),
      queryFn: fetchLoanTenureMetrics,
      staleTime: 60 * 1000,
    }),

  list: (params: TenureListParams) =>
    queryOptions({
      queryKey: loanTenureKeys.list(params),
      queryFn: () => fetchLoanTenureList(params),
      placeholderData: (previous) => previous,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: loanTenureKeys.detail(id),
      queryFn: () => fetchLoanTenureDetail(id),
      enabled: Boolean(id.trim()),
    }),
}
