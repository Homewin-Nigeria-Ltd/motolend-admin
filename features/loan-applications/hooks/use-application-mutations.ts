"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { loanApplicationKeys } from "@/features/loan-applications/api/keys"
import { loanApplicationMutations } from "@/features/loan-applications/api/mutations"
import type {
  DisburseApplicationInput,
  RejectApplicationInput,
} from "@/features/loan-applications/types"
import { toast } from "@/lib/toast"

export function useApproveApplication() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanApplicationMutations.approve,
    onSuccess: (result, applicationId) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(
          loanApplicationKeys.detail(applicationId),
          result.data,
        )
      }

      void queryClient.invalidateQueries({ queryKey: loanApplicationKeys.all })
      toast.success("Application approved")
    },
    onError: () => {
      toast.error("Failed to approve application")
    },
  })

  return {
    approveApplication: (applicationId: string) =>
      mutation.mutateAsync(applicationId),
    isPending: mutation.isPending,
  }
}

export function useRejectApplication() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanApplicationMutations.reject,
    onSuccess: (result, { applicationId }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(
          loanApplicationKeys.detail(applicationId),
          result.data,
        )
      }

      void queryClient.invalidateQueries({ queryKey: loanApplicationKeys.all })
      toast.success("Application rejected")
    },
    onError: () => {
      toast.error("Failed to reject application")
    },
  })

  return {
    rejectApplication: (input: RejectApplicationInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useDisburseApplication() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanApplicationMutations.disburse,
    onSuccess: (result, { applicationId }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(
          loanApplicationKeys.detail(applicationId),
          result.data,
        )
      }

      void queryClient.invalidateQueries({ queryKey: loanApplicationKeys.all })
      toast.success("Loan disbursed")
    },
    onError: () => {
      toast.error("Failed to disburse loan")
    },
  })

  return {
    disburseApplication: (input: DisburseApplicationInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useDirectDebitMandate() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanApplicationMutations.directDebitMandate,
    onSuccess: (result, applicationId) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(
          loanApplicationKeys.detail(applicationId),
          result.data,
        )
      }

      void queryClient.invalidateQueries({ queryKey: loanApplicationKeys.all })
      toast.success("Direct debit mandate created")
    },
    onError: () => {
      toast.error("Failed to create direct debit mandate")
    },
  })

  return {
    createDirectDebitMandate: (applicationId: string) =>
      mutation.mutateAsync(applicationId),
    isPending: mutation.isPending,
  }
}

export function useMarkDisbursed() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanApplicationMutations.markDisbursed,
    onSuccess: (result, { applicationId }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(
          loanApplicationKeys.detail(applicationId),
          result.data,
        )
      }

      void queryClient.invalidateQueries({ queryKey: loanApplicationKeys.all })
      toast.success("Loan marked as disbursed")
    },
    onError: () => {
      toast.error("Failed to mark loan as disbursed")
    },
  })

  return {
    markDisbursed: (input: DisburseApplicationInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
