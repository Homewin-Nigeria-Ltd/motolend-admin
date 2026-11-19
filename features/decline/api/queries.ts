import { queryOptions } from "@tanstack/react-query"

import { declineEndpoints } from "@/features/decline/api/endpoints"
import { declineKeys } from "@/features/decline/api/keys"
import type {
  DeclineListParams,
  DeclineListResponse,
} from "@/features/decline/types"
import { mapApiLoanToDeclineRecord } from "@/features/decline/utils/map-decline"
import type { ApiApplicationListResponse } from "@/features/loan-applications/types"
import { api } from "@/lib/api/client"

async function fetchDeclinedLoans(
  params: DeclineListParams,
): Promise<DeclineListResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: params.per_page ?? 15,
    status: "rejected",
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  const response = await api.get<ApiApplicationListResponse>(
    declineEndpoints.list,
    query,
  )

  return {
    items: (response.data ?? []).map(mapApiLoanToDeclineRecord),
    meta: {
      current_page: response.current_page ?? params.page,
      last_page: response.last_page ?? 1,
      per_page: response.per_page ?? params.per_page ?? 15,
      total: response.total ?? response.data?.length ?? 0,
    },
  }
}

export const declineQueries = {
  list: (params: DeclineListParams) =>
    queryOptions({
      queryKey: declineKeys.list(params),
      queryFn: () => fetchDeclinedLoans(params),
      placeholderData: (previous) => previous,
    }),
}
