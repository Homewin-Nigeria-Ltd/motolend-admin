import type { RecoveryListParams } from "@/features/recovery/types"

export const recoveryKeys = {
  all: ["recovery"] as const,
  lists: () => [...recoveryKeys.all, "list"] as const,
  list: (params: RecoveryListParams) =>
    [...recoveryKeys.lists(), params] as const,
  stageCounts: () => [...recoveryKeys.all, "stage-counts"] as const,
  metrics: () => [...recoveryKeys.all, "metrics"] as const,
}
