export type AllocationDuration = "daily" | "weekly" | "monthly"

export type DisbursementPartner = "palmpay" | "monnify" | "paylode"

export type DisbursementStatus = "disbursed" | "undisbursed"

export type DisbursementRecord = {
  id: string
  applicationId: string
  createdAt: string
  customerName: string
  loanProduct: string
  principal: string
  bankAccount: string
  status: DisbursementStatus
}

export type AllocationSettings = {
  amountAllocated: string
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
  alert: string
}
