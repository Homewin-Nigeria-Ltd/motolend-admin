export type AllocationDuration = "daily" | "weekly" | "monthly"

export type DisbursementPartner = string

export type DisbursementStatus = "disbursed" | "undisbursed"

export type DisbursementListParams = {
  page: number
  per_page?: number
  search?: string
}

export type DisbursementListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type DisbursementRecord = {
  id: string
  loanId: string
  applicationId: string
  createdAt: string
  customerName: string
  customerInitials?: string
  userId?: string
  loanProduct: string
  principal: string
  bankAccount: string
  status: DisbursementStatus
  canRequery: boolean
  transactionReference?: string | null
  transactionStatus?: string | null
}

export type DisbursementPartnerOption = {
  value: string
  label: string
}

export type AllocationSettings = {
  amountAllocated: number
  amountAllocatedFormatted: string
  duration: AllocationDuration
  partner: DisbursementPartner
  disburseAutomatically: boolean
}

export type AllocationSummary = {
  title: string
  resetNote: string
  disbursed: string
  remaining: string
  usedPercent: number
  totalAllocated: string
  loansDisbursed: number
  isExhausted: boolean
  alert: string
}

export type DisbursementAllocationState = {
  settings: AllocationSettings
  summary: AllocationSummary
  availablePartners: DisbursementPartnerOption[]
}

export type DisbursementListResponse = {
  items: DisbursementRecord[]
  meta: DisbursementListMeta
}

export type UpdateDisbursementAllocationInput = {
  amount_allocated: number
  duration: AllocationDuration
  disbursement_partner: DisbursementPartner
  disburse_automatically: boolean
}

export type RaiseDisbursementAllocationInput = {
  additional_amount: number
}

export type VerifyDisbursementInput = {
  loanId: string
}

export type DisbursementActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export type ApiDisbursement = {
  id?: number | string
  loan_id?: string | number | null
  loan?: {
    id?: string | number | null
  } | null
  application_id?: string | number | null
  loan_application_id?: string | number | null
  date_created?: string | null
  created_at?: string | null
  customer?: {
    id?: string | number | null
    name?: string | null
    initials?: string | null
  } | null
  customer_name?: string | null
  user?: {
    id?: string | number
    first_name?: string | null
    last_name?: string | null
    name?: string | null
  } | null
  user_id?: string | number | null
  loan_product?: string | { name?: string | null } | null
  loan_product_name?: string | null
  principal?: number | string | null
  principal_formatted?: string | null
  amount?: number | string | null
  bank_account?: string | null
  account_number?: string | null
  bank_name?: string | null
  status?: string | null
  can_requery?: boolean | number | string | null
  disbursed_at?: string | null
  transaction_reference?: string | null
  transaction_status?: string | null
}

export type ApiDisbursementAllocationConfig = {
  amount_allocated?: number | string | null
  amount_allocated_formatted?: string | null
  duration?: string | null
  disbursement_partner?: string | null
  disburse_automatically?: boolean | number | string | null
  updated_at?: string | null
  updated_by?: string | null
}

export type ApiDisbursementAllocationUsage = {
  period_label?: string | null
  reset_label?: string | null
  disbursed_amount?: number | string | null
  disbursed_amount_formatted?: string | null
  remaining_amount?: number | string | null
  remaining_amount_formatted?: string | null
  percentage_used?: number | string | null
  loans_disbursed_count?: number | string | null
  is_exhausted?: boolean | number | string | null
  alert_message?: string | null
  message?: string | null
  customer_message?: string | null
  resumes_at?: string | null
  declines_until?: string | null
}

export type ApiDisbursementPartnerOption = {
  value?: string | null
  label?: string | null
}

export type ApiDisbursementAllocationResponse = {
  allocation?: ApiDisbursementAllocationConfig | null
  available_partners?: ApiDisbursementPartnerOption[] | null
  usage?: ApiDisbursementAllocationUsage | null
  data?: {
    allocation?: ApiDisbursementAllocationConfig | null
    available_partners?: ApiDisbursementPartnerOption[] | null
    usage?: ApiDisbursementAllocationUsage | null
  } | null
}

export type ApiDisbursementsListResponse = {
  current_page?: number
  data?: ApiDisbursement[]
  last_page?: number
  per_page?: number
  total?: number
}
