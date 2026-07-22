"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { RepaymentToolbar } from "@/features/repayments/components/repayment-toolbar"
import { RepaymentsListToolbar } from "@/features/repayments/components/repayments-list-toolbar"
import { repaymentColumns } from "@/features/repayments/columns"
import { useRepaymentList } from "@/features/repayments/hooks/use-repayment-queries"
import type { Repayment, RepaymentTab } from "@/features/repayments/types"

const PAGE_SIZE = 15

export function RepaymentsListSection() {
  const router = useRouter()
  const [tab, setTab] = useState<RepaymentTab>("active")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const {
    data: repaymentList,
    isPending,
    isFetching,
    isError,
    error,
  } = useRepaymentList({
    page,
    per_page: PAGE_SIZE,
    search,
    status: tab,
  })

  const repayments = repaymentList?.items ?? []
  const totalPages = repaymentList?.meta.last_page ?? 1
  const currentPage = repaymentList?.meta.current_page ?? page

  const handleTabChange = (value: RepaymentTab) => {
    setTab(value)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRowClick = (repayment: Repayment) => {
    router.push(`/repayments/${repayment.id}`)
  }

  if (isPending && repayments.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load repayments."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <section className="min-w-0">
        <DataTable
          columns={repaymentColumns}
          data={repayments}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isPending || (isFetching && repayments.length === 0)}
          emptyMessage="No repayments found."
          className="min-w-0"
          toolbar={
            <>
              <RepaymentsListToolbar />
              <RepaymentToolbar
                tab={tab}
                onTabChange={handleTabChange}
                search={search}
                onSearchChange={handleSearchChange}
              />
            </>
          }
        />
      </section>
    </div>
  )
}
