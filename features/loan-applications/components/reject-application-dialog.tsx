"use client"

import { useState } from "react"

import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

type RejectApplicationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (rejectionReason: string) => Promise<void>
  isPending?: boolean
}

export function RejectApplicationDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: RejectApplicationDialogProps) {
  const [reason, setReason] = useState("")

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setReason("")
    }

    onOpenChange(next)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!reason.trim()) {
      return
    }

    await onConfirm(reason.trim())
    setReason("")
  }

  return (
    <BaseModal
      title="Reject Application"
      open={open}
      onOpenChange={handleOpenChange}
      asForm
      onSubmit={handleSubmit}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !reason.trim()}>
            {isPending ? "Rejecting…" : "Reject Application"}
          </Button>
        </div>
      }
    >
      <Field>
        <FieldLabel htmlFor="reject-application-reason">
          Rejection reason
        </FieldLabel>
        <Textarea
          id="reject-application-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={4}
          placeholder="Enter reason for rejection"
          className="resize-none rounded-sm border-border bg-transparent"
          disabled={isPending}
        />
      </Field>
    </BaseModal>
  )
}
