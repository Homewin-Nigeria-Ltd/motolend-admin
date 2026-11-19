import { queryOptions } from "@tanstack/react-query"

import { smsEndpoints } from "@/features/sms/api/endpoints"
import { smsKeys } from "@/features/sms/api/keys"
import type {
  ApiRecoverySmsOverviewResponse,
  SmsOverview,
} from "@/features/sms/types"
import {
  extractApiRecoverySmsOverview,
  mapApiRecoverySmsOverview,
} from "@/features/sms/utils/map-sms"
import { api } from "@/lib/api/client"

async function fetchRecoverySmsOverview(): Promise<SmsOverview> {
  const response = await api.get<ApiRecoverySmsOverviewResponse>(
    smsEndpoints.overview,
  )
  const overview = extractApiRecoverySmsOverview(response)

  if (!overview) {
    throw new Error("Failed to load recovery SMS settings")
  }

  return mapApiRecoverySmsOverview(overview)
}

export const smsQueries = {
  overview: () =>
    queryOptions({
      queryKey: smsKeys.overview(),
      queryFn: fetchRecoverySmsOverview,
      staleTime: 60 * 1000,
    }),
}
