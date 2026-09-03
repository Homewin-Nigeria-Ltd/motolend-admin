"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApplicationFilterTabs } from "@/features/loan-applications/components/application-filter-tabs"
import type { ApplicationTab } from "@/features/loan-applications/types"

type ApplicationToolbarProps = {
  tab: ApplicationTab
  onTabChange: (value: ApplicationTab) => void
  search: string
  onSearchChange: (value: string) => void
  showViewAll?: boolean
}

export function ApplicationToolbar({
  tab,
  onTabChange,
  search,
  onSearchChange,
  showViewAll = false,
}: ApplicationToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ApplicationFilterTabs value={tab} onChange={onTabChange} />

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

          {showViewAll ? (
            <>
              <Button type="button" variant="outline" className="h-10 px-4" asChild>
                <Link href="/applications/eligibility-reviews">
                  Eligibility Reviews
                </Link>
              </Button>
              <Button type="button" className="h-10 px-4" asChild>
                <Link href="/applications">View All</Link>
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
