import { BackLink } from "@/components/back-link"
import type { UserDetail } from "@/features/users/types"

const fields = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
] as const

type AdminDetailSectionProps = {
  user: UserDetail
}

export function AdminDetailSection({ user }: AdminDetailSectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/users/admin" label="Admin" />
        <h2 className="text-base font-semibold text-foreground">
          Admin Details
        </h2>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
        <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>

        <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                {field.label}
              </p>
              <p className="mt-1 truncate text-sm font-medium text-foreground">
                {user[field.key] || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
