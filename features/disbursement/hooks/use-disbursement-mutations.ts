"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { disbursementKeys } from "@/features/disbursement/api/keys"
import { disbursementMutations } from "@/features/disbursement/api/mutations"
import type {
  UpdateDisbursementAllocationInput,
  VerifyDisbursementInput,
} from "@/features/disbursement/types"
import { toast } from "@/lib/toast"

export function useUpdateDisbursementAllocation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...disbursementMutations.updateAllocation,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(disbursementKeys.allocation(), result.data)
      }

      void queryClient.invalidateQueries({
        queryKey: disbursementKeys.allocation(),
      })
      void queryClient.invalidateQueries({ queryKey: disbursementKeys.lists() })
      toast.success("Allocation saved")
    },
    onError: () => {
      toast.error("Failed to update disbursement allocation")
    },
  })

  return {
    updateAllocation: (input: UpdateDisbursementAllocationInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useVerifyDisbursement() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...disbursementMutations.verify,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: disbursementKeys.lists() })
      void queryClient.invalidateQueries({
        queryKey: disbursementKeys.allocation(),
      })
      toast.success("Disbursement verification requested")
    },
    onError: () => {
      toast.error("Failed to verify disbursement")
    },
  })

  return {
    verifyDisbursement: (input: VerifyDisbursementInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
    pendingLoanId:
      mutation.isPending && mutation.variables
        ? mutation.variables.loanId
        : null,
  }
}
