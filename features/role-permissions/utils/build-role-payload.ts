import type {
  ApiPermission,
  CreateRoleInput,
  CreateRolePayload,
  SyncRolePermissionsInput,
} from "@/features/role-permissions/types"
import {
  buildEnabledPermissionKeys,
  mapPermissionToFormDefaults,
} from "@/features/role-permissions/utils/role"

export function buildDefaultPermissions(
  catalog: ApiPermission[],
): Record<string, boolean> {
  return mapPermissionToFormDefaults(catalog)
}

export function buildCreateRoleInput(payload: CreateRolePayload): CreateRoleInput {
  return {
    name: payload.name.trim(),
    description: payload.description.trim(),
    permissions: buildEnabledPermissionKeys(payload.permissions),
    users: payload.userIds,
  }
}

export function buildSyncRolePermissionsInput(
  permissions: Record<string, boolean>,
): SyncRolePermissionsInput {
  return {
    permissions: buildEnabledPermissionKeys(permissions),
  }
}

export { buildEnabledPermissionKeys, mapPermissionToFormDefaults }
