import type { PermissionCategory } from "@/features/role-permissions/types"
import type { ApiRole } from "@/features/role-permissions/types"

export function filterPermissionCatalog(
  catalog: PermissionCategory[],
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return catalog
  }

  return catalog
    .map((category) => ({
      ...category,
      permissions: category.permissions.filter((permission) => {
        const haystack =
          `${permission.title} ${permission.description} ${category.label}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      }),
    }))
    .filter((category) => category.permissions.length > 0)
}

export function filterRoles(roles: ApiRole[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return roles
  }

  return roles.filter((role) => {
    const haystack = `${role.name} ${role.description}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })
}

export function formatRoleUsersCount(role: ApiRole) {
  const count = role.users_count ?? 0
  return count === 1 ? "1 User" : `${count} Users`
}
