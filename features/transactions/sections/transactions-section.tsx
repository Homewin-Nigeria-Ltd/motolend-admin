"use client"

import { useMemo, useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { transactionColumns } from "@/features/transactions/columns"
import { TransactionFilterTabs } from "@/features/transactions/components/transaction-filter-tabs"
import { TransactionSummaryCards } from "@/features/transactions/components/transaction-summary-cards"
import {
  transactionMetrics,
  transactionRecords,
} from "@/features/transactions/data/mock-transactions"
import type { TransactionTab } from "@/features/transactions/types"

export function TransactionsSection() {
  const [tab, setTab] = useState<TransactionTab>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return transactionRecords.filter((item) => {
      if (tab !== "all" && item.status !== tab) {
        return false
      }

      if (!query) {
        return true
      }

      return (
        item.customerName.toLowerCase().includes(query) ||
        item.applicationId.toLowerCase().includes(query) ||
        item.loanProduct.toLowerCase().includes(query)
      )
    })
  }, [search, tab])

  const pageSize = 15
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/repayments/overview" label="Repayments" />
        <h2 className="text-base font-semibold text-foreground">Transaction</h2>
      </div>

      <TransactionSummaryCards metrics={transactionMetrics} />

      <section className="min-w-0">
        <DataTable
          columns={transactionColumns}
          data={pageItems}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          emptyMessage="No transactions found."
          className="min-w-0"
          toolbar={
            <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <TransactionFilterTabs
                  value={tab}
                  onChange={(value) => {
                    setTab(value)
                    setPage(1)
                  }}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <div className="min-w-[200px] flex-1 sm:max-w-xs">
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
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-10 shrink-0"
                    aria-label="Filter transactions"
                  >
                    <Icons.filter size={18} />
                  </Button>
                  <Button
                    type="button"
                    className="h-10 px-4"
                    icon={{ name: "download", position: "left" }}
                  >
                    Export
                  </Button>
                </div>
              </div>
            </div>
          }
        />
      </section>
    </div>
  )
}
