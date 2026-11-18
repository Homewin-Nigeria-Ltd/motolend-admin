const usersPath = "/admin/users"

export const userEndpoints = {
  metrics: `/api/proxy${usersPath}/metrics`,
  list: `/api/proxy${usersPath}`,
  detail: (id: string) => `/api/proxy${usersPath}/${id}`,
  status: (id: string) => `/api/proxy${usersPath}/${id}/status`,
  reset: (id: string) => `/api/proxy${usersPath}/${id}/reset`,
  loans: (id: string) => `/api/proxy${usersPath}/${id}/loans`,
  create: usersPath,
  createProxy: `/api/proxy${usersPath}`,
} as const
