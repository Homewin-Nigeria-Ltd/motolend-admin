"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { UserLoanProgression } from "@/features/users/types"

type UserLoanProgressionCardProps = {
  progression: UserLoanProgression
}

export function UserLoanProgressionCard({
  progression,
}: UserLoanProgressionCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {progression.title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {progression.subtitle}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        className="h-9 shrink-0 px-3 text-primary"
        asChild
      >
        <Link href={progression.href}>View progression</Link>
      </Button>
    </div>
  )
}
