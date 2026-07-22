import {
  createLoanProductAction,
  deleteLoanProductAction,
  updateLoanProductAction,
} from "@/features/loan-products/actions/loan-product.actions"
import type {
  CreateLoanProductInput,
  DeleteLoanProductInput,
  UpdateLoanProductInput,
} from "@/features/loan-products/types"

export const loanProductMutations = {
  create: {
    mutationFn: (input: CreateLoanProductInput) => createLoanProductAction(input),
  },
  update: {
    mutationFn: (input: UpdateLoanProductInput) => updateLoanProductAction(input),
  },
  delete: {
    mutationFn: (input: DeleteLoanProductInput) => deleteLoanProductAction(input),
  },
} as const
