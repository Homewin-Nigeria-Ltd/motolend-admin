import { Badge } from "@/components/ui/badge"
import type { ApplicationCreditScore } from "@/features/loan-applications/types"
import { cn } from "@/lib/utils"

type ApplicationCreditScoreCardProps = {
  creditScore: ApplicationCreditScore
}

function ratingStyles(rating: string) {
  const normalized = rating.toLowerCase()

  if (normalized.includes("excellent") || normalized.includes("good")) {
    return "bg-emerald-50 text-emerald-700"
  }

  if (normalized.includes("fair") || normalized.includes("average")) {
    return "bg-amber-50 text-amber-700"
  }

  return "bg-destructive/10 text-destructive"
}

export function ApplicationCreditScoreCard({
  creditScore,
}: ApplicationCreditScoreCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <h3 className="text-base font-semibold text-foreground">Credit Score</h3>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <p className="text-4xl font-semibold tracking-tight text-foreground">
          {creditScore.score}/{creditScore.maxScore}
        </p>
        <Badge
          className={cn(
            "mb-1 h-auto rounded-full border-0 px-3 py-1 text-xs font-medium",
            ratingStyles(creditScore.rating),
          )}
        >
          {creditScore.rating}
        </Badge>
      </div>
    </div>
  )
}
