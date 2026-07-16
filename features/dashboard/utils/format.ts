import { formatMoney } from "@/features/users/utils/format-money"

export function formatDashboardCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value)
}

export function formatDashboardPercent(value: number) {
  return `${new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 1,
  }).format(value)}%`
}

export function formatInterestValue(value: number) {
  return formatMoney(value)
}
