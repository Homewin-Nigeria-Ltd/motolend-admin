"use client"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import type { ProgressionCustomer } from "@/features/loan-progression/types"
import { getUserInitials } from "@/utils/get-initials"

type ProgressionCustomersTableProps = {
  customers: ProgressionCustomer[]
}

export function ProgressionCustomersTable({
  customers,
}: ProgressionCustomersTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="border-b border-border px-5 py-4 md:px-6">
        <h3 className="text-base font-semibold text-foreground">
          Customer progression
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          How far each customer is toward their next limit.
        </p>
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
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-5 py-4 md:px-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                        {getUserInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">
                      {customer.name}
                    </span>
                  </div>
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
