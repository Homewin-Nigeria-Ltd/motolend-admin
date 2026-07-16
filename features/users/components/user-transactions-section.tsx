"use client"

import { DataTable } from "@/components/data-table"
import { userTransactionColumns } from "@/features/users/transaction-columns"
import type { UserTransaction } from "@/features/users/types"

type UserTransactionsSectionProps = {
  transactions: UserTransaction[]
}

export function UserTransactionsSection({
  transactions,
}: UserTransactionsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">Transactions</h3>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4">
        <p className="text-sm text-muted-foreground">
          Total number of transaction
        </p>
        <p className="text-lg font-semibold text-foreground">
          {transactions.length}
        </p>
      </div>

      <DataTable
        columns={userTransactionColumns}
        data={transactions}
        emptyMessage="No transactions found."
      />
    </div>
  )
}
