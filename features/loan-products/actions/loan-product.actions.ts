"use server"

import { loanProductServerEndpoints } from "@/features/loan-products/api/endpoints"
import type {
  CreateLoanProductInput,
  DeleteLoanProductInput,
  LoanProductActionResult,
  UpdateLoanProductInput,
} from "@/features/loan-products/types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(error: unknown, fallback: string): LoanProductActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

export async function createLoanProductAction(
  input: CreateLoanProductInput,
): Promise<LoanProductActionResult> {
  try {
    await apiServer.post(loanProductServerEndpoints.create, input)

    return { success: true }
  } catch (error) {
    return toActionError(error, "Failed to create loan product")
  }
}

export async function updateLoanProductAction(
  input: UpdateLoanProductInput,
): Promise<LoanProductActionResult> {
  const { id, ...payload } = input

  try {
    await apiServer.put(loanProductServerEndpoints.update(id), payload)

    return { success: true }
  } catch (error) {
    return toActionError(error, "Failed to update loan product")
  }
}

export async function deleteLoanProductAction(
  input: DeleteLoanProductInput,
): Promise<LoanProductActionResult> {
  try {
    await apiServer.delete(loanProductServerEndpoints.delete(input.id))

    return { success: true }
  } catch (error) {
    return toActionError(error, "Failed to delete loan product")
  }
}
