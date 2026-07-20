"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { ApplicationSummaryCards } from "@/features/loan-applications/components/application-summary-cards"
import { ApplicationToolbar } from "@/features/loan-applications/components/application-toolbar"
import { applicationColumns } from "@/features/loan-applications/columns"
import {
  useApplicationList,
  useApplicationMetrics,
} from "@/features/loan-applications/hooks/use-application-queries"
import type { ApplicationTab, LoanApplication } from "@/features/loan-applications/types"

const PAGE_SIZE = 15

export function ApplicationsOverviewSection() {
  const router = useRouter()
  const [tab, setTab] = useState<ApplicationTab>("approved")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const {
    data: metrics,
    isPending: isMetricsPending,
    isError: isMetricsError,
    error: metricsError,
  } = useApplicationMetrics()

  const {
    data: applicationList,
    isPending,
    isFetching,
    isError,
    error,
  } = useApplicationList({
    page,
    per_page: PAGE_SIZE,
    search,
    status: tab,
  })

  const applications = applicationList?.items ?? []
  const totalPages = applicationList?.meta.last_page ?? 1
  const currentPage = applicationList?.meta.current_page ?? page

  const handleTabChange = (value: ApplicationTab) => {
    setTab(value)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRowClick = (application: LoanApplication) => {
    router.push(`/applications/${application.id}`)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      {isMetricsError ? (
        <div className="rounded-2xl border border-border bg-background p-4 text-sm text-destructive">
          {metricsError instanceof Error
            ? metricsError.message
            : "Failed to load application metrics."}
        </div>
      ) : (
        <ApplicationSummaryCards
          kpis={metrics ?? []}
          isLoading={isMetricsPending}
        />
      )}

      {isError ? (
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load applications."}
        </div>
      ) : (
        <DataTable
          columns={applicationColumns}
          data={applications}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isPending || (isFetching && applications.length === 0)}
          emptyMessage="No applications found."
          toolbar={
            <ApplicationToolbar
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
