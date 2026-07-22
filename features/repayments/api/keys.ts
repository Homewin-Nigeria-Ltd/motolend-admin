import type { RepaymentListParams } from "@/features/repayments/types"

export const repaymentKeys = {
  all: ["repayments"] as const,
  lists: () => [...repaymentKeys.all, "list"] as const,
  list: (params: RepaymentListParams) =>
    [...repaymentKeys.lists(), params] as const,
  details: () => [...repaymentKeys.all, "detail"] as const,
  detail: (id: string) => [...repaymentKeys.details(), id] as const,
}
