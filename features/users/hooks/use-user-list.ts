"use client"

import { useQuery } from "@tanstack/react-query"

import { userQueries } from "@/features/users/api/queries"
import type { UserListParams } from "@/features/users/types"

export function useUserList(params: UserListParams) {
  return useQuery(userQueries.list(params))
}
