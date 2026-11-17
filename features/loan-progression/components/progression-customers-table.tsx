"use client"

import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import type { ProgressionCustomer } from "@/features/loan-progression/types"
import { getUserInitials } from "@/utils/get-initials"

type ProgressionCustomersTableProps = {
  customers: ProgressionCustomer[]
  search: string
  onSearchChange: (value: string) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function ProgressionCustomersTable({
  customers,
  search,
  onSearchChange,
  page,
  totalPages,
  onPageChange,
  isLoading = false,
}: ProgressionCustomersTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex flex-col gap-4 border-b border-border px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Customer progression
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            How far each customer is toward their next limit.
          </p>
        </div>
        <div className="min-w-[200px] sm:max-w-xs">
          <Input
            type="search"
            icon={{ name: "search", position: "left" }}
            placeholder="Search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-5 py-3 font-medium md:px-6">Customer Name</th>
              <th className="px-4 py-3 font-medium">Current limit</th>
              <th className="px-4 py-3 font-medium">Consecutive on time</th>
              <th className="px-4 py-3 font-medium">Next limit</th>
              <th className="px-5 py-3 font-medium md:px-6">Progress</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-muted-foreground md:px-6"
                >
                  {isLoading ? "Loading customers…" : "No customers found."}
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-5 py-4 md:px-6">
                    <Link
                      href={`/users/${customer.id}`}
                      className="flex items-center gap-3 hover:opacity-80"
                    >
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                          {customer.initials || getUserInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground underline-offset-4 hover:underline">
                        {customer.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    {customer.currentLimit}
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    {customer.consecutiveLabel}
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    {customer.nextLimit}
                  </td>
                  <td className="px-5 py-4 md:px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${customer.progressPercent}%` }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">
                        {customer.progressPercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3 md:px-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <Icons.chevronLeft size={16} />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
            <Icons.chevronRight size={16} />
          </Button>
        </div>
      ) : null}
    </section>
  )
}
