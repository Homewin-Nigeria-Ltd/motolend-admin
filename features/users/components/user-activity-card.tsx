"use client"

import type { UserDetail } from "@/features/users/types"

type UserActivityCardProps = {
  user: UserDetail
}

export function UserActivityCard({ user }: UserActivityCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Loan Taken</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {user.loansTaken}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Spend</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {user.totalSpend}
          </p>
        </div>
      </div>
    </div>
  )
}
