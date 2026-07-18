import type {
  ApiPermission,
  ApiRole,
  RoleDetail,
  RoleDetailPermission,
} from "@/features/role-permissions/types"
import { unwrapApiItem } from "@/features/role-permissions/utils/map-api-response"

export function getPermissionKey(permission: Pick<ApiPermission, "name">) {
  return permission.name
}

export function formatPermissionLabel(name: string) {
  return name
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

export function getRoleId(role: Pick<ApiRole, "id">) {
  return String(role.id)
}

export function findRoleById(roles: ApiRole[], roleId: string) {
  return roles.find((role) => getRoleId(role) === roleId)
}

export function getAssignedPermissionKeys(role: ApiRole) {
  const keys = new Set<string>()

  role.permissions?.forEach((permission) => {
    if (permission.name) {
      keys.add(permission.name)
    }
  })

  return keys
}

export function buildRoleDetail(
  role: ApiRole,
  catalog: ApiPermission[],
): RoleDetail {
  const assignedKeys = getAssignedPermissionKeys(role)

  const permissions: RoleDetailPermission[] = catalog.map((permission) => {
    const key = getPermissionKey(permission)
    const label = formatPermissionLabel(permission.name)

    return {
      key,
      name: label,
      description: label,
      has_access: assignedKeys.has(key),
    }
  })

  return {
    role: {
      id: role.id,
      name: role.name,
      description: role.description,
    },
    permissions,
  }
}

export function mapPermissionToFormDefaults(
  catalog: ApiPermission[],
): Record<string, boolean> {
  return catalog.reduce<Record<string, boolean>>((accumulator, permission) => {
    accumulator[getPermissionKey(permission)] = false
    return accumulator
  }, {})
}

export function buildEnabledPermissionKeys(
  permissions: Record<string, boolean>,
) {
  return Object.entries(permissions)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key)
}

export function extractCreatedRoleId(response: unknown) {
  const role = unwrapApiItem<ApiRole>(response)
  return getRoleId(role)
}
