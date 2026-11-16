export type ProgressionTier = {
  id: string
  label: string
  limit: string
  description: string
  repaymentsToUnlock: string
  unlockLabel: string | null
  highlighted?: boolean
}

export type ProgressionRule = {
  id: string
  label: string
  enabled: boolean
}

export type ProgressionCustomer = {
  id: string
  name: string
  currentLimit: string
  consecutiveLabel: string
  nextLimit: string
  progressPercent: number
}
