"use client"

import { useQuery } from "@tanstack/react-query"

import { rolePermissionsQueries } from "@/features/role-permissions/api/queries"

export function useRoles() {
  return useQuery(rolePermissionsQueries.roles())
}
