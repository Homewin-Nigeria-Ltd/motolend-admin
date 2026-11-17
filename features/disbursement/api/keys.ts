import type { DisbursementListParams } from "@/features/disbursement/types"

export const disbursementKeys = {
  all: ["disbursements"] as const,
  lists: () => [...disbursementKeys.all, "list"] as const,
  list: (params: DisbursementListParams) =>
    [...disbursementKeys.lists(), params] as const,
  allocation: () => [...disbursementKeys.all, "allocation"] as const,
}
