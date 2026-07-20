import type { ApplicationListParams } from "@/features/loan-applications/types"

export const loanApplicationKeys = {
  all: ["loan-applications"] as const,
  metrics: () => [...loanApplicationKeys.all, "metrics"] as const,
  lists: () => [...loanApplicationKeys.all, "list"] as const,
  list: (params: ApplicationListParams) =>
    [...loanApplicationKeys.lists(), params] as const,
  details: () => [...loanApplicationKeys.all, "detail"] as const,
  detail: (id: string) => [...loanApplicationKeys.details(), id] as const,
}
