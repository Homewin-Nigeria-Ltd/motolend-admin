"use client"

import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserStatusSelect } from "@/features/users/components/user-status-select"
import type { UserDetail, UserDetailField } from "@/features/users/types"
import { maskSensitiveId } from "@/features/users/utils/user-detail"
import { getUserInitials } from "@/utils/get-initials"

type UserProfileCardProps = {
  user: UserDetail
}

function SensitiveFieldValue({ field }: { field: UserDetailField }) {
  const [revealed, setRevealed] = useState(false)

  if (!field.sensitive || field.value === "—") {
    return (
      <p className="mt-1 truncate text-sm font-medium text-foreground">
        {field.value}
      </p>
    )
  }

  return (
    <div className="mt-1 space-y-1.5">
      <p className="truncate text-sm font-medium text-foreground">
        {revealed ? field.value : maskSensitiveId(field.value)}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="h-auto rounded-full border-0 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
          Encrypted
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground"
          onClick={() => setRevealed((current) => !current)}
        >
          {revealed ? "Hide" : "Reveal"}
        </Button>
      </div>
    </div>
  )
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const signupLine = user.photoNote
    ? `Signed up on ${user.signedUpOn} · ${user.photoNote}`
    : `Signed up on ${user.signedUpOn}`

  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 rounded-2xl">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback className="rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-semibold text-foreground">
                {user.name}
              </h2>
              <Badge className="h-auto rounded-full border-0 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {user.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{signupLine}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {user.pendingRepayments > 0 ? (
            <Badge className="h-auto rounded-full border-0 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              {user.pendingRepayments} Pending Repayment
            </Badge>
          ) : null}
          <UserStatusSelect
            userId={user.id}
            userName={user.name}
            status={user.accountStatus}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
        {user.fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              {field.label}
            </p>
            {field.sensitive ? (
              <SensitiveFieldValue field={field} />
            ) : (
              <p className="mt-1 truncate text-sm font-medium text-foreground">
                {field.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
