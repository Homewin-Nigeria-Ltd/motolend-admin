"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { getTenureColumns } from "@/features/tenures/columns"
import { TenureFilterTabs } from "@/features/tenures/components/tenure-filter-tabs"
import { TenureSummaryCards } from "@/features/tenures/components/tenure-summary-cards"
import {
  tenureMetrics,
  tenureRecords as initialTenureRecords,
} from "@/features/tenures/data/mock-tenures"
import type { TenureRecord, TenureTab } from "@/features/tenures/types"

export function TenuresSection() {
  const router = useRouter()
  const [tab, setTab] = useState<TenureTab>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [records, setRecords] = useState(initialTenureRecords)
  const [tenureToDelete, setTenureToDelete] = useState<TenureRecord | null>(
    null,
  )

  const columns = useMemo(
    () =>
      getTenureColumns({
        onEdit: (tenure: TenureRecord) => {
          router.push(`/loan-products/tenures/${tenure.id}/edit`)
        },
        onDelete: (tenure: TenureRecord) => {
          setTenureToDelete(tenure)
        },
      }),
    [router],
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return records.filter((item) => {
      if (tab !== "all" && item.status !== tab) {
        return false
      }

      if (!query) {
        return true
      }

      return (
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.linkedProducts.toLowerCase().includes(query) ||
        item.interestType.toLowerCase().includes(query)
      )
    })
  }, [records, search, tab])

  const pageSize = 15
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const handleConfirmDelete = () => {
    if (!tenureToDelete) return

    setRecords((current) =>
      current.filter((item) => item.id !== tenureToDelete.id),
    )
    setTenureToDelete(null)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/loan-products/overview" label="Loan Products" />
        <h2 className="text-base font-semibold text-foreground">Tenure</h2>
      </div>

      <TenureSummaryCards metrics={tenureMetrics} />

      <section className="min-w-0">
        <DataTable
          columns={columns}
          data={pageItems}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          emptyMessage="No tenures found."
          className="min-w-0"
          toolbar={
            <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <TenureFilterTabs
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
                    aria-label="Filter tenures"
                  >
                    <Icons.filter size={18} />
                  </Button>
                  <Button type="button" className="h-10 gap-1.5 px-4" asChild>
                    <Link href="/loan-products/tenures/new">
                      <Icons.add size={16} />
                      Create Loan Tenure
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          }
        />
      </section>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Active tenures are what the mobile app shows when a customer picks how
        long to borrow for.
      </div>

      <BaseAlertDialog
        title="Delete Tenure"
        open={tenureToDelete != null}
        onOpenChange={(open) => {
          if (!open) setTenureToDelete(null)
        }}
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
        headerIcon={<Icons.alert size={28} className="text-destructive" />}
        className="sm:max-w-md"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">
            {tenureToDelete?.name}
          </span>
          ? This action cannot be undone.
        </p>
      </BaseAlertDialog>
    </div>
  )
}
