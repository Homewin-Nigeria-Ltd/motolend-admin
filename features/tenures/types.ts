import type { CreateTenureFormInput } from "@/features/tenures/schemas/create-tenure.schema"

export type TenureStatus = "active" | "inactive"

export type TenureTab = "all" | "active" | "inactive"

export type TenureListParams = {
  page: number
  per_page?: number
  search?: string
  status?: TenureStatus
}

export type TenureListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type TenureRecord = {
  id: string
  name: string
  code: string
  tenure: number
  tenureType: "Days" | "Weeks" | "Months"
  interestType: string
  interestRate: string
  processingFee: string
  insuranceFee: string
  loanProductIds: string[]
  linkedProducts: string
  status: TenureStatus
  description?: string
  repaymentFrequency?: string
  interestFrequency?: string
}

export type TenureDetail = TenureRecord & {
  formValues: CreateTenureFormInput
}

export type TenureListResponse = {
  items: TenureRecord[]
  meta: TenureListMeta
}

export type TenureMetric = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: "up" | "down"
}

export type CreateLoanTenureInput = {
  name: string
  code: string
  description: string
  loan_product_ids: number[]
  tenure: number
  tenure_type: "days" | "weeks" | "months"
  repayment_frequency: "daily" | "weekly" | "biweekly" | "monthly"
  interest_type: "flat" | "reducing"
  interest_frequency: "daily" | "weekly" | "monthly"
  interest_rate: number
  processing_fee: number
  insurance_fee: number
  is_active: boolean
}

export type UpdateLoanTenureInput = {
  id: string
} & CreateLoanTenureInput

export type DeleteLoanTenureInput = {
  id: string
}

export type LoanTenureActionResult =
  | { success: true }
  | { success: false; error: string }

export type ApiLoanTenureProduct = {
  id?: number | string
  name?: string | null
}

export type ApiLoanTenure = {
  id: number | string
  name?: string | null
  code?: string | null
  description?: string | null
  loan_product_ids?: Array<number | string> | null
  loan_products?: ApiLoanTenureProduct[] | null
  tenure?: number | string | null
  tenure_type?: string | null
  repayment_frequency?: string | null
  interest_type?: string | null
  interest_frequency?: string | null
  interest_rate?: number | string | null
  processing_fee?: number | string | null
  insurance_fee?: number | string | null
  is_active?: boolean | number | string | null
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
}

export type ApiLoanTenureDetailResponse =
  | ApiLoanTenure
  | {
      data?: ApiLoanTenure
      success?: boolean
    }

export type ApiLoanTenureListResponse = {
  current_page?: number
  data?: ApiLoanTenure[]
  last_page?: number
  per_page?: number
  total?: number
}
