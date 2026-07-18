const rolesPath = "/admin/roles"
const permissionsPath = "/admin/permissions"
const usersPath = "/admin/users"

export const rolePermissionsEndpoints = {
  roles: `/api/proxy${rolesPath}`,
  permissions: `/api/proxy${permissionsPath}`,
  rolePermissions: (roleId: string | number) =>
    `/api/proxy${rolesPath}/${encodeURIComponent(String(roleId))}/permissions`,
  assignUserRole: (userId: string) =>
    `/api/proxy${usersPath}/${encodeURIComponent(userId)}/roles`,
} as const
