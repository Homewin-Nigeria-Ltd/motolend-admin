"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ApplicationStatusBadge } from "@/features/loan-applications/components/application-status-badge"
import { RejectApplicationDialog } from "@/features/loan-applications/components/reject-application-dialog"
import {
  useApproveApplication,
  useRejectApplication,
} from "@/features/loan-applications/hooks/use-application-mutations"
import type { ApplicationDetail } from "@/features/loan-applications/types"

type ApplicationDetailHeaderProps = {
  application: ApplicationDetail
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

export function ApplicationDetailHeader({
  application,
}: ApplicationDetailHeaderProps) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const { approveApplication, isPending: isApproving } = useApproveApplication()
  const { rejectApplication, isPending: isRejecting } = useRejectApplication()

  const isPending = application.status === "pending"
  const isActionPending = isApproving || isRejecting

  const handleApprove = async () => {
    await approveApplication(application.id)
  }

  const handleReject = async (rejectionReason: string) => {
    await rejectApplication({
      applicationId: application.id,
      rejection_reason: rejectionReason,
    })
    setRejectOpen(false)
  }

  return (
    <>
      <div className="rounded-2xl border border-border bg-background px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-4">
            <HeaderField label="Application ID">
              <p className="text-base font-semibold text-foreground">
                {displayValue(application.applicationId)}
              </p>
            </HeaderField>

            <HeaderField label="Status">
              <ApplicationStatusBadge status={application.status} />
            </HeaderField>

            <HeaderField label="Date Created">
              <p className="text-sm font-semibold text-foreground">
                {displayValue(application.dateCreated)}
              </p>
            </HeaderField>

            <HeaderField label="Time Created">
              <p className="text-sm font-semibold text-foreground">
                {displayValue(application.timeCreated)}
              </p>
            </HeaderField>

            <Button type="button" className="h-10 shrink-0 px-4" disabled>
              Loan History
            </Button>
          </div>

          {isPending ? (
            <div className="flex shrink-0 items-center gap-2 lg:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-10 border-primary px-4 text-primary hover:bg-primary/5 hover:text-primary"
                disabled={isActionPending}
                onClick={() => setRejectOpen(true)}
              >
                Reject
              </Button>
              <Button
                type="button"
                className="h-10 px-4"
                disabled={isActionPending}
                onClick={handleApprove}
              >
                {isApproving ? "Approving…" : "Approve"}
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <RejectApplicationDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={handleReject}
        isPending={isRejecting}
      />
    </>
  )
}
