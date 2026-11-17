import {
  raiseDisbursementAllocationAction,
  updateDisbursementAllocationAction,
  verifyDisbursementAction,
} from "@/features/disbursement/actions/disbursement.actions"
import type {
  RaiseDisbursementAllocationInput,
  UpdateDisbursementAllocationInput,
  VerifyDisbursementInput,
} from "@/features/disbursement/types"

export const disbursementMutations = {
  updateAllocation: {
    mutationFn: (input: UpdateDisbursementAllocationInput) =>
      updateDisbursementAllocationAction(input),
  },
  raiseAllocation: {
    mutationFn: (input: RaiseDisbursementAllocationInput) =>
      raiseDisbursementAllocationAction(input),
  },
  verify: {
    mutationFn: (input: VerifyDisbursementInput) =>
      verifyDisbursementAction(input),
  },
} as const
