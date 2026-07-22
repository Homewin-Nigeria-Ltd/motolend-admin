"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoanProductFilterTabs } from "@/features/loan-products/components/loan-product-filter-tabs"
import type { LoanProductTab } from "@/features/loan-products/types"

type LoanProductToolbarProps = {
  tab: LoanProductTab
  onTabChange: (value: LoanProductTab) => void
  search: string
  onSearchChange: (value: string) => void
  showViewAll?: boolean
}

export function LoanProductToolbar({
  tab,
  onTabChange,
  search,
  onSearchChange,
  showViewAll = false,
}: LoanProductToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <LoanProductFilterTabs value={tab} onChange={onTabChange} />

        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[200px] flex-1 sm:max-w-xs">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-10"
            />
          </div>

          {/* <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 shrink-0"
            aria-label="Filter loan products"
          >
            <Icons.filter size={18} />
          </Button> */}

          {showViewAll ? (
            <Button type="button" variant="outline" className="h-10 px-4" asChild>
              <Link href="/loan-products">View All</Link>
            </Button>
          ) : null}

          <Button
            type="button"
            className="h-10 px-4"
            icon={{ name: "add", position: "left" }}
            asChild
          >
            <Link href="/loan-products/new">Create Loan Product</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
