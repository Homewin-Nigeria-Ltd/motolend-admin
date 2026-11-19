const loansPath = "/admin/loans"

export const declineEndpoints = {
  list: `/api/proxy${loansPath}`,
} as const
