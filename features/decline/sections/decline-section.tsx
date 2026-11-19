"use client"

import { useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { Input } from "@/components/ui/input"
import { declineColumns } from "@/features/decline/columns"
import { useDeclinedLoans } from "@/features/decline/hooks/use-decline-queries"

const PAGE_SIZE = 15

export function DeclineSection() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const {
    data: declinedList,
    isPending,
    isFetching,
    isError,
    error,
  } = useDeclinedLoans({
    page,
    per_page: PAGE_SIZE,
    search,
  })

  const records = declinedList?.items ?? []
  const totalPages = declinedList?.meta.last_page ?? 1
  const currentPage = declinedList?.meta.current_page ?? page

  if (isPending && records.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-background p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-background p-4 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/loan-products/overview" label="Loan Products" />
          <h2 className="text-base font-semibold text-foreground">
            Declined Loans
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load declined loans."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-background p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/loan-products/overview" label="Loan Products" />
        <h2 className="text-base font-semibold text-foreground">
          Declined Loans
        </h2>
      </div>

      <section className="min-w-0">
        <DataTable
          columns={declineColumns}
          data={records}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isFetching && records.length === 0}
          emptyMessage="No declined loans found."
          className="min-w-0"
          toolbar={
            <div className="flex w-full justify-end border-b border-border px-4 py-4">
              <div className="min-w-[200px] w-full sm:max-w-xs">
                <Input
                  type="search"
                  icon={{ name: "search", position: "left" }}
                  placeholder="Search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  className="h-10"
                />
              </div>
            </div>
          }
        />
      </section>
    </div>
  )
}
