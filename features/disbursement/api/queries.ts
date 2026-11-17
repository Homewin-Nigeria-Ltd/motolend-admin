import { queryOptions } from "@tanstack/react-query"

import { disbursementEndpoints } from "@/features/disbursement/api/endpoints"
import { disbursementKeys } from "@/features/disbursement/api/keys"
import type {
  ApiDisbursementAllocationResponse,
  ApiDisbursementsListResponse,
  DisbursementAllocationState,
  DisbursementListParams,
  DisbursementListResponse,
} from "@/features/disbursement/types"
import {
  mapApiDisbursement,
  mapApiDisbursementAllocationResponse,
} from "@/features/disbursement/utils/map-disbursement"
import { api } from "@/lib/api/client"

async function fetchDisbursementList(
  params: DisbursementListParams,
): Promise<DisbursementListResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: params.per_page ?? 15,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  const response = await api.get<ApiDisbursementsListResponse>(
    disbursementEndpoints.list,
    query,
  )

  const perPage = response.per_page ?? params.per_page ?? 15
  const total = response.total ?? response.data?.length ?? 0
  const lastPage =
    response.last_page ?? Math.max(1, Math.ceil(total / Math.max(perPage, 1)))

  return {
    items: (response.data ?? []).map(mapApiDisbursement),
    meta: {
      current_page: response.current_page ?? params.page,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  }
}

async function fetchDisbursementAllocation(): Promise<DisbursementAllocationState> {
  const response = await api.get<ApiDisbursementAllocationResponse>(
    disbursementEndpoints.allocation,
  )

  return mapApiDisbursementAllocationResponse(response)
}

export const disbursementQueries = {
  list: (params: DisbursementListParams) =>
    queryOptions({
      queryKey: disbursementKeys.list(params),
      queryFn: () => fetchDisbursementList(params),
      placeholderData: (previous) => previous,
    }),

  allocation: () =>
    queryOptions({
      queryKey: disbursementKeys.allocation(),
      queryFn: fetchDisbursementAllocation,
      staleTime: 30 * 1000,
    }),
}
