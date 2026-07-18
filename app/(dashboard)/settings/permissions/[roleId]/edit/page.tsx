import { redirect } from "next/navigation"

export default function EditRoleRedirectPage() {
  redirect("/settings/role-permissions")
}
