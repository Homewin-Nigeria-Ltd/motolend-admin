"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { UserDetail } from "@/features/users/types"
import { getUserInitials } from "@/utils/get-initials"

type UserProfileCardProps = {
  user: UserDetail
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-foreground">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed up on {user.signedUpOn}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {user.pendingRepayments > 0 ? (
            <Badge className="h-auto rounded-full border-0 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              {user.pendingRepayments} Pending Repayment
            </Badge>
          ) : null}
          <Badge className="h-auto rounded-full border-0 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {user.status}
          </Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
        {user.fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              {field.label}
            </p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
