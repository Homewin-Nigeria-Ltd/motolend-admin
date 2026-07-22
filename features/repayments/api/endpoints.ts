const repaymentsPath = "/admin/repayments"

export const repaymentServerEndpoints = {
  list: repaymentsPath,
  detail: (id: string) => `${repaymentsPath}/${encodeURIComponent(id)}`,
  record: (id: string) =>
    `${repaymentsPath}/${encodeURIComponent(id)}/record`,
} as const

export const repaymentEndpoints = {
  list: `/api/proxy${repaymentsPath}`,
  detail: (id: string) =>
    `/api/proxy${repaymentsPath}/${encodeURIComponent(id)}`,
} as const
