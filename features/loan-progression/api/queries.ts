import { queryOptions } from "@tanstack/react-query"

import { loanTierProgressionEndpoints } from "@/features/loan-progression/api/endpoints"
import { loanTierProgressionKeys } from "@/features/loan-progression/api/keys"
import type {
  ApiLoanTierProgressionResponse,
  LoanTierProgressionResponse,
  ProgressionCustomerListParams,
} from "@/features/loan-progression/types"
import { mapApiLoanTierProgressionResponse } from "@/features/loan-progression/utils/map-progression"
import { api } from "@/lib/api/client"

async function fetchLoanTierProgression(
  params: ProgressionCustomerListParams,
): Promise<LoanTierProgressionResponse> {
  const perPage = params.per_page ?? 15
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: perPage,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  const response = await api.get<ApiLoanTierProgressionResponse>(
    loanTierProgressionEndpoints.root,
    query,
  )

  return mapApiLoanTierProgressionResponse(response, {
    page: params.page,
    per_page: perPage,
  })
}

export const loanTierProgressionQueries = {
  detail: (params: ProgressionCustomerListParams) =>
    queryOptions({
      queryKey: loanTierProgressionKeys.detail(params),
      queryFn: () => fetchLoanTierProgression(params),
      placeholderData: (previous) => previous,
    }),
}
