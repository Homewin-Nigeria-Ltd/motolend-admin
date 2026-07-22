import { queryOptions } from "@tanstack/react-query"

import { repaymentEndpoints } from "@/features/repayments/api/endpoints"
import { repaymentKeys } from "@/features/repayments/api/keys"
import type {
  ApiRepaymentDetailResponse,
  ApiRepaymentListResponse,
  RepaymentDetail,
  RepaymentListParams,
  RepaymentListResponse,
} from "@/features/repayments/types"
import {
  extractApiRepaymentDetail,
  mapApiRepayment,
  mapApiRepaymentDetail,
} from "@/features/repayments/utils/repayment"
import { api } from "@/lib/api/client"

async function fetchRepaymentList(
  params: RepaymentListParams,
): Promise<RepaymentListResponse> {
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

  if (params.loan_product_id !== undefined && params.loan_product_id !== "") {
    query.loan_product_id = params.loan_product_id
  }

  if (params.date_from?.trim()) {
    query.date_from = params.date_from.trim()
  }

  if (params.date_to?.trim()) {
    query.date_to = params.date_to.trim()
  }

  const response = await api.get<ApiRepaymentListResponse>(
    repaymentEndpoints.list,
    query,
  )

  const perPage = response.per_page ?? params.per_page ?? 15
  const total = response.total ?? response.data?.length ?? 0
  const lastPage = response.last_page ?? Math.max(1, Math.ceil(total / Math.max(perPage, 1)))

  return {
    items: (response.data ?? []).map((item) =>
      mapApiRepayment(item, params.status),
    ),
    meta: {
      current_page: response.current_page ?? params.page,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  }
}

async function fetchRepaymentDetail(id: string): Promise<RepaymentDetail> {
  const response = await api.get<ApiRepaymentDetailResponse>(
    repaymentEndpoints.detail(id),
  )
  const repayment = extractApiRepaymentDetail(response)

  if (!repayment) {
    throw new Error("Repayment not found")
  }

  return mapApiRepaymentDetail(repayment)
}

export const repaymentQueries = {
  list: (params: RepaymentListParams) =>
    queryOptions({
      queryKey: repaymentKeys.list(params),
      queryFn: () => fetchRepaymentList(params),
      placeholderData: (previous) => previous,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: repaymentKeys.detail(id),
      queryFn: () => fetchRepaymentDetail(id),
      enabled: Boolean(id.trim()),
    }),
}
