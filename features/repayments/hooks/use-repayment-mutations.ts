"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { repaymentKeys } from "@/features/repayments/api/keys"
import { repaymentMutations } from "@/features/repayments/api/mutations"
import type { RecordRepaymentInput } from "@/features/repayments/types"
import { toast } from "@/lib/toast"

export function useRecordRepayment(repaymentId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...repaymentMutations.record,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(
          repaymentKeys.detail(repaymentId),
          result.data,
        )
      }

      void queryClient.invalidateQueries({ queryKey: repaymentKeys.all })
      toast.success("Repayment recorded")
    },
    onError: () => {
      toast.error("Failed to record repayment")
    },
  })

  return {
    recordRepayment: (input: Omit<RecordRepaymentInput, "id">) =>
      mutation.mutateAsync({ ...input, id: repaymentId }),
    isPending: mutation.isPending,
  }
}
