import { queryOptions } from "@tanstack/react-query"

import { loanApplicationEndpoints } from "@/features/loan-applications/api/endpoints"
import { loanApplicationKeys } from "@/features/loan-applications/api/keys"
import type {
  ApiApplicationDetailResponse,
  ApiApplicationListResponse,
  ApiApplicationMetricsResponse,
  ApplicationDetail,
  ApplicationKpi,
  ApplicationListParams,
  ApplicationListResponse,
} from "@/features/loan-applications/types"
import {
  extractApiApplicationDetail,
  mapApiApplicationDetail,
  mapApiLoanToApplication,
  mapApiMetricsToApplicationKpis,
} from "@/features/loan-applications/utils/application"
import { api } from "@/lib/api/client"

async function fetchApplicationMetrics(): Promise<ApplicationKpi[]> {
  const response = await api.get<ApiApplicationMetricsResponse>(
    loanApplicationEndpoints.metrics,
  )

  return mapApiMetricsToApplicationKpis(response)
}

async function fetchApplicationList(
  params: ApplicationListParams,
): Promise<ApplicationListResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: params.per_page ?? 15,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  if (params.status) {
    query.status = params.status
  }

  if (params.date_from) {
    query.date_from = params.date_from
  }

  if (params.date_to) {
    query.date_to = params.date_to
  }

  const response = await api.get<ApiApplicationListResponse>(
    loanApplicationEndpoints.list,
    query,
  )

  return {
    items: (response.data ?? []).map(mapApiLoanToApplication),
    meta: {
      current_page: response.current_page ?? params.page,
      last_page: response.last_page ?? 1,
      per_page: response.per_page ?? params.per_page ?? 15,
      total: response.total ?? response.data?.length ?? 0,
    },
  }
}

async function fetchApplicationDetail(id: string): Promise<ApplicationDetail> {
  const response = await api.get<ApiApplicationDetailResponse>(
    loanApplicationEndpoints.detail(id),
  )
  const application = extractApiApplicationDetail(response)

  if (!application) {
    throw new Error("Application not found")
  }

  return mapApiApplicationDetail(application)
}

export const loanApplicationQueries = {
  metrics: () =>
    queryOptions({
      queryKey: loanApplicationKeys.metrics(),
      queryFn: fetchApplicationMetrics,
      staleTime: 60 * 1000,
    }),

  list: (params: ApplicationListParams) =>
    queryOptions({
      queryKey: loanApplicationKeys.list(params),
      queryFn: () => fetchApplicationList(params),
      placeholderData: (previous) => previous,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: loanApplicationKeys.detail(id),
      queryFn: () => fetchApplicationDetail(id),
      enabled: Boolean(id.trim()),
    }),
}
