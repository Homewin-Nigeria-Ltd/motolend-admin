"use client"

import type { UserDetail } from "@/features/users/types"

type UserBalanceCardProps = {
  user: UserDetail
}

export function UserBalanceCard({ user }: UserBalanceCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Eligible Amount</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-600">
            {user.eligibleAmount}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pending Bill</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-primary">
            {user.pendingBill}
          </p>
        </div>
      </div>
    </div>
  )
}
