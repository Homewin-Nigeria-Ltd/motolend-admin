"use server"

import { loanApplicationServerEndpoints } from "@/features/loan-applications/api/endpoints"
import type {
  ApiApplicationDetailResponse,
  ApplicationActionResult,
  ApplicationDetail,
  DisburseApplicationInput,
  RejectApplicationInput,
} from "@/features/loan-applications/types"
import {
  extractApiApplicationDetail,
  mapApiApplicationDetail,
} from "@/features/loan-applications/utils/application"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(error: unknown, fallback: string): ApplicationActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

function mapDetailResult(data: ApiApplicationDetailResponse) {
  const application = extractApiApplicationDetail(data)

  if (!application) {
    return undefined
  }

  return mapApiApplicationDetail(application)
}

export async function approveApplicationAction(
  applicationId: string,
): Promise<ApplicationActionResult<ApplicationDetail>> {
  try {
    const data = await apiServer.post<ApiApplicationDetailResponse>(
      loanApplicationServerEndpoints.approve(applicationId),
    )

    return { success: true, data: mapDetailResult(data) }
  } catch (error) {
    return toActionError(error, "Failed to approve application")
  }
}

export async function rejectApplicationAction(
  input: RejectApplicationInput,
): Promise<ApplicationActionResult<ApplicationDetail>> {
  try {
    const data = await apiServer.post<ApiApplicationDetailResponse>(
      loanApplicationServerEndpoints.reject(input.applicationId),
      { rejection_reason: input.rejection_reason },
    )

    return { success: true, data: mapDetailResult(data) }
  } catch (error) {
    return toActionError(error, "Failed to reject application")
  }
}

export async function disburseApplicationAction(
  input: DisburseApplicationInput,
): Promise<ApplicationActionResult<ApplicationDetail>> {
  try {
    const data = await apiServer.post<ApiApplicationDetailResponse>(
      loanApplicationServerEndpoints.disburse(input.applicationId),
      { reason: input.reason },
    )

    return { success: true, data: mapDetailResult(data) }
  } catch (error) {
    return toActionError(error, "Failed to disburse loan")
  }
}

export async function directDebitMandateAction(
  applicationId: string,
): Promise<ApplicationActionResult<ApplicationDetail>> {
  try {
    const data = await apiServer.post<ApiApplicationDetailResponse>(
      loanApplicationServerEndpoints.directDebitMandate(applicationId),
    )

    return { success: true, data: mapDetailResult(data) }
  } catch (error) {
    return toActionError(error, "Failed to create direct debit mandate")
  }
}

export async function markDisbursedAction(
  input: DisburseApplicationInput,
): Promise<ApplicationActionResult<ApplicationDetail>> {
  try {
    const data = await apiServer.post<ApiApplicationDetailResponse>(
      loanApplicationServerEndpoints.markDisbursed(input.applicationId),
      { reason: input.reason },
    )

    return { success: true, data: mapDetailResult(data) }
  } catch (error) {
    return toActionError(error, "Failed to mark loan as disbursed")
  }
}
