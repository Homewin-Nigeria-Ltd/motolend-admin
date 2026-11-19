const recoverySmsPath = "/admin/recovery-sms"

export const smsEndpoints = {
  overview: `/api/proxy${recoverySmsPath}`,
  stage: (stage: string) =>
    `/api/proxy${recoverySmsPath}/${encodeURIComponent(stage)}`,
  send: (stage: string) =>
    `/api/proxy${recoverySmsPath}/${encodeURIComponent(stage)}/send`,
} as const
