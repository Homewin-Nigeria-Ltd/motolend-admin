const loanTierProgressionPath = "/admin/loan-tier-progression"

export const loanTierProgressionServerEndpoints = {
  root: loanTierProgressionPath,
} as const

export const loanTierProgressionEndpoints = {
  root: `/api/proxy${loanTierProgressionPath}`,
} as const
