import { redirect } from "next/navigation"

export default function PermissionsSettingsRedirectPage() {
  redirect("/settings/role-permissions")
}
