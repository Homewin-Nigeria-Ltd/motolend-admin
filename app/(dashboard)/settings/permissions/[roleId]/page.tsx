import { redirect } from "next/navigation"

export default function RoleDetailRedirectPage() {
  redirect("/settings/role-permissions")
}
