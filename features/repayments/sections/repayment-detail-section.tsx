"use client"

import { useState } from "react"

import { BackLink } from "@/components/back-link"
import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { RecordRepaymentDialog } from "@/features/repayments/components/record-repayment-dialog"
import { RepaymentStatusBadge } from "@/features/repayments/components/repayment-status-badge"
import {
  repaymentScheduleColumns,
} from "@/features/repayments/columns"
import { useRepaymentDetail } from "@/features/repayments/hooks/use-repayment-queries"
import type { RepaymentDetail } from "@/features/repayments/types"

type RepaymentDetailSectionProps = {
  repaymentId: string
}

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

function HeaderField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0 shrink-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-start sm:gap-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{displayValue(value)}</p>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  )
}

function RepaymentDetailContent({ repayment }: { repayment: RepaymentDetail }) {
  const [recordOpen, setRecordOpen] = useState(false)
  const isClosed = repayment.status.trim().toLowerCase() === "closed"

  return (
    <>
      <div className="rounded-2xl border border-border bg-background px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-4">
            <HeaderField label="Loan ID">
              <p className="text-base font-semibold text-foreground">
                {displayValue(repayment.loanId)}
              </p>
            </HeaderField>

            <HeaderField label="Status">
              <RepaymentStatusBadge status={repayment.status} />
            </HeaderField>

            <HeaderField label="Loan Officer">
              <p className="text-sm font-semibold text-foreground">
                {displayValue(repayment.loanOfficer)}
              </p>
            </HeaderField>
          </div>

          {!isClosed ? (
            <div className="flex items-center gap-2 self-start lg:self-center">
              <Button type="button" onClick={() => setRecordOpen(true)}>
                Record Payment
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
        <h3 className="text-base font-semibold text-foreground">
          Customer Information
        </h3>
        <div className="mt-6 flex flex-col gap-4">
          <InfoRow label="Customer Name" value={repayment.customerName} />
          <InfoRow label="Email" value={repayment.customerEmail} />
          <InfoRow label="Phone Number" value={repayment.customerPhone} />
          <InfoRow label="Loan Product" value={repayment.loanProduct} />
          <InfoRow
            label="Installment"
            value={
              repayment.installment !== null
                ? String(repayment.installment)
                : "—"
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
        <h3 className="text-base font-semibold text-foreground">
          Loan Information
        </h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryItem label="Total Loan" value={repayment.totalLoan} />
          <SummaryItem label="Repaid" value={repayment.repaid} />
          <SummaryItem label="Outstanding" value={repayment.outstanding} />
          <SummaryItem label="Next Due Date" value={repayment.nextDueDate} />
          <SummaryItem label="Penalties" value={repayment.penalties} />
        </div>
      </div>

      <section className="min-w-0 rounded-2xl border border-border bg-background p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground">
            Repayment Schedule
          </h3>
          <p className="text-sm text-muted-foreground">
            {repayment.schedule.length} installment
            {repayment.schedule.length === 1 ? "" : "s"}
          </p>
        </div>

        <DataTable
          columns={repaymentScheduleColumns}
          data={repayment.schedule}
          emptyMessage="No schedule items found."
          className="min-w-0"
        />
      </section>

      <RecordRepaymentDialog
        repaymentId={repayment.id}
        open={recordOpen}
        onOpenChange={setRecordOpen}
      />
    </>
  )
}

export function RepaymentDetailSection({
  repaymentId,
}: RepaymentDetailSectionProps) {
  const { data: repayment, isPending, isError, error } =
    useRepaymentDetail(repaymentId)

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !repayment) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/repayments/overview" label="Repayments" />
          <h2 className="text-base font-semibold text-foreground">
            Repayment Details
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load repayment."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/repayments/overview" label="Repayments" />
        <h2 className="text-base font-semibold text-foreground">
          Repayment Details
        </h2>
      </div>

      <RepaymentDetailContent repayment={repayment} />
    </div>
  )
}
