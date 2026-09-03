export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "disbursed"

export type ApplicationTab = ApplicationStatus

export type ApplicationKpi = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: "up" | "down"
}

export type ApplicationListParams = {
  page: number
  per_page?: number
  search?: string
  status?: ApplicationStatus
  date_from?: string
  date_to?: string
}

export type ApplicationListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type LoanApplication = {
  id: string
  applicationId: string
  createdAt: string
  customerName: string
  customerEmail: string
  avatarUrl?: string | null
  loanType: string
  principal: string
  totalPayable: string
  status: ApplicationStatus | string
  userId: string
}

export type ApplicationListResponse = {
  items: LoanApplication[]
  meta: ApplicationListMeta
}

import type { UserStatus } from "@/features/users/types"

export type ApplicationBorrowerGrantor = {
  name: string
  telephone: string
}

export type ApplicationBorrower = {
  id: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  idNumber: string
  employmentStatus: string
  companyName: string
  jobTitle: string
  monthlyIncome: string
  grantors: ApplicationBorrowerGrantor[]
  status: UserStatus
}

export type ApplicationCreditScore = {
  score: number
  maxScore: number
  rating: string
}

export type ApplicationDocument = {
  id: string
  label: string
  name: string
  size: string
  downloadUrl: string | null
}

export type ApplicationLoanInformation = {
  loanType: string
  loanCategory: string
  description: string
  amountRequested: string
  tenure: string
  interestRate: string
  repaymentFrequency: string
}

export type ApplicationActivityLogEntry = {
  id: string
  dateTime: string
  action: string
}

export type ApplicationDetail = {
  id: string
  applicationId: string
  status: ApplicationStatus | string
  rejectionReason: string
  dateCreated: string
  timeCreated: string
  borrower: ApplicationBorrower
  creditScore: ApplicationCreditScore
  supportingDocuments: ApplicationDocument[]
  loanInformation: ApplicationLoanInformation
  activityLog: ApplicationActivityLogEntry[]
}

export type RejectApplicationInput = {
  applicationId: string
  rejection_reason: string
}

export type DisburseApplicationInput = {
  applicationId: string
  reason: string
}

export type ApplicationActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export type ApiApplicationTrend = {
  percentage: number
  direction: "up" | "down" | string
}

export type ApiApplicationMetricItem = {
  value: number
  trend: ApiApplicationTrend
}

export type ApiApplicationMetricsResponse = {
  total_applications: ApiApplicationMetricItem
  new_applications: ApiApplicationMetricItem
  approved_applications: ApiApplicationMetricItem
  disbursed_loans: ApiApplicationMetricItem
  pending_applications: ApiApplicationMetricItem
}

export type ApiApplicationBorrowerGrantor = {
  name?: string
  telephone?: string
  relationship?: string
}

export type ApiApplicationBorrower = {
  id: string
  full_name?: string
  email?: string
  phone?: string
  date_of_birth?: string
  nationality?: string
  id_number?: string
  employment_status?: string
  company_name?: string
  job_title?: string
  monthly_income?: string
  grantors?: ApiApplicationBorrowerGrantor[]
  status?: string
  account_status?: string
  signed_up_date?: string
  kyc_status?: string
}

export type ApiApplicationCreditScore = {
  score: number
  max_score: number
  rating: string
}

export type ApiApplicationDocument = {
  name: string
  size?: string
  type: string
  download_url?: string
}

export type ApiApplicationLoanInformation = {
  loan_type?: string
  loan_category?: string
  description?: string
  amount_requested?: string
  tenure?: string
  interest_rate?: string
  repayment_frequency?: string
}

export type ApiApplicationActivityLogEntry = {
  date_time: string
  action: string
}

export type ApiApplicationDetail = {
  id: number | string
  application_id: string
  status: string
  rejection_reason?: string | null
  date_created: string
  time_created: string
  borrower: ApiApplicationBorrower
  credit_score: ApiApplicationCreditScore
  supporting_documents: ApiApplicationDocument[]
  loan_information: ApiApplicationLoanInformation
  activity_log: ApiApplicationActivityLogEntry[]
}

export type ApiApplicationDetailResponse =
  | ApiApplicationDetail
  | {
      data?: ApiApplicationDetail
    }

export type ApiApplicationUser = {
  id?: string
  first_name?: string
  last_name?: string
  middle_name?: string | null
  name?: string
  full_name?: string
  email?: string
  avatar_url?: string | null
}

export type ApiLoanProduct = {
  id?: number
  name?: string
}

export type ApiLoanApplication = {
  id: number | string
  user_id: string
  loan_product_id?: number
  amount: number | string
  total_repayment: number | string
  interest_rate?: number | string | null
  tenure?: number
  tenure_type?: string
  due_date?: string | null
  status?: string
  rejection_reason?: string | null
  created_at: string
  loan_product?: ApiLoanProduct | null
  loanProduct?: ApiLoanProduct | null
  user?: ApiApplicationUser | null
}

export type ApiApplicationListResponse = {
  current_page: number
  data: ApiLoanApplication[]
  last_page: number
  per_page: number
  total: number
}

export type EligibilityReviewDecision =
  | "approve_10000"
  | "approve_20000"
  | "decline"

export type EligibilityReviewDecisionInput = {
  userId: string
  decision: EligibilityReviewDecision
  notes: string
}

export type EligibilityReviewListParams = {
  page: number
  per_page?: number
}

export type ApiEligibilityReviewUser = {
  id: string
  name: string
  email: string
  phone: string
}

export type ApiEligibilityReviewRiskAnalysis = {
  eligibility_amount: number
  status: string
  analyzed_transaction_count: number
  average_monthly_regular_income: number
  qualifying_income_months: number
  qualifying_10000_months: number
  qualifying_20000_months: number
  monthly_credit_inflows: Record<string, number>
  reasons: string[]
}

export type ApiEligibilityReviewItem = {
  user: ApiEligibilityReviewUser
  risk_analysis: ApiEligibilityReviewRiskAnalysis
  statement_checked_at: string | null
  manual_review_status: string | null
  manual_review_amount: number | null
  manual_review_notes: string | null
  reviewed_at: string | null
}

export type ApiEligibilityReviewsResponse = {
  current_page: number
  data: ApiEligibilityReviewItem[]
  first_page_url?: string | null
  from?: number | null
  last_page: number
  last_page_url?: string | null
  links?: unknown[]
  next_page_url?: string | null
  path?: string | null
  per_page: number
  prev_page_url?: string | null
  to?: number | null
  total: number
}
