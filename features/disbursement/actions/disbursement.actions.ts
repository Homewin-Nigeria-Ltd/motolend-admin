"use server"

import { disbursementServerEndpoints } from "@/features/disbursement/api/endpoints"
import type {
  ApiDisbursementAllocationResponse,
  DisbursementActionResult,
  DisbursementAllocationState,
  RaiseDisbursementAllocationInput,
  UpdateDisbursementAllocationInput,
  VerifyDisbursementInput,
} from "@/features/disbursement/types"
import { mapApiDisbursementAllocationResponse } from "@/features/disbursement/utils/map-disbursement"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(
  error: unknown,
  fallback: string,
): DisbursementActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

export async function updateDisbursementAllocationAction(
  input: UpdateDisbursementAllocationInput,
): Promise<DisbursementActionResult<DisbursementAllocationState>> {
  try {
    const response = await apiServer.put<ApiDisbursementAllocationResponse>(
      disbursementServerEndpoints.allocation,
      input,
    )

    return {
      success: true,
      data: mapApiDisbursementAllocationResponse(response),
    }
  } catch (error) {
    return toActionError(error, "Failed to update disbursement allocation")
  }
}

export async function raiseDisbursementAllocationAction(
  input: RaiseDisbursementAllocationInput,
): Promise<DisbursementActionResult<DisbursementAllocationState>> {
  try {
    const response = await apiServer.post<ApiDisbursementAllocationResponse>(
      disbursementServerEndpoints.raiseAllocation,
      {
        additional_amount: input.additional_amount,
      },
    )

    return {
      success: true,
      data: mapApiDisbursementAllocationResponse(response),
    }
  } catch (error) {
    return toActionError(error, "Failed to raise disbursement allocation")
  }
}

export async function verifyDisbursementAction(
  input: VerifyDisbursementInput,
): Promise<DisbursementActionResult> {
  try {
    await apiServer.post(disbursementServerEndpoints.verify(input.loanId))
    return { success: true }
  } catch (error) {
    return toActionError(error, "Failed to verify disbursement")
  }
}
