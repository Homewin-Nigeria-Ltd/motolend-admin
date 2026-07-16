"use client"

import { useState } from "react"

import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"
import { UserActivityCard } from "@/features/users/components/user-activity-card"
import { UserBalanceCard } from "@/features/users/components/user-balance-card"
import { UserLoansSection } from "@/features/users/components/user-loans-section"
import { UserProfileCard } from "@/features/users/components/user-profile-card"
import { UserRepaymentAccounts } from "@/features/users/components/user-repayment-accounts"
import { useUserDetail } from "@/features/users/hooks/use-user-detail"
import { useUserLoans } from "@/features/users/hooks/use-user-loans"

const LOANS_PAGE_SIZE = 15

type UserDetailSectionProps = {
  userId: string
}

export function UserDetailSection({ userId }: UserDetailSectionProps) {
  const [loansPage, setLoansPage] = useState(1)
  const { data: user, isPending, isError, error } = useUserDetail(userId)
  const {
    data: loans,
    isPending: isLoansPending,
    isFetching: isLoansFetching,
    isError: isLoansError,
    error: loansError,
  } = useUserLoans({
    userId,
    page: loansPage,
    per_page: LOANS_PAGE_SIZE,
  })

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/users/overview" label="Users" />
          <h2 className="text-base font-semibold text-foreground">
            User Details
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load user."}
        </div>
      </div>
    )
  }

  const loanItems = loans?.items ?? []
  const loanTotal = loans?.meta.total ?? user.loansTaken

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/users/overview" label="Users" />
        <h2 className="text-base font-semibold text-foreground">
          User Details
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <UserProfileCard user={user} />

        <div className="flex flex-col gap-4">
          <UserBalanceCard user={user} />
          <UserRepaymentAccounts accounts={user.repaymentAccounts} />
          <UserActivityCard user={user} />
        </div>
      </div>

      <UserLoansSection
        loans={loanItems}
        total={loanTotal}
        page={loans?.meta.current_page ?? loansPage}
        totalPages={loans?.meta.last_page ?? 1}
        onPageChange={setLoansPage}
        isLoading={
          isLoansPending || (isLoansFetching && loanItems.length === 0)
        }
        errorMessage={
          isLoansError
            ? loansError instanceof Error
              ? loansError.message
              : "Failed to load loan history."
            : null
        }
      />
    </div>
  )
}
