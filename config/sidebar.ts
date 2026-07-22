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
  { title: "Users", url: "/users/overview", icon: "group", permission: null },
  {
    title: "Loan Applications",
    url: "/applications/overview",
    icon: "listAlt",
    permission: null,
  },
  {
    title: "Loan Products",
    url: "/loan-products/overview",
    icon: "priceTag",
    permission: null,
  },
  {
    title: "Repayments",
    url: "/repayments/overview",
    icon: "revenue",
    permission: null,
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
    permission: PERMISSION_KEYS.settings,
  },
]
