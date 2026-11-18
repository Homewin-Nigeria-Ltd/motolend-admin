"use client"

import { useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import { declineColumns } from "@/features/decline/columns"
import type { DeclineRecord } from "@/features/decline/types"

export function DeclineSection() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const records: DeclineRecord[] = []

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
          page={page}
          totalPages={1}
          onPageChange={setPage}
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
