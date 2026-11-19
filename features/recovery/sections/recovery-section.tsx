"use client"

import { useMemo, useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { getRecoveryColumns } from "@/features/recovery/columns"
import { MarkPaidDialog } from "@/features/recovery/components/mark-paid-dialog"
import { MarkPaidOtpDialog } from "@/features/recovery/components/mark-paid-otp-dialog"
import { RecoveryFilterTabs } from "@/features/recovery/components/recovery-filter-tabs"
import { RecoverySummaryCards } from "@/features/recovery/components/recovery-summary-cards"
import {
  useSendRecoveryOtp,
  useVerifyRecoveryOtp,
} from "@/features/recovery/hooks/use-recovery-mutations"
import {
  useRecoveryLoans,
  useRecoveryMetrics,
  useRecoveryStageCounts,
} from "@/features/recovery/hooks/use-recovery-queries"
import {
  RECOVERY_METHOD_LABELS,
  parseAmountRecovered,
  type MarkPaidFormValues,
} from "@/features/recovery/schemas/mark-paid.schema"
import type { RecoveryLoan, RecoveryTab } from "@/features/recovery/types"
import { exportRecoveryLoansCsv } from "@/features/recovery/utils/export-recovery"
import { buildRecoveryTabMeta } from "@/features/recovery/utils/map-recovery"
import { toast } from "@/lib/toast"

const PAGE_SIZE = 15

export function RecoverySection() {
  const [tab, setTab] = useState<RecoveryTab>("active")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const [paidOverrides, setPaidOverrides] = useState<Record<string, true>>({})
  const [selectedLoan, setSelectedLoan] = useState<RecoveryLoan | null>(null)
  const [markPaidOpen, setMarkPaidOpen] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [pendingValues, setPendingValues] =
    useState<MarkPaidFormValues | null>(null)

  const { sendOtp, isPending: isSendingOtp } = useSendRecoveryOtp()
  const { verifyOtp, isPending: isVerifying } = useVerifyRecoveryOtp()
  const [isResending, setIsResending] = useState(false)

  const {
    data: stageCounts = [],
    isPending: isStageCountsPending,
    isError: isStageCountsError,
    error: stageCountsError,
  } = useRecoveryStageCounts()

  const {
    data: metrics = [],
    isPending: isMetricsPending,
    isError: isMetricsError,
    error: metricsError,
  } = useRecoveryMetrics()

  const {
    data: loanList,
    isPending,
    isFetching,
    isError,
    error,
  } = useRecoveryLoans({
    page,
    per_page: PAGE_SIZE,
    search,
    stage: tab,
  })

  const tabMeta = useMemo(
    () => buildRecoveryTabMeta(stageCounts),
    [stageCounts],
  )

  const records = useMemo(() => {
    const items = loanList?.items ?? []
    if (Object.keys(paidOverrides).length === 0) {
      return items
    }

    return items.map((loan) =>
      paidOverrides[loan.id] ? { ...loan, status: "paid" as const } : loan,
    )
  }, [loanList?.items, paidOverrides])

  const totalPages = loanList?.meta.last_page ?? 1
  const currentPage = loanList?.meta.current_page ?? page

  const columns = useMemo(
    () =>
      getRecoveryColumns({
        onMarkPaid: (loan) => {
          setSelectedLoan(loan)
          setMarkPaidOpen(true)
        },
      }),
    [],
  )

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await exportRecoveryLoansCsv({ search, stage: tab })
      toast.success("Recovery loans exported")
    } catch (exportError) {
      toast.error(
        exportError instanceof Error
          ? exportError.message
          : "Failed to export recovery loans",
      )
    } finally {
      setIsExporting(false)
    }
  }

  async function handleSendOtp(values: MarkPaidFormValues) {
    if (!selectedLoan) return

    const amountRecovered = parseAmountRecovered(values.amount_recovered)
    if (!Number.isFinite(amountRecovered) || amountRecovered <= 0) {
      toast.error("Enter a valid amount recovered")
      return
    }

    try {
      await sendOtp({
        loanId: selectedLoan.id,
        recovery_method: RECOVERY_METHOD_LABELS[values.recovery_method],
        amount_recovered: amountRecovered,
        payment_reference: values.payment_reference.trim(),
      })
      setPendingValues(values)
      setMarkPaidOpen(false)
      setOtpOpen(true)
    } catch {
      // Error toast is handled in the mutation hook.
    }
  }

  async function handleResendOtp() {
    if (!selectedLoan || !pendingValues) return

    const amountRecovered = parseAmountRecovered(pendingValues.amount_recovered)
    if (!Number.isFinite(amountRecovered) || amountRecovered <= 0) {
      toast.error("Enter a valid amount recovered")
      return
    }

    setIsResending(true)
    try {
      await sendOtp({
        loanId: selectedLoan.id,
        recovery_method: RECOVERY_METHOD_LABELS[pendingValues.recovery_method],
        amount_recovered: amountRecovered,
        payment_reference: pendingValues.payment_reference.trim(),
      })
    } catch {
      // Error toast is handled in the mutation hook.
    } finally {
      setIsResending(false)
    }
  }

  async function handleVerifyOtp(otp: string) {
    if (!selectedLoan) return

    try {
      await verifyOtp({
        loanId: selectedLoan.id,
        otp,
      })
      setPaidOverrides((current) => ({
        ...current,
        [selectedLoan.id]: true,
      }))
      setOtpOpen(false)
      setSelectedLoan(null)
      setPendingValues(null)
    } catch {
      // Error toast is handled in the mutation hook.
    }
  }

  if (
    (isPending && records.length === 0) ||
    (isStageCountsPending && stageCounts.length === 0) ||
    (isMetricsPending && metrics.length === 0)
  ) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-background p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || isStageCountsError || isMetricsError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-background p-4 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/repayments/overview" label="Repayments" />
          <h2 className="text-base font-semibold text-foreground">Recovery</h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {(error ?? stageCountsError ?? metricsError) instanceof Error
            ? (error ?? stageCountsError ?? metricsError)?.message
            : "Failed to load recovery loans."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-background p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/repayments/overview" label="Repayments" />
        <h2 className="text-base font-semibold text-foreground">Recovery</h2>
      </div>

      <RecoverySummaryCards metrics={metrics} />

      <section className="min-w-0">
        <DataTable
          columns={columns}
          data={records}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          emptyMessage="No recovery loans found."
          className="min-w-0"
          toolbar={
            <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4">
              <RecoveryFilterTabs
                value={tab}
                tabs={tabMeta}
                onChange={(value) => {
                  setTab(value)
                  setPage(1)
                }}
              />

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-muted-foreground">
                  • {tabMeta[tab].description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="min-w-[220px] flex-1 sm:max-w-xs">
                    <Input
                      type="search"
                      icon={{ name: "search", position: "left" }}
                      placeholder="Search name, phone or ID"
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
                    aria-label="Filter recovery loans"
                  >
                    <Icons.filter size={18} />
                  </Button>
                  <Button
                    type="button"
                    className="h-10 px-4"
                    icon={{ name: "download", position: "left" }}
                    disabled={isExporting || isFetching}
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

      <MarkPaidDialog
        loan={selectedLoan}
        open={markPaidOpen}
        onOpenChange={setMarkPaidOpen}
        onSendOtp={handleSendOtp}
        isPending={isSendingOtp}
      />

      <MarkPaidOtpDialog
        loan={selectedLoan}
        open={otpOpen}
        onOpenChange={(open) => {
          setOtpOpen(open)
          if (!open) {
            setPendingValues(null)
          }
        }}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        isPending={isVerifying}
        isResending={isResending}
      />
    </div>
  )
}
