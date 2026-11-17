import type { TenureListParams } from "@/features/tenures/types"

export const loanTenureKeys = {
  all: ["loan-tenures"] as const,
  lists: () => [...loanTenureKeys.all, "list"] as const,
  list: (params: TenureListParams) =>
    [...loanTenureKeys.lists(), params] as const,
  details: () => [...loanTenureKeys.all, "detail"] as const,
  detail: (id: string) => [...loanTenureKeys.details(), id] as const,
}
