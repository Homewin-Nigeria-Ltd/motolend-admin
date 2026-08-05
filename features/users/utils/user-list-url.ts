export function buildAdminUsersByRoleUrl(roleId: string | number) {
  const params = new URLSearchParams({
    tab: "admin",
    role_id: String(roleId),
  })

  return `/users?${params.toString()}`
}

export function getUserListStateFromSearchParams(searchParams: URLSearchParams) {
  const tabParam = searchParams.get("tab")
  const roleIdParam = searchParams.get("role_id")

  if (tabParam === "admin" || roleIdParam) {
    return {
      tab: "admin" as const,
      roleId: roleIdParam ?? "all",
    }
  }

  return {
    tab: "active" as const,
    roleId: "all",
  }
}
