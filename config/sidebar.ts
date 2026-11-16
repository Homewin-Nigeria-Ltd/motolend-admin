import type { IconName } from "@/components/ui/icons"
import { PERMISSION_KEYS, type PermissionKey } from "@/lib/permissions"

export type NavItem = {
  title: string
  url: string
  icon: IconName
  permission: PermissionKey | null
  items?: {
    title: string
    url: string
  }[]
}

export type SupportItem = {
  name: string
  url?: string
  icon: IconName
  permission: PermissionKey | null
  items?: {
    name: string
    url: string
  }[]
}

export const navMain: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: "dashboard", permission: null },
  {
    title: "Users",
    url: "/users",
    icon: "group",
    permission: PERMISSION_KEYS.viewUsers,
    items: [
      { title: "Users", url: "/users" },
      { title: "Admin", url: "/users/admin" },
    ],
  },
  {
    title: "Loan Applications",
    url: "/applications/overview",
    icon: "listAlt",
    permission: PERMISSION_KEYS.viewLoans,
  },
  {
    title: "Loan",
    url: "/loan-products",
    icon: "priceTag",
    permission: PERMISSION_KEYS.viewLoanProducts,
    items: [
      { title: "Loan Products", url: "/loan-products/overview" },
      { title: "Tenure", url: "/loan-products/tenures" },
      {
        title: "Disbursement",
        url: "/loan-products/disbursement",
      },
      {
        title: "Loan Progression",
        url: "/loan-products/progression",
      },
    ],
  },
  {
    title: "Repayments",
    url: "/repayments",
    icon: "revenue",
    permission: PERMISSION_KEYS.manageRepayments,
    items: [
      { title: "Repayment", url: "/repayments/overview" },
      { title: "Recovery", url: "/repayments/recovery" },
      { title: "Transaction", url: "/repayments/transactions" },
    ],
  },
  {
    title: "Customer Support",
    url: "/support/overview",
    icon: "headphones",
    permission: null,
  },
]

export const navSupport: SupportItem[] = [
  {
    name: "Settings",
    url: "/settings",
    icon: "settings",
    permission: PERMISSION_KEYS.manageUsers,
  },
]
