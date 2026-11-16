import type { IconName } from "@/components/ui/icons"

export type SettingsItemId =
  | "credit-check"
  | "role-permissions"
  | "channel"
  | "sms"

export type SettingsItem = {
  id: SettingsItemId
  title: string
  description: string
  icon: IconName
  iconVariant?: "default" | "danger"
  iconPlain?: boolean
  href: string
}

export type CreditCheckSetting = {
  key: string
  enabled: boolean
  description: string
  updated_at: string
  updated_by: string | null
}

export type CreditCheckSettingApiResponse = {
  status?: string
  success?: boolean
  message?: string
  data: CreditCheckSetting
}

export type UpdateCreditCheckSettingInput = {
  enabled: boolean
}

export const SETTINGS_LEFT_COLUMN: SettingsItem[] = [
  {
    id: "credit-check",
    title: "Credit Check",
    description:
      "Control whether credit checks run during loan applications.",
    icon: "fileText",
    iconPlain: true,
    href: "/settings/credit-check",
  },
]

export const SETTINGS_RIGHT_COLUMN: SettingsItem[] = [
  {
    id: "role-permissions",
    title: "Roles & Permissions",
    description:
      "Manage user roles and control access levels across the admin dashboard.",
    icon: "shield",
    iconPlain: true,
    href: "/settings/role-permissions",
  },
  {
    id: "channel",
    title: "Channel",
    description:
      "Turn API partners on or off for KYC, credit, banking, deposits and withdrawals.",
    icon: "link",
    iconPlain: true,
    href: "/settings/channel",
  },
  {
    id: "sms",
    title: "SMS",
    description:
      "Connect your SMS partner and edit automated messages by loan status.",
    icon: "messageCircle",
    iconPlain: true,
    href: "/settings/sms",
  },
]
