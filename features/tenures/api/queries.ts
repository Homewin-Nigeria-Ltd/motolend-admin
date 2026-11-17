import { queryOptions } from "@tanstack/react-query"

import { loanTenureEndpoints } from "@/features/tenures/api/endpoints"
import { loanTenureKeys } from "@/features/tenures/api/keys"
import type {
  ApiLoanTenureDetailResponse,
  ApiLoanTenureListResponse,
  TenureDetail,
  TenureListParams,
  TenureListResponse,
} from "@/features/tenures/types"
import {
  extractApiLoanTenure,
  mapApiLoanTenure,
  mapApiLoanTenureDetail,
} from "@/features/tenures/utils/map-tenure"
import { api } from "@/lib/api/client"

async function fetchLoanTenureList(
  params: TenureListParams,
): Promise<TenureListResponse> {
  const query: Record<string, string | number | boolean> = {
    page: params.page,
    per_page: params.per_page ?? 15,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  if (params.status === "active") {
    query.is_active = true
  }

  if (params.status === "inactive") {
    query.is_active = false
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
