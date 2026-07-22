"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function LoanProductsListToolbar() {
  return (
    <div className="flex w-full items-center gap-3 border-b border-border px-4 py-4">
      <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
        <Link
          href="/loan-products/overview"
          aria-label="Back to loan products overview"
        >
          <Icons.chevronLeft size={20} />
        </Link>
      </Button>
      <h2 className="text-lg font-semibold text-foreground">Loan Products</h2>
    </div>
  )
}
