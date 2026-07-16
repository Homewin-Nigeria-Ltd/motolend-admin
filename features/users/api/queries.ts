import { queryOptions } from "@tanstack/react-query"

import { userEndpoints } from "@/features/users/api/endpoints"
import { userKeys } from "@/features/users/api/keys"
import type {
  ApiUserDetailResponse,
  ApiUserListResponse,
  ApiUserLoanListResponse,
  ApiUserMetricsResponse,
  UserDetail,
  UserKpi,
  UserListParams,
  UserListResponse,
  UserLoanListParams,
  UserLoanListResponse,
} from "@/features/users/types"
import { mapApiMetricsToUserKpis } from "@/features/users/utils/user-metrics"
import { mapApiUserToUserDetail } from "@/features/users/utils/user-detail"
import { mapApiLoanToUserLoan } from "@/features/users/utils/user-loans"
import {
  extractApiUser,
  mapApiUserToUserRecord,
  tabToListQuery,
} from "@/features/users/utils/user"
import { api } from "@/lib/api/client"

async function fetchUserMetrics(): Promise<UserKpi[]> {
  const response = await api.get<ApiUserMetricsResponse>(
    userEndpoints.metrics,
  )

  return mapApiMetricsToUserKpis(response)
}

async function fetchUserList(params: UserListParams): Promise<UserListResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: params.per_page ?? 15,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  const tabQuery = tabToListQuery(params.tab ?? "active")
  Object.assign(query, tabQuery)

  const response = await api.get<ApiUserListResponse>(userEndpoints.list, query)

  return {
    items: response.data.map(mapApiUserToUserRecord),
    meta: {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total,
    },
  }
}

async function fetchUserDetail(id: string): Promise<UserDetail> {
  const response = await api.get<ApiUserDetailResponse>(
    userEndpoints.detail(id),
  )
  const user = extractApiUser(response)

  if (!user) {
    throw new Error("User not found")
  }

  return mapApiUserToUserDetail(user)
}

async function fetchUserLoans(
  params: UserLoanListParams,
): Promise<UserLoanListResponse> {
  const response = await api.get<ApiUserLoanListResponse>(
    userEndpoints.loans(params.userId),
    {
      page: params.page,
      per_page: params.per_page ?? 15,
    },
  )

  return {
    items: response.data.map(mapApiLoanToUserLoan),
    meta: {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total,
    },
  }
}

export const userQueries = {
  metrics: () =>
    queryOptions({
      queryKey: userKeys.metrics(),
      queryFn: fetchUserMetrics,
      staleTime: 60 * 1000,
    }),

  list: (params: UserListParams) =>
    queryOptions({
      queryKey: userKeys.list(params),
      queryFn: () => fetchUserList(params),
      placeholderData: (previous) => previous,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: userKeys.detail(id),
      queryFn: () => fetchUserDetail(id),
      enabled: Boolean(id.trim()),
    }),

  loans: (params: UserLoanListParams) =>
    queryOptions({
      queryKey: userKeys.loans(params),
      queryFn: () => fetchUserLoans(params),
      enabled: Boolean(params.userId.trim()),
      placeholderData: (previous) => previous,
    }),
}
