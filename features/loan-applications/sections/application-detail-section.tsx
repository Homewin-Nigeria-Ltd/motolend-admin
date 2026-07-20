"use client"

import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"
import { ApplicationActivityLogCard } from "@/features/loan-applications/components/application-activity-log-card"
import { ApplicationBorrowerCard } from "@/features/loan-applications/components/application-borrower-card"
import { ApplicationCreditScoreCard } from "@/features/loan-applications/components/application-credit-score-card"
import { ApplicationDetailHeader } from "@/features/loan-applications/components/application-detail-header"
import { ApplicationLoanInformationCard } from "@/features/loan-applications/components/application-loan-information-card"
import { ApplicationSupportingDocumentsCard } from "@/features/loan-applications/components/application-supporting-documents-card"
import { useApplicationDetail } from "@/features/loan-applications/hooks/use-application-queries"

type ApplicationDetailSectionProps = {
  applicationId: string
}

export function ApplicationDetailSection({
  applicationId,
}: ApplicationDetailSectionProps) {
  const { data: application, isPending, isError, error } =
    useApplicationDetail(applicationId)

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !application) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/applications/overview" label="Applications" />
          <h2 className="text-base font-semibold text-foreground">
            Application Details
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load application."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/applications/overview" label="Applications" />
        <h2 className="text-base font-semibold text-foreground">
          Application Details
        </h2>
      </div>

      <ApplicationDetailHeader application={application} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <ApplicationBorrowerCard borrower={application.borrower} />
          <ApplicationSupportingDocumentsCard
            documents={application.supportingDocuments}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ApplicationCreditScoreCard creditScore={application.creditScore} />
          <ApplicationLoanInformationCard
            loanInformation={application.loanInformation}
          />
          <ApplicationActivityLogCard activityLog={application.activityLog} />
        </div>
      </div>
    </div>
  )
}
