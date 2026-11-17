import type { TransactionListParams } from "@/features/transactions/types"

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params: TransactionListParams) =>
    [...transactionKeys.lists(), params] as const,
  metrics: () => [...transactionKeys.all, "metrics"] as const,
}
