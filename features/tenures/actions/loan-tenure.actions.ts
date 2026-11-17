"use server"

import { loanTenureServerEndpoints } from "@/features/tenures/api/endpoints"
import type {
  CreateLoanTenureInput,
  DeleteLoanTenureInput,
  LoanTenureActionResult,
  UpdateLoanTenureInput,
} from "@/features/tenures/types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(
  error: unknown,
  fallback: string,
): LoanTenureActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

export async function createLoanTenureAction(
  input: CreateLoanTenureInput,
): Promise<LoanTenureActionResult> {
  try {
    await apiServer.post(loanTenureServerEndpoints.create, input)
    return { success: true }
  } catch (error) {
    return toActionError(error, "Failed to create loan tenure")
  }
}

export async function updateLoanTenureAction(
  input: UpdateLoanTenureInput,
): Promise<LoanTenureActionResult> {
  const { id, ...payload } = input

  try {
    await apiServer.put(loanTenureServerEndpoints.update(id), payload)
    return { success: true }
  } catch (error) {
    return toActionError(error, "Failed to update loan tenure")
  }
}

export async function deleteLoanTenureAction(
  input: DeleteLoanTenureInput,
): Promise<LoanTenureActionResult> {
  try {
    await apiServer.delete(loanTenureServerEndpoints.delete(input.id))
    return { success: true }
  } catch (error) {
    return toActionError(error, "Failed to delete loan tenure")
  }
}
