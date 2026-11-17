import type { RecoveryTab, RecoveryTabMeta } from "@/features/recovery/types"

export const RECOVERY_TAB_ORDER: RecoveryTab[] = [
  "active",
  "due_soon",
  "due_today",
  "early_delinquency",
  "soft_collections",
  "medium_delinquency",
  "late_stage_delinquency",
  "non_performing",
  "doubtful",
  "lost",
]

export const RECOVERY_TAB_META: Record<
  RecoveryTab,
  Omit<RecoveryTabMeta, "count">
> = {
  active: {
    label: "Active",
    description: "Active: loans that have not reached their due date.",
  },
  due_soon: {
    label: "Due soon",
    description: "Due soon: loans due within the next few days.",
  },
  due_today: {
    label: "Due today",
    description: "Due today: loans with a repayment due today.",
  },
  early_delinquency: {
    label: "Early delinquency",
    description: "Early delinquency: recently missed repayments.",
  },
  soft_collections: {
    label: "Soft collections",
    description: "Soft collections: early collection outreach stage.",
  },
  medium_delinquency: {
    label: "Medium delinquency",
    description: "Medium delinquency: mid-stage overdue loans.",
  },
  late_stage_delinquency: {
    label: "Late stage delinquency",
    description: "Late stage delinquency: severely overdue loans.",
  },
  non_performing: {
    label: "Non-performing – Substandard",
    description: "NPL classification and appropriate provisioning",
  },
  doubtful: {
    label: "Doubtful",
    description: "Doubtful: recovery is uncertain.",
  },
  lost: {
    label: "Lost",
    description: "Lost: loans written off or considered unrecoverable.",
  },
}
