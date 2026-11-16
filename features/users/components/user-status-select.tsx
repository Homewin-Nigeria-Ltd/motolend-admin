"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { ChangeStatusDialog } from "@/features/users/components/change-status-dialog"
import { useUpdateUserStatus } from "@/features/users/hooks/use-user-mutations"
import type { UserAccountStatus } from "@/features/users/types"

const STATUS_LABELS: Record<UserAccountStatus, string> = {
  active: "Active",
  pnd: "PND",
  blocked: "Blocked",
}

function isAccountStatus(value: string): value is UserAccountStatus {
  return value === "active" || value === "pnd" || value === "blocked"
}

type UserStatusSelectProps = {
  userId: string
  userName: string
  status: string
}

export function UserStatusSelect({
  userId,
  userName,
  status,
}: UserStatusSelectProps) {
  const { updateStatus, isPending } = useUpdateUserStatus(userId)
  const [open, setOpen] = useState(false)
  const current = isAccountStatus(status) ? status : "active"

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2 px-3"
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        Status: {STATUS_LABELS[current]}
        <Icons.chevronDown size={16} className="text-muted-foreground" />
      </Button>

      <ChangeStatusDialog
        open={open}
        onOpenChange={setOpen}
        userName={userName}
        currentStatus={current}
        isPending={isPending}
        onSave={async (nextStatus, reason) => {
          await updateStatus(nextStatus, reason)
        }}
      />
    </>
  )
}
