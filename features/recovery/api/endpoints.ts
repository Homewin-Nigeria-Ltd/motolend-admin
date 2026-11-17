const loansPath = "/admin/loans"

export const recoveryEndpoints = {
  list: `/api/proxy${loansPath}`,
  stageCounts: `/api/proxy${loansPath}/stage-counts`,
  metrics: `/api/proxy${loansPath}/recovery-metrics`,
  export: `/api/proxy${loansPath}/export`,
} as const
