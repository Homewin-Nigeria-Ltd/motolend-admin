"use client"

import { useState } from "react"

import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { UserAccountStatus } from "@/features/users/types"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS: {
  value: UserAccountStatus
  label: string
  description: string
  badgeClassName: string
}[] = [
  {
    value: "active",
    label: "Active",
    description: "Can log in and get a loan",
    badgeClassName: "bg-emerald-50 text-emerald-700",
  },
  {
    value: "pnd",
    label: "PND",
    description:
      "Post no debit. Can log in but cannot withdraw or request a loan",
    badgeClassName: "bg-orange-50 text-orange-700",
  },
  {
    value: "blocked",
    label: "Blocked",
    description: "Cannot log in to the app",
    badgeClassName: "bg-red-50 text-red-600",
  },
]

type ChangeStatusDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  currentStatus: UserAccountStatus
  isPending?: boolean
  onSave: (status: UserAccountStatus, reason: string) => void | Promise<void>
}

type ChangeStatusDialogSessionProps = {
  userName: string
  currentStatus: UserAccountStatus
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSave: (status: UserAccountStatus, reason: string) => void | Promise<void>
}

function ChangeStatusDialogSession({
  userName,
  currentStatus,
  isPending,
  onOpenChange,
  onSave,
}: ChangeStatusDialogSessionProps) {
  const [status, setStatus] = useState<UserAccountStatus>(currentStatus)
  const [reason, setReason] = useState("")

  return (
    <BaseModal
      title="Change status"
      open
      onOpenChange={onOpenChange}
      className="max-w-md"
      headerClassName="items-start px-6 pt-6 pb-0 text-left"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending || !reason.trim()}
            onClick={async () => {
              await onSave(status, reason.trim())
              onOpenChange(false)
            }}
          >
            {isPending ? "Saving…" : "Save status"}
          </Button>
        </div>
      }
    >
      <p className="-mt-1 text-sm text-muted-foreground">{userName}</p>

      <RadioGroup
        value={status}
        onValueChange={(value) => setStatus(value as UserAccountStatus)}
        className="gap-3"
        disabled={isPending}
      >
        {STATUS_OPTIONS.map((option) => {
          const isSelected = status === option.value

          return (
            <label
              key={option.value}
              htmlFor={`change-status-${option.value}`}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/40",
              )}
            >
              <RadioGroupItem
                id={`change-status-${option.value}`}
                value={option.value}
                className="mt-1"
              />
              <div className="min-w-0 space-y-1">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                    option.badgeClassName,
                  )}
                >
                  {option.label}
                </span>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </label>
          )
        })}
      </RadioGroup>

      <Field>
        <FieldLabel htmlFor="change-status-reason">Reason</FieldLabel>
        <Textarea
          id="change-status-reason"
          rows={4}
          placeholder="Why are you changing this status?"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          disabled={isPending}
          className="mt-2 resize-none rounded-xl"
        />
      </Field>
    </BaseModal>
  )
}

export function ChangeStatusDialog({
  open,
  onOpenChange,
  userName,
  currentStatus,
  isPending = false,
  onSave,
}: ChangeStatusDialogProps) {
  if (!open) {
    return null
  }

  return (
    <ChangeStatusDialogSession
      key={`${currentStatus}-${userName}`}
      userName={userName}
      currentStatus={currentStatus}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  )
}
