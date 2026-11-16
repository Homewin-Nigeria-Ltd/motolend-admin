"use client"

import { BackLink } from "@/components/back-link"

export function ApplicationsListToolbar() {
  return (
    <div className="flex w-full items-center gap-2 border-b border-border px-4 py-4">
      <BackLink href="/applications/overview" label="Loan Applications" />
      <h2 className="text-base font-semibold text-foreground">
        All Applications
      </h2>
    </div>
  )
}
