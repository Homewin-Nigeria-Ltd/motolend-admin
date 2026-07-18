"use client"

import { useState } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"
import { TicketAssigneeCombobox } from "@/features/customer-support/components/ticket-assignee-combobox"
import { useAssignTicket } from "@/features/customer-support/hooks/use-ticket-mutations"
import { useTicketAssignees } from "@/features/customer-support/hooks/use-ticket-queries"
import { toast } from "@/lib/toast"

type ReassignTicketDialogProps = {
  ticketId: string
  currentAssigneeId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReassignTicketDialog({
  ticketId,
  currentAssigneeId,
  open,
  onOpenChange,
}: ReassignTicketDialogProps) {
  const selectionKey = currentAssigneeId ?? "none"
  const [selectedId, setSelectedId] = useState("")
  const [selectionSeed, setSelectionSeed] = useState("")

  if (open && selectionKey !== selectionSeed) {
    setSelectionSeed(selectionKey)
    setSelectedId(currentAssigneeId ?? "")
  }

  const { data: assignees = [], isPending, isError } = useTicketAssignees(open)
  const { assignTicket, isPending: isAssigning } = useAssignTicket()

  const handleSubmit = async () => {
    if (!selectedId) {
      toast.error("Please select an agent")
      return
    }

    const result = await assignTicket({
      ticketId,
      assigned_to: selectedId,
    })

    if (result.success) {
      onOpenChange(false)
    }
  }

  return (
    <BaseModal
      title="Reassign Ticket"
      open={open}
      onOpenChange={onOpenChange}
      headerIcon={<Icons.account size={28} className="text-primary" />}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || isError || isAssigning || assignees.length === 0}
          >
            {isAssigning ? "Saving…" : "Save"}
          </Button>
        </div>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="ticket-assignee">Choose agent</Label>
        {isPending ? (
          <AppLoader className="py-8" spinnerClassName="size-6" />
        ) : isError ? (
          <p className="text-sm text-destructive">
            Failed to load agents. Please try again.
          </p>
        ) : (
          <TicketAssigneeCombobox
            id="ticket-assignee"
            assignees={assignees}
            value={selectedId}
            onChange={setSelectedId}
            placeholder="Select agent"
            disabled={isAssigning}
          />
        )}
      </div>
    </BaseModal>
  )
}
