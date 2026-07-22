"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { LoanProductToolbar } from "@/features/loan-products/components/loan-product-toolbar"
import { LoanProductsListToolbar } from "@/features/loan-products/components/loan-products-list-toolbar"
import { loanProductColumns } from "@/features/loan-products/columns"
import { useLoanProductList } from "@/features/loan-products/hooks/use-loan-product-queries"
import type { LoanProduct, LoanProductTab } from "@/features/loan-products/types"

const PAGE_SIZE = 15

export function LoanProductsListSection() {
  const router = useRouter()
  const [tab, setTab] = useState<LoanProductTab>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

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

  if (isPending && products.length === 0) {
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
            : "Failed to load loan products."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <section className="min-w-0">
        <DataTable
          columns={loanProductColumns}
          data={products}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isPending || (isFetching && products.length === 0)}
          emptyMessage="No loan products found."
          className="min-w-0"
          toolbar={
            <>
              <LoanProductsListToolbar />
              <LoanProductToolbar
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
