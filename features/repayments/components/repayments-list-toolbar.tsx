"use client"

type RepaymentsListToolbarProps = {
  title?: string
}

export function RepaymentsListToolbar({
  title = "Repayments",
}: RepaymentsListToolbarProps) {
  return (
    <div className="border-b border-border px-4 py-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
    </div>
  )
}
