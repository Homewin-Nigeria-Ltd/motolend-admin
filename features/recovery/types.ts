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

export type RecoveryListParams = {
  page: number
  per_page?: number
  search?: string
  stage?: RecoveryTab
  status?: string
  loan_product_id?: number
  date_from?: string
  date_to?: string
}

export type RecoveryListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type RecoveryLoan = {
  id: string
  applicationId: string
  createdAt: string
  userId: string
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

export type RecoveryListResponse = {
  items: RecoveryLoan[]
  meta: RecoveryListMeta
}

export type RecoveryStageCount = {
  key: RecoveryTab
  label: string
  count: number
  totalOutstanding: number
  totalOutstandingFormatted: string
  suggestedAction: string
  dpdRange: { min: number; max: number | null } | null
}

export type RecoveryTabMeta = {
  label: string
  count: number
  description: string
}

export type RecoveryMetric = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: "up" | "down"
}

export type ApiRecoveryMetricTrend = {
  percentage?: number | null
  mom_change?: number | null
  direction?: "up" | "down" | string | null
}

export type ApiRecoveryMetricItem = {
  value?: number | string | null
  formatted?: string | null
  trend?: ApiRecoveryMetricTrend | null
}

export type ApiRecoveryMetrics = {
  outstanding_in_recovery?: ApiRecoveryMetricItem | null
  due_today?: ApiRecoveryMetricItem | null
  in_delinquency?: ApiRecoveryMetricItem | null
  recovered_this_month?: ApiRecoveryMetricItem | null
}

export type ApiRecoveryMetricsResponse = ApiRecoveryMetrics

export type RecoveryMethod =
  | "bank_transfer"
  | "cash"
  | "pos"
  | "other"

export type SendRecoveryOtpInput = {
  loanId: string
  recovery_method: string
  amount_recovered: number
  payment_reference: string
}

export type VerifyRecoveryOtpInput = {
  loanId: string
  otp: string
}

export type ApiSendRecoveryOtpResponse = {
  message?: string
  approval_email?: string
  expires_in_seconds?: number
}

export type ApiRecoveryLoan = {
  id?: number | string
  application_id?: string | number | null
  date_created?: string | null
  created_at?: string | null
  user_id?: string | number | null
  customer?: {
    id?: string | number | null
    name?: string | null
    initials?: string | null
    phone?: string | null
  } | null
  user?: {
    id?: string | number | null
    first_name?: string | null
    last_name?: string | null
    name?: string | null
    phone?: string | null
  } | null
  phone?: string | null
  phone_number?: string | null
  loan_product?: string | { name?: string | null } | null
  loan_product_name?: string | null
  amount?: number | string | null
  principal?: number | string | null
  principal_formatted?: string | null
  interest?: number | string | null
  interest_rate?: number | string | null
  interest_formatted?: string | null
  interest_amount?: number | string | null
  total_payable?: number | string | null
  total_repayment?: number | string | null
  total_payable_formatted?: string | null
  due_date?: string | null
  outstanding?: number | string | null
  outstanding_amount?: number | string | null
  outstanding_formatted?: string | null
  status?: string | null
  payment_status?: string | null
  stage?: string | null
  collection_stage?: string | null
}

export type ApiRecoveryLoanListResponse = {
  current_page?: number
  data?: ApiRecoveryLoan[]
  last_page?: number
  per_page?: number
  total?: number
}

export type ApiRecoveryStageCount = {
  key?: string | null
  label?: string | null
  count?: number | string | null
  total_outstanding?: number | string | null
  suggested_action?: string | null
  dpd_range?: {
    min?: number | null
    max?: number | null
  } | null
}

export type ApiRecoveryStageCountsResponse =
  | ApiRecoveryStageCount[]
  | {
      data?: ApiRecoveryStageCount[]
    }
