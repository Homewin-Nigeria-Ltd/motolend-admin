export type TransactionStatus = "paid" | "unpaid"

export type TransactionTab = "all" | "paid" | "unpaid"

export type TransactionListParams = {
  page: number
  per_page?: number
  search?: string
  status?: TransactionStatus
}

export type TransactionListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type TransactionRecord = {
  id: string
  applicationId: string
  createdAt: string
  userId: string
  customerName: string
  customerInitials?: string
  loanProduct: string
  principal: string
  interest: string
  totalPayable: string
  principalRaw: number
  interestRaw: number
  totalPayableRaw: number
  status: TransactionStatus
}

export type TransactionMetric = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: "up" | "down"
}

export type TransactionListResponse = {
  items: TransactionRecord[]
  meta: TransactionListMeta
}

export type ApiTransactionCustomer = {
  id?: string | number | null
  name?: string | null
  initials?: string | null
}

export type ApiTransaction = {
  id?: number | string
  application_id?: string | number | null
  loan_application_id?: string | number | null
  date_created?: string | null
  created_at?: string | null
  customer?: ApiTransactionCustomer | null
  user_id?: string | number | null
  customer_name?: string | null
  user?: {
    id?: string | number | null
    first_name?: string | null
    last_name?: string | null
    name?: string | null
  } | null
  loan_product?: string | { name?: string | null } | null
  loan_product_name?: string | null
  principal?: number | string | null
  principal_formatted?: string | null
  amount?: number | string | null
  interest?: number | string | null
  interest_formatted?: string | null
  interest_amount?: number | string | null
  total_payable?: number | string | null
  total_payable_formatted?: string | null
  total_repayment?: number | string | null
  status?: string | null
}

export type ApiTransactionMetricTrend = {
  percentage?: number | null
  mom_change?: number | null
  direction?: "up" | "down" | string | null
}

export type ApiTransactionMetricItem = {
  value?: number | string | null
  formatted?: string | null
  trend?: ApiTransactionMetricTrend | null
}

export type ApiTransactionMetrics = {
  all_transactions?: ApiTransactionMetricItem | null
  paid?: ApiTransactionMetricItem | null
  unpaid?: ApiTransactionMetricItem | null
  interest_earned?: ApiTransactionMetricItem | null
}

export type ApiTransactionMetricsResponse = ApiTransactionMetrics

export type ApiTransactionListResponse = {
  current_page?: number
  data?: ApiTransaction[]
  last_page?: number
  per_page?: number
  total?: number
}
