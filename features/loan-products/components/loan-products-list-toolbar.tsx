"use client"

import { BackLink } from "@/components/back-link"

export function LoanProductsListToolbar() {
  return (
    <div className="flex w-full items-center gap-2 border-b border-border px-4 py-4">
      <BackLink href="/loan-products/overview" label="Loan Products" />
      <h2 className="text-base font-semibold text-foreground">Loan Products</h2>
    </div>
  )
}
