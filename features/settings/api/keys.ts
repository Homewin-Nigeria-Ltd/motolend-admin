export const settingsKeys = {
  all: ["settings"] as const,
  creditCheck: () => [...settingsKeys.all, "credit-check"] as const,
}
