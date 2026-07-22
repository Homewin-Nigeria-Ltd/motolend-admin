export type LoanProductStatus = "active" | "inactive"

export type LoanProductTab = "all" | LoanProductStatus

export type LoanProductKpi = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: "up" | "down"
}

export type LoanProductListParams = {
  page: number
  per_page?: number
  search?: string
  status?: LoanProductStatus
}

export type LoanProductListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type LoanProduct = {
  id: string
  name: string
  description: string
  amountRange: string
  interest: string
  tenure: string
  status: LoanProductStatus
}

export type LoanProductInfoRow = {
  label: string
  value: string
}

export type LoanProductTier = {
  id: string
  minAmount: string
  maxAmount: string
  interestRate: string
}

export type LoanProductApprovalWorkflow = {
  id: string
  name: string
  steps: string
}

export type LoanProductIntegrationStatus = "connected" | "disconnected"

export type LoanProductIntegration = {
  id: string
  name: string
  status: LoanProductIntegrationStatus
}

export type LoanProductDetail = {
  id: string
  productId: string
  name: string
  status: LoanProductStatus
  overview: LoanProductInfoRow[]
  loanAmountDuration: LoanProductInfoRow[]
  interestFees: LoanProductInfoRow[]
  repaymentRules: LoanProductInfoRow[]
  collateralSecurity: LoanProductInfoRow[]
  documentRequirements: LoanProductInfoRow[]
  approvalWorkflow: LoanProductApprovalWorkflow[]
  notificationsAlerts: LoanProductInfoRow[]
  integrations: LoanProductIntegration[]
  tiers: LoanProductTier[]
}

export type LoanProductListResponse = {
  items: LoanProduct[]
  meta: LoanProductListMeta
}

export type CreateLoanProductTierInput = {
  min_amount: number
  max_amount: number
  interest_rate: number
}

export type CreateLoanProductInput = {
  name: string
  description: string
  min_amount: number
  max_amount: number
  interest_type: string
  tenure: number
  tenure_type: string
  credit_protection_fee: number
  is_active: boolean
  tiers: CreateLoanProductTierInput[]
}

export type UpdateLoanProductPayload = {
  name?: string
  description?: string
  min_amount?: number
  max_amount?: number
  interest_type?: string
  tenure?: number
  tenure_type?: string
  credit_protection_fee?: number
  is_active?: boolean
  tiers?: CreateLoanProductTierInput[]
}

export type UpdateLoanProductInput = {
  id: string
} & UpdateLoanProductPayload

export type DeleteLoanProductInput = {
  id: string
}

export type LoanProductActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export type ApiLoanProductMetricItem = {
  value: number
  percentage: number
  direction: "up" | "down" | string
}

export type ApiLoanProductMetricsResponse = {
  total_products: ApiLoanProductMetricItem
  active_products: ApiLoanProductMetricItem
  inactive_products: ApiLoanProductMetricItem
}

export type ApiLoanProductTier = {
  id: number | string
  loan_product_id?: number | string | null
  min_amount: number | string
  max_amount: number | string
  interest_rate: number | string
  created_at?: string | null
  updated_at?: string | null
}

export type ApiLoanProductDetailsHeader = {
  name?: string | null
  id?: string | null
  status?: string | null
}

export type ApiLoanProductDetailsOverview = {
  category?: string | null
  description?: string | null
  age?: string | null
  location?: string | null
  employment_status?: string | null
  credit_score?: string | null
}

export type ApiLoanProductDetailsLoanAmountDuration = {
  min_amount?: number | string | null
  max_amount?: number | string | null
  step_increments?: number | string | null
  currency?: string | null
  loan_tenure?: string | null
  repayment_frequency?: string | null
  grace_period?: string | null
  loan_start_date_rule?: string | null
}

export type ApiLoanProductDetailsInterestFees = {
  interest_method?: string | null
  interest_rate?: string | null
  processing_fee?: number | string | null
  late_payment_penalty?: number | string | null
  early_repayment?: number | string | null
  insurance_fee?: number | string | null
}

export type ApiLoanProductDetailsRepaymentRules = {
  repayment_methods?: string | null
  payment_allocation?: string | null
  partial_payments_allowed?: string | null
  overpayment_handling?: string | null
  auto_debit?: string | null
}

export type ApiLoanProductDetailsCollateralSecurity = {
  collateral_required?: string | null
  collateral_type?: string | null
  collateral_valuation_rules?: string | null
  guarantor_info?: string | null
}

export type ApiLoanProductDetailsDocumentRequirements = {
  mandatory_documents?: string | null
  document_type?: string | null
  verification_method?: string | null
}

export type ApiLoanProductDetailsApprovalWorkflow = {
  name?: string | null
  steps?: number | string | null
}

export type ApiLoanProductDetailsNotificationsAlerts = {
  collateral_required?: string | null
  repayment_reminder?: string | null
  overdue_alert?: string | null
}

export type ApiLoanProductDetailsIntegrations = {
  credit_bureau?: string | null
  payment_gateway?: string | null
  id_verification?: string | null
}

export type ApiLoanProductDetails = {
  header?: ApiLoanProductDetailsHeader | null
  overview?: ApiLoanProductDetailsOverview | null
  loan_amount_and_duration?: ApiLoanProductDetailsLoanAmountDuration | null
  interest_and_fees?: ApiLoanProductDetailsInterestFees | null
  repayment_rules?: ApiLoanProductDetailsRepaymentRules | null
  collateral_and_security?: ApiLoanProductDetailsCollateralSecurity | null
  document_requirements?: ApiLoanProductDetailsDocumentRequirements | null
  approval_workflow?: ApiLoanProductDetailsApprovalWorkflow | null
  notifications_and_alerts?: ApiLoanProductDetailsNotificationsAlerts | null
  integrations?: ApiLoanProductDetailsIntegrations | null
}

export type ApiLoanProduct = {
  id: number | string
  name: string
  description?: string | null
  min_amount?: number | string | null
  max_amount?: number | string | null
  interest_type?: string | null
  tenure?: number | null
  tenure_type?: string | null
  credit_protection_fee?: number | string | null
  is_active?: boolean | null
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
  code?: string | null
  category?: string | null
  eligibility_criteria?: string | null
  amount_increment?: number | string | null
  currency?: string | null
  repayment_frequency?: string | null
  grace_period?: string | null
  start_date_rules?: string | null
  interest_rate?: number | string | null
  processing_fee?: number | string | null
  late_payment_fee?: number | string | null
  early_settlement_fee?: number | string | null
  insurance_fee?: number | string | null
  repayment_methods?: string | null
  payment_allocation?: string | null
  partial_payment_allowed?: string | null
  overpayment_handling?: string | null
  auto_debit_settings?: string | null
  collateral_required?: boolean | string | null
  collateral_types?: string | null
  valuation_rules?: string | null
  mandatory_documents?: string | null
  allowed_document_formats?: string | null
  document_size_limit?: string | null
  verification_method?: string | null
  approval_workflow?: string | null
  notifications_integrations?: string | null
  tiers?: ApiLoanProductTier[] | null
  details?: ApiLoanProductDetails | null
}

export type ApiLoanProductDetailResponse =
  | ApiLoanProduct
  | {
      data?: ApiLoanProduct
      success?: boolean
    }

export type ApiLoanProductListResponse = {
  current_page: number
  data: ApiLoanProduct[]
  last_page?: number
  per_page?: number
  total: number
}
