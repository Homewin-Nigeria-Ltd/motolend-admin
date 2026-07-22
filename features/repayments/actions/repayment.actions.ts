"use server"

import { repaymentServerEndpoints } from "@/features/repayments/api/endpoints"
import type {
  ApiRepaymentDetailResponse,
  RecordRepaymentInput,
  RepaymentActionResult,
  RepaymentDetail,
} from "@/features/repayments/types"
import {
  extractApiRepaymentDetail,
  mapApiRepaymentDetail,
} from "@/features/repayments/utils/repayment"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(error: unknown, fallback: string): RepaymentActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

function mapDetailResult(data: ApiRepaymentDetailResponse) {
  const repayment = extractApiRepaymentDetail(data)

  if (!repayment) {
    return undefined
  }

  return mapApiRepaymentDetail(repayment)
}

export async function recordRepaymentAction(
  input: RecordRepaymentInput,
): Promise<RepaymentActionResult<RepaymentDetail>> {
  const { id, amount, payment_method } = input

  try {
    const data = await apiServer.post<ApiRepaymentDetailResponse>(
      repaymentServerEndpoints.record(id),
      {
        amount,
        payment_method,
      },
    )

    return { success: true, data: mapDetailResult(data) }
  } catch (error) {
    return toActionError(error, "Failed to record repayment")
  }
}
