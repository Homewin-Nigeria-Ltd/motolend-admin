"use client"

import { useQuery } from "@tanstack/react-query"

import { userQueries } from "@/features/users/api/queries"

export function useUserDetail(userId: string) {
  return useQuery(userQueries.detail(userId))
}
