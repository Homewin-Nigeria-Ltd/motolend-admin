"use server"

import { loanTierProgressionServerEndpoints } from "@/features/loan-progression/api/endpoints"
import type {
  ApiLoanTierProgressionResponse,
  LoanTierProgressionActionResult,
  ProgressionSettingsState,
  UpdateLoanTierProgressionInput,
} from "@/features/loan-progression/types"
import { mapApiSettings } from "@/features/loan-progression/utils/map-progression"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(
  error: unknown,
  fallback: string,
): LoanTierProgressionActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

export async function updateLoanTierProgressionAction(
  input: UpdateLoanTierProgressionInput,
): Promise<LoanTierProgressionActionResult<ProgressionSettingsState>> {
  try {
    const response = await apiServer.put<ApiLoanTierProgressionResponse>(
      loanTierProgressionServerEndpoints.root,
      input,
    )

    const payload = response.data ?? response

    return {
      success: true,
      data: mapApiSettings(payload.settings),
    }
  } catch (error) {
    return toActionError(error, "Failed to update loan tier progression")
  }
}
