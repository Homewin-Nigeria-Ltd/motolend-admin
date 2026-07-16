"use client"

import { DataTable } from "@/components/data-table"
import { userLoanColumns } from "@/features/users/loan-columns"
import type { UserLoan } from "@/features/users/types"

type UserLoansSectionProps = {
  loans: UserLoan[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  errorMessage?: string | null
}

export function UserLoansSection({
  loans,
  total,
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  errorMessage,
}: UserLoansSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">Loan History</h3>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4">
        <p className="text-sm text-muted-foreground">Total number of loans</p>
        <p className="text-lg font-semibold text-foreground">{total}</p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : (
        <DataTable
          columns={userLoanColumns}
          data={loans}
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isLoading}
          emptyMessage="No loan history found."
        />
      )}
    </div>
  )
}
