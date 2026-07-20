"use client"

import Image from "next/image"

import { ASSETS } from "@/constants/assets"
import { cn } from "@/lib/utils"

export type MetricTrend = "up" | "down"

export type MetricSummaryCardProps = {
  label: string
  value: string
  changePercent: number
  trend: MetricTrend
}

function MetricTrendIllustration({ trend }: { trend: MetricTrend }) {
  const isUp = trend === "up"

  return (
    <div className="relative h-10 w-[5.6875rem] shrink-0">
      <Image
        src={
          isUp
            ? ASSETS.illustrations.longUpTrend
            : ASSETS.illustrations.longDownTrend
        }
        alt=""
        fill
        sizes="91px"
        unoptimized
        className="object-contain object-right"
        aria-hidden
      />
    </div>
  )
}

export function MetricSummaryCard({
  label,
  value,
  changePercent,
  trend,
}: MetricSummaryCardProps) {
  const isUp = trend === "up"

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-4">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <MetricTrendIllustration trend={trend} />
      </div>

      <div
        className={cn(
          "mt-auto flex items-center gap-1 pt-3 text-xs font-medium",
          isUp ? "text-emerald-600" : "text-destructive",
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
        <span className="whitespace-nowrap">
          {Math.abs(changePercent)}%
        </span>
        <span className="font-normal whitespace-nowrap text-muted-foreground">
          vs last month
        </span>
      </div>
    </div>
  )
}
