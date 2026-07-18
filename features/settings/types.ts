import type { IconName } from "@/components/ui/icons"

export type SettingsItemId = "role-permissions"

export type SettingsItem = {
  id: SettingsItemId
  title: string
  description: string
  icon: IconName
  iconVariant?: "default" | "danger"
  iconPlain?: boolean
  href: string
}

export const SETTINGS_LEFT_COLUMN: SettingsItem[] = []

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
]
