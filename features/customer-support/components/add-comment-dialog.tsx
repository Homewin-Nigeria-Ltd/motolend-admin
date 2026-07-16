"use client"

import { useState } from "react"

import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { useAddTicketComment } from "@/features/customer-support/hooks/use-ticket-mutations"

type AddCommentDialogProps = {
  ticketId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCommentDialog({
  ticketId,
  open,
  onOpenChange,
}: AddCommentDialogProps) {
  const { addComment, isPending } = useAddTicketComment()
  const [comment, setComment] = useState("")

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setComment("")
    }
    onOpenChange(next)
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!comment.trim()) {
      return
    }

    const result = await addComment({
      ticketId,
      comment: comment.trim(),
    })

    if (result.success) {
      handleOpenChange(false)
    }
  }

  return (
    <BaseModal
      title="Add Comment"
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
          <Button type="submit" disabled={isPending || !comment.trim()}>
            {isPending ? "Adding…" : "Add Comment"}
          </Button>
        </div>
      }
    >
      <Field>
        <FieldLabel>Comment</FieldLabel>
        <Textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={5}
          placeholder="Write your comment"
        />
      </Field>
    </BaseModal>
  )
}
