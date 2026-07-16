const usersPath = "/admin/users"

export const userEndpoints = {
  metrics: `/api/proxy${usersPath}/metrics`,
  list: `/api/proxy${usersPath}`,
  detail: (id: string) => `/api/proxy${usersPath}/${id}`,
  loans: (id: string) => `/api/proxy${usersPath}/${id}/loans`,
  create: usersPath,
  createProxy: `/api/proxy${usersPath}`,
} as const
