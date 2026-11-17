"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { getTenureColumns } from "@/features/tenures/columns"
import { TenureFilterTabs } from "@/features/tenures/components/tenure-filter-tabs"
import { TenureSummaryCards } from "@/features/tenures/components/tenure-summary-cards"
import { useDeleteLoanTenure } from "@/features/tenures/hooks/use-loan-tenure-mutations"
import { useLoanTenureList } from "@/features/tenures/hooks/use-loan-tenure-queries"
import type {
  TenureMetric,
  TenureRecord,
  TenureTab,
} from "@/features/tenures/types"

const PAGE_SIZE = 15

export function TenuresSection() {
  const router = useRouter()
  const [tab, setTab] = useState<TenureTab>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [tenureToDelete, setTenureToDelete] = useState<TenureRecord | null>(
    null,
  )
  const { deleteLoanTenure, isPending: isDeleting } = useDeleteLoanTenure()

  const listParams = {
    page,
    per_page: PAGE_SIZE,
    search,
    status: tab === "all" ? undefined : tab,
  }

  const {
    data: tenureList,
    isPending,
    isFetching,
    isError,
    error,
  } = useLoanTenureList(listParams)

  const { data: allTenures } = useLoanTenureList({
    page: 1,
    per_page: 1,
  })
  const { data: activeTenures } = useLoanTenureList({
    page: 1,
    per_page: 1,
    status: "active",
  })
  const { data: inactiveTenures } = useLoanTenureList({
    page: 1,
    per_page: 1,
    status: "inactive",
  })

  const metrics: TenureMetric[] = [
    {
      key: "total",
      label: "Total Tenures",
      value: String(allTenures?.meta.total ?? 0),
      changePercent: 0,
      trend: "up",
    },
    {
      key: "active",
      label: "Active Tenures",
      value: String(activeTenures?.meta.total ?? 0),
      changePercent: 0,
      trend: "up",
    },
    {
      key: "inactive",
      label: "Inactive Tenures",
      value: String(inactiveTenures?.meta.total ?? 0),
      changePercent: 0,
      trend: "down",
    },
  ]

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

  const tenures = tenureList?.items ?? []
  const totalPages = tenureList?.meta.last_page ?? 1
  const currentPage = tenureList?.meta.current_page ?? page

  const handleConfirmDelete = async () => {
    if (!tenureToDelete) return

    const result = await deleteLoanTenure({ id: tenureToDelete.id })
    if (result.success) {
      setTenureToDelete(null)
    }
  }

  if (isPending && tenures.length === 0) {
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
          <h2 className="text-base font-semibold text-foreground">Tenure</h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load loan tenures."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-background p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/loan-products/overview" label="Loan Products" />
        <h2 className="text-base font-semibold text-foreground">Tenure</h2>
      </div>

      <TenureSummaryCards metrics={metrics} />

      <section className="min-w-0">
        <DataTable
          columns={columns}
          data={tenures}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isFetching && tenures.length === 0}
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
          if (!open && !isDeleting) setTenureToDelete(null)
        }}
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        confirmVariant="destructive"
        isPending={isDeleting}
        onConfirm={() => {
          void handleConfirmDelete()
        }}
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
