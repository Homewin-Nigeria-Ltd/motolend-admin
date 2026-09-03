"use client"

import { useMemo, useState } from "react"

import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { EligibilityReviewDecisionDialog } from "@/features/loan-applications/components/eligibility-review-decision-dialog"
import { EligibilityReviewsToolbar } from "@/features/loan-applications/components/eligibility-reviews-toolbar"
import { createEligibilityReviewColumns } from "@/features/loan-applications/eligibility-review-columns"
import { useSubmitEligibilityReviewDecision } from "@/features/loan-applications/hooks/use-eligibility-review-mutations"
import { useEligibilityReviews } from "@/features/loan-applications/hooks/use-eligibility-review-queries"
import type { ApiEligibilityReviewItem } from "@/features/loan-applications/types"

const PAGE_SIZE = 15

export function EligibilityReviewsSection() {
  const [page, setPage] = useState(1)
  const [selectedReview, setSelectedReview] =
    useState<ApiEligibilityReviewItem | null>(null)
  const [decisionOpen, setDecisionOpen] = useState(false)

  const { data, isPending, isFetching, isError, error } = useEligibilityReviews({
    page,
    per_page: PAGE_SIZE,
  })
  const { isPending: isSubmitting } = useSubmitEligibilityReviewDecision()

  const reviews = data?.data ?? []
  const totalPages = data?.last_page ?? 1
  const currentPage = data?.current_page ?? page

  const columns = useMemo(
    () =>
      createEligibilityReviewColumns({
        onReview: (review) => {
          setSelectedReview(review)
          setDecisionOpen(true)
        },
        isSubmitting,
      }),
    [isSubmitting],
  )

  if (isPending && reviews.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <EligibilityReviewsToolbar />
        <div className="mt-6 rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load eligibility reviews."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <section className="min-w-0">
        <DataTable
          columns={columns}
          data={reviews}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isPending || (isFetching && reviews.length === 0)}
          emptyMessage="No eligibility reviews awaiting decision."
          className="min-w-0"
          toolbar={<EligibilityReviewsToolbar />}
        />
      </section>

      <EligibilityReviewDecisionDialog
        review={selectedReview}
        open={decisionOpen}
        onOpenChange={(open) => {
          setDecisionOpen(open)

          if (!open) {
            setSelectedReview(null)
          }
        }}
      />
    </div>
  )
}
