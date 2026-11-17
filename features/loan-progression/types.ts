export type ProgressionTier = {
  id: string
  tierNumber: number
  label: string
  limit: string
  limitValue: number
  description: string
  repaymentsToUnlock: string
  unlockLabel: string | null
  highlighted?: boolean
}

export type ProgressionRuleId =
  | "reset_on_late_repayment"
  | "require_full_on_time_repayment"
  | "downgrade_on_default"

export type ProgressionRule = {
  id: ProgressionRuleId
  label: string
  enabled: boolean
}

export type ProgressionCustomer = {
  id: string
  name: string
  initials?: string
  currentLimit: string
  consecutiveLabel: string
  nextLimit: string
  progressPercent: number
}

export type ProgressionCustomerListParams = {
  page: number
  per_page?: number
  search?: string
}

export type ProgressionCustomerListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type ProgressionSettingsState = {
  categoryName: string
  automaticUpgrades: boolean
  tiers: ProgressionTier[]
  rules: ProgressionRule[]
}

export type ProgressionCustomersResponse = {
  items: ProgressionCustomer[]
  meta: ProgressionCustomerListMeta
}

export type LoanTierProgressionResponse = {
  settings: ProgressionSettingsState
  customers: ProgressionCustomersResponse
}

export type UpdateLoanTierProgressionInput = {
  category_name: string
  automatic_upgrades: boolean
  reset_on_late_repayment: boolean
  require_full_on_time_repayment: boolean
  downgrade_on_default: boolean
  tiers: Array<{
    limit: number
    repayments_to_unlock: number
  }>
}

export type LoanTierProgressionActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export type ApiLoanTier = {
  tier_number?: number | null
  name?: string | null
  limit?: number | string | null
  limit_formatted?: string | null
  repayments_to_unlock?: number | string | null
  description?: string | null
}

export type ApiLoanTierSettings = {
  category_name?: string | null
  automatic_upgrades?: boolean | number | string | null
  reset_on_late_repayment?: boolean | number | string | null
  require_full_on_time_repayment?: boolean | number | string | null
  downgrade_on_default?: boolean | number | string | null
  tiers?: ApiLoanTier[] | null
  updated_at?: string | null
  updated_by?: string | null
}

export type ApiLoanTierCustomer = {
  user_id?: string | null
  customer?: {
    id?: string | null
    name?: string | null
    initials?: string | null
  } | null
  current_tier?: number | null
  current_limit?: number | string | null
  current_limit_formatted?: string | null
  consecutive_on_time?: number | null
  consecutive_on_time_label?: string | null
  next_limit?: number | string | null
  next_limit_formatted?: string | null
  progress_percentage?: number | string | null
}

export type ApiLoanTierCustomerProgression = {
  current_page?: number
  data?: ApiLoanTierCustomer[]
  last_page?: number
  per_page?: number
  total?: number
}

export type ApiLoanTierProgressionResponse = {
  settings?: ApiLoanTierSettings | null
  customer_progression?: ApiLoanTierCustomerProgression | null
  data?: {
    settings?: ApiLoanTierSettings | null
    customer_progression?: ApiLoanTierCustomerProgression | null
  } | null
}
