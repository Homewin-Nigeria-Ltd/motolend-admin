"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { loanApplicationKeys } from "@/features/loan-applications/api/keys"
import { loanApplicationMutations } from "@/features/loan-applications/api/mutations"
import type { EligibilityReviewDecisionInput } from "@/features/loan-applications/types"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useSubmitEligibilityReviewDecision() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...loanApplicationMutations.eligibilityReviewDecision,
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: [...loanApplicationKeys.all, "eligibility-reviews"],
      })
      toast.success(response.message ?? "Eligibility review decision submitted")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to submit eligibility review decision."
      toast.error(message)
    },
  })

  return {
    submitDecision: (input: EligibilityReviewDecisionInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
