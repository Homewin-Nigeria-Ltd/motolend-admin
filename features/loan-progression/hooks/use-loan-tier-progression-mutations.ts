"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { loanTierProgressionKeys } from "@/features/loan-progression/api/keys"
import { loanTierProgressionMutations } from "@/features/loan-progression/api/mutations"
import type { UpdateLoanTierProgressionInput } from "@/features/loan-progression/types"
import { toast } from "@/lib/toast"

export function useUpdateLoanTierProgression() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanTierProgressionMutations.update,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({
        queryKey: loanTierProgressionKeys.all,
      })
      toast.success("Progression settings saved")
    },
    onError: () => {
      toast.error("Failed to update loan tier progression")
    },
  })

  return {
    updateProgression: (input: UpdateLoanTierProgressionInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
