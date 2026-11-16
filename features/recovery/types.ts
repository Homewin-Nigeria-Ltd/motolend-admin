export type RecoveryTab =
  | "active"
  | "due_soon"
  | "due_today"
  | "early_delinquency"
  | "soft_collections"
  | "medium_delinquency"
  | "late_stage_delinquency"
  | "non_performing"
  | "doubtful"
  | "lost"

export type RecoveryPaymentStatus = "unpaid" | "paid"

export type RecoveryLoan = {
  id: string
  applicationId: string
  createdAt: string
  customerName: string
  phone: string
  loanProduct: string
  principal: string
  interest: string
  totalPayable: string
  dueDate: string
  outstanding: string
  outstandingRaw: number
  status: RecoveryPaymentStatus
  tab: RecoveryTab
}

export type RecoveryMetric = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: "up" | "down"
}

export type RecoveryMethod =
  | "bank_transfer"
  | "cash"
  | "pos"
  | "other"
