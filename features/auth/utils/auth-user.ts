import type {
  ApiAuthPermission,
  ApiAuthUser,
  AuthUser,
  AuthUserPermission,
} from "@/features/auth/types"

function mapApiPermissions(
  permissions: ApiAuthPermission[] = [],
): AuthUserPermission[] {
  return permissions.map((permission) => ({
    key: permission.name,
    name: permission.name,
    description: permission.name,
    has_access: true,
  }))
}

function collectPermissionKeys(
  permissions: ApiAuthPermission[] = [],
): string[] {
  return [...new Set(permissions.map((permission) => permission.name))]
}

export function mapApiAuthUserToAuthUser(user: ApiAuthUser): AuthUser {
  const name = [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ")

  const permissions = mapApiPermissions(user.permissions)
  const permission_keys = collectPermissionKeys(user.permissions)

  return {
    id: user.id,
    name: name || user.email,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.account_status || user.status,
    profile_photo_url: user.profile_photo_url ?? null,
    admin_role: user.roles?.[0]?.name ?? user.admin_role ?? null,
    permissions,
    permission_keys,
  }
}
