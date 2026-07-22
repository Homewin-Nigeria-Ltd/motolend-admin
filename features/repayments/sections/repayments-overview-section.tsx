"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { RepaymentToolbar } from "@/features/repayments/components/repayment-toolbar"
import { repaymentColumns } from "@/features/repayments/columns"
import { useRepaymentList } from "@/features/repayments/hooks/use-repayment-queries"
import type { Repayment, RepaymentTab } from "@/features/repayments/types"

const PAGE_SIZE = 15

export function RepaymentsOverviewSection() {
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

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      {isError ? (
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load repayments."}
        </div>
      ) : (
        <DataTable
          columns={repaymentColumns}
          data={repayments}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isPending || (isFetching && repayments.length === 0)}
          emptyMessage="No repayments found."
          toolbar={
            <RepaymentToolbar
              tab={tab}
              onTabChange={handleTabChange}
              search={search}
              onSearchChange={handleSearchChange}
              showViewAll
            />
          }
        />
      )}
    </div>
  )
}
