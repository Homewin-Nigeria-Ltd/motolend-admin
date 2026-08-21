import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import { settingsEndpoints } from "@/features/settings/api/endpoints"
import { settingsKeys } from "@/features/settings/api/keys"
import type {
  CreditCheckSetting,
  CreditCheckSettingApiResponse,
} from "@/features/settings/types"

async function fetchCreditCheckSetting(): Promise<CreditCheckSetting> {
  const response = await api.get<CreditCheckSettingApiResponse>(
    settingsEndpoints.creditCheck,
  )

  return response.data
}

export const settingsQueries = {
  creditCheck: () =>
    queryOptions({
      queryKey: settingsKeys.creditCheck(),
      queryFn: fetchCreditCheckSetting,
      staleTime: 60_000,
    }),
}
