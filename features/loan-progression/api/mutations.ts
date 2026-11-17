import { updateLoanTierProgressionAction } from "@/features/loan-progression/actions/loan-tier-progression.actions"
import type { UpdateLoanTierProgressionInput } from "@/features/loan-progression/types"

export const loanTierProgressionMutations = {
  update: {
    mutationFn: (input: UpdateLoanTierProgressionInput) =>
      updateLoanTierProgressionAction(input),
  },
} as const
