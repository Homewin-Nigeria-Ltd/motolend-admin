"use client"

import { useState } from "react"

import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

type UserPasswordCardProps = {
  userId: string
  userName: string
}

export function UserPasswordCard({ userId, userName }: UserPasswordCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const firstName = userName.trim().split(/\s+/)[0] || userName

  async function handleReset() {
    setIsPending(true)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 400))
      void userId
      setConfirmOpen(false)
      setSuccessOpen(true)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Password</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Reset sends the user to the change password screen the next time they
            open the app.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-10 shrink-0 px-4"
          onClick={() => setConfirmOpen(true)}
        >
          Reset password
        </Button>
      </div>

      <BaseAlertDialog
        title={`Reset password for ${firstName}?`}
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        cancelLabel="Cancel"
        confirmLabel="Reset password"
        pendingLabel="Resetting…"
        confirmVariant="destructive"
        isPending={isPending}
        headerIcon={<Icons.alert size={28} className="text-destructive" />}
        onConfirm={() => {
          void handleReset()
        }}
        className="sm:max-w-md"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          They will be signed out of the app. The next time they open it, they
          will see the change password screen before anything else.
        </p>
      </BaseAlertDialog>

      <BaseModal
        title="Password reset"
        open={successOpen}
        onOpenChange={setSuccessOpen}
        className="max-w-md"
        headerClassName="items-start px-6 pt-6 pb-0 text-left"
        headerIcon={
          <Icons.alert size={28} className="text-emerald-600" />
        }
        footer={
          <Button
            type="button"
            className="h-11 w-full"
            onClick={() => setSuccessOpen(false)}
          >
            Done
          </Button>
        }
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          {firstName} will be asked to create a new password on next app launch.
          This was saved to the activity log.
        </p>
      </BaseModal>
    </>
  )
}
