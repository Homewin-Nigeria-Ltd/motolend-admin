"use client"

import { useState } from "react"

import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Icons } from "@/components/ui/icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateUserStatus } from "@/features/users/hooks/use-user-mutations"
import type { UserAccountStatus } from "@/features/users/types"

const OPTIONS: { value: UserAccountStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "pnd", label: "PND" },
  { value: "blocked", label: "Blocked" },
]

const NOTES: Record<UserAccountStatus, string> = {
  active: "The user can sign in and use the account.",
  pnd: "Can log in and deposit, but cannot apply for loans or withdraw referral earnings.",
  blocked: "The user is blocked and existing login tokens are revoked.",
}

function isAccountStatus(value: string): value is UserAccountStatus {
  return value === "active" || value === "pnd" || value === "blocked"
}

type UserStatusSelectProps = {
  userId: string
  status: string
}

export function UserStatusSelect({ userId, status }: UserStatusSelectProps) {
  const { updateStatus, isPending } = useUpdateUserStatus(userId)
  const [confirmBlock, setConfirmBlock] = useState(false)
  const current = isAccountStatus(status) ? status : undefined

  return (
    <div className="flex w-full flex-col gap-2 sm:w-56">
      <Select
        value={current}
        disabled={isPending}
        onValueChange={(value) => {
          if (!isAccountStatus(value) || value === current) {
            return
          }

          if (value === "blocked") {
            setConfirmBlock(true)
            return
          }

          updateStatus(value)
        }}
      >
        <SelectTrigger className="h-10 w-full bg-background">
          <SelectValue placeholder="Set status" />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {current ? (
        <p className="text-xs text-muted-foreground">{NOTES[current]}</p>
      ) : null}

      <BaseAlertDialog
        title="Block this user?"
        open={confirmBlock}
        onOpenChange={setConfirmBlock}
        confirmLabel="Block user"
        pendingLabel="Blocking..."
        confirmVariant="destructive"
        isPending={isPending}
        headerIcon={<Icons.alert size={28} className="text-destructive" />}
        onConfirm={() => {
          updateStatus("blocked")
          setConfirmBlock(false)
        }}
        className="sm:max-w-md"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          This blocks the account and revokes existing login tokens. The user
          will need to sign in again after the block is lifted.
        </p>
      </BaseAlertDialog>
    </div>
  )
}
