"use client"

import { useState } from "react"

import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAssignTicket } from "@/features/customer-support/hooks/use-ticket-mutations"
import { useUserList } from "@/features/users/hooks/use-user-list"

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
  const { assignTicket, isPending } = useAssignTicket()
  const { data, isPending: isAgentsPending } = useUserList({
    page: 1,
    per_page: 50,
    tab: "admin",
  })
  const agents = data?.items ?? []
  const [assigneeId, setAssigneeId] = useState(currentAssigneeId ?? "")

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setAssigneeId(currentAssigneeId ?? "")
    }
    onOpenChange(next)
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const result = await assignTicket({
      ticketId,
      assigned_to: assigneeId || null,
    })

    if (result.success) {
      handleOpenChange(false)
    }
  }

  return (
    <BaseModal
      title="Reassign Ticket"
      open={open}
      onOpenChange={handleOpenChange}
      asForm
      onSubmit={onSubmit}
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
          <Button type="submit" disabled={isPending || !assigneeId}>
            {isPending ? "Saving…" : "Reassign"}
          </Button>
        </div>
      }
    >
      <Field>
        <FieldLabel>Ticket Owner</FieldLabel>
        <Select
          value={assigneeId}
          onValueChange={setAssigneeId}
          disabled={isPending || isAgentsPending}
        >
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </BaseModal>
  )
}
