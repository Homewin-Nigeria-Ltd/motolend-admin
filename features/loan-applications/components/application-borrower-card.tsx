"use client"

import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { ApplicationBorrower } from "@/features/loan-applications/types"
import { UserStatusBadge } from "@/features/users/components/user-status-badge"
import { getUserInitials } from "@/utils/get-initials"

type ApplicationBorrowerCardProps = {
  borrower: ApplicationBorrower
}

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-foreground">
        {displayValue(value)}
      </p>
    </div>
  )
}

export function ApplicationBorrowerCard({
  borrower,
}: ApplicationBorrowerCardProps) {
  const grantorOne = borrower.grantors[0]
  const grantorTwo = borrower.grantors[1]

  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage alt={borrower.fullName} />
            <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
              {getUserInitials(borrower.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-foreground">
              {displayValue(borrower.fullName)}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" className="h-9 px-4" asChild>
            <Link href={`/users/${borrower.id}`}>View Profile</Link>
          </Button>
          <UserStatusBadge status={borrower.status} />
        </div>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Email" value={borrower.email} />
        <Field label="Date of Birth" value={borrower.dateOfBirth} />
        <Field label="Telephone" value={borrower.phone} />
        <Field label="SA ID Number" value={borrower.idNumber} />
        <Field label="Employment status" value={borrower.employmentStatus} />
        <Field label="Company Name" value={borrower.companyName} />
        <Field label="Job Title" value={borrower.jobTitle} />
        <Field label="Monthly Income" value={borrower.monthlyIncome} />
        <Field
          label="Grantor Name 1"
          value={grantorOne?.name ?? "—"}
        />
        <Field
          label="Grantor Telephone 1"
          value={grantorOne?.telephone ?? "—"}
        />
        <Field
          label="Grantor Name 2"
          value={grantorTwo?.name ?? "—"}
        />
        <Field
          label="Grantor Telephone 2"
          value={grantorTwo?.telephone ?? "—"}
        />
      </div>
    </div>
  )
}
