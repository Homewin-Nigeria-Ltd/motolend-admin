"use client"

import { useQuery } from "@tanstack/react-query"

import { userQueries } from "@/features/users/api/queries"
import type { UserLoanListParams } from "@/features/users/types"

export function useUserLoans(params: UserLoanListParams) {
  return useQuery(userQueries.loans(params))
}
