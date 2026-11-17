import type { ProgressionCustomerListParams } from "@/features/loan-progression/types"

export const loanTierProgressionKeys = {
  all: ["loan-tier-progression"] as const,
  detail: (params: ProgressionCustomerListParams) =>
    [...loanTierProgressionKeys.all, "detail", params] as const,
}
