const loanTenuresPath = "/admin/loan-tenures"

export const loanTenureServerEndpoints = {
  list: loanTenuresPath,
  create: loanTenuresPath,
  detail: (id: string) => `${loanTenuresPath}/${encodeURIComponent(id)}`,
  update: (id: string) => `${loanTenuresPath}/${encodeURIComponent(id)}`,
  delete: (id: string) => `${loanTenuresPath}/${encodeURIComponent(id)}`,
} as const

export const loanTenureEndpoints = {
  list: `/api/proxy${loanTenuresPath}`,
  detail: (id: string) =>
    `/api/proxy${loanTenuresPath}/${encodeURIComponent(id)}`,
} as const
