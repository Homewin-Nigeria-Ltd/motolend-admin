"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { ApplicationToolbar } from "@/features/loan-applications/components/application-toolbar"
import { ApplicationsListToolbar } from "@/features/loan-applications/components/applications-list-toolbar"
import { applicationColumns } from "@/features/loan-applications/columns"
import { useApplicationList } from "@/features/loan-applications/hooks/use-application-queries"
import type { ApplicationTab, LoanApplication } from "@/features/loan-applications/types"

const PAGE_SIZE = 15

export function ApplicationsListSection() {
  const router = useRouter()
  const [tab, setTab] = useState<ApplicationTab>("approved")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

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

  if (isPending && applications.length === 0) {
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
            : "Failed to load applications."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <section className="min-w-0">
        <DataTable
          columns={applicationColumns}
          data={applications}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isPending || (isFetching && applications.length === 0)}
          emptyMessage="No applications found."
          className="min-w-0"
          toolbar={
            <>
              <ApplicationsListToolbar />
              <ApplicationToolbar
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
