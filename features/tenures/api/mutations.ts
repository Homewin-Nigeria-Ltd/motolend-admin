import {
  createLoanTenureAction,
  deleteLoanTenureAction,
  updateLoanTenureAction,
} from "@/features/tenures/actions/loan-tenure.actions"
import type {
  CreateLoanTenureInput,
  DeleteLoanTenureInput,
  UpdateLoanTenureInput,
} from "@/features/tenures/types"

export const loanTenureMutations = {
  create: {
    mutationFn: (input: CreateLoanTenureInput) => createLoanTenureAction(input),
  },
  update: {
    mutationFn: (input: UpdateLoanTenureInput) => updateLoanTenureAction(input),
  },
  delete: {
    mutationFn: (input: DeleteLoanTenureInput) => deleteLoanTenureAction(input),
  },
} as const
