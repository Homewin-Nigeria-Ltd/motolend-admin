import type { ApiRole } from "@/features/role-permissions/types"

export function getAssignableAdminRoles(roles: ApiRole[]) {
  return roles.filter((role) => role.name.trim().toLowerCase() !== "user")
}
