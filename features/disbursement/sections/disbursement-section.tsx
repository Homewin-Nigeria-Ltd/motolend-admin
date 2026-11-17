"use client"

import { useMemo, useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { getDisbursementColumns } from "@/features/disbursement/columns"
import { RaiseAllocationDialog } from "@/features/disbursement/components/raise-allocation-dialog"
import {
  useRaiseDisbursementAllocation,
  useUpdateDisbursementAllocation,
  useVerifyDisbursement,
} from "@/features/disbursement/hooks/use-disbursement-mutations"
import {
  useDisbursementAllocation,
  useDisbursementList,
} from "@/features/disbursement/hooks/use-disbursement-queries"
import type {
  AllocationDuration,
  DisbursementAllocationState,
  DisbursementPartner,
  DisbursementPartnerOption,
  DisbursementRecord,
} from "@/features/disbursement/types"
import {
  formatAllocationAmountInput,
  parseAllocationAmountInput,
} from "@/features/disbursement/utils/map-disbursement"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 15

const DURATION_OPTIONS: { value: AllocationDuration; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

const FALLBACK_PARTNERS: DisbursementPartnerOption[] = [
  { value: "palmpay", label: "Palmpay" },
  { value: "monnify", label: "Monnify" },
  { value: "paylode", label: "Paylode" },
]

export function DisbursementSection() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [recordToRequery, setRecordToRequery] =
    useState<DisbursementRecord | null>(null)

  const {
    data: allocationData,
    isPending: isAllocationPending,
    isError: isAllocationError,
    error: allocationError,
  } = useDisbursementAllocation()

  const {
    data: disbursementList,
    isPending: isListPending,
    isFetching: isListFetching,
    isError: isListError,
    error: listError,
  } = useDisbursementList({
    page,
    per_page: PAGE_SIZE,
    search,
  })

  const {
    verifyDisbursement,
    pendingLoanId,
    isPending: isVerifying,
  } = useVerifyDisbursement()

  const records = disbursementList?.items ?? []
  const totalPages = disbursementList?.meta.last_page ?? 1
  const currentPage = disbursementList?.meta.current_page ?? page

  const columns = useMemo(
    () =>
      getDisbursementColumns({
        pendingLoanId,
        onRequery: (record: DisbursementRecord) => {
          if (!record.loanId) {
            toast.error("Missing loan id for this disbursement")
            return
          }

          setRecordToRequery(record)
        },
      }),
    [pendingLoanId],
  )

  const handleConfirmRequery = async () => {
    if (!recordToRequery?.loanId) return

    const result = await verifyDisbursement({
      loanId: recordToRequery.loanId,
    })

    if (result.success) {
      setRecordToRequery(null)
    }
  }

  if (
    (isAllocationPending && !allocationData) ||
    (isListPending && records.length === 0)
  ) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isAllocationError || isListError || !allocationData) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-white p-4 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/loan-products/overview" label="Loan Products" />
          <h2 className="text-base font-semibold text-foreground">
            Disbursement Allocation
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 text-sm text-destructive">
          {(allocationError ?? listError) instanceof Error
            ? (allocationError ?? listError)?.message
            : "Failed to load disbursements."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-white p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/loan-products/overview" label="Loan Products" />
        <h2 className="text-base font-semibold text-foreground">
          Disbursement Allocation
        </h2>
      </div>

      <DisbursementAllocationForm initialAllocation={allocationData} />

      <section className="min-w-0">
        <DataTable
          columns={columns}
          data={records}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isListFetching && records.length === 0}
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

      <BaseAlertDialog
        title="Requery disbursement"
        open={recordToRequery != null}
        onOpenChange={(open) => {
          if (!open && !isVerifying) setRecordToRequery(null)
        }}
        confirmLabel="Requery"
        pendingLabel="Verifying..."
        isPending={isVerifying}
        onConfirm={() => {
          void handleConfirmRequery()
        }}
        headerIcon={<Icons.alert size={28} className="text-primary" />}
        className="sm:max-w-md"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Verify pending disbursement for{" "}
          <span className="font-medium text-foreground">
            {recordToRequery?.applicationId}
          </span>
          {recordToRequery?.customerName
            ? ` (${recordToRequery.customerName})`
            : ""}
          ?
        </p>
      </BaseAlertDialog>
    </div>
  )
}

function DisbursementAllocationForm({
  initialAllocation,
}: {
  initialAllocation: DisbursementAllocationState
}) {
  const [amountAllocated, setAmountAllocated] = useState(() =>
    formatAllocationAmountInput(initialAllocation.settings.amountAllocated),
  )
  const [duration, setDuration] = useState<AllocationDuration>(
    initialAllocation.settings.duration,
  )
  const [partner, setPartner] = useState<DisbursementPartner>(
    initialAllocation.settings.partner,
  )
  const [disburseAutomatically, setDisburseAutomatically] = useState(
    initialAllocation.settings.disburseAutomatically,
  )
  const [summary, setSummary] = useState(initialAllocation.summary)
  const [partnerOptions, setPartnerOptions] = useState(
    initialAllocation.availablePartners.length > 0
      ? initialAllocation.availablePartners
      : FALLBACK_PARTNERS,
  )
  const [raiseOpen, setRaiseOpen] = useState(false)

  const { updateAllocation, isPending: isSaving } =
    useUpdateDisbursementAllocation()
  const { raiseAllocation, isPending: isRaising } =
    useRaiseDisbursementAllocation()

  const raisePeriodLabel =
    duration === "daily"
      ? "today's"
      : duration === "weekly"
        ? "this week's"
        : "this month's"

  const handleSaveAllocation = async () => {
    const amount = parseAllocationAmountInput(amountAllocated)

    if (amount <= 0) {
      toast.error("Enter a valid allocation amount")
      return
    }

    const result = await updateAllocation({
      amount_allocated: amount,
      duration,
      disbursement_partner: partner,
      disburse_automatically: disburseAutomatically,
    })

    if (result.success && result.data) {
      setAmountAllocated(
        formatAllocationAmountInput(result.data.settings.amountAllocated),
      )
      setDuration(result.data.settings.duration)
      setPartner(result.data.settings.partner)
      setDisburseAutomatically(result.data.settings.disburseAutomatically)
      setSummary(result.data.summary)
      setPartnerOptions(
        result.data.availablePartners.length > 0
          ? result.data.availablePartners
          : FALLBACK_PARTNERS,
      )
    }
  }

  const handleRaiseAllocation = async (additionalAmount: number) => {
    const result = await raiseAllocation({
      additional_amount: additionalAmount,
    })

    if (result.success && result.data) {
      setSummary(result.data.summary)
      setPartnerOptions(
        result.data.availablePartners.length > 0
          ? result.data.availablePartners
          : FALLBACK_PARTNERS,
      )
      return true
    }

    return false
  }

  return (
    <>
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="rounded-2xl border border-border bg-white p-5 md:p-6">
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
                onChange={(event) => {
                  const raw = event.target.value.replace(/[^\d,]/g, "")
                  const parsed = parseAllocationAmountInput(raw)
                  setAmountAllocated(
                    raw.trim() === ""
                      ? ""
                      : formatAllocationAmountInput(parsed),
                  )
                }}
                disabled={isSaving}
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
                    disabled={isSaving}
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
              {partnerOptions.map((option) => {
                const isActive = partner === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isSaving}
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
              disabled={isSaving}
            />
          </div>

          <Button
            type="button"
            className="h-11 w-full"
            disabled={isSaving}
            onClick={() => {
              void handleSaveAllocation()
            }}
          >
            {isSaving ? "Saving..." : "Save allocation"}
          </Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="border-b border-border bg-[#F9F9F9] px-5 py-4 md:px-6">
          <h3 className="text-lg font-semibold text-foreground">
            {summary.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{summary.resetNote}</p>
        </div>
        <div className="bg-white p-5 md:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Disbursed</p>
              <p
                className={cn(
                  "mt-1 text-3xl font-semibold tracking-tight",
                  summary.isExhausted ? "text-red-600" : "text-foreground",
                )}
              >
                {summary.disbursed}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {summary.remaining}
              </p>
            </div>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full",
                summary.isExhausted ? "bg-red-500" : "bg-primary",
              )}
              style={{ width: `${summary.usedPercent}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {summary.usedPercent}% of {summary.totalAllocated} used ·{" "}
            {summary.loansDisbursed} loans disbursed.
          </p>

          <div
            className={cn(
              "mt-6 rounded-xl px-4 py-3 text-sm",
              summary.isExhausted
                ? "bg-red-50 text-red-700"
                : "bg-muted text-muted-foreground",
            )}
          >
            {summary.alert}
          </div>

          {summary.isExhausted ? (
            <Button
              type="button"
              variant="outline"
              className="mt-4 h-10 border-primary text-primary hover:bg-primary/5 hover:text-primary"
              disabled={isRaising}
              onClick={() => setRaiseOpen(true)}
            >
              Raise {raisePeriodLabel} allocation
            </Button>
          ) : null}
        </div>
      </section>
    </div>

    <RaiseAllocationDialog
      open={raiseOpen}
      onOpenChange={setRaiseOpen}
      isPending={isRaising}
      periodLabel={raisePeriodLabel}
      onConfirm={handleRaiseAllocation}
    />
    </>
  )
}
