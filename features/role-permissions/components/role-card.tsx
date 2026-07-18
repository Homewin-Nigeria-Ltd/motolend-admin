"use client"

import type { ApiRole } from "@/features/role-permissions/types"
import { formatRoleUsersCount } from "@/features/role-permissions/utils/filter-permissions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type RoleCardProps = {
  role: ApiRole
  onViewPermissions: (role: ApiRole) => void
}

export function RoleCard({ role, onViewPermissions }: RoleCardProps) {
  return (
    <Card className="flex h-full min-w-0 flex-col gap-0 overflow-hidden py-0">
      <div className="flex h-full min-w-0 flex-col px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground">{role.name}</h3>
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {formatRoleUsersCount(role)}
          </span>
        </div>

        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {role.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded"
            disabled
          >
            View Users
          </Button>
          <Button
            type="button"
            className="h-10 rounded"
            onClick={() => onViewPermissions(role)}
          >
            View Permissions
          </Button>
        </div>
      </div>
    </Card>
  )
}
