"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { loanTenureKeys } from "@/features/tenures/api/keys"
import { loanTenureMutations } from "@/features/tenures/api/mutations"
import type {
  CreateLoanTenureInput,
  DeleteLoanTenureInput,
  UpdateLoanTenureInput,
} from "@/features/tenures/types"
import { toast } from "@/lib/toast"

export function useCreateLoanTenure() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanTenureMutations.create,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: loanTenureKeys.all })
      toast.success("Tenure created")
    },
    onError: () => {
      toast.error("Failed to create loan tenure")
    },
  })

  return {
    createLoanTenure: (input: CreateLoanTenureInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useUpdateLoanTenure() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanTenureMutations.update,
    onSuccess: (result, { id }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: loanTenureKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: loanTenureKeys.all })
      toast.success("Tenure updated")
    },
    onError: () => {
      toast.error("Failed to update loan tenure")
    },
  })

  return {
    updateLoanTenure: (input: UpdateLoanTenureInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useDeleteLoanTenure() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanTenureMutations.delete,
    onSuccess: (result, { id }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.removeQueries({ queryKey: loanTenureKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: loanTenureKeys.all })
      toast.success("Tenure deleted")
    },
    onError: () => {
      toast.error("Failed to delete loan tenure")
    },
  })

  return {
    deleteLoanTenure: (input: DeleteLoanTenureInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
