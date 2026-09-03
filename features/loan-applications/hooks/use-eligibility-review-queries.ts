"use client"

import { useQuery } from "@tanstack/react-query"

import { loanApplicationQueries } from "@/features/loan-applications/api/queries"
import type { EligibilityReviewListParams } from "@/features/loan-applications/types"

export function useEligibilityReviews(params: EligibilityReviewListParams) {
  return useQuery(loanApplicationQueries.eligibilityReviews(params))
}
