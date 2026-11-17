const transactionsPath = "/admin/transactions"

export const transactionEndpoints = {
  list: `/api/proxy${transactionsPath}`,
  metrics: `/api/proxy${transactionsPath}/metrics`,
  export: `/api/proxy${transactionsPath}/export`,
} as const
