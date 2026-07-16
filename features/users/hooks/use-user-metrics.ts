"use client"

import { useQuery } from "@tanstack/react-query"

import { userQueries } from "@/features/users/api/queries"

export function useUserMetrics() {
  return useQuery(userQueries.metrics())
}
