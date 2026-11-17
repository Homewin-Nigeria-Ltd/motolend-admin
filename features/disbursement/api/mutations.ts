import {
  updateDisbursementAllocationAction,
  verifyDisbursementAction,
} from "@/features/disbursement/actions/disbursement.actions"
import type {
  UpdateDisbursementAllocationInput,
  VerifyDisbursementInput,
} from "@/features/disbursement/types"

export const disbursementMutations = {
  updateAllocation: {
    mutationFn: (input: UpdateDisbursementAllocationInput) =>
      updateDisbursementAllocationAction(input),
  },
  verify: {
    mutationFn: (input: VerifyDisbursementInput) =>
      verifyDisbursementAction(input),
  },
} as const
