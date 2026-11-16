export type TransactionStatus = "paid" | "unpaid"

export type TransactionTab = "all" | "paid" | "unpaid"

export type TransactionRecord = {
  id: string
  applicationId: string
  createdAt: string
  customerName: string
  loanProduct: string
  principal: string
  interest: string
  totalPayable: string
  status: TransactionStatus
}

export type TransactionMetric = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: "up" | "down"
}
