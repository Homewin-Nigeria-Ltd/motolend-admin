"use client"

import { useMemo, useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { getDisbursementColumns } from "@/features/disbursement/columns"
import {
  allocationSummary,
  defaultAllocationSettings,
  disbursementRecords,
} from "@/features/disbursement/data/mock-disbursement"
import type {
  AllocationDuration,
  DisbursementPartner,
  DisbursementRecord,
} from "@/features/disbursement/types"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"

const DURATION_OPTIONS: { value: AllocationDuration; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

const PARTNER_OPTIONS: { value: DisbursementPartner; label: string }[] = [
  { value: "palmpay", label: "Palmpay" },
  { value: "monnify", label: "Monnify" },
  { value: "paylode", label: "Paylode" },
]

export function DisbursementSection() {
  const [amountAllocated, setAmountAllocated] = useState(
    defaultAllocationSettings.amountAllocated,
  )
  const [duration, setDuration] = useState<AllocationDuration>(
    defaultAllocationSettings.duration,
  )
  const [partner, setPartner] = useState<DisbursementPartner>(
    defaultAllocationSettings.partner,
  )
  const [disburseAutomatically, setDisburseAutomatically] = useState(
    defaultAllocationSettings.disburseAutomatically,
  )
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [records, setRecords] = useState(disbursementRecords)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return records
    }

    return records.filter(
      (item) =>
        item.customerName.toLowerCase().includes(query) ||
        item.applicationId.toLowerCase().includes(query) ||
        item.loanProduct.toLowerCase().includes(query) ||
        item.bankAccount.toLowerCase().includes(query),
    )
  }, [records, search])

  const pageSize = 15
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const columns = useMemo(
    () =>
      getDisbursementColumns({
        onRequery: (record: DisbursementRecord) => {
          setRecords((current) =>
            current.map((item) =>
              item.id === record.id
                ? { ...item, status: "disbursed" }
                : item,
            ),
          )
          toast.success(`Requeried ${record.applicationId}`)
        },
      }),
    [],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/loan-products/overview" label="Loan Products" />
        <h2 className="text-base font-semibold text-foreground">
          Disbursement Allocation
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-2xl border border-border bg-background p-5 md:p-6">
          <h3 className="text-lg font-semibold text-foreground">Allocation</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Total amount we can disburse in each period.
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="amount-allocated"
                className="text-sm font-medium text-foreground"
              >
                Amount allocated
              </label>
              <div className="relative mt-2">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  ₦
                </span>
                <Input
                  id="amount-allocated"
                  value={amountAllocated}
                  onChange={(event) => setAmountAllocated(event.target.value)}
                  className="h-11 pl-7"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">Duration</p>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
                {DURATION_OPTIONS.map((option) => {
                  const isActive = duration === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDuration(option.value)}
                      className={cn(
                        "h-10 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">
                Disbursement partner
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {PARTNER_OPTIONS.map((option) => {
                  const isActive = partner === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPartner(option.value)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "border-primary/30 bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full border",
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border",
                        )}
                      >
                        {isActive ? <Icons.check size={12} /> : null}
                      </span>
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Disburse automatically
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Send funds as soon as a loan is approved.
                </p>
              </div>
              <Switch
                checked={disburseAutomatically}
                onCheckedChange={setDisburseAutomatically}
              />
            </div>

            <Button
              type="button"
              className="h-11 w-full"
              onClick={() => toast.success("Allocation saved")}
            >
              Save allocation
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-5 md:p-6">
          <h3 className="text-lg font-semibold text-foreground">
            {allocationSummary.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {allocationSummary.resetNote}
          </p>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Disbursed</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                {allocationSummary.disbursed}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {allocationSummary.remaining}
              </p>
            </div>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${allocationSummary.usedPercent}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {allocationSummary.usedPercent}% of {allocationSummary.totalAllocated}{" "}
            used · {allocationSummary.loansDisbursed} loans disbursed.
          </p>

          <div className="mt-6 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
            {allocationSummary.alert}
          </div>
        </section>
      </div>

      <section className="min-w-0">
        <DataTable
          columns={columns}
          data={pageItems}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          emptyMessage="No disbursements found."
          className="min-w-0"
          toolbar={
            <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-base font-semibold text-foreground">
                  Disbursements
                </h3>
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
                    aria-label="Filter disbursements"
                  >
                    <Icons.filter size={18} />
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
