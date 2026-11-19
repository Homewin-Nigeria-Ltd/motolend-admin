export const smsKeys = {
  all: ["recovery-sms"] as const,
  overview: () => [...smsKeys.all, "overview"] as const,
}
