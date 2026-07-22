import { recordRepaymentAction } from "@/features/repayments/actions/repayment.actions"
import type { RecordRepaymentInput } from "@/features/repayments/types"

export const repaymentMutations = {
  record: {
    mutationFn: (input: RecordRepaymentInput) => recordRepaymentAction(input),
  },
} as const
