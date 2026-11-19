const loansPath = "/admin/loans"

export const recoveryEndpoints = {
  list: `/api/proxy${loansPath}`,
  stageCounts: `/api/proxy${loansPath}/stage-counts`,
  metrics: `/api/proxy${loansPath}/recovery-metrics`,
  export: `/api/proxy${loansPath}/export`,
  sendOtp: (loanId: string) =>
    `/api/proxy${loansPath}/${encodeURIComponent(loanId)}/recovery/send-otp`,
  verify: (loanId: string) =>
    `/api/proxy${loansPath}/${encodeURIComponent(loanId)}/recovery/verify`,
} as const
