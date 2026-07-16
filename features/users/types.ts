export type UserTab =
  | "active"
  | "inactive"
  | "deactivated"
  | "admin"

export type UserStatus = "Active" | "Inactive" | "Deactivated" | "Admin"

export type UserListParams = {
  page: number
  per_page?: number
  search?: string
  tab?: UserTab
}

export type UserListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type UserListResponse = {
  items: UserRecord[]
  meta: UserListMeta
}

export type ApiUserProfile = {
  id?: number
  user_id?: string
  date_of_birth?: string | null
  address?: string | null
  state?: string | null
  lga?: string | null
  city?: string | null
  nationality?: string | null
  bank_name?: string | null
  account_number?: string | null
  account_name?: string | null
  bank_code?: string | null
  kyc_status?: string | null
  liveness_status?: string | null
  bank_account_verified_at?: string | null
  monnify_mandate_status?: string | null
}

export type ApiNextOfKin = {
  full_name?: string | null
  relationship?: string | null
  phone_number?: string | null
}

export type ApiFinancialMetrics = {
  eligible_amount?: number | string | null
  pending_bill?: number | string | null
  loans_taken?: number | null
  total_spend?: number | string | null
  total_transactions?: number | null
  pending_repayments_count?: number | null
}

export type ApiAdminUser = {
  id: string
  first_name: string
  last_name: string
  middle_name?: string | null
  email: string
  phone: string
  status: string
  role?: string
  account_status: string
  created_at: string
  updated_at?: string
  email_verified_at?: string | null
  phone_verified_at?: string | null
  bvn?: string | null
  bvn_verified_at?: string | null
  transaction_pin_set_at?: string | null
  two_factor_enabled_at?: string | null
  profile?: ApiUserProfile | null
  roles?: unknown[]
  next_of_kin?: ApiNextOfKin | null
  employment_status?: string | null
  company_name?: string | null
  job_title?: string | null
  monthly_income?: number | string | null
  financial_metrics?: ApiFinancialMetrics | null
}

export type ApiUserListResponse = {
  current_page: number
  data: ApiAdminUser[]
  last_page: number
  per_page: number
  total: number
}

export type ApiUserDetailResponse =
  | ApiAdminUser
  | {
      data?: ApiAdminUser
      user?: ApiAdminUser
      success?: boolean
    }

export type CreateAdminUserInput = {
  full_name: string
  email: string
  phone: string
  role: string
}

export type UserActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export type UserKpi = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: "up" | "down"
  sparkline: number[]
}

export type ApiUserMetricTrend = {
  percentage: number
  direction: "up" | "down" | string
}

export type ApiUserMetricItem = {
  value: number | string
  trend: ApiUserMetricTrend
}

export type ApiUserMetricsResponse = {
  new_signups_today: ApiUserMetricItem
  all_users: ApiUserMetricItem
  inactive_users: ApiUserMetricItem
  churn_rate: ApiUserMetricItem
  active_users: ApiUserMetricItem
}

export type UserRecord = {
  id: string
  createdAt: string
  name: string
  email: string
  accountNumber: string
  phoneNumber: string
  status: UserStatus
  avatarUrl?: string | null
}

export type UserDetailField = {
  label: string
  value: string
}

export type UserRepaymentAccount = {
  id: string
  accountNumber: string
  bankName: string
  variant: "success" | "danger"
}

export type UserTransaction = {
  id: string
  createdAt: string
  name: string
  email: string
  accountNumber: string
  phoneNumber: string
  status: UserStatus
  avatarUrl?: string | null
}

export type LoanStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "disbursed"
  | "repaid"
  | "overdue"
  | "defaulted"

export type ApiLoanProduct = {
  id: number
  name: string
  description?: string | null
  tenure?: number
  tenure_type?: "days" | "weeks" | "months"
}

export type ApiLoan = {
  id: number | string
  user_id: string
  loan_product_id?: number
  amount: number | string
  interest_rate: number | string
  interest_amount?: number | string
  credit_protection_fee?: number | string
  total_repayment: number | string
  tenure: number
  tenure_type: "days" | "weeks" | "months"
  due_date?: string | null
  disbursed_at?: string | null
  status: LoanStatus | string
  rejection_reason?: string | null
  created_at: string
  updated_at?: string
  deleted_at?: string | null
  loan_product?: ApiLoanProduct | null
  loanProduct?: ApiLoanProduct | null
}

export type ApiUserLoanListResponse = {
  current_page: number
  data: ApiLoan[]
  last_page: number
  per_page: number
  total: number
}

export type UserLoan = {
  id: string
  createdAt: string
  productName: string
  amount: string
  interestRate: string
  totalRepayment: string
  tenure: string
  dueDate: string
  status: LoanStatus | string
}

export type UserLoanListParams = {
  userId: string
  page: number
  per_page?: number
}

export type UserLoanListResponse = {
  items: UserLoan[]
  meta: UserListMeta
}

export type UserDetail = {
  id: string
  name: string
  email: string
  signedUpOn: string
  status: UserStatus
  pendingRepayments: number
  avatarUrl?: string | null
  fields: UserDetailField[]
  eligibleAmount: string
  pendingBill: string
  repaymentAccounts: UserRepaymentAccount[]
  loansTaken: number
  totalSpend: string
  transactions: UserTransaction[]
}
