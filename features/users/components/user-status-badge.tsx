import type { UserStatus } from "@/features/users/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<UserStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-amber-50 text-amber-700",
  Deactivated: "bg-muted text-muted-foreground",
  Pending: "bg-amber-50 text-amber-800",
  Verified: "bg-sky-50 text-sky-700",
  Admin: "bg-primary/10 text-primary",
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto rounded-full border-0 px-3 py-1 text-xs font-medium",
        statusStyles[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </Badge>
  )
}
