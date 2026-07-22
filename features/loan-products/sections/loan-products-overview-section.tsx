"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { LoanProductSummaryCards } from "@/features/loan-products/components/loan-product-summary-cards"
import { LoanProductToolbar } from "@/features/loan-products/components/loan-product-toolbar"
import { loanProductColumns } from "@/features/loan-products/columns"
import {
  useLoanProductList,
  useLoanProductMetrics,
} from "@/features/loan-products/hooks/use-loan-product-queries"
import type { LoanProduct, LoanProductTab } from "@/features/loan-products/types"

const PAGE_SIZE = 15

export function LoanProductsOverviewSection() {
  const router = useRouter()
  const [tab, setTab] = useState<LoanProductTab>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const {
    data: metrics,
    isPending: isMetricsPending,
    isError: isMetricsError,
    error: metricsError,
  } = useLoanProductMetrics()

  const {
    data: productList,
    isPending,
    isFetching,
    isError,
    error,
  } = useLoanProductList({
    page,
    per_page: PAGE_SIZE,
    search,
    status: tab === "all" ? undefined : tab,
  })

  const products = productList?.items ?? []
  const totalPages = productList?.meta.last_page ?? 1
  const currentPage = productList?.meta.current_page ?? page

  const handleTabChange = (value: LoanProductTab) => {
    setTab(value)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRowClick = (product: LoanProduct) => {
    router.push(`/loan-products/${product.id}`)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      {isMetricsError ? (
        <div className="rounded-2xl border border-border bg-background p-4 text-sm text-destructive">
          {metricsError instanceof Error
            ? metricsError.message
            : "Failed to load loan product metrics."}
        </div>
      ) : (
        <LoanProductSummaryCards
          kpis={metrics ?? []}
          isLoading={isMetricsPending}
        />
      )}

      {isError ? (
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load loan products."}
        </div>
      ) : (
        <DataTable
          columns={loanProductColumns}
          data={products}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isPending || (isFetching && products.length === 0)}
          emptyMessage="No loan products found."
          toolbar={
            <LoanProductToolbar
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
