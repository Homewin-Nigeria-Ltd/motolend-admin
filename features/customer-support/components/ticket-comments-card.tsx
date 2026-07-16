"use client"

import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AddCommentDialog } from "@/features/customer-support/components/add-comment-dialog"
import type { TicketComment } from "@/features/customer-support/types"

type TicketCommentsCardProps = {
  ticketId: string
  comments: TicketComment[]
}

function CommentItem({ comment }: { comment: TicketComment }) {
  return (
    <div className="flex gap-3 border-b border-border/60 pb-5 last:border-b-0 last:pb-0">
      <Avatar className="size-10 shrink-0">
        <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
          {comment.authorInitials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-medium text-foreground">
            {comment.authorName}
          </p>
          <p className="text-xs text-muted-foreground">{comment.createdAt}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {comment.message}
        </p>
      </div>
    </div>
  )
}

export function TicketCommentsCard({
  ticketId,
  comments,
}: TicketCommentsCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">Comments</h3>
        <Button type="button" className="h-9 px-4" onClick={() => setOpen(true)}>
          Add Comment
        </Button>
      </div>

      <div className="mt-6 space-y-5">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}
      </div>

      <AddCommentDialog
        ticketId={ticketId}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}
