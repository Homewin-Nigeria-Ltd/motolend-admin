import type { DeclineListParams } from "@/features/decline/types"

export const declineKeys = {
  all: ["declined-loans"] as const,
  lists: () => [...declineKeys.all, "list"] as const,
  list: (params: DeclineListParams) =>
    [...declineKeys.lists(), params] as const,
}
