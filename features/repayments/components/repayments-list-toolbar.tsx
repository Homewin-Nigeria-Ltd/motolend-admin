"use client"

import { BackLink } from "@/components/back-link"

type RepaymentsListToolbarProps = {
  title?: string
}

export function RepaymentsListToolbar({
  title = "All Repayments",
}: RepaymentsListToolbarProps) {
  return (
    <div className="flex w-full items-center gap-2 border-b border-border px-4 py-4">
      <BackLink href="/repayments/overview" label="Repayments" />
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
    </div>
  )
}
