import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  ApiPermission,
  ApiRole,
  PermissionsApiResponse,
  RoleDetail,
  RolesApiResponse,
} from "@/features/role-permissions/types"
import { rolePermissionsEndpoints } from "@/features/role-permissions/api/endpoints"
import { rolePermissionsKeys } from "@/features/role-permissions/api/keys"
import { unwrapApiList } from "@/features/role-permissions/utils/map-api-response"
import {
  buildRoleDetail,
  findRoleById,
} from "@/features/role-permissions/utils/role"

async function fetchRoles(): Promise<ApiRole[]> {
  const response = await api.get<RolesApiResponse>(
    rolePermissionsEndpoints.roles,
  )

  return unwrapApiList<ApiRole>(response)
}

async function fetchPermissions(): Promise<ApiPermission[]> {
  const response = await api.get<PermissionsApiResponse>(
    rolePermissionsEndpoints.permissions,
  )

  return unwrapApiList<ApiPermission>(response)
}

async function fetchRoleDetail(roleId: string): Promise<RoleDetail> {
  const [roles, permissions] = await Promise.all([
    fetchRoles(),
    fetchPermissions(),
  ])

  const role = findRoleById(roles, roleId)

  if (!role) {
    throw new Error("Role not found")
  }

  return buildRoleDetail(role, permissions)
}

export const rolePermissionsQueries = {
  roles: () =>
    queryOptions({
      queryKey: rolePermissionsKeys.roles(),
      queryFn: fetchRoles,
      staleTime: 60_000,
    }),
  permissionCatalog: () =>
    queryOptions({
      queryKey: rolePermissionsKeys.permissionCatalog(),
      queryFn: fetchPermissions,
      staleTime: 60_000,
    }),
  roleDetail: (roleId: string) =>
    queryOptions({
      queryKey: rolePermissionsKeys.roleDetail(roleId),
      queryFn: () => fetchRoleDetail(roleId),
      enabled: Boolean(roleId),
      staleTime: 60_000,
    }),
}
