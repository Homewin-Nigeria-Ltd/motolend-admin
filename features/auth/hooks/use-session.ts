"use client"

import { useQuery } from "@tanstack/react-query"

import { authQueries } from "@/features/auth/api/queries"

export function useSession() {
  return useQuery(authQueries.session())
}
