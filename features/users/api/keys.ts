import type { UserListParams, UserLoanListParams } from "@/features/users/types"

export const userKeys = {
  all: ["users"] as const,
  metrics: () => [...userKeys.all, "metrics"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  loans: (params: UserLoanListParams) =>
    [...userKeys.all, "loans", params] as const,
}
