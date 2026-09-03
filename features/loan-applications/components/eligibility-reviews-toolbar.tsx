"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function EligibilityReviewsToolbar() {
  return (
    <div className="flex w-full items-center gap-3 border-b border-border px-4 py-4">
      <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
        <Link
          href="/applications/overview"
          aria-label="Back to applications overview"
        >
          <Icons.chevronLeft size={20} />
        </Link>
      </Button>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-foreground">
          Eligibility Reviews
        </h2>
        <p className="text-sm text-muted-foreground">
          Users awaiting manual review of their latest Mono assessment.
        </p>
      </div>
    </div>
  )
}
