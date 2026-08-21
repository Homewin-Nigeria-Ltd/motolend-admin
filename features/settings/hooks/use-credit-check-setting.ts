"use client"

import { useQuery } from "@tanstack/react-query"

import { settingsQueries } from "@/features/settings/api/queries"

export function useCreditCheckSetting() {
  return useQuery(settingsQueries.creditCheck())
}
