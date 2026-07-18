"use client"

import { useQuery } from "@tanstack/react-query"

import { rolePermissionsQueries } from "@/features/role-permissions/api/queries"

export function useRoleDetail(slug: string) {
  return useQuery(rolePermissionsQueries.roleDetail(slug))
}
