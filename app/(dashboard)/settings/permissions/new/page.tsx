import { redirect } from "next/navigation"

export default function CreateRoleRedirectPage() {
  redirect("/settings/role-permissions")
}
