import type { LoanProductListParams } from "@/features/loan-products/types"

export const loanProductKeys = {
  all: ["loan-products"] as const,
  metrics: () => [...loanProductKeys.all, "metrics"] as const,
  lists: () => [...loanProductKeys.all, "list"] as const,
  list: (params: LoanProductListParams) =>
    [...loanProductKeys.lists(), params] as const,
  details: () => [...loanProductKeys.all, "detail"] as const,
  detail: (id: string) => [...loanProductKeys.details(), id] as const,
}
