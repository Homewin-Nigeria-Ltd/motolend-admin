"use client"

import { useQuery } from "@tanstack/react-query"

import { smsQueries } from "@/features/sms/api/queries"

export function useRecoverySmsOverview() {
  return useQuery(smsQueries.overview())
}
