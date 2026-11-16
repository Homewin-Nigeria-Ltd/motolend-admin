"use client"

import { useMemo, useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { getRecoveryColumns } from "@/features/recovery/columns"
import { MarkPaidDialog } from "@/features/recovery/components/mark-paid-dialog"
import { MarkPaidOtpDialog } from "@/features/recovery/components/mark-paid-otp-dialog"
import { RecoveryFilterTabs } from "@/features/recovery/components/recovery-filter-tabs"
import { RecoverySummaryCards } from "@/features/recovery/components/recovery-summary-cards"
import {
  RECOVERY_TAB_META,
  recoveryLoans as initialLoans,
  recoveryMetrics,
} from "@/features/recovery/data/mock-recovery"
import type { MarkPaidFormValues } from "@/features/recovery/schemas/mark-paid.schema"
import type { RecoveryLoan, RecoveryTab } from "@/features/recovery/types"
import { toast } from "@/lib/toast"

export function RecoverySection() {
  const [tab, setTab] = useState<RecoveryTab>("active")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loans, setLoans] = useState(initialLoans)
  const [selectedLoan, setSelectedLoan] = useState<RecoveryLoan | null>(null)
  const [markPaidOpen, setMarkPaidOpen] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [pendingValues, setPendingValues] =
    useState<MarkPaidFormValues | null>(null)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return loans.filter((loan) => {
      if (loan.tab !== tab) {
        return false
      }

      if (!query) {
        return true
      }

      return (
        loan.customerName.toLowerCase().includes(query) ||
        loan.phone.includes(query) ||
        loan.applicationId.toLowerCase().includes(query) ||
        loan.id.includes(query)
      )
    })
  }, [loans, search, tab])

  const pageSize = 15
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

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

  async function handleSendOtp(values: MarkPaidFormValues) {
    setIsSendingOtp(true)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 500))
      setPendingValues(values)
      setMarkPaidOpen(false)
      setOtpOpen(true)
      toast.success("OTP sent to recovery@motolend.ng")
    } finally {
      setIsSendingOtp(false)
    }
  }

  async function handleResendOtp() {
    setIsResending(true)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 500))
      toast.success("A new OTP has been sent")
    } finally {
      setIsResending(false)
    }
  }

  async function handleVerifyOtp(otp: string) {
    if (!selectedLoan || !pendingValues) {
      return
    }

    setIsVerifying(true)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 600))
      void otp
      void pendingValues

      setLoans((current) =>
        current.map((loan) =>
          loan.id === selectedLoan.id ? { ...loan, status: "paid" } : loan,
        ),
      )
      setOtpOpen(false)
      setSelectedLoan(null)
      setPendingValues(null)
      toast.success(`Loan ${selectedLoan.applicationId} marked as Paid`)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/repayments/overview" label="Repayments" />
        <h2 className="text-base font-semibold text-foreground">Recovery</h2>
      </div>

      <RecoverySummaryCards metrics={recoveryMetrics} />

      <section className="min-w-0">
        <DataTable
          columns={columns}
          data={pageItems}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          emptyMessage="No recovery loans found."
          className="min-w-0"
          toolbar={
            <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4">
              <RecoveryFilterTabs
                value={tab}
                onChange={(value) => {
                  setTab(value)
                  setPage(1)
                }}
              />

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-muted-foreground">
                  • {RECOVERY_TAB_META[tab].description}
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
                  >
                    Export
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
