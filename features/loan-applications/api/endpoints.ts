const loansPath = "/admin/loans"

export const loanApplicationServerEndpoints = {
  metrics: `${loansPath}/metrics`,
  list: loansPath,
  detail: (id: string) => `${loansPath}/${encodeURIComponent(id)}`,
  approve: (id: string) => `${loansPath}/${encodeURIComponent(id)}/approve`,
  reject: (id: string) => `${loansPath}/${encodeURIComponent(id)}/reject`,
  disburse: (id: string) => `${loansPath}/${encodeURIComponent(id)}/disburse`,
  directDebitMandate: (id: string) =>
    `${loansPath}/${encodeURIComponent(id)}/direct-debit-mandate`,
  markDisbursed: (id: string) =>
    `${loansPath}/${encodeURIComponent(id)}/mark-disbursed`,
} as const

export const loanApplicationEndpoints = {
  metrics: `/api/proxy${loansPath}/metrics`,
  list: `/api/proxy${loansPath}`,
  detail: (id: string) => `/api/proxy${loansPath}/${encodeURIComponent(id)}`,
  approve: (id: string) =>
    `/api/proxy${loansPath}/${encodeURIComponent(id)}/approve`,
  reject: (id: string) =>
    `/api/proxy${loansPath}/${encodeURIComponent(id)}/reject`,
  disburse: (id: string) =>
    `/api/proxy${loansPath}/${encodeURIComponent(id)}/disburse`,
  directDebitMandate: (id: string) =>
    `/api/proxy${loansPath}/${encodeURIComponent(id)}/direct-debit-mandate`,
  markDisbursed: (id: string) =>
    `/api/proxy${loansPath}/${encodeURIComponent(id)}/mark-disbursed`,
} as const
