import { queryOptions } from "@tanstack/react-query"

import { loanProductEndpoints } from "@/features/loan-products/api/endpoints"
import { loanProductKeys } from "@/features/loan-products/api/keys"
import type {
  ApiLoanProductDetailResponse,
  ApiLoanProductListResponse,
  ApiLoanProductMetricsResponse,
  LoanProductDetail,
  LoanProductKpi,
  LoanProductListParams,
  LoanProductListResponse,
} from "@/features/loan-products/types"
import {
  extractApiLoanProductDetail,
  mapApiLoanProduct,
  mapApiLoanProductDetail,
  mapApiMetricsToLoanProductKpis,
} from "@/features/loan-products/utils/loan-product"
import { api } from "@/lib/api/client"

async function fetchLoanProductMetrics(): Promise<LoanProductKpi[]> {
  const response = await api.get<ApiLoanProductMetricsResponse>(
    loanProductEndpoints.metrics,
  )

  return mapApiMetricsToLoanProductKpis(response)
}

async function fetchLoanProductList(
  params: LoanProductListParams,
): Promise<LoanProductListResponse> {
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

  const response = await api.get<ApiLoanProductListResponse>(
    loanProductEndpoints.list,
    query,
  )

  const perPage = response.per_page ?? params.per_page ?? 15
  const total = response.total ?? response.data?.length ?? 0
  const lastPage =
    response.last_page ?? Math.max(1, Math.ceil(total / Math.max(perPage, 1)))

  return {
    items: (response.data ?? []).map(mapApiLoanProduct),
    meta: {
      current_page: response.current_page ?? params.page,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  }
}

async function fetchLoanProductDetail(id: string): Promise<LoanProductDetail> {
  const response = await api.get<ApiLoanProductDetailResponse>(
    loanProductEndpoints.detail(id),
  )
  const product = extractApiLoanProductDetail(response)

  if (!product) {
    throw new Error("Loan product not found")
  }

  return mapApiLoanProductDetail(product)
}

export const loanProductQueries = {
  metrics: () =>
    queryOptions({
      queryKey: loanProductKeys.metrics(),
      queryFn: fetchLoanProductMetrics,
      staleTime: 60 * 1000,
    }),

  list: (params: LoanProductListParams) =>
    queryOptions({
      queryKey: loanProductKeys.list(params),
      queryFn: () => fetchLoanProductList(params),
      placeholderData: (previous) => previous,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: loanProductKeys.detail(id),
      queryFn: () => fetchLoanProductDetail(id),
      enabled: Boolean(id.trim()),
    }),
}
