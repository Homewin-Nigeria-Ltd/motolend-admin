export type RepaymentStatus = "active" | "paid" | "defaulted" | "overdue"

export type RepaymentTab = RepaymentStatus

export type RepaymentListParams = {
  page: number
  per_page?: number
  search?: string
  status?: RepaymentStatus
  loan_product_id?: number | string
  date_from?: string
  date_to?: string
}

export type RepaymentListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type Repayment = {
  id: string
  dueDate: string
  loanId: string
  customerName: string
  customerEmail: string
  avatarUrl?: string | null
  loanType: string
  outstanding: string
  amountPaid: string
  penalties: string
  status: RepaymentStatus | string
  userId?: string
}

export type RepaymentListResponse = {
  items: Repayment[]
  meta: RepaymentListMeta
}

export type RepaymentScheduleItem = {
  id: string
  installmentNo: number
  dueDate: string
  principal: string
  interest: string
  totalDue: string
  amountPaid: string
  balance: string
  penalty: string
  status: string
}

export type RepaymentDetail = {
  id: string
  loanId: string
  status: string
  loanOfficer: string
  customerName: string
  customerEmail: string
  customerPhone: string
  loanProduct: string
  installment: number | null
  totalLoan: string
  repaid: string
  outstanding: string
  nextDueDate: string
  penalties: string
  schedule: RepaymentScheduleItem[]
}

export type RecordRepaymentInput = {
  id: string
  amount: number
  payment_method: string
}

export type RepaymentActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export type ApiRepaymentUser = {
  id?: string | number | null
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  profile_photo_url?: string | null
}

export type ApiRepaymentLoanProduct = {
  name?: string | null
}

export type ApiRepayment = {
  id: number | string
  amount?: number | string | null
  amt_paid?: number | string | null
  outstanding?: number | string | null
  due_date?: string | null
  loan_id?: number | string | null
  loan_type?: string | null
  amount_paid?: number | string | null
  penalties?: number | string | null
  status?: string | null
  user_id?: string | number | null
  user?: ApiRepaymentUser | null
  loan_product?: ApiRepaymentLoanProduct | null
  loan_product_id?: number | string | null
}

export type ApiRepaymentListResponse = {
  current_page: number
  data: ApiRepayment[]
  last_page: number
  per_page: number
  total: number
}

export type ApiRepaymentCustomerInformation = {
  customer_name?: string | null
  email?: string | null
  phone_number?: string | null
  loan_product?: string | null
  installment?: number | null
}

export type ApiRepaymentLoanInformation = {
  total_loan?: number | string | null
  repaid?: number | string | null
  outstanding?: number | string | null
  next_due_date?: string | null
  penalties?: number | string | null
}

export type ApiRepaymentScheduleItem = {
  due_date?: string | null
  installment_no?: number | null
  principal?: number | string | null
  interest?: number | string | null
  total_due?: number | string | null
  amount_paid?: number | string | null
  balance?: number | string | null
  penalty?: number | string | null
  status?: string | null
}

export type ApiRepaymentDetail = {
  id: number | string
  loan_id?: string | number | null
  status?: string | null
  loan_officer?: string | null
  customer_information?: ApiRepaymentCustomerInformation | null
  loan_information?: ApiRepaymentLoanInformation | null
  repayment_schedule?: ApiRepaymentScheduleItem[] | null
}

export type ApiRepaymentDetailResponse =
  | ApiRepaymentDetail
  | {
      data?: ApiRepaymentDetail
      success?: boolean
    }
