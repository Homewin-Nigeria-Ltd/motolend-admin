const disbursementsPath = "/admin/disbursements"
const loansPath = "/admin/loans"

export const disbursementServerEndpoints = {
  list: disbursementsPath,
  allocation: `${disbursementsPath}/allocation`,
  verify: (loanId: string) =>
    `${loansPath}/${encodeURIComponent(loanId)}/disbursement/verify`,
} as const

export const disbursementEndpoints = {
  list: `/api/proxy${disbursementsPath}`,
  allocation: `/api/proxy${disbursementsPath}/allocation`,
} as const
