"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { repaymentColumns } from "@/features/repayments/columns"
import { RepaymentSummaryCards } from "@/features/repayments/components/repayment-summary-cards"
import { RepaymentToolbar } from "@/features/repayments/components/repayment-toolbar"
import { useRepaymentMetrics } from "@/features/repayments/hooks/use-repayment-metrics"
import { useRepaymentList } from "@/features/repayments/hooks/use-repayment-queries"
import type { Repayment, RepaymentTab } from "@/features/repayments/types"

const PAGE_SIZE = 15

export function RepaymentsOverviewSection() {
  const router = useRouter()
  const [tab, setTab] = useState<RepaymentTab>("disbursed")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const {
    data: metrics,
    isPending: isMetricsPending,
    isError: isMetricsError,
    error: metricsError,
  } = useRepaymentMetrics()

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
      {isMetricsError ? (
        <div className="rounded-2xl border border-border bg-background p-4 text-sm text-destructive">
          {metricsError instanceof Error
            ? metricsError.message
            : "Failed to load repayment metrics."}
        </div>
      ) : (
        <RepaymentSummaryCards
          metrics={metrics}
          isLoading={isMetricsPending}
        />
      )}

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
