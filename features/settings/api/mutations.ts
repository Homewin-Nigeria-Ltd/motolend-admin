import { api } from "@/lib/api/client"
import { settingsEndpoints } from "@/features/settings/api/endpoints"
import type {
  CreditCheckSettingApiResponse,
  UpdateCreditCheckSettingInput,
} from "@/features/settings/types"

export const settingsMutations = {
  updateCreditCheck: {
    mutationFn: (input: UpdateCreditCheckSettingInput) =>
      api.post<CreditCheckSettingApiResponse, UpdateCreditCheckSettingInput>(
        settingsEndpoints.creditCheck,
        input,
      ),
  },
} as const
