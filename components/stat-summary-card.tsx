"use client"

import Image from "next/image"

import type { MetricTrend } from "@/components/metric-summary-card"
import { ASSETS } from "@/constants/assets"
import { cn } from "@/lib/utils"

export type StatSummaryCardProps = {
  label: string
  value: string
  changePercent: number
  trend: MetricTrend
}

export function StatSummaryCard({
  label,
  value,
  changePercent,
  trend,
}: StatSummaryCardProps) {
  const isUp = trend === "up"

  return (
    <div className="flex h-full min-h-[7.5rem] flex-col justify-between gap-5 rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            isUp
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600",
          )}
        >
          <Image
            src={
              isUp
                ? ASSETS.illustrations.shortUpTrend
                : ASSETS.illustrations.shortDownTrend
            }
            alt=""
            width={13}
            height={8}
            unoptimized
            className="shrink-0"
            aria-hidden
          />
          {Math.abs(changePercent).toFixed(1)}%
        </span>
      </div>

      <p className="text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  )
}
