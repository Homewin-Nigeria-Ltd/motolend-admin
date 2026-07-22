"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { loanProductKeys } from "@/features/loan-products/api/keys"
import { loanProductMutations } from "@/features/loan-products/api/mutations"
import type {
  CreateLoanProductInput,
  DeleteLoanProductInput,
  UpdateLoanProductInput,
} from "@/features/loan-products/types"
import { toast } from "@/lib/toast"

export function useCreateLoanProduct() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanProductMutations.create,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: loanProductKeys.all })
      toast.success("Loan product created")
    },
    onError: () => {
      toast.error("Failed to create loan product")
    },
  })

  return {
    createLoanProduct: (input: CreateLoanProductInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useUpdateLoanProduct() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanProductMutations.update,
    onSuccess: (result, { id }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: loanProductKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: loanProductKeys.all })
      toast.success("Loan product updated")
    },
    onError: () => {
      toast.error("Failed to update loan product")
    },
  })

  return {
    updateLoanProduct: (input: UpdateLoanProductInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useDeleteLoanProduct() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    ...loanProductMutations.delete,
    onSuccess: (result, { id }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.removeQueries({ queryKey: loanProductKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: loanProductKeys.all })
      toast.success("Loan product deleted")
      router.push("/loan-products/overview")
    },
    onError: () => {
      toast.error("Failed to delete loan product")
    },
  })

  return {
    deleteLoanProduct: (input: DeleteLoanProductInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
