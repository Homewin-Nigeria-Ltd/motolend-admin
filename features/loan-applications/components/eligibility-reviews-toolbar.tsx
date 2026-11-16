"use client"

import { BackLink } from "@/components/back-link"

export function EligibilityReviewsToolbar() {
  return (
    <div className="flex w-full items-center gap-2 border-b border-border px-4 py-4">
      <BackLink href="/applications/overview" label="Loan Applications" />
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-foreground">
          Eligibility Reviews
        </h2>
        <p className="text-sm text-muted-foreground">
          Users awaiting manual review of their latest Mono assessment.
        </p>
      </div>
    </div>
  )
}
