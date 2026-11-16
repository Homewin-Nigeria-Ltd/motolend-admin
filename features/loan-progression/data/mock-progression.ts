import type {
  ProgressionCustomer,
  ProgressionRule,
  ProgressionTier,
} from "@/features/loan-progression/types"

export const progressionCategory = {
  title: "₦5,000 Loan category",
  description: "Limits go up automatically after consecutive successful repayments.",
}

export const defaultTiers: ProgressionTier[] = [
  {
    id: "tier-1",
    label: "Tier 1",
    limit: "5,000",
    description: "Starting limit for every new user",
    repaymentsToUnlock: "0",
    unlockLabel: null,
  },
  {
    id: "tier-2",
    label: "Tier 2",
    limit: "10,000",
    description: "Unlocked after 2 consecutive successful repayments at Tier 1",
    repaymentsToUnlock: "2",
    unlockLabel: "2 in a row",
  },
  {
    id: "tier-3",
    label: "Tier 3",
    limit: "20,000",
    description: "Unlocked after 5 more consecutive successful repayments at Tier 2",
    repaymentsToUnlock: "5",
    unlockLabel: "5 more in a row",
    highlighted: true,
  },
]

export const defaultRules: ProgressionRule[] = [
  {
    id: "reset-on-late",
    label: "A late or missed repayment resets the consecutive count to zero",
    enabled: true,
  },
  {
    id: "on-time-definition",
    label: "A successful repayment means paid in full on or before the due date",
    enabled: true,
  },
  {
    id: "downgrade-on-default",
    label: "Move users down a tier after a default",
    enabled: false,
  },
]

export const progressionCustomers: ProgressionCustomer[] = [
  {
    id: "1",
    name: "Ebiwari Ogan",
    currentLimit: "₦5,000",
    consecutiveLabel: "1 of 2",
    nextLimit: "₦10,000",
    progressPercent: 50,
  },
  {
    id: "2",
    name: "Inengite Ekisagha",
    currentLimit: "₦10,000",
    consecutiveLabel: "3 of 5",
    nextLimit: "₦20,000",
    progressPercent: 60,
  },
  {
    id: "3",
    name: "Gbagha Kemepade",
    currentLimit: "₦20,000",
    consecutiveLabel: "Top tier",
    nextLimit: "—",
    progressPercent: 100,
  },
]
