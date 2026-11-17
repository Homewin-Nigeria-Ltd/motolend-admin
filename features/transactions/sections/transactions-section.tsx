"use client"

import { useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { transactionColumns } from "@/features/transactions/columns"
import { TransactionFilterTabs } from "@/features/transactions/components/transaction-filter-tabs"
import { TransactionSummaryCards } from "@/features/transactions/components/transaction-summary-cards"
import {
  useTransactionList,
  useTransactionMetrics,
} from "@/features/transactions/hooks/use-transaction-queries"
import type { TransactionTab } from "@/features/transactions/types"
import { exportTransactionsCsv } from "@/features/transactions/utils/export-transactions"
import { toast } from "@/lib/toast"

const PAGE_SIZE = 15

export function TransactionsSection() {
  const [tab, setTab] = useState<TransactionTab>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)

  const status = tab === "all" ? undefined : tab

  const {
    data: metrics = [],
    isPending: isMetricsPending,
    isError: isMetricsError,
    error: metricsError,
  } = useTransactionMetrics()

  const {
    data: transactionList,
    isPending,
    isFetching,
    isError,
    error,
  } = useTransactionList({
    page,
    per_page: PAGE_SIZE,
    search,
    status,
  })

  const records = transactionList?.items ?? []
  const totalPages = transactionList?.meta.last_page ?? 1
  const currentPage = transactionList?.meta.current_page ?? page

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await exportTransactionsCsv({ search, status })
      toast.success("Transactions exported")
    } catch (exportError) {
      toast.error(
        exportError instanceof Error
          ? exportError.message
          : "Failed to export transactions",
      )
    } finally {
      setIsExporting(false)
    }
  }

  if (
    (isPending && records.length === 0) ||
    (isMetricsPending && metrics.length === 0)
  ) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || isMetricsError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-white p-4 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/repayments/overview" label="Repayments" />
          <h2 className="text-base font-semibold text-foreground">
            Transaction
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {(error ?? metricsError) instanceof Error
            ? (error ?? metricsError)?.message
            : "Failed to load transactions."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-white p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/repayments/overview" label="Repayments" />
        <h2 className="text-base font-semibold text-foreground">Transaction</h2>
      </div>

      <TransactionSummaryCards metrics={metrics} />

      <section className="min-w-0">
        <DataTable
          columns={transactionColumns}
          data={records}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isFetching && records.length === 0}
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
                    disabled={isExporting}
                    onClick={() => {
                      void handleExport()
                    }}
                  >
                    {isExporting ? "Exporting..." : "Export"}
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
