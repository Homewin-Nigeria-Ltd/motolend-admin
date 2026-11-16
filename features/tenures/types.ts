export type TenureStatus = "active" | "inactive"

export type TenureTab = "all" | "active" | "inactive"

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
  linkedProducts: string
  status: TenureStatus
  description?: string
}

export type TenureMetric = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: "up" | "down"
}
